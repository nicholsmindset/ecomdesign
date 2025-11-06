import Database from 'better-sqlite3';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

console.log('🧪 E-Commerce Platform Test Suite\n');
console.log('=' .repeat(60));

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
let db: any;
let testsPassed = 0;
let testsFailed = 0;

function test(name: string, fn: () => boolean | Promise<boolean>) {
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.then(r => {
        if (r) {
          console.log(`✅ ${name}`);
          testsPassed++;
        } else {
          console.log(`❌ ${name}`);
          testsFailed++;
        }
      });
    } else if (result) {
      console.log(`✅ ${name}`);
      testsPassed++;
    } else {
      console.log(`❌ ${name}`);
      testsFailed++;
    }
  } catch (error: any) {
    console.log(`❌ ${name} - ${error.message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('\n📊 DATABASE TESTS\n');

  // Test 1: Database file exists
  test('Database file exists', () => {
    const fs = require('fs');
    return fs.existsSync(dbPath);
  });

  // Test 2: Can connect to database
  test('Can connect to database', () => {
    db = new Database(dbPath, { readonly: true });
    return db !== null;
  });

  // Test 3: Users table has data
  test('Users table has 2 test users', () => {
    const result = db.prepare('SELECT COUNT(*) as count FROM User').get();
    return result.count === 2;
  });

  // Test 4: Products table has data
  test('Products table has 20 products', () => {
    const result = db.prepare('SELECT COUNT(*) as count FROM Product').get();
    return result.count === 20;
  });

  // Test 5: Categories table has data
  test('Categories table has 5 categories', () => {
    const result = db.prepare('SELECT COUNT(*) as count FROM Category').get();
    return result.count === 5;
  });

  // Test 6: Orders table has sample data
  test('Orders table has sample order', () => {
    const result = db.prepare('SELECT COUNT(*) as count FROM "Order"').get();
    return result.count >= 1;
  });

  console.log('\n👤 AUTHENTICATION TESTS\n');

  // Test 7: Admin user exists
  test('Admin user exists', () => {
    const user = db.prepare('SELECT * FROM User WHERE email = ?').get('admin@ecomdesign.com');
    return user !== undefined;
  });

  // Test 8: Customer user exists
  test('Customer user exists', () => {
    const user = db.prepare('SELECT * FROM User WHERE email = ?').get('customer@example.com');
    return user !== undefined;
  });

  // Test 9: Passwords are hashed
  await test('Passwords are properly hashed', async () => {
    const user = db.prepare('SELECT password FROM User WHERE email = ?').get('admin@ecomdesign.com') as any;
    return user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
  });

  // Test 10: Password verification works
  await test('Password verification works', async () => {
    const user = db.prepare('SELECT password FROM User WHERE email = ?').get('admin@ecomdesign.com') as any;
    return await bcrypt.compare('password123', user.password);
  });

  console.log('\n📦 PRODUCT TESTS\n');

  // Test 11: Products have valid prices
  test('Products have valid prices (in dollars)', () => {
    const products = db.prepare('SELECT price FROM Product').all() as any[];
    return products.every(p => p.price > 0 && p.price < 10000);
  });

  // Test 12: Products have categories
  test('All products have valid categories', () => {
    const result = db.prepare(`
      SELECT COUNT(*) as count FROM Product p
      WHERE EXISTS (SELECT 1 FROM Category c WHERE c.id = p.categoryId)
    `).get() as any;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM Product').get() as any;
    return result.count === totalProducts.count;
  });

  // Test 13: Featured products exist
  test('Featured products exist', () => {
    const result = db.prepare('SELECT COUNT(*) as count FROM Product WHERE featured = 1').get() as any;
    return result.count > 0;
  });

  // Test 14: Products have images
  test('Products have image data', () => {
    const product = db.prepare('SELECT images FROM Product LIMIT 1').get() as any;
    try {
      const images = JSON.parse(product.images);
      return Array.isArray(images) && images.length > 0;
    } catch {
      return false;
    }
  });

  // Test 15: Products have unique slugs
  test('Products have unique slugs', () => {
    const duplicates = db.prepare(`
      SELECT slug, COUNT(*) as count FROM Product
      GROUP BY slug HAVING COUNT(*) > 1
    `).all();
    return duplicates.length === 0;
  });

  console.log('\n📂 CATEGORY TESTS\n');

  // Test 16: Categories have unique names
  test('Categories have unique names', () => {
    const duplicates = db.prepare(`
      SELECT name, COUNT(*) as count FROM Category
      GROUP BY name HAVING COUNT(*) > 1
    `).all();
    return duplicates.length === 0;
  });

  // Test 17: All categories have products
  test('All categories have at least one product', () => {
    const emptyCategories = db.prepare(`
      SELECT c.id FROM Category c
      WHERE NOT EXISTS (SELECT 1 FROM Product p WHERE p.categoryId = c.id)
    `).all();
    return emptyCategories.length === 0;
  });

  console.log('\n🛒 ORDER TESTS\n');

  // Test 18: Sample order has items
  test('Sample order has order items', () => {
    const order = db.prepare('SELECT id FROM "Order" LIMIT 1').get() as any;
    if (!order) return false;
    const items = db.prepare('SELECT COUNT(*) as count FROM OrderItem WHERE orderId = ?').get(order.id) as any;
    return items.count > 0;
  });

  // Test 19: Order items reference valid products
  test('Order items reference valid products', () => {
    const invalidItems = db.prepare(`
      SELECT COUNT(*) as count FROM OrderItem oi
      WHERE NOT EXISTS (SELECT 1 FROM Product p WHERE p.id = oi.productId)
    `).get() as any;
    return invalidItems.count === 0;
  });

  // Test 20: Order totals are positive
  test('Order totals are positive values', () => {
    const orders = db.prepare('SELECT total FROM "Order"').all() as any[];
    return orders.every(o => Number(o.total) > 0);
  });

  console.log('\n💰 PRICE CONSISTENCY TESTS\n');

  // Test 21: Check sample product prices
  test('Sample product prices are in dollars', () => {
    const product = db.prepare("SELECT price FROM Product WHERE name LIKE '%Headphones%'").get() as any;
    // Should be 299.99, not 29999 (cents)
    return product && product.price > 100 && product.price < 500;
  });

  // Test 22: Cart items would work with current prices
  test('Prices compatible with cart format', () => {
    const products = db.prepare('SELECT price FROM Product LIMIT 5').all() as any[];
    // All prices should be reasonable dollar amounts
    return products.every(p => p.price >= 1 && p.price <= 1000);
  });

  db.close();

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 TEST RESULTS: ${testsPassed} passed, ${testsFailed} failed\n`);

  if (testsFailed === 0) {
    console.log('✅ All tests passed! Application is ready for use.\n');
  } else {
    console.log('❌ Some tests failed. Please review the issues above.\n');
  }

  console.log('🔧 MANUAL TESTING CHECKLIST:\n');
  console.log('  1. Start dev server: npm run dev');
  console.log('  2. Visit http://localhost:3000');
  console.log('  3. Browse products page');
  console.log('  4. Add product to cart');
  console.log('  5. Sign in with: customer@example.com / password123');
  console.log('  6. View order history at /account/orders');
  console.log('  7. Go through checkout flow (requires Stripe keys)');
  console.log('');
}

runTests().catch(console.error);
