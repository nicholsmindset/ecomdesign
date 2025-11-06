import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  adapter: undefined, // Use default adapter for SQLite
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ecomdesign.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Created users: ${adminUser.email}, ${customerUser.email}`);

  // Create categories
  console.log('📁 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronic devices',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel for everyone',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Everything for your home and garden',
        image: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Gear for outdoor adventures and fitness',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Books',
        slug: 'books',
        description: 'Discover your next great read',
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create products
  console.log('📦 Creating products...');

  // Electronics
  await prisma.product.createMany({
    data: [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        slug: 'wireless-noise-cancelling-headphones',
        description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and commuters.',
        price: 299.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        ]),
        stock: 45,
        categoryId: categories[0].id,
        featured: true,
      },
      {
        name: 'Smart Watch Series 5',
        slug: 'smart-watch-series-5',
        description: 'Track your fitness, monitor your health, and stay connected. Features heart rate monitoring, GPS, and water resistance up to 50m.',
        price: 399.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
          'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800',
        ]),
        stock: 30,
        categoryId: categories[0].id,
        featured: true,
      },
      {
        name: '4K Webcam Pro',
        slug: '4k-webcam-pro',
        description: 'Professional 4K webcam with autofocus, built-in dual microphones, and wide-angle lens. Perfect for streaming and video calls.',
        price: 149.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
        ]),
        stock: 60,
        categoryId: categories[0].id,
        featured: false,
      },
      {
        name: 'Mechanical Gaming Keyboard RGB',
        slug: 'mechanical-gaming-keyboard-rgb',
        description: 'Mechanical keyboard with customizable RGB backlighting, programmable keys, and anti-ghosting technology. Cherry MX switches.',
        price: 129.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
        ]),
        stock: 25,
        categoryId: categories[0].id,
        featured: false,
      },
      {
        name: 'Portable Bluetooth Speaker',
        slug: 'portable-bluetooth-speaker',
        description: 'Compact and powerful Bluetooth speaker with 360° sound, 20-hour battery life, and IPX7 waterproof rating.',
        price: 79.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
        ]),
        stock: 100,
        categoryId: categories[0].id,
        featured: false,
      },
    ],
  });

  // Clothing
  await prisma.product.createMany({
    data: [
      {
        name: 'Classic Denim Jacket',
        slug: 'classic-denim-jacket',
        description: 'Timeless denim jacket made from premium cotton. Features button closure, chest pockets, and a comfortable regular fit.',
        price: 89.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
        ]),
        stock: 40,
        categoryId: categories[1].id,
        featured: true,
      },
      {
        name: 'Athletic Running Shoes',
        slug: 'athletic-running-shoes',
        description: 'Lightweight running shoes with breathable mesh upper, responsive cushioning, and durable rubber outsole.',
        price: 119.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
        ]),
        stock: 50,
        categoryId: categories[1].id,
        featured: false,
      },
      {
        name: 'Cotton T-Shirt Pack (3-Pack)',
        slug: 'cotton-t-shirt-pack',
        description: 'Premium cotton t-shirts in classic colors. Soft, breathable, and perfect for everyday wear. Pack includes 3 shirts.',
        price: 39.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        ]),
        stock: 150,
        categoryId: categories[1].id,
        featured: false,
      },
      {
        name: 'Winter Wool Beanie',
        slug: 'winter-wool-beanie',
        description: 'Cozy merino wool beanie to keep you warm during cold weather. One size fits all.',
        price: 24.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800',
        ]),
        stock: 80,
        categoryId: categories[1].id,
        featured: false,
      },
    ],
  });

  // Home & Garden
  await prisma.product.createMany({
    data: [
      {
        name: 'Modern Table Lamp',
        slug: 'modern-table-lamp',
        description: 'Sleek and minimalist table lamp with adjustable brightness and touch controls. Perfect for bedroom or office.',
        price: 59.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
        ]),
        stock: 35,
        categoryId: categories[2].id,
        featured: false,
      },
      {
        name: 'Ceramic Planter Set',
        slug: 'ceramic-planter-set',
        description: 'Set of 3 handcrafted ceramic planters in different sizes. Includes drainage holes and saucers.',
        price: 44.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
        ]),
        stock: 55,
        categoryId: categories[2].id,
        featured: false,
      },
      {
        name: 'Premium Throw Blanket',
        slug: 'premium-throw-blanket',
        description: 'Ultra-soft fleece throw blanket perfect for cozy nights. Machine washable and available in multiple colors.',
        price: 34.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
        ]),
        stock: 70,
        categoryId: categories[2].id,
        featured: false,
      },
      {
        name: 'Kitchen Knife Set (5-Piece)',
        slug: 'kitchen-knife-set',
        description: 'Professional chef knife set with high-carbon stainless steel blades and ergonomic handles. Includes knife block.',
        price: 129.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800',
        ]),
        stock: 20,
        categoryId: categories[2].id,
        featured: true,
      },
    ],
  });

  // Sports & Outdoors
  await prisma.product.createMany({
    data: [
      {
        name: 'Yoga Mat with Carrying Strap',
        slug: 'yoga-mat-with-carrying-strap',
        description: 'Non-slip yoga mat with excellent cushioning and grip. Includes carrying strap for easy transport. 6mm thick.',
        price: 39.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
        ]),
        stock: 90,
        categoryId: categories[3].id,
        featured: false,
      },
      {
        name: 'Camping Tent (4-Person)',
        slug: 'camping-tent-4-person',
        description: 'Spacious 4-person tent with waterproof rainfly, easy setup, and excellent ventilation. Perfect for family camping trips.',
        price: 189.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
        ]),
        stock: 15,
        categoryId: categories[3].id,
        featured: true,
      },
      {
        name: 'Resistance Bands Set',
        slug: 'resistance-bands-set',
        description: 'Set of 5 resistance bands with different strength levels. Includes door anchor, handles, and carrying bag.',
        price: 29.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800',
        ]),
        stock: 120,
        categoryId: categories[3].id,
        featured: false,
      },
      {
        name: 'Stainless Steel Water Bottle',
        slug: 'stainless-steel-water-bottle',
        description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours. 32oz capacity.',
        price: 34.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
        ]),
        stock: 200,
        categoryId: categories[3].id,
        featured: false,
      },
    ],
  });

  // Books
  await prisma.product.createMany({
    data: [
      {
        name: 'The Art of Web Design',
        slug: 'art-of-web-design',
        description: 'Comprehensive guide to modern web design principles, UX/UI best practices, and responsive design patterns.',
        price: 44.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
        ]),
        stock: 30,
        categoryId: categories[4].id,
        featured: false,
      },
      {
        name: 'JavaScript: The Complete Guide',
        slug: 'javascript-complete-guide',
        description: 'Master JavaScript from basics to advanced concepts. Includes ES6+, async programming, and modern frameworks.',
        price: 54.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
        ]),
        stock: 25,
        categoryId: categories[4].id,
        featured: false,
      },
      {
        name: 'Mindful Living: A Practical Guide',
        slug: 'mindful-living-guide',
        description: 'Discover the power of mindfulness and meditation. Practical exercises for stress reduction and personal growth.',
        price: 24.99,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
        ]),
        stock: 50,
        categoryId: categories[4].id,
        featured: false,
      },
    ],
  });

  const productCount = await prisma.product.count();
  console.log(`✅ Created ${productCount} products`);

  // Create a sample cart for customer user
  console.log('🛒 Creating sample cart...');
  const sampleCart = await prisma.cart.create({
    data: {
      userId: customerUser.id,
    },
  });

  const headphones = await prisma.product.findUnique({
    where: { slug: 'wireless-noise-cancelling-headphones' },
  });

  if (headphones) {
    await prisma.cartItem.create({
      data: {
        cartId: sampleCart.id,
        productId: headphones.id,
        quantity: 1,
      },
    });
  }

  console.log('✅ Created sample cart');

  // Create a sample order
  console.log('📋 Creating sample order...');
  const smartWatch = await prisma.product.findUnique({
    where: { slug: 'smart-watch-series-5' },
  });

  if (smartWatch) {
    await prisma.order.create({
      data: {
        userId: customerUser.id,
        status: 'DELIVERED',
        total: 399.99,
        shippingAddress: {
          name: 'John Doe',
          addressLine1: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94102',
          country: 'USA',
        },
        billingAddress: {
          name: 'John Doe',
          addressLine1: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94102',
          country: 'USA',
        },
        paymentIntentId: 'pi_sample_' + Date.now(),
        items: {
          create: {
            productId: smartWatch.id,
            quantity: 1,
            price: smartWatch.price,
          },
        },
      },
    });
  }

  console.log('✅ Created sample order');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 2 (admin@ecomdesign.com, customer@example.com)`);
  console.log(`   - Password: password123`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Products: ${productCount}`);
  console.log(`   - Sample Cart: 1 item`);
  console.log(`   - Sample Order: 1 completed order`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
