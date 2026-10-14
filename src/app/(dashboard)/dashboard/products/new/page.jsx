// src/app/(dashboard)/dashboard/products/new/page.jsx
import { ProductForm } from '../ProductForm'

export const metadata = {
  title: 'Add Product | Shoaib Jewellers Admin',
}

export default function NewProductPage() {
  return <ProductForm mode="create" />
}