// src/app/(dashboard)/dashboard/categories/[id]/edit/page.jsx
import { CategoryForm } from '../../CategoryForm'

export const metadata = {
  title: 'Edit Category | Shoaib Jewellers Admin',
}

export default function EditCategoryPage() {
  return <CategoryForm mode="edit" />
}