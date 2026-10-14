// src/app/(website)/blog/page.jsx
import { BlogPageClient } from './BlogPageClient'

export const metadata = {
  title: 'Journal | Shoaib Jewellers',
  description:
    'Stories of craftsmanship, styling guides, and the art of fine jewellery — from the Shoaib Jewellers atelier.',
}

export default function BlogPage() {
  return <BlogPageClient />
}