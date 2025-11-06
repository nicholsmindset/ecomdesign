import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import * as path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath, { readonly: true });

    try {
      const product = db.prepare(`
        SELECT
          p.*,
          c.id as categoryId,
          c.name as categoryName,
          c.slug as categorySlug
        FROM Product p
        LEFT JOIN Category c ON c.id = p.categoryId
        WHERE p.slug = ?
      `).get(slug);

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      // Format the response to match Prisma structure
      const formattedProduct = {
        ...(product as any),
        category: {
          id: (product as any).categoryId,
          name: (product as any).categoryName,
          slug: (product as any).categorySlug,
        },
      };

      // Remove duplicate category fields
      delete (formattedProduct as any).categoryId;
      delete (formattedProduct as any).categoryName;
      delete (formattedProduct as any).categorySlug;

      return NextResponse.json(formattedProduct);
    } finally {
      db.close();
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
