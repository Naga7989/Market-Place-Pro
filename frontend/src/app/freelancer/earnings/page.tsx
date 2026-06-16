'use client';

import { motion } from 'framer-motion';
import { DollarSign, Award, CheckCircle2, TrendingUp, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function FreelancerEarningsPage() {
  const transactions = [
    { id: 1, description: 'Milestone 1 Release: React Native eCommerce App', amount: 35000, date: '2026-06-05', status: 'CREDITED' },
    { id: 2, description: 'Contract Completion: Blog SEO Redesign', amount: 18000, date: '2026-06-01', status: 'CREDITED' },
    { id: 3, description: 'Milestone 2 Deposit: React Native eCommerce App', amount: 40000, date: '2026-05-29', status: 'LOCKED_IN_ESCROW' },
  ];

  return (
    <div className="flex-1 bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Earnings & Milestones</h1>
          <p className="text-xs text-slate-400 mt-0.5">View your wallet balances, platform fees, and escrowed milestones.</p>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Earnings breakdown cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 border border-white/60 rounded-[24px] p-5 shadow-xl backdrop-blur-md">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Wallet Balance</span>
            <span className="text-2xl font-black text-slate-900 mt-1.5 block">{formatPrice(142800)}</span>
            <span className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Available for payout
            </span>
          </div>

          <div className="bg-white/80 border border-white/60 rounded-[24px] p-5 shadow-xl backdrop-blur-md">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Locked in Escrow</span>
            <span className="text-2xl font-black text-slate-900 mt-1.5 block">{formatPrice(40000)}</span>
            <span className="text-[10px] text-slate-400 font-bold mt-1.5">
              Awaiting milestone approvals
            </span>
          </div>

          <div className="bg-white/80 border border-white/60 rounded-[24px] p-5 shadow-xl backdrop-blur-md">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Platform Fees Paid</span>
            <span className="text-2xl font-black text-slate-900 mt-1.5 block">{formatPrice(19500)}</span>
            <span className="text-[10px] text-slate-400 font-bold mt-1.5">
              12% standard service fee
            </span>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white/80 border border-white/60 rounded-[24px] shadow-xl backdrop-blur-md overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-105/60">
            <h4 className="font-extrabold text-slate-900 text-sm">Recent Activity</h4>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-bold text-slate-800">{tx.description}</p>
                  <span className="text-[10px] text-slate-400">{tx.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900 block">
                    {formatPrice(tx.amount)}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mt-1 inline-block border ${
                    tx.status === 'CREDITED' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                      : 'bg-amber-50 text-amber-700 border-amber-200/60'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
