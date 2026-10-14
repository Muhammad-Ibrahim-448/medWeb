// src/app/(dashboard)/dashboard/orders/[id]/page.jsx
import { OrderDetailClient } from './OrderDetailClient'

export const metadata = {
  title: 'Order Details | Shoaib Jewellers Admin',
}

export default function OrderDetailPage() {
  return <OrderDetailClient />
}