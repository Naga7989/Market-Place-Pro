'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Play,
  CheckCircle2,
  XCircle,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Booking {
  id: number;
  user: { fullName: string; email: string; phone: string };
  service: { name: string; basePrice: number; durationMinutes: number };
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  scheduledAt: string;
  totalAmount: number;
  notes?: string;
  address?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export default function ProviderBookingsPage() {
  const queryClient = useQueryClient();

  // Fetch bookings
  const { data: bookingsData, isLoading, refetch } = useQuery({
    queryKey: ['providerBookingsAll'],
    queryFn: async () => {
      const res = await apiClient.get('/services/provider/bookings?page=0&size=50');
      return res.data?.data?.content as Booking[];
    },
  });

  const bookings = bookingsData || [];

  // Status transition mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiClient.put(`/services/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success('Booking status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['providerBookingsAll'] });
      queryClient.invalidateQueries({ queryKey: ['providerBookings'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update booking status');
    },
  });

  const handleStatusChange = (id: number, nextStatus: string) => {
    updateStatusMutation.mutate({ id, status: nextStatus });
  };

  const statusStyles: Record<string, string> = {
    PENDING: 'bg-amber-55 text-amber-700 border-amber-200/60',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200/60',
    IN_PROGRESS: 'bg-violet-50 text-violet-700 border-violet-200/60',
    COMPLETED: 'bg-emerald-55 text-emerald-705 border-emerald-200/60',
    CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200/60',
    NO_SHOW: 'bg-slate-100 text-slate-700 border-slate-200/60',
  };

  return (
    <div className="flex-1 bg-slate-50 text-slate-900">
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Manage Bookings</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track, assign, and update statuses of your customer bookings.</p>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-white/80 border border-white/60 rounded-[24px] animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white/80 border border-white/60 rounded-[24px] p-12 text-center shadow-xl backdrop-blur-md">
            <Calendar className="w-14 h-14 text-slate-350 mx-auto mb-4" />
            <h3 className="font-extrabold text-slate-900 text-lg mb-1">No Bookings Found</h3>
            <p className="text-xs text-slate-500">Bookings registered to your business profile will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                layout
                className="bg-white/80 border border-white/60 rounded-[24px] p-5 md:p-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-slate-300 transition-all duration-300"
              >
                <div className="space-y-4 flex-1">
                  {/* Title & Status */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-extrabold text-slate-900 text-base md:text-lg">{booking.service?.name}</h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wide ${statusStyles[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Customer Information & Timing */}
                  <div className="grid sm:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Customer Info</span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                          <User className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{booking.user?.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{booking.user?.phone || 'No phone'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{booking.user?.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Schedule</span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{formatDate(booking.scheduledAt, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{formatDate(booking.scheduledAt, { hour: '2-digit', minute: '2-digit' })} ({booking.service?.durationMinutes} mins)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Address */}
                  {booking.address && (
                    <div className="border-t border-slate-100 pt-3 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Location</span>
                      <div className="flex items-start gap-2 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">
                          {booking.address.addressLine1}
                          {booking.address.addressLine2 && `, ${booking.address.addressLine2}`}
                          , {booking.address.city}, {booking.address.state} - {booking.address.pincode}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Customer Notes */}
                  {booking.notes && (
                    <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 flex gap-2">
                      <AlertCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div className="text-[11px] text-slate-500 leading-relaxed">
                        <span className="font-bold text-slate-900 block mb-0.5">Notes:</span>
                        {booking.notes}
                      </div>
                    </div>
                  )}
                </div>

                {/* Amount & Actions Panel */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[170px]">
                  <div className="md:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Paid</span>
                    <span className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5 block">{formatPrice(booking.totalAmount)}</span>
                  </div>

                  {/* Operations Toggles */}
                  <div className="w-full space-y-2 max-w-[150px] md:max-w-none">
                    {booking.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                          disabled={updateStatusMutation.isPending}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Accept Booking
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                          disabled={updateStatusMutation.isPending}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-rose-250 hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject Job
                        </button>
                      </>
                    )}

                    {booking.status === 'CONFIRMED' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'IN_PROGRESS')}
                          disabled={updateStatusMutation.isPending}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-violet-600 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:bg-violet-500 active:scale-95 disabled:opacity-50"
                        >
                          <Play className="w-3.5 h-3.5" /> Start Service
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                          disabled={updateStatusMutation.isPending}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-250 text-slate-500 hover:text-rose-600 text-xs font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
                        >
                          Cancel Booking
                        </button>
                      </>
                    )}

                    {booking.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'COMPLETED')}
                        disabled={updateStatusMutation.isPending}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete Job
                      </button>
                    )}

                    {booking.status === 'COMPLETED' && (
                      <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-xs font-bold py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Job Complete
                      </div>
                    )}

                    {booking.status === 'CANCELLED' && (
                      <div className="flex items-center justify-center gap-1.5 text-rose-600 text-xs font-bold py-2 bg-rose-50 border border-rose-200 rounded-xl">
                        <XCircle className="w-3.5 h-3.5" /> Job Cancelled
                      </div>
                    )}
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
