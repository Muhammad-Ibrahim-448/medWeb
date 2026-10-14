// src/app/(dashboard)/dashboard/customers/[id]/page.jsx
import { CustomerDetailClient } from './CustomerDetailClient'

export const metadata = {
  title: 'Customer Details | Shoaib Jewellers Admin',
}

export default function CustomerDetailPage() {
  return <CustomerDetailClient />
}