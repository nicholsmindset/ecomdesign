import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import * as path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath, { readonly: true });

    try {
      let query = `
        SELECT
          p.*,
          c.id as categoryId,
          c.name as categoryName,
          c.slug as categorySlug
        FROM Product p
        LEFT JOIN Category c ON c.id = p.categoryId
        WHERE 1=1
      `;

      const params: any[] = [];

      if (categoryId) {
        query += ' AND p.categoryId = ?';
        params.push(categoryId);
      }

      if (featured === 'true') {
        query += ' AND p.featured = 1';
      }

      if (search) {
        query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ' ORDER BY p.createdAt DESC';

      const products = db.prepare(query).all(...params);

      // Format products to match Prisma structure
      const formattedProducts = products.map((product: any) => ({
        ...product,
        category: {
          id: product.categoryId,
          name: product.categoryName,
          slug: product.categorySlug,
        },
        categoryId: product.categoryId,
      }));

      return NextResponse.json(formattedProducts);
    } finally {
      db.close();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
