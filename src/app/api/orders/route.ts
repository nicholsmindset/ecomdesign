import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Database from 'better-sqlite3';
import * as path from 'path';

export async function GET(req: NextRequest) {
  try {
    // Get session - note: in production you'd import authOptions from your NextAuth config
    // For now, we'll use a simple check based on the request
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath, { readonly: true });

    try {
      // Get user by email
      const findUser = db.prepare('SELECT id FROM "User" WHERE email = ?');
      const user = findUser.get(session.user.email) as { id: string } | undefined;

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Get user's orders
      const getOrders = db.prepare(`
        SELECT * FROM "Order"
        WHERE userId = ?
        ORDER BY createdAt DESC
      `);

      const orders = getOrders.all(user.id) as any[];

      // Get order items for each order
      const ordersWithItems = orders.map((order) => {
        const getOrderItems = db.prepare(`
          SELECT
            oi.*,
            p.name as productName,
            p.slug as productSlug,
            p.images as productImages
          FROM OrderItem oi
          JOIN Product p ON p.id = oi.productId
          WHERE oi.orderId = ?
        `);

        const items = getOrderItems.all(order.id).map((item: any) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          product: {
            name: item.productName,
            slug: item.productSlug,
            images: item.productImages,
          },
        }));

        return {
          ...order,
          items,
        };
      });

      return NextResponse.json({ orders: ordersWithItems });
    } finally {
      db.close();
    }
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
