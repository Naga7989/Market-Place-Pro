'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import Sidebar from '@/components/layout/Sidebar';

export default function VendorEarningsPage() {
  // Force Light Mode on Mount
  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  const transactions = [
    { id: 'TXN-901234', desc: 'Payout transfer to HDFC Account', date: '2026-06-01', amount: -184500, type: 'DEBIT', status: 'SUCCESS' },
    { id: 'TXN-901233', desc: 'Order MKP-2026-001234 commission credit', date: '2026-05-28', amount: 134900, type: 'CREDIT', status: 'SUCCESS' },
    { id: 'TXN-901232', desc: 'Order MKP-2026-001233 commission credit', date: '2026-05-26', amount: 74999, type: 'CREDIT', status: 'SUCCESS' },
    { id: 'TXN-901231', desc: 'Order MKP-2026-001232 commission credit', date: '2026-05-24', amount: 24990, type: 'CREDIT', status: 'SUCCESS' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-5">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight">Earnings & Payouts</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage payouts, track sales revenue, and check pending escrows</p>
        </div>

        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-650 text-white rounded-[24px] p-6 shadow-xl shadow-indigo-100 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-indigo-100 font-bold uppercase tracking-wider">Available for Payout</p>
                <h3 className="text-3xl font-black font-display mt-2">{formatPrice(100000)}</h3>
              </div>
              <button className="w-full mt-6 py-3 bg-white text-indigo-650 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors shadow-md hover:scale-[1.02] active:scale-[0.98]">
                Request Instant Transfer
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/50 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Total Revenue Earned</p>
                <h3 className="text-2xl font-black text-slate-900 font-display mt-2">{formatPrice(284500)}</h3>
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-2">
                Commission withheld: <span className="font-extrabold text-red-500">₹14,225 (5%)</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/50 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Pending Approvals</p>
                <h3 className="text-2xl font-black text-slate-900 font-display mt-2">{formatPrice(24990)}</h3>
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-2">
                Escrow held orders: <span className="font-extrabold text-amber-500">1 Order</span>
              </div>
            </motion.div>
          </div>

          {/* Historical Trans Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/50 space-y-4 overflow-hidden"
          >
            <h3 className="text-base font-extrabold text-slate-900 font-display">Recent Payouts & Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-6 py-4">Reference ID</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100 font-semibold">
                  {transactions.map((txn, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 font-mono">{txn.id}</td>
                      <td className="px-6 py-4 font-extrabold text-slate-800">{txn.desc}</td>
                      <td className="px-6 py-4 text-slate-400 font-semibold">{txn.date}</td>
                      <td className={`px-6 py-4 text-right font-black ${txn.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {txn.type === 'CREDIT' ? '+' : '-'}{formatPrice(Math.abs(txn.amount))}
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
