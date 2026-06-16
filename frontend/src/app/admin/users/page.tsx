'use client';

import { useState, useEffect } from 'react';
import { Users, Search, ArrowLeft, ArrowUpRight, ShieldAlert, Check } from 'lucide-react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Link from 'next/link';

interface MockUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: string;
}

const MOCK_USERS: MockUser[] = [
  { id: 101, fullName: 'Aarav Sharma', email: 'aarav@gmail.com', role: 'CUSTOMER', status: 'ACTIVE' },
  { id: 102, fullName: 'Priya Patel', email: 'priya@gmail.com', role: 'CUSTOMER', status: 'ACTIVE' },
  { id: 103, fullName: 'Rajesh Kumar', email: 'rajesh@techmart.in', role: 'SELLER', status: 'ACTIVE' },
  { id: 104, fullName: 'Neha Gupta', email: 'neha@gmail.com', role: 'CUSTOMER', status: 'SUSPENDED' }
];

export default function AdminUsersPage() {
  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-200/60 bg-white/70 backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-900 font-display">User Directory</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Manage Platform Accounts</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Search filter block */}
            <div className="bg-white/80 border border-white/60 p-4 rounded-[24px] flex items-center shadow-xl backdrop-blur-md">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Users table list */}
            <div className="bg-white/80 border border-white/60 rounded-[24px] shadow-xl backdrop-blur-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4">User Details</th>
                      <th className="px-6 py-4">Account Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-600">
                    {MOCK_USERS.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">{user.fullName}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 uppercase border border-indigo-250">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                              : 'bg-rose-50 text-rose-700 border-rose-200/60'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs font-bold text-indigo-650 hover:text-indigo-800 hover:underline">
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
