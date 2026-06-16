'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package, ShoppingBag, Star,
  DollarSign, Users, Eye, ArrowUp, ArrowDown,
  Plus, ChevronRight, Tag
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Sidebar from '@/components/layout/Sidebar';

// Sample vendor dashboard data
const dashboardStats = [
  { label: 'Total Revenue', value: '₹2,84,500', change: '+12.5%', up: true, icon: <DollarSign className="w-6 h-6" />, color: 'from-emerald-500 to-teal-600', text: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Total Orders', value: '1,284', change: '+8.2%', up: true, icon: <ShoppingBag className="w-6 h-6" />, color: 'from-indigo-500 to-blue-600', text: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Active Products', value: '342', change: '+5', up: true, icon: <Package className="w-6 h-6" />, color: 'from-violet-500 to-purple-600', text: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Avg. Rating', value: '4.8★', change: '+0.2', up: true, icon: <Star className="w-6 h-6" />, color: 'from-amber-500 to-orange-600', text: 'text-amber-600', bg: 'bg-amber-50' },
];

const recentOrders = [
  { id: 'MKP-2024-001234', customer: 'Rahul Sharma', product: 'iPhone 15 Pro Max', amount: 134900, status: 'DELIVERED', date: '2024-01-15' },
  { id: 'MKP-2024-001233', customer: 'Priya Singh', product: 'Samsung Galaxy S24', amount: 74999, status: 'SHIPPED', date: '2024-01-14' },
  { id: 'MKP-2024-001232', customer: 'Amit Patel', product: 'Sony WH-1000XM5', amount: 24990, status: 'PROCESSING', date: '2024-01-14' },
  { id: 'MKP-2024-001231', customer: 'Neha Gupta', product: 'MacBook Air M3', amount: 114900, status: 'CONFIRMED', date: '2024-01-13' },
  { id: 'MKP-2024-001230', customer: 'Karan Mehta', product: 'iPad Pro 12.9"', amount: 89900, status: 'CANCELLED', date: '2024-01-12' },
];

const statusColors: Record<string, string> = {
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  SHIPPED: 'bg-indigo-50 text-indigo-755',
  PROCESSING: 'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-violet-50 text-violet-700',
  CANCELLED: 'bg-red-50 text-red-700',
  PENDING: 'bg-slate-50 text-slate-700',
};

export default function VendorDashboardPage() {
  const [activePeriod, setActivePeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // Force Light Mode on Mount
  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight">Rajesh's Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your store operations and monitor sales analytics</p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            {/* Period selector */}
            <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              {(['today', 'week', 'month', 'year'] as const).map((period) => (
                <button key={period} onClick={() => setActivePeriod(period)}
                  className={`px-3.5 py-2 text-xs font-bold capitalize transition-all ${
                    activePeriod === period
                      ? 'bg-indigo-600 text-white shadow-inner'
                      : 'text-slate-500 hover:text-slate-950'
                  }`}>
                  {period}
                </button>
              ))}
            </div>
            <Link href="/vendor/products/new"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-indigo-150 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="w-4 h-4" /> 
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardStats.map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[20px] p-5 shadow-xl shadow-slate-100/50 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.bg} ${stat.text} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-bold ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                    {stat.up ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 font-display tracking-tight">{stat.value}</p>
                  <p className="text-xs font-bold text-slate-450 mt-1 uppercase tracking-wider">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] shadow-xl shadow-slate-100/50 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-extrabold text-slate-900 font-display">Recent Orders</h2>
              <Link href="/vendor/orders" className="text-xs font-bold text-indigo-650 hover:text-indigo-750 flex items-center gap-1 uppercase tracking-wider">
                <span>View all orders</span> 
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left">Order ID</th>
                    <th className="px-6 py-4 text-left">Customer</th>
                    <th className="px-6 py-4 text-left hidden md:table-cell">Product</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4.5 font-mono text-xs font-semibold">
                        <Link href={`/vendor/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-750">
                          {order.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4.5">
                        <p className="text-xs font-extrabold text-slate-800">{order.customer}</p>
                      </td>
                      <td className="px-6 py-4.5 hidden md:table-cell">
                        <p className="text-xs text-slate-550 max-w-[200px] truncate">{order.product}</p>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <span className="text-xs font-black text-slate-900">{formatPrice(order.amount)}</span>
                      </td>
                      <td className="px-6 py-4.5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right hidden md:table-cell">
                        <span className="text-xs font-semibold text-slate-400">{order.date}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Package className="w-5 h-5" />, label: 'Add Product', href: '/vendor/products/new', color: 'from-indigo-600 to-indigo-650 shadow-indigo-150' },
              { icon: <Tag className="w-5 h-5" />, label: 'Create Coupon', href: '/vendor/promotions/new', color: 'from-blue-600 to-blue-650 shadow-blue-150' },
              { icon: <Eye className="w-5 h-5" />, label: 'View Store', href: '/store/techmart', color: 'from-emerald-600 to-emerald-650 shadow-emerald-150' },
              { icon: <Users className="w-5 h-5" />, label: 'See Reviews', href: '/vendor/reviews', color: 'from-violet-600 to-violet-650 shadow-violet-150' },
            ].map(({ icon, label, href, color }) => (
              <Link key={label} href={href}
                className={`flex items-center justify-center gap-2 py-4 bg-gradient-to-r ${color} hover:opacity-95 text-white text-xs font-extrabold rounded-2xl transition-all shadow-lg active:scale-[0.98]`}>
                {icon} 
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
