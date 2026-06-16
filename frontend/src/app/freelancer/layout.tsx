'use client';

import React, { useEffect } from 'react';
import FreelancerSidebar from '@/components/layout/FreelancerSidebar';

export default function FreelancerLayout({
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
      <FreelancerSidebar />

      {/* Main Workspace Scroll Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
