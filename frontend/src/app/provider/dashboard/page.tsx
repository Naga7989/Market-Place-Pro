'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  ChevronRight,
  User,
  Activity
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';

interface Booking {
  id: number;
  user: { fullName: string; email: string; phone: string };
  service: { name: string; basePrice: number; durationMinutes: number };
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  scheduledAt: string;
  totalAmount: number;
  notes?: string;
}

export default function ProviderDashboardPage() {
  const [activePeriod, setActivePeriod] = useState<'today' | 'week' | 'month'>('month');

  // Force Light Mode on Mount
  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  // Fetch provider bookings
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['providerBookings', { page: 0, size: 5 }],
    queryFn: async () => {
      const res = await apiClient.get('/services/provider/bookings?page=0&size=5');
      return res.data?.data?.content as Booking[];
    },
  });

  const recentBookings = bookingsData || [];

  // Derived stats (mock summaries for visualization)
  const stats = [
    { label: 'Total Earnings', value: '₹48,250', change: '+18.4%', up: true, icon: <DollarSign className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100' },
    { label: 'Total Jobs', value: '38', change: '+4.2%', up: true, icon: <Activity className="w-5 h-5 text-indigo-650" />, bg: 'bg-indigo-50 border-indigo-100' },
    { label: 'Pending Bookings', value: '5', change: '-2', up: false, icon: <Clock className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50 border-amber-100' },
    { label: 'Avg Rating', value: '4.9★', change: '+0.1', up: true, icon: <Star className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-50 border-orange-100' },
  ];

  const statusStyles: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-705 border-amber-100',
    CONFIRMED: 'bg-blue-50 text-blue-600 border-blue-105',
    IN_PROGRESS: 'bg-violet-50 text-violet-600 border-violet-105',
    COMPLETED: 'bg-emerald-50 text-emerald-600 border-emerald-105',
    CANCELLED: 'bg-red-50 text-red-650 border-red-105',
    NO_SHOW: 'bg-slate-50 text-slate-500 border-slate-200',
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] text-slate-900 min-h-screen pb-12">
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight">Provider Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your service requests, bookings, and customer schedules.</p>
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
          <Link
            href="/provider/bookings"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-indigo-150 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" /> 
            <span>View Schedule</span>
          </Link>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-5xl mx-auto">
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
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  stat.up 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 font-display tracking-tight">{stat.value}</p>
                <p className="text-[10px] text-slate-455 font-extrabold mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bookings Section */}
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-slate-900 font-display text-base">Upcoming Appointments</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Your next few customer service bookings.</p>
            </div>
            <Link
              href="/provider/bookings"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-755 flex items-center gap-1 transition-colors uppercase tracking-wider"
            >
              <span>Manage Bookings</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-8 space-y-4">
              <div className="h-14 bg-slate-50 rounded-2xl animate-pulse" />
              <div className="h-14 bg-slate-50 rounded-2xl animate-pulse" />
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-350 mx-auto mb-3" />
              <p className="text-sm font-extrabold text-slate-800">No upcoming bookings</p>
              <p className="text-xs text-slate-450 mt-1">You are currently fully caught up with jobs!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm md:text-base font-extrabold text-slate-900">{booking.service?.name}</span>
                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${statusStyles[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-450">
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-indigo-600" />
                        <span className="text-slate-650">{booking.user?.fullName}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span className="text-slate-650">{formatDate(booking.scheduledAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 block">{formatPrice(booking.totalAmount)}</span>
                      <span className="text-[10px] text-slate-450 mt-0.5 block font-bold">{booking.service?.durationMinutes} mins Duration</span>
                    </div>
                    <Link
                      href="/provider/bookings"
                      className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-indigo-600 hover:text-white rounded-xl text-slate-500 transition-all active:scale-95 shadow-sm"
                    >
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
            { label: 'Manage Calendar', href: '/provider/schedule', color: 'border-indigo-100 hover:border-indigo-305 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-650 shadow-indigo-50/20' },
            { label: 'View Reviews', href: '/provider/reviews', color: 'border-orange-105 hover:border-orange-305 bg-orange-50/50 hover:bg-orange-50 text-orange-600 shadow-orange-50/20' },
            { label: 'General Settings', href: '/provider/settings', color: 'border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-slate-50 text-slate-650 shadow-slate-50/20' },
            { label: 'Platform Guide', href: '/help', color: 'border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-slate-50 text-slate-650 shadow-slate-50/20' },
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
