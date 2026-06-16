'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, Eye, ShoppingCart, Percent
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

export default function VendorAnalyticsPage() {
  // Force Light Mode on Mount
  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  const stats = [
    { label: 'Store Page Views', value: '45,280', change: '+18.2% views', icon: <Eye className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Add to Cart Rate', value: '6.4%', change: '+1.5% conversion', icon: <ShoppingCart className="w-5 h-5" />, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Checkout Success Rate', value: '3.1%', change: '+0.4% conversion', icon: <Percent className="w-5 h-5" />, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Gross Sales Volume', value: '₹2,84,500', change: '+12.5% revenue', icon: <DollarSign className="w-5 h-5" />, color: 'text-violet-600 bg-violet-50' }
  ];

  const topCategories = [
    { name: 'Electronics', sales: 142, revenue: '₹1,34,900', percentage: 70 },
    { name: 'Home Appliances', sales: 68, revenue: '₹89,900', percentage: 50 },
    { name: 'Accessories', sales: 132, revenue: '₹59,700', percentage: 35 },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-5">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight">Analytics Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track your store views, conversion rates, and sales trends</p>
        </div>

        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[20px] p-5 shadow-xl shadow-slate-100/50 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">{stat.label}</span>
                  <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">{stat.value}</h3>
                  <p className="text-xs font-bold text-emerald-600 mt-1">{stat.change}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Performance chart preview & categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/50"
            >
              <h3 className="text-base font-extrabold text-slate-900 font-display mb-6">Sales Trend (Last 30 Days)</h3>
              <div className="h-60 bg-slate-50/50 rounded-2xl flex items-end justify-between p-6 gap-2 border border-slate-100">
                {/* Simulated bar chart */}
                {[45, 60, 55, 75, 90, 80, 95, 110, 120, 105, 125, 140].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                    <div
                      className="w-full bg-indigo-500/20 group-hover:bg-indigo-600 rounded-t transition-all"
                      style={{ height: `${val}px` }}
                    />
                    <span className="text-[10px] font-bold text-slate-400">W{idx + 1}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/50 space-y-4"
            >
              <h3 className="text-base font-extrabold text-slate-900 font-display">Sales by Category</h3>
              <div className="space-y-5">
                {topCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">{cat.name}</span>
                      <span className="text-indigo-600">{cat.revenue}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: `${cat.percentage}%` }} />
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400">{cat.sales} items sold</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
