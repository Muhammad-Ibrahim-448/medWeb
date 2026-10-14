// src/app/(dashboard)/dashboard/products/page.jsx
import { ProductsClient } from './ProductsClient'

export const metadata = {
  title: 'Products | Shoaib Jewellers Admin',
}

export default function ProductsPage() {
  return <ProductsClient />
}