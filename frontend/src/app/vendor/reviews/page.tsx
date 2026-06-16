'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

export default function VendorReviewsPage() {
  // Force Light Mode on Mount
  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  const reviews = [
    { customer: 'Rahul Sharma', rating: 5, comment: 'Excellent product! The iPhone 15 Pro Max was delivered in perfect condition and is extremely fast. Highly recommended seller!', product: 'iPhone 15 Pro Max', date: '2026-06-05' },
    { customer: 'Priya Singh', rating: 4, comment: 'Slight delay in shipping, but the Samsung Galaxy S24 is fantastic. Packaged safely.', product: 'Samsung Galaxy S24', date: '2026-06-03' },
    { customer: 'Amit Patel', rating: 5, comment: 'Top-tier active noise cancellation on this Sony WH-1000XM5. Very satisfied with BharatMart Megastore.', product: 'Sony WH-1000XM5', date: '2026-05-30' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-5">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight">Customer Feedback</h1>
          <p className="text-xs text-slate-500 mt-0.5">View ratings, reviews, and satisfaction scores from your store customers</p>
        </div>

        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          {/* Aggregate Rating */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="text-center md:px-8">
              <h2 className="text-5xl font-black text-indigo-650 font-display">4.8</h2>
              <div className="flex justify-center gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">Overall Rating (128 Reviews)</p>
            </div>

            <div className="flex-1 w-full space-y-2 md:border-l border-slate-100 md:pl-8">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3 text-xs font-semibold">
                  <span className="w-6 text-slate-400 text-right">{stars}★</span>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: stars === 5 ? '80%' : stars === 4 ? '15%' : '5%' }} />
                  </div>
                  <span className="w-8 text-right text-slate-400">{stars === 5 ? '102' : stars === 4 ? '19' : '7'}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* List of Reviews */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 font-display">Recent Reviews</h3>
            {reviews.map((rev, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 + 0.1 }}
                className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/50 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-800">{rev.customer}</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">Reviewed on {rev.product}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-0.5 justify-end">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 block mt-1">{rev.date}</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-650 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  "{rev.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
