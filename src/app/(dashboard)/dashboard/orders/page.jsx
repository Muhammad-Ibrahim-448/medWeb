// src/app/(dashboard)/dashboard/orders/page.jsx
import { OrdersClient } from './OrdersClient'

export const metadata = {
  title: 'Orders | Shoaib Jewellers Admin',
  description: 'Manage customer orders',
}

export default function OrdersPage() {
  return <OrdersClient />
}