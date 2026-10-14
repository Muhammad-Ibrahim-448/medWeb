import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import CartClient from './CartClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shopping Cart | Shoaib Jewellers',
  description: 'Review your selected jewellery pieces',
};

export default async function CartPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?redirect=/cart');
  }

  return <CartClient />;
}