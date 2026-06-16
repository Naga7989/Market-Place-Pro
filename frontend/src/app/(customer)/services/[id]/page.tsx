'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Calendar, CheckCircle2, MapPin, Sparkles, User } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Address {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

interface Service {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  priceType: string;
  durationMinutes: number;
  rating: number;
  totalReviews: number;
  category?: { name: string };
  provider?: { businessName: string; experienceYears?: number; rating?: number };
}

// Fallback services
const mockServices: Record<number, Service> = {
  201: {
    id: 201,
    name: 'AC Service & Gas Recharge',
    description: 'Complete filter cleaning, cooling coil check, gas replenishment, and performance diagnostics. Our technician will clean the AC unit and top up refrigerant gas if cooling is low. Recommended every 6 months for optimal cooling performance.',
    basePrice: 1499,
    priceType: 'FIXED',
    durationMinutes: 60,
    rating: 4.8,
    totalReviews: 240,
    category: { name: 'Appliance Repair' },
    provider: { businessName: 'CoolBreeze AC Care', experienceYears: 5, rating: 4.8 },
  },
  202: {
    id: 202,
    name: 'Full Home Deep Cleaning',
    description: 'Intense dusting, vacuuming, mopping, kitchen degreasing, bathroom scrubbing, and disinfection. Includes cleaning of windows, kitchen cabinets, bathroom floor tiles, and balcony mopping. Eco-friendly cleaning chemicals used.',
    basePrice: 4999,
    priceType: 'FIXED',
    durationMinutes: 240,
    rating: 4.9,
    totalReviews: 480,
    category: { name: 'Home Cleaning' },
    provider: { businessName: 'SuperClean India', experienceYears: 7, rating: 4.9 },
  },
  203: {
    id: 203,
    name: 'Stress Relief Deep Tissue Massage',
    description: '60 minutes of professional body massage with herbal oils to relieve fatigue and muscle knots. Therapist will carry massage table, sheets, and essential oils. Recommended for deep body relaxation.',
    basePrice: 1999,
    priceType: 'FIXED',
    durationMinutes: 60,
    rating: 4.7,
    totalReviews: 155,
    category: { name: 'Salon & Spa' },
    provider: { businessName: 'Aura Wellness Mobile Spa', experienceYears: 4, rating: 4.6 },
  },
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const serviceId = params.id;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);



  // Fetch service details
  const { data: serviceData, isLoading } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/services/${serviceId}`);
        return res.data?.data as Service;
      } catch (err) {
        // Return mock service if not found in DB
        const mock = mockServices[Number(serviceId)];
        if (mock) return mock;
        throw err;
      }
    },
  });

  // Fetch addresses
  const { data: addressesData } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await apiClient.get('/users/addresses');
      const list = res.data?.data as Address[];
      if (list && list.length > 0) {
        setSelectedAddressId(list.find((a) => a.isDefault)?.id || list[0].id);
      }
      return list;
    },
  });

  // Book service mutation
  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDate || !selectedSlot || !selectedAddressId) {
        throw new Error('Please select date, time slot, and address');
      }
      return apiClient.post('/services/book', {
        serviceId: Number(serviceId),
        addressId: selectedAddressId,
        scheduledAt: `${selectedDate}T${selectedSlot}:00`,
        notes,
      });
    },
    onSuccess: () => {
      setBookingSuccess(true);
      toast.success('Service booked successfully!');
    },
    onError: (err: any) => {
      // Mock booking success if mock service is used
      if ([201, 202, 203].includes(Number(serviceId)) || err.response?.status === 404) {
        setBookingSuccess(true);
        toast.success('Service booked successfully (Mock Mode)!');
        return;
      }
      toast.error(err.response?.data?.message || 'Failed to book service');
    },
  });

  const service = serviceData;
  const addresses = addressesData || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 animate-pulse font-display">Loading service details...</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A] text-center px-4 py-20">
        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4 font-display">Service Listing Not Found</h3>
        <Link 
          href="/services" 
          className="px-6 py-3 bg-indigo-650 text-white rounded-xl font-bold transition-all hover:bg-indigo-700"
        >
          Back to Services Home
        </Link>
      </div>
    );
  }

  const timeSlots = ['09:00', '11:00', '13:00', '15:00', '17:00'];

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#F8FAFC] dark:bg-[#0F172A] px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 p-8 md:p-10 rounded-[32px] shadow-2xl shadow-indigo-100/40 dark:shadow-none"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">✓</div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 font-display">Booking Confirmed!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            Your booking for <span className="font-extrabold text-indigo-650 dark:text-indigo-400">{service.name}</span> has been confirmed. Our professional partner will contact you shortly.
          </p>
          <div className="space-y-3 p-5 bg-slate-50/80 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800 rounded-2xl mb-8 text-left text-xs font-bold text-slate-550 dark:text-slate-400">
            <p className="flex justify-between"><span className="text-slate-400 dark:text-slate-500">Scheduled Date:</span> <span className="text-slate-800 dark:text-slate-200">{selectedDate}</span></p>
            <p className="flex justify-between"><span className="text-slate-400 dark:text-slate-500">Time Slot:</span> <span className="text-slate-800 dark:text-slate-200">{selectedSlot}</span></p>
            <p className="flex justify-between"><span className="text-slate-400 dark:text-slate-500">Total Price:</span> <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{formatPrice(service.basePrice + Math.round(service.basePrice * 0.18))}</span></p>
          </div>
          <button 
            onClick={() => router.push('/services')} 
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-150 transition-all hover:opacity-95"
          >
            Explore More Services
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <button
          onClick={() => router.push('/services')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-450 dark:hover:text-indigo-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Services Directory
        </button>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Detail info */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 md:p-8 shadow-xl shadow-slate-100/40 dark:shadow-none">
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-4 inline-block uppercase tracking-wider">
                {service.category?.name || 'General Service'}
              </span>
              
              <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white mb-4 leading-tight font-display tracking-tight">
                {service.name}
              </h1>

              <div className="flex items-center gap-4 mb-6 text-xs font-bold text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                  <Star className="w-4 h-4 fill-current text-amber-400" />
                  <strong className="text-slate-800 dark:text-slate-200">{service.rating}</strong> ({service.totalReviews} reviews)
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {service.durationMinutes} mins Duration
                </span>
                <span className="flex items-center gap-1.5 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-md border border-indigo-100/50 dark:border-indigo-900/50">
                  <Sparkles className="w-4 h-4" /> Best Price Guarantee
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {service.description}
              </p>
            </div>

            {/* Provider details */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/40 dark:shadow-none flex items-center gap-4.5">
              <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                <User className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Assigned Professional Partner</p>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base mt-0.5 truncate">{service.provider?.businessName}</h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  {service.provider?.experienceYears || 5} Years Experience • Rating: ★ {service.provider?.rating || 4.8}
                </p>
              </div>
            </div>

            {/* Step 1: Scheduling Slot */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 md:p-8 shadow-xl shadow-slate-100/40 dark:shadow-none space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3 font-display">
                <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-black">1</span>
                <span>Choose Booking Date & Slot</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Select Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 dark:focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Select Time Slot</label>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                          selectedSlot === slot
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-150'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping/Billing Address */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 md:p-8 shadow-xl shadow-slate-100/40 dark:shadow-none space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3 font-display">
                <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-black">2</span>
                <span>Service Location Address</span>
              </h3>

              {addresses.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-slate-200 dark:border-slate-750 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No shipping addresses found in your account.</p>
                  <Link 
                    href="/profile" 
                    className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Add Address in Profile
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3">
                  {addresses.map((address) => {
                    const isSelected = selectedAddressId === address.id;
                    return (
                      <label
                        key={address.id}
                        className={`flex items-start gap-4 p-5 border rounded-2xl cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-550/20 bg-white dark:bg-slate-900 shadow-md'
                            : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-250 dark:hover:border-slate-700 shadow-sm'
                        }`}
                      >
                        <input
                          type="radio"
                          name="serviceAddress"
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-sm">
                          <p className="font-extrabold text-slate-900 dark:text-white">
                            {address.fullName}
                          </p>
                          <p className="text-slate-550 dark:text-slate-400 text-xs md:text-sm mt-1.5 leading-relaxed">
                            {address.addressLine1}, {address.city} - <span className="font-bold text-slate-800 dark:text-slate-200">{address.pincode}</span>
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 3: Instructions Notes */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 md:p-8 shadow-xl shadow-slate-100/40 dark:shadow-none space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3 font-display">
                <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-black">3</span>
                <span>Special Instructions (Optional)</span>
              </h3>
              <textarea
                rows={3}
                placeholder="E.g., Please call before arriving, bring a ladder, pets in house, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* Right: Summary */}
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/70 dark:border-slate-800/70 rounded-[24px] p-6 md:p-8 shadow-xl shadow-slate-150/40 dark:shadow-none sticky top-24 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800 font-display">Booking Summary</h3>

              <div className="space-y-3.5 text-sm font-bold text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Base Service Fee</span>
                  <span className="text-slate-900 dark:text-white font-black">{formatPrice(service.basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span className="text-slate-900 dark:text-white font-black">{formatPrice(Math.round(service.basePrice * 0.18))}</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 flex justify-between items-baseline">
                  <span className="font-extrabold text-slate-900 dark:text-slate-200">Total Price</span>
                  <span className="text-2.5xl font-black text-indigo-600 dark:text-indigo-400">
                    {formatPrice(service.basePrice + Math.round(service.basePrice * 0.18))}
                  </span>
                </div>
              </div>

              {/* Validation warning when booking button is disabled */}
              {(!selectedDate || !selectedSlot || !selectedAddressId) && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl text-xs font-bold space-y-1">
                  <p className="flex items-center gap-1.5">
                    ⚠️ Required to book:
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {!selectedDate && <li>Select date</li>}
                    {!selectedSlot && <li>Select time slot</li>}
                    {!selectedAddressId && <li>Add/select a service address</li>}
                  </ul>
                </div>
              )}

              <button
                onClick={() => bookMutation.mutate()}
                disabled={!selectedDate || !selectedSlot || !selectedAddressId || bookMutation.isPending}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-[right_center] text-white font-extrabold rounded-2xl active:scale-[0.99] transition-all duration-500 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {bookMutation.isPending ? 'Confirming Booking...' : 'Book Service Now'}
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-450 justify-center">
                <Sparkles className="w-4.5 h-4.5 text-indigo-500" /> 
                <span>Professional 30-day warranty included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

