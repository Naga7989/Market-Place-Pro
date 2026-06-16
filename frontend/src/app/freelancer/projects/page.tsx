'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Briefcase,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';

interface ActiveProject {
  id: number;
  title: string;
  description: string;
  clientName: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  budgetMax: number;
  timelineDays: number;
}

export default function FreelancerProjectsPage() {
  // Fetch active projects (mocked API or custom logic)
  const activeProjects: ActiveProject[] = [
    { id: 1, title: 'React Native eCommerce App', description: 'Build a mobile app for an online retail store based in Delhi. Integrate Razorpay SDK and push notifications.', clientName: 'Amit Verma', status: 'IN_PROGRESS', budgetMax: 75000, timelineDays: 45 },
    { id: 2, title: 'SEO Optimization & Blog Redesign', description: 'Optimize page loads and rewrite slug patterns for a travel advisory platform. Relayout tailwind grids.', clientName: 'Sania Mirza', status: 'COMPLETED', budgetMax: 18000, timelineDays: 14 }
  ];

  const statusStyles: Record<string, string> = {
    IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200/60',
  };

  return (
    <div className="flex-1 bg-slate-50 text-slate-900">
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Active Contracts</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track milestones and deliverables for your ongoing freelance projects.</p>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {activeProjects.length === 0 ? (
          <div className="bg-white/80 border border-white/60 rounded-[24px] p-12 text-center shadow-xl backdrop-blur-md">
            <Briefcase className="w-14 h-14 text-slate-350 mx-auto mb-4" />
            <h3 className="font-extrabold text-slate-900 text-lg mb-1">No Active Contracts</h3>
            <p className="text-xs text-slate-500">Submit proposals on the jobs board to win contracts and start working.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {activeProjects.map((proj) => (
              <motion.div
                key={proj.id}
                layout
                className="bg-white/80 border border-white/60 rounded-[24px] p-5 md:p-6 shadow-xl backdrop-blur-md space-y-4 hover:border-slate-300 transition-all duration-300"
              >
                {/* Title & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-base md:text-lg">{proj.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Client: {proj.clientName}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wide ${statusStyles[proj.status]}`}>
                    {proj.status === 'IN_PROGRESS' ? 'Working' : proj.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  {proj.description}
                </p>

                {/* Info Panel & Milestone Progress */}
                <div className="grid sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Contract Value</span>
                    <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{formatPrice(proj.budgetMax)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Timeline</span>
                    <span className="text-xs font-semibold text-slate-800 mt-1 block flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-650" />
                      {proj.timelineDays} days limit
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Deliverables</span>
                    <span className="text-xs font-semibold text-slate-800 mt-1 block flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-650" />
                      Milestone payments enabled
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
