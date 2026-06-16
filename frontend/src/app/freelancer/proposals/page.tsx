'use client';

import { motion } from 'framer-motion';
import { Send, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function FreelancerProposalsPage() {
  const proposals = [
    { id: 1, projectTitle: 'Figma UI/UX Mockup for Fintech Dashboard', bidAmount: 12000, status: 'PENDING', date: '2026-06-09' },
    { id: 2, projectTitle: 'React Native eCommerce App', bidAmount: 75000, status: 'ACCEPTED', date: '2026-06-04' },
    { id: 3, projectTitle: 'Spring Boot Auth Controller Debugging', bidAmount: 5000, status: 'REJECTED', date: '2026-05-28' },
  ];

  const statusStyles: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200/60',
    ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200/60',
  };

  return (
    <div className="flex-1 bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Bids & Proposals</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track the status of bids you have submitted for freelance gigs.</p>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
          {proposals.map((prop, i) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/80 border border-white/60 rounded-[24px] p-5 md:p-6 shadow-xl backdrop-blur-md flex items-center justify-between gap-4 hover:border-slate-300 transition-all duration-300"
            >
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-sm md:text-base">{prop.projectTitle}</h4>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Submitted: {prop.date}</span>
                  <span className="font-bold text-slate-800">Bid Value: {formatPrice(prop.bidAmount)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wide ${statusStyles[prop.status]}`}>
                  {prop.status}
                </span>
                <Link
                  href="/projects"
                  className="p-2 bg-slate-100 hover:bg-slate-950 hover:text-white rounded-xl text-slate-500 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
