'use client';

import { motion } from 'framer-motion';
import { Star, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

export default function ProviderReviewsPage() {
  const reviews = [
    { id: 1, customer: 'Amit K.', rating: 5, date: '2026-06-08', service: 'Deep Home Cleaning', comment: 'Punctual, professional, and very thorough. The house looks sparkling clean! Highly recommend their deep clean service.' },
    { id: 2, customer: 'Sneha L.', rating: 5, date: '2026-06-05', service: 'AC Gas Refill', comment: 'Quick service, explained the problem clearly, and fixed the AC immediately. Great experience.' },
    { id: 3, customer: 'Vikram R.', rating: 4, date: '2026-05-29', service: 'Bathroom Plumbing Repair', comment: 'Fixed the leak quickly, charged exactly as quoted. Deducted one star because they arrived 15 mins late, but work was excellent.' },
  ];

  return (
    <div className="flex-1 bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Customer Reviews</h1>
          <p className="text-xs text-slate-400 mt-0.5">Read feedback and ratings from customers you have served.</p>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Rating Summary Card */}
        <div className="grid md:grid-cols-3 gap-6 bg-white/80 border border-white/60 rounded-[24px] p-6 shadow-xl backdrop-blur-md">
          <div className="text-center md:border-r border-slate-100 flex flex-col justify-center items-center py-4">
            <span className="text-4xl font-black text-slate-900">4.9</span>
            <div className="flex gap-1.5 my-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />)}
            </div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Average Rating</span>
          </div>

          <div className="col-span-2 space-y-2 flex flex-col justify-center py-2">
            {[
              { stars: 5, pct: '92%' },
              { stars: 4, pct: '8%' },
              { stars: 3, pct: '0%' },
              { stars: 2, pct: '0%' },
              { stars: 1, pct: '0%' },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-4">{row.stars}★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: row.pct }} />
                </div>
                <span className="text-xs font-bold text-slate-900 w-8 text-right">{row.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev, i) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/80 border border-white/60 rounded-[24px] p-5 md:p-6 shadow-xl backdrop-blur-md space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{rev.customer}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-250 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Job: {rev.service}
              </div>

              <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
