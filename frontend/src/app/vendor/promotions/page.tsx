'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Tag as TagIcon, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/layout/Sidebar';

export default function VendorPromotionsPage() {
  const [coupons, setCoupons] = useState([
    { code: 'BHARAT10', desc: '10% discount on all physical products', type: 'PERCENT', value: '10%', status: 'ACTIVE', usages: '45/100' },
    { code: 'TECHDISC', desc: 'Flat ₹500 discount on Electronics above ₹10,000', type: 'FLAT', value: '₹500', status: 'ACTIVE', usages: '12/50' },
  ]);

  // Force Light Mode on Mount
  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  const handleAdd = () => {
    toast.success('Campaign setup wizard under maintenance 🛠');
  };

  const handleDelete = (code: string) => {
    setCoupons(coupons.filter(c => c.code !== code));
    toast.success(`Coupon ${code} deleted successfully.`);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight">Promotions & Coupons</h1>
            <p className="text-xs text-slate-500 mt-0.5">Create and manage discounts for your storefront</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-650 hover:from-indigo-500 hover:to-purple-555 text-white text-xs font-extrabold rounded-xl shadow-md shadow-indigo-150 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> 
            <span>Create Coupon</span>
          </button>
        </div>

        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          {/* List of Coupons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] shadow-xl shadow-slate-100/50 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-6 py-4">Coupon Code</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Discount Value</th>
                    <th className="px-6 py-4">Usages</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                  {coupons.map((coupon) => (
                    <tr key={coupon.code} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 font-black text-indigo-600">
                        <span className="flex items-center gap-2">
                          <TagIcon className="w-4 h-4" /> {coupon.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-650">{coupon.desc}</td>
                      <td className="px-6 py-4 font-black text-slate-800">{coupon.value}</td>
                      <td className="px-6 py-4 text-slate-400">{coupon.usages}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                          {coupon.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(coupon.code)}
                          className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
