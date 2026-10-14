// src/app/(dashboard)/dashboard/products/[id]/edit/page.jsx
import { ProductForm } from '../../ProductForm'

export const metadata = {
  title: 'Edit Product | Shoaib Jewellers Admin',
}

export default function EditProductPage({ params }) {
  return <ProductForm mode="edit" productId={params.id} />
}