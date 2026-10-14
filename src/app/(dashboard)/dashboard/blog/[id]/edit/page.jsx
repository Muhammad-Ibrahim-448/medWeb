// src/app/(dashboard)/dashboard/blog/[id]/edit/page.jsx
import { BlogForm } from '../../BlogForm'

export const metadata = {
  title: 'Edit Post | Shoaib Jewellers Admin',
}

export default function EditBlogPostPage() {
  return <BlogForm mode="edit" />
}