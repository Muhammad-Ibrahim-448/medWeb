// src/components/layout/DashboardLayoutWrapper.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DashboardProvider } from '@/context/DashboardContext';
import { DashboardLayout } from './DashboardLayout';

function DashboardGuard({ children }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/dashboard');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return <DashboardLayout>{children}</DashboardLayout>;
}

const DashboardLayoutWrapper = ({ children }) => {
  return (
    <AuthProvider>
      <DashboardProvider>
        <DashboardGuard>{children}</DashboardGuard>
      </DashboardProvider>
    </AuthProvider>
  );
};

export { DashboardLayoutWrapper };