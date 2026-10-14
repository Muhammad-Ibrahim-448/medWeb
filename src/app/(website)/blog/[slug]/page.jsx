// src/app/(website)/blog/[slug]/page.jsx
import { BlogDetailClient } from './BlogDetailClient'

export async function generateMetadata({ params }) {
  const { slug } = await params
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/blog/${slug}`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    if (data.success) {
      return {
        title: `${data.data.title} | Shoaib Jewellers Journal`,
        description: data.data.excerpt || '',
        openGraph: {
          title: data.data.title,
          description: data.data.excerpt || '',
          images: data.data.cover_image ? [data.data.cover_image] : [],
        },
      }
    }
  } catch (e) {
    // ignore
  }
  return { title: 'Journal | Shoaib Jewellers' }
}

export default function BlogDetailPage() {
  return <BlogDetailClient />
}