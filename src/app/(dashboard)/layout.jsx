// src/app/(dashboard)/layout.jsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import {DashboardLayoutWrapper} from '@/components/layout/DashboardLayoutWrapper';

export const metadata = {
  title: 'Dashboard | Shoaib Jewellers',
  description: 'Admin dashboard',
};

export default async function DashboardRootLayout({ children }) {
  const session = await getSession();

  // Not logged in → login
  if (!session) {
    redirect('/login?redirect=/dashboard');
  }

  // Logged in but not admin → home
  if (session.role !== 'admin') {
    redirect('/');
  }

  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}