'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Briefcase,
  Send,
  DollarSign,
  Award,
  ChevronRight,
  Clock,
  Code
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

interface Project {
  id: number;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  projectType: 'FIXED' | 'HOURLY';
  deadline: string;
  skillsRequired: string[];
}

export default function FreelancerDashboardPage() {
  const [activePeriod, setActivePeriod] = useState<'today' | 'week' | 'month'>('month');

  // Force Light Mode on Mount
  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  // Fetch open projects
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['freelancerOpenProjects'],
    queryFn: async () => {
      const res = await apiClient.get('/projects?page=0&size=5');
      return res.data?.data?.content as Project[];
    },
  });

  const openProjects = projectsData || [];

  // Mocked statistics for rendering
  const stats = [
    { label: 'Total Earnings', value: '₹1,42,800', change: '+22.5%', up: true, icon: <DollarSign className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100' },
    { label: 'Active Projects', value: '3', change: '+1', up: true, icon: <Briefcase className="w-5 h-5 text-indigo-650" />, bg: 'bg-indigo-50 border-indigo-100' },
    { label: 'Proposals Sent', value: '14', change: '+3', up: true, icon: <Send className="w-5 h-5 text-violet-600" />, bg: 'bg-violet-50 border-violet-100' },
    { label: 'Success Rate', value: '98%', change: '+1%', up: true, icon: <Award className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50 border-amber-100' },
  ];

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 min-h-screen pb-12">
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight">Freelancer Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track active contracts, manage proposals, and load milestones.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-slate-200 bg-white p-0.5 overflow-hidden shadow-sm">
            {(['today', 'week', 'month'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-3 py-1.5 text-xs font-bold capitalize transition-all rounded-lg ${
                  activePeriod === period
                    ? 'bg-indigo-600 text-white shadow-inner'
                    : 'text-slate-550 hover:text-slate-950'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[20px] p-5 shadow-xl shadow-slate-100/50 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.bg}`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 font-display tracking-tight">{stat.value}</p>
                <p className="text-[10px] text-slate-450 font-extrabold mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gig Listings / Open Projects Feed */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-slate-900 font-display text-base">Recommended Projects</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Bidding matches aligned with your registered skills.</p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-750 flex items-center gap-1 transition-colors uppercase tracking-wider"
            >
              <span>Explore Board</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-8 space-y-4">
              <div className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
              <div className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
            </div>
          ) : openProjects.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-extrabold text-slate-800">No recommended projects found</p>
              <p className="text-xs text-slate-400 mt-1">Check back later for client listings.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {openProjects.map((project) => (
                <div
                  key={project.id}
                  className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/40 transition-all"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h3 className="font-extrabold text-slate-900 text-sm md:text-base truncate">{project.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed max-w-3xl">
                      {project.description}
                    </p>
                    {project.skillsRequired && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.skillsRequired.map((skill) => (
                          <span
                            key={skill}
                            className="text-[9px] font-extrabold px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/60 text-slate-500 uppercase tracking-wide"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 block">
                        {formatPrice(project.budgetMin)} - {formatPrice(project.budgetMax)}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-bold uppercase tracking-wider">
                        {project.projectType === 'FIXED' ? 'Fixed Price' : 'Hourly rate'}
                      </span>
                    </div>

                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-1.5 py-2.5 px-4 bg-indigo-50 hover:bg-indigo-600 text-indigo-650 hover:text-white text-xs font-bold rounded-xl transition-all active:scale-95 border border-indigo-100 hover:border-transparent shadow-sm shadow-indigo-100/30"
                    >
                      <span>Bid Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'View Proposals', href: '/freelancer/proposals', color: 'border-indigo-100 hover:border-indigo-305 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-650 shadow-indigo-50/20' },
            { label: 'Track Earnings', href: '/freelancer/earnings', color: 'border-emerald-100 hover:border-emerald-305 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-600 shadow-emerald-50/20' },
            { label: 'Profile Settings', href: '/freelancer/settings', color: 'border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-slate-50 text-slate-650 shadow-slate-50/20' },
            { label: 'Freelancer Rules', href: '/help', color: 'border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-slate-50 text-slate-650 shadow-slate-50/20' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center justify-center p-4 border rounded-[20px] text-center text-xs font-bold transition-all shadow-sm active:scale-[0.97] ${action.color}`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
