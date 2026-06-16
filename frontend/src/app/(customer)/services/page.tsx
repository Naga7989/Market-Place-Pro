'use client';

import { Suspense, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Star, Clock, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
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
  provider?: { businessName: string };
}

// Mock services for fallback if DB is empty
const mockCategories: ServiceCategory[] = [
  { id: 101, name: 'Home Cleaning', slug: 'home-cleaning', icon: '🧹', description: 'Deep cleaning, kitchen, bathroom sanitization' },
  { id: 102, name: 'Appliance Repair', slug: 'appliance-repair', icon: '🔌', description: 'AC, washing machine, geyser service & repair' },
  { id: 103, name: 'Salon & Spa', slug: 'salon-spa', icon: '💆', description: 'Haircut, massage, facials at home' },
  { id: 104, name: 'Plumbing & Electrical', slug: 'plumbing-electrical', icon: '🔧', description: 'Leaking pipe fixes, switch installations, wiring' },
];

const mockServices: Service[] = [
  {
    id: 201,
    name: 'AC Service & Gas Recharge',
    description: 'Complete filter cleaning, cooling coil check, gas replenishment, and performance diagnostics.',
    basePrice: 1499,
    priceType: 'FIXED',
    durationMinutes: 60,
    rating: 4.8,
    totalReviews: 240,
    category: { name: 'Appliance Repair' },
    provider: { businessName: 'CoolBreeze AC Care' },
  },
  {
    id: 202,
    name: 'Full Home Deep Cleaning',
    description: 'Intense dusting, vacuuming, mopping, kitchen degreasing, bathroom scrubbing, and disinfection.',
    basePrice: 4999,
    priceType: 'FIXED',
    durationMinutes: 240,
    rating: 4.9,
    totalReviews: 480,
    category: { name: 'Home Cleaning' },
    provider: { businessName: 'SuperClean India' },
  },
  {
    id: 203,
    name: 'Stress Relief Deep Tissue Massage',
    description: '60 minutes of professional body massage with herbal oils to relieve fatigue and muscle knots.',
    basePrice: 1999,
    priceType: 'FIXED',
    durationMinutes: 60,
    rating: 4.7,
    totalReviews: 155,
    category: { name: 'Salon & Spa' },
    provider: { businessName: 'Aura Wellness Mobile Spa' },
  },
];

const getCategoryIcon = (iconName?: string) => {
  if (!iconName) return '🛠️';
  switch (iconName.toLowerCase()) {
    case 'home': return '🏠';
    case 'scissors': return '💇';
    case 'book': return '📚';
    case 'heart': return '❤️';
    case 'truck': return '🚚';
    case 'briefcase': return '💼';
    case 'map': return '🗺️';
    case 'camera': return '📷';
    default: return iconName.length <= 2 ? iconName : '🛠️';
  }
};


function ServicesContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Sync searchQuery when URL query param changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const res = await apiClient.get('/services/categories');
      return res.data?.data as ServiceCategory[];
    },
  });

  // Fetch public services
  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['public-services', selectedCategory],
    queryFn: async () => {
      const params = selectedCategory ? `?categoryId=${selectedCategory}` : '';
      const res = await apiClient.get(`/services/public${params}`);
      return res.data?.data?.content as Service[];
    },
  });

  const categories = categoriesData && categoriesData.length > 0 ? categoriesData : mockCategories;
  const dbServices = servicesData || [];
  
  // Disable mockServices fallback if database is active (categoriesData loaded from DB)
  const isDbActive = !!(categoriesData && categoriesData.length > 0);
  const services = isDbActive ? dbServices : mockServices;

  // Filter services by selected category if using mockServices (database is empty or inactive)
  const categoryFilteredServices = services === mockServices && selectedCategory !== null
    ? services.filter((svc) => {
        const catName = categories.find((c) => c.id === selectedCategory)?.name;
        return catName ? svc.category?.name === catName : true;
      })
    : services;

  // Filter services by search query
  const filteredServices = categoryFilteredServices.filter((svc) =>
    svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    svc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden shadow-lg shadow-violet-500/25">
          <div className="absolute right-0 bottom-0 top-0 opacity-15 pointer-events-none flex items-center justify-center">
            <span className="text-[250px] select-none">🛠️</span>
          </div>
          <div className="relative z-10 max-w-xl">
            <span className="bg-white/20 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
              Urban Services
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 font-display leading-tight">
              Professional Home Services, On Demand.
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-8">
              Book expert cleaners, electricians, AC technicians, spa therapists, and more. Delivered straight to your doorstep.
            </p>

            {/* Search Bar */}
            <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-2xl p-2 shadow-xl">
              <Search className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Search AC repair, home cleaning, massage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`p-5 rounded-2xl border text-left transition-all ${
                selectedCategory === cat.id
                  ? 'border-violet-600 bg-violet-50/20 dark:bg-violet-900/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-violet-350'
              }`}
            >
              <span className="text-3xl mb-3 block">{getCategoryIcon(cat.icon)}</span>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-400 line-clamp-2">{cat.description || 'Verified experts at your service'}</p>
            </button>
          ))}
        </div>

        {/* Services Listing */}
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {selectedCategory ? 'Services in Category' : 'Top Booked Services'}
          </h2>
          <span className="text-xs text-gray-400">All prices inclusive of safety charges</span>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 bg-white dark:bg-gray-800 rounded-2xl"></div>
            <div className="h-32 bg-white dark:bg-gray-800 rounded-2xl"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center shadow-sm">
            <p className="text-gray-500 mb-1">No services found matching your search</p>
            <button onClick={() => setSearchQuery('')} className="text-violet-600 hover:underline text-sm font-semibold">
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredServices.map((svc) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950/30 text-violet-600">
                      {svc.category?.name || 'Home'}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {svc.durationMinutes} mins
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-violet-600 transition-colors">
                    <Link href={`/services/${svc.id}`}>{svc.name}</Link>
                  </h3>
                  <p className="text-sm text-gray-650 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {svc.description}
                  </p>
                  
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-xs font-bold text-gray-850 dark:text-gray-250">{svc.rating}</span>
                      <span className="text-xs text-gray-400">({svc.totalReviews} reviews)</span>
                    </div>
                    <span className="text-xs text-gray-400">By {svc.provider?.businessName}</span>
                  </div>
                </div>

                {/* Right: Booking Action */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 dark:border-gray-700 flex-shrink-0 gap-4">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-400 font-medium">Starts from</p>
                    <p className="text-xl font-extrabold text-violet-600">{formatPrice(svc.basePrice)}</p>
                  </div>
                  <Link
                    href={`/services/${svc.id}`}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-750 text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                  >
                    View & Book <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quality Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center">
          {[
            { icon: <ShieldCheck className="w-8 h-8 text-violet-600 mx-auto mb-3" />, title: 'Verified Professionals', desc: 'Background checked & highly skilled service providers' },
            { icon: <Clock className="w-8 h-8 text-violet-600 mx-auto mb-3" />, title: 'On-time Guarantee', desc: 'Rescheduling and refunds if technician is delayed' },
            { icon: <Sparkles className="w-8 h-8 text-violet-600 mx-auto mb-3" />, title: 'Premium Service Quality', desc: 'Top-tier materials and 30-day post-service warranty' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm">
              {icon}
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">{title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 animate-pulse">Loading Services...</span>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}
