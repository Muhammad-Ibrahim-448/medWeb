// src/app/(dashboard)/dashboard/blog/new/page.jsx
import { BlogForm } from '../BlogForm'

export const metadata = {
  title: 'New Post | Shoaib Jewellers Admin',
}

export default function NewBlogPostPage() {
  return <BlogForm mode="create" />
}