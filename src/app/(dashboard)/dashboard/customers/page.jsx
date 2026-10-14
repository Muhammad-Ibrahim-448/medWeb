// src/app/(dashboard)/dashboard/customers/page.jsx
import { CustomersClient } from './CustomersClient'

export const metadata = {
  title: 'Customers | Shoaib Jewellers Admin',
}

export default function CustomersPage() {
  return <CustomersClient />
}