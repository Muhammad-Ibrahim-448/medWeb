import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import WishlistClient from './WishlistClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My Wishlist | Shoaib Jewellers',
  description: 'Your saved jewellery pieces',
}

export default async function WishlistPage({ searchParams }) {
  const session = await getSession()

  // Not logged in → send to login with redirect back to /wishlist
  if (!session) {
    const params = await searchParams
    const extra = params?.redirect
      ? `?redirect=${encodeURIComponent(params.redirect)}`
      : ''

    redirect(
      `/login?redirect=${encodeURIComponent('/wishlist')}${extra ? '' : ''}`
    )
  }

  return <WishlistClient />
}