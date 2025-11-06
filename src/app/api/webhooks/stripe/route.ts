import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import Database from 'better-sqlite3';
import * as path from 'path';
import { randomBytes } from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Helper function to generate CUID-like IDs
function generateId(): string {
  return 'c' + randomBytes(12).toString('base64').replace(/[+/=]/g, '').substring(0, 24);
}

// Disable body parsing for webhooks (we need the raw body for signature verification)
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('⚠️  Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('✅ Payment succeeded:', session.id);

        // Create order in database
        await createOrderFromSession(session);

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function createOrderFromSession(session: Stripe.Checkout.Session) {
  try {
    // Get the database connection
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath);

    // Retrieve full session details with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    const lineItems = fullSession.line_items?.data || [];

    // Calculate total from line items
    const total = lineItems.reduce((sum, item) => {
      return sum + ((item.amount_total || 0) / 100); // Convert from cents to dollars
    }, 0);

    // Get or create customer - for now, we'll use a guest user or create one
    // In production, you'd want to match by email to an existing user
    const customerEmail = session.customer_details?.email || 'guest@example.com';

    // Try to find existing user by email
    const findUser = db.prepare('SELECT id FROM "User" WHERE email = ?');
    let user = findUser.get(customerEmail) as { id: string } | undefined;

    // If no user exists, create a guest user
    if (!user) {
      const userId = generateId();
      const insertUser = db.prepare(`
        INSERT INTO "User" (id, email, name, role, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const customerName = session.customer_details?.name || 'Guest User';

      insertUser.run(
        userId,
        customerEmail,
        customerName,
        'CUSTOMER',
        new Date().toISOString(),
        new Date().toISOString()
      );

      user = { id: userId };
    }

    // Prepare addresses
    const shippingAddress = {
      name: session.customer_details?.name || '',
      addressLine1: session.customer_details?.address?.line1 || '',
      addressLine2: session.customer_details?.address?.line2 || '',
      city: session.customer_details?.address?.city || '',
      state: session.customer_details?.address?.state || '',
      postalCode: session.customer_details?.address?.postal_code || '',
      country: session.customer_details?.address?.country || '',
    };

    // Use metadata for billing address if provided, otherwise use shipping
    const billingAddress = session.metadata?.customerAddress ? {
      name: `${session.metadata.customerFirstName} ${session.metadata.customerLastName}`,
      addressLine1: session.metadata.customerAddress || '',
      city: session.metadata.customerCity || '',
      state: session.metadata.customerState || '',
      postalCode: session.metadata.customerZipCode || '',
      country: session.metadata.customerCountry || '',
    } : shippingAddress;

    // Create order
    const orderId = generateId();
    const insertOrder = db.prepare(`
      INSERT INTO "Order" (id, userId, status, total, shippingAddress, billingAddress, paymentIntentId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertOrder.run(
      orderId,
      user.id,
      'PROCESSING', // Order status
      total,
      JSON.stringify(shippingAddress),
      JSON.stringify(billingAddress),
      session.payment_intent as string,
      new Date().toISOString(),
      new Date().toISOString()
    );

    // Create order items from metadata cart items
    const insertOrderItem = db.prepare(`
      INSERT INTO OrderItem (id, orderId, productId, quantity, price, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Try to get cart items from metadata first
    if (session.metadata?.cartItems) {
      try {
        const cartItems = JSON.parse(session.metadata.cartItems);

        for (const item of cartItems) {
          if (item.id) {
            insertOrderItem.run(
              generateId(),
              orderId,
              item.id,
              item.quantity || 1,
              (item.price || 0) / 100, // Convert from cents to dollars
              new Date().toISOString()
            );
          }
        }

        console.log(`   - Created ${cartItems.length} order items from metadata`);
      } catch (err) {
        console.error('Error parsing cart items from metadata:', err);
      }
    } else {
      // Fallback to matching by product name from line items
      for (const item of lineItems) {
        const productData = item.price?.product as Stripe.Product;
        const productName = productData?.name || item.description;

        const findProduct = db.prepare('SELECT id, price FROM Product WHERE name = ?');
        const product = findProduct.get(productName) as { id: string; price: number } | undefined;

        if (product) {
          insertOrderItem.run(
            generateId(),
            orderId,
            product.id,
            item.quantity || 1,
            (item.amount_total || 0) / 100 / (item.quantity || 1),
            new Date().toISOString()
          );
        } else {
          console.warn(`Product not found: ${productName}`);
        }
      }
    }

    db.close();

    console.log(`✅ Order created successfully: ${orderId}`);
    console.log(`   - Customer: ${customerEmail}`);
    console.log(`   - Total: $${total.toFixed(2)}`);
    console.log(`   - Items: ${lineItems.length}`);

  } catch (error) {
    console.error('Error creating order from session:', error);
    throw error;
  }
}
