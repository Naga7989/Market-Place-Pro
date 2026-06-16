'use client';

import React, { useEffect } from 'react';
import ProviderSidebar from '@/components/layout/ProviderSidebar';

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <ProviderSidebar />

      {/* Main Workspace Scroll Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
