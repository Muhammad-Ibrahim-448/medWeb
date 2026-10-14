import { notFound } from 'next/navigation'
import { query } from '@/lib/db'
import ProductDetailClient from './ProductDetailClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params

  const rows = await query(
    `SELECT name, short_description, meta_title, meta_description
     FROM products
     WHERE slug = ? AND status = 'active'
     LIMIT 1`,
    [slug]
  )

  if (!rows.length) {
    return {
      title: 'Product Not Found',
    }
  }

  const product = rows[0]

  return {
    title:
      product.meta_title ||
      `${product.name} | Shoaib Jewellers`,
    description:
      product.meta_description ||
      product.short_description ||
      undefined,
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params

  const rows = await query(
    `SELECT
       p.*,
       c.name AS category_name,
       c.slug AS category_slug
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.slug = ?
       AND p.status = 'active'
     LIMIT 1`,
    [slug]
  )

  if (!rows.length) {
    notFound()
  }

  const product = rows[0]

  const images = await query(
    `SELECT
       id,
       image_url,
       alt_text,
       is_primary,
       sort_order
     FROM product_images
     WHERE product_id = ?
     ORDER BY is_primary DESC, sort_order ASC`,
    [product.id]
  )

  const related = await query(
    `SELECT
       p.id,
       p.name,
       p.slug,
       p.price,
       p.sale_price,
       p.stock_quantity,
       p.featured,
       p.gender,
       p.stone,
       c.name AS category_name,
       (
         SELECT image_url
         FROM product_images
         WHERE product_id = p.id
         ORDER BY is_primary DESC, sort_order ASC
         LIMIT 1
       ) AS primary_image
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.status = 'active'
       AND p.category_id = ?
       AND p.id != ?
     ORDER BY p.featured DESC, p.created_at DESC
     LIMIT 4`,
    [product.category_id, product.id]
  )

  query(
    'UPDATE products SET views_count = views_count + 1 WHERE id = ?',
    [product.id]
  ).catch(() => {})

  return (
    <ProductDetailClient
      product={{
        ...product,
        price: Number(product.price),
        sale_price:
          product.sale_price != null
            ? Number(product.sale_price)
            : null,
      }}
      images={images}
      related={related.map((product) => ({
        ...product,
        price: Number(product.price),
        sale_price:
          product.sale_price != null
            ? Number(product.sale_price)
            : null,
      }))}
    />
  )
}