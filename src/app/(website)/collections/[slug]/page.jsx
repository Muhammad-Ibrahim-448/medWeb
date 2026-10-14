import { notFound } from 'next/navigation'
import { COLLECTIONS } from '@/lib/collections'
import CollectionClient from './CollectionClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const col = COLLECTIONS[slug]

  if (!col) {
    return {
      title: 'Collection Not Found',
    }
  }

  return {
    title: `${col.name} | Shoaib Jewellers`,
    description: col.description,
  }
}

export default async function CollectionPage({ params }) {
  const { slug } = await params

  if (!COLLECTIONS[slug]) {
    notFound()
  }

  return <CollectionClient slug={slug} />
}