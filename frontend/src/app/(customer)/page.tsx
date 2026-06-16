'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import {
  Search, ShoppingBag, Wrench, Users, Star, ArrowRight, Zap, Shield, Truck,
  Laptop, Shirt, Home, Sparkles, BookOpen, Activity, Gamepad2, ShoppingCart,
  Scissors, Snowflake, Paintbrush, Code, Palette, PenTool, TrendingUp, Heart,
  Mic, ChevronDown, Check, UserCheck, Play, ArrowUpRight, Award
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

// ─────────────────── Data Models with Lucide Icons ───────────────────
const categories = [
  { id: 1, name: 'Electronics', icon: Laptop, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80', count: '12K+ products', slug: 'electronics' },
  { id: 2, name: 'Fashion', icon: Shirt, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80', count: '45K+ products', slug: 'fashion' },
  { id: 3, name: 'Home & Living', icon: Home, image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80', count: '8K+ products', slug: 'home-kitchen' },
  { id: 4, name: 'Beauty', icon: Sparkles, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', count: '6K+ products', slug: 'beauty' },
  { id: 5, name: 'Sports', icon: Activity, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80', count: '5K+ products', slug: 'sports' },
  { id: 6, name: 'Books', icon: BookOpen, image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80', count: '20K+ books', slug: 'books' },
  { id: 7, name: 'Toys & Gaming', icon: Gamepad2, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80', count: '3K+ items', slug: 'toys' },
  { id: 8, name: 'Grocery', icon: ShoppingCart, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', count: 'Daily fresh', slug: 'grocery' },
];

const featuredProducts = [
  { id: 1, name: 'iPhone 15 Pro Max', price: 134900, originalPrice: 159900, rating: 4.8, reviews: 2341, discount: 16, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Samsung 4K Smart TV 55"', price: 49990, originalPrice: 79990, rating: 4.6, reviews: 1205, discount: 38, image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Nike Air Max 2024', price: 8995, originalPrice: 12995, rating: 4.7, reviews: 897, discount: 31, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Dyson V15 Detect', price: 52900, originalPrice: 65900, rating: 4.9, reviews: 543, discount: 20, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80' },
  { id: 5, name: 'MacBook Air M3', price: 114900, originalPrice: 124900, rating: 4.9, reviews: 3211, discount: 8, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' },
  { id: 6, name: 'Sony WH-1000XM5', price: 24990, originalPrice: 34990, rating: 4.8, reviews: 1876, discount: 29, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
];

const services = [
  { id: 1, name: 'Home Cleaning', icon: Sparkles, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', rating: 4.8, startingAt: 299, desc: 'Deep cleaning, dusting & sanitization' },
  { id: 2, name: 'Electrician', icon: Zap, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', rating: 4.7, startingAt: 199, desc: 'Wiring, repairs & installations' },
  { id: 3, name: 'Plumbing Services', icon: Wrench, image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80', rating: 4.6, startingAt: 149, desc: 'Leakages, fittings & drainage repairs' },
  { id: 4, name: 'Salon at Home', icon: Scissors, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80', rating: 4.9, startingAt: 399, desc: 'Facials, hair care & massage therapies' },
  { id: 5, name: 'AC Repair & Service', icon: Snowflake, image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80', rating: 4.5, startingAt: 499, desc: 'Gas filling, servicing & installations' },
  { id: 6, name: 'Wall Painting', icon: Paintbrush, image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80', rating: 4.7, startingAt: 2999, desc: 'Expert texture & wall painting services' },
];

const freelancers = [
  { id: 1, name: 'Arjan Mehta', role: 'UI/UX Designer', rating: 4.9, rate: 1200, projects: 320, skills: ['Figma', 'Prototyping', 'Design Systems'], image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
  { id: 2, name: 'Neha Sharma', role: 'Full Stack Developer', rating: 4.8, rate: 1500, projects: 280, skills: ['React', 'Node.js', 'Next.js'], image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  { id: 3, name: 'Rohit Verma', role: 'SEO Expert', rating: 4.7, rate: 800, projects: 210, skills: ['SEO Audits', 'Link Building', 'Google Ads'], image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80' },
  { id: 4, name: 'Priya Singh', role: 'Content Writer', rating: 4.8, rate: 900, projects: 190, skills: ['Copywriting', 'SEO Articles', 'Technical Writing'], image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80' },
  { id: 5, name: 'Karan Malhotra', role: 'AI Engineer', rating: 4.9, rate: 2000, projects: 150, skills: ['LLMs', 'PyTorch', 'Computer Vision'], image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' },
  { id: 6, name: 'Sneha Iyer', role: 'Digital Marketer', rating: 4.7, rate: 1000, projects: 170, skills: ['Social Media', 'Growth Hacking', 'Email Marketing'], image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80' },
];

const testimonials = [
  { name: 'Rahul Kumar', role: 'E-commerce Seller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', text: 'MarketPlacePro is my go-to platform for everything. Amazing products, fast delivery, and great support!', rating: 5 },
  { name: 'Ananya Sharma', role: 'Home Service Customer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', text: 'I found top quality freelancers for my projects. Very professional platform.', rating: 5 },
  { name: 'Vikram Singh', role: 'Tech Startup Founder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', text: 'Booking home services is so easy now. Great professionals and super affordable.', rating: 5 },
];

const trustFeatures = [
  { icon: Shield, title: 'Secure Payments', desc: '100% secure payments via Razorpay, UPI & Credit Cards' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Same day & next day shipping on electronics and grocery' },
  { icon: UserCheck, title: 'Verified Vendors', desc: 'Every merchant and expert provider is strictly KYC-vetted' },
  { icon: Zap, title: '24/7 AI Support', desc: 'Smart conversational AI assistant for instant inquiries and help' },
];

const popularSearches = ['iPhone 15', 'Washing Machine', 'Laptop', 'Running Shoes', 'Deep Cleaning', 'Web Developer'];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load wishlist
  useEffect(() => {
    // Retrieve local wishlist
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(stored.map((item: any) => item.id));
      } catch (err) {}
    }

    // Close category dropdown on click outside
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    if (activeCategory === 'Services') {
      router.push(`/services?q=${encodeURIComponent(query)}`);
    } else if (activeCategory === 'Freelancers') {
      router.push(`/freelancers?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  const toggleWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const index = stored.findIndex((item: any) => item.id === product.id);
      let updatedWishlist = [...wishlist];

      if (index > -1) {
        stored.splice(index, 1);
        updatedWishlist = updatedWishlist.filter(id => id !== product.id);
        toast.success(`${product.name} removed from Wishlist`);
      } else {
        stored.push({ id: product.id, name: product.name, price: product.price, image: product.image });
        updatedWishlist.push(product.id);
        toast.success(`${product.name} added to Wishlist`);
      }
      localStorage.setItem('wishlist', JSON.stringify(stored));
      setWishlist(updatedWishlist);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {}
  };

  const addToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      toast.success(`${product.name} added to Cart successfully!`);
    } catch (err) {}
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#050816] text-[#0F172A] dark:text-[#F8FAFC] min-h-screen relative font-sans overflow-x-hidden selection:bg-indigo-500/10 selection:text-indigo-600">
      
      {/* ─── Hero Section ─── */}
      <section className="relative pt-10 pb-20 lg:pt-16 lg:pb-32 overflow-visible bg-gradient-to-b from-[#EEF2F6]/50 via-white to-[#F8FAFC] dark:from-[#050816]/50 dark:via-[#0B1220]/80 dark:to-[#050816]">
        {/* Glow meshes & floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Light Mode Glows */}
          <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-300/20 to-purple-300/30 rounded-full blur-[120px] dark:hidden" />
          <div className="absolute top-48 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyan-200/20 to-indigo-200/20 rounded-full blur-[100px] dark:hidden" />
          
          {/* Dark Mode Luxury Glows & Floating Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-[140px] animate-float-1 hidden dark:block" />
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-[120px] animate-float-2 hidden dark:block" />
          <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/5 to-cyan-500/10 rounded-full blur-[100px] animate-float-1 hidden dark:block" />
        </div>

        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-7 text-left flex flex-col justify-center">
            {/* SaaS Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 border border-indigo-100/80 dark:border-indigo-900/50 w-fit mb-6 shadow-sm shadow-indigo-100/20"
            >
              <Award className="w-3.5 h-3.5" />
              <span>INDIA'S PREMIUM MULTI-VENDOR MARKETPLACE</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.12] text-slate-900 dark:text-white"
            >
              India's Smart Marketplace <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent inline-block pb-1">
                Shop, Hire & Book
              </span> <br />
              From One Platform
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl mt-5 font-normal leading-relaxed"
            >
              Millions of products, trusted services and expert freelancers all in one secure platform.
            </motion.p>

            {/* Search Bar Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mt-8 max-w-2xl"
              ref={dropdownRef}
            >
              <form
                onSubmit={handleSearch}
                className="bg-white/95 dark:bg-card/95 backdrop-blur-md border border-slate-200/80 dark:border-border/80 rounded-2xl md:rounded-[24px] p-2 shadow-xl hover:shadow-2xl focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300 flex flex-col md:flex-row items-center gap-1"
              >
                {/* Category Dropdown */}
                <div className="relative w-full md:w-auto flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full md:w-auto px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-650 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-accent/40 rounded-xl flex items-center justify-between gap-1.5 transition-colors"
                  >
                    <span>{activeCategory}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
 
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 mt-2 w-48 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl shadow-lg py-1.5 z-30"
                      >
                        {['All', 'Products', 'Services', 'Freelancers'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setActiveCategory(cat);
                              setDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-accent/40 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                          >
                            {cat}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
 
                {/* Divider */}
                <div className="hidden md:block w-[1px] h-6 bg-slate-200 dark:bg-border mx-2" />
 
                {/* Input with Voice Search */}
                <div className="flex-1 flex items-center w-full px-3">
                  <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, services, freelancers..."
                    className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm md:text-base outline-none py-2"
                  />
                  <button
                    type="button"
                    onClick={() => toast.success("Listening for search queries...")}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-accent rounded-lg text-slate-400 hover:text-indigo-500 transition-all flex-shrink-0"
                  >
                    <Mic className="w-4.5 h-4.5" />
                  </button>
                </div>
 
                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-650 to-cyan-600 hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 hover:scale-[1.02] active:scale-[0.98] text-white font-bold rounded-xl md:rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all text-sm flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-300"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </form>
 
              {/* Popular Searches */}
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Popular:</span>
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/products?q=${encodeURIComponent(term)}`}
                    className="text-xs px-3 py-1 bg-white dark:bg-card hover:bg-indigo-50 dark:hover:bg-accent/40 border border-slate-200/60 dark:border-border text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-all shadow-sm"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Statistics Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl border-t border-slate-200/50 dark:border-border/50 pt-8 w-full"
            >
              {[
                { label: 'User Rating', value: '4.9/5' },
                { label: 'Vendors', value: '50K+' },
                { label: 'Products', value: '1M+' },
                { label: 'Freelancers', value: '25K+' },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-50 dark:bg-card/40 border border-slate-200/60 dark:border-border/50 rounded-2xl p-4 text-center">
                  <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column (Floating Cards Container) */}
          <div className="lg:col-span-5 relative h-[420px] md:h-[480px] lg:h-[500px] flex items-center justify-center">
            
            {/* Background glowing rings */}
            <div className="absolute w-[340px] h-[340px] border border-indigo-100 rounded-full animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-[220px] h-[220px] border border-purple-50 rounded-full animate-[spin_20s_linear_infinite]" />

            {/* Card 1: iPhone Product Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute top-[20px] right-[20px] md:right-[40px] w-[190px] bg-white/80 dark:bg-card/90 backdrop-blur-xl border border-white/60 dark:border-border/80 rounded-2xl p-3 shadow-xl flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-accent overflow-hidden flex-shrink-0 relative">
                <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=150&q=80" alt="iPhone 15" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">iPhone 15 Pro</h4>
                <p className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold mt-0.5">₹1,34,900</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold">4.8</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Home Cleaning Card */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute top-[130px] left-[10px] md:left-[30px] w-[210px] bg-white/90 dark:bg-card/90 backdrop-blur-xl border border-white/60 dark:border-border/80 rounded-2xl p-3 shadow-xl flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-5.5 h-5.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Home Cleaning</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Starts ₹299</p>
                <span className="inline-block px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded text-[8px] font-bold mt-1">Verified</span>
              </div>
            </motion.div>

            {/* Card 3: UI/UX Freelancer Card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-[230px] right-0 md:right-[20px] w-[200px] bg-white/80 dark:bg-card/90 backdrop-blur-xl border border-white/60 dark:border-border/80 rounded-2xl p-3.5 shadow-xl flex flex-col gap-2.5 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center gap-2">
                <div className="w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-accent overflow-hidden relative border border-indigo-200 dark:border-border/50">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Ananya" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Ananya S.</h4>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">UI/UX Designer</p>
                </div>
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-border/80 pt-2 text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">₹990/hr</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">Hire Now →</span>
              </div>
            </motion.div>

            {/* Card 4: Order Status Tracker Widget */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="absolute bottom-[60px] left-[10px] md:left-[40px] w-[190px] bg-white/90 dark:bg-card/90 backdrop-blur-xl border border-white/60 dark:border-border/80 rounded-2xl p-3 shadow-xl flex flex-col gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="flex justify-between items-center text-[8px] font-bold">
                <span className="text-slate-400 dark:text-slate-500">ORDER #12345</span>
                <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded">IN PROGRESS</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Truck className="w-4 h-4 text-indigo-500 dark:text-indigo-455" />
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[70%]" />
                </div>
              </div>
              <span className="text-[8px] text-slate-500 dark:text-slate-400 font-medium">ETA: 12 mins • Nearby</span>
            </motion.div>

            {/* Card 5: Revenue Analytics Widget */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
              className="absolute bottom-[20px] right-[120px] lg:right-[150px] w-[210px] bg-white/80 dark:bg-card/90 backdrop-blur-xl border border-white/60 dark:border-border/80 rounded-2xl p-3.5 shadow-xl flex flex-col gap-1 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="flex justify-between items-center text-[9px] font-bold">
                <span className="text-slate-400 dark:text-slate-500 uppercase">Total Earnings</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded">+18.5%</span>
              </div>
              <div className="text-base font-black text-slate-800 dark:text-slate-200">₹24,50,000</div>
              
              {/* Sparkline chart SVG */}
              <svg className="w-full h-7 mt-2 text-indigo-500" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 25C15 25 10 5 25 10C40 15 35 2 50 12C65 22 60 5 75 8C90 11 85 2 100 5"
                  stroke="url(#sparkline-gradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── Trust Features Section ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-12 bg-white/40 dark:bg-muted/40 border-y border-slate-200/50 dark:border-border/80 backdrop-blur-md relative z-20"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white/85 dark:bg-card backdrop-blur-md border border-white/65 dark:border-border/80 shadow-lg shadow-slate-100/30 dark:shadow-none rounded-[20px] p-5 flex items-start gap-4 hover:shadow-xl hover-neon-blue transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-450 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-850 dark:text-white text-sm leading-snug">{feat.title}</h3>
                    <p className="text-slate-450 dark:text-slate-400 text-xs mt-1 leading-normal">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>
 
      {/* ─── Categories Section ─── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-[#F8FAFC] dark:bg-background"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest">Premium Catalog</span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-heading">Shop by Category</h2>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-755 dark:hover:text-indigo-350 group mt-3 md:mt-0 transition-colors"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
 
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link href={`/products?category=${cat.slug}`} key={cat.id} className="block">
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="group relative h-40 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-transparent dark:border-border/40 bg-white dark:bg-card/60 hover-neon-cyan transition-all duration-300 cursor-pointer"
                  >
                    {/* Category Image */}
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                    
                    {/* Category Details */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between items-start text-white">
                      <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center self-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      
                      <div className="mt-auto text-left">
                        <span className="text-[10px] font-semibold text-indigo-200 block mb-0.5">{cat.count}</span>
                        <h3 className="text-sm font-bold leading-tight">{cat.name}</h3>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ─── Featured Products Section ─── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-white dark:bg-background border-y border-slate-200/40 dark:border-border/50"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest">Trending Deals</span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-heading">Featured Products</h2>
            </div>
            <Link
              href="/products?featured=true"
              className="flex items-center gap-1 text-sm font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-755 dark:hover:text-indigo-350 group mt-3 md:mt-0 transition-colors"
            >
              <span>View All Hot Deals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {featuredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className="group bg-white dark:bg-card border border-slate-100 dark:border-border/40 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-200/50 dark:hover:border-border/80 hover-neon-blue transition-all duration-300 flex flex-col justify-between h-full relative cursor-pointer"
                  onClick={() => window.location.href = `/products/${product.id}`}
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-square bg-slate-50 dark:bg-slate-900 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                        -{product.discount}%
                      </span>
                    )}
 
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => toggleWishlist(product, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-background/90 backdrop-blur-md border border-slate-100 dark:border-border flex items-center justify-center shadow-md hover:scale-110 transition-all text-slate-400 dark:text-slate-500 hover:text-red-500 active:scale-95"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500 animate-pulse' : ''}`} />
                    </button>
                  </div>
 
                  {/* Body details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                          {product.rating} <span className="text-slate-350 dark:text-slate-500 font-normal">({product.reviews.toLocaleString()})</span>
                        </span>
                      </div>
                    </div>
 
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-border/80 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-slate-900 dark:text-white">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 line-through font-medium leading-none">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => addToCart(product, e)}
                        className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-accent group-hover:bg-indigo-650 group-hover:text-white dark:group-hover:bg-primary text-slate-700 dark:text-slate-300 group-hover:text-white flex items-center justify-center transition-all duration-300"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ─── Home Services Section ─── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-[#F8FAFC] dark:bg-background"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest">Doorstep Solutions</span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-heading">Book Professional Services</h2>
            </div>
            <Link
              href="/services"
              className="flex items-center gap-1 text-sm font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-755 dark:hover:text-indigo-350 group mt-3 md:mt-0 transition-colors"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.id}
                  className="group relative h-[260px] rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 border border-transparent dark:border-border/80 hover-neon-purple transition-all duration-300 cursor-pointer"
                  onClick={() => window.location.href = `/services/${svc.id}`}
                >
                  {/* Photo bg */}
                  <img src={svc.image} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/30 transition-colors duration-300" />
 
                  {/* Glass Card content */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-card/95 dark:glass-dark backdrop-blur-md border border-white/60 dark:border-border/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                          <Icon className="w-4.5 h-4.5" />
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{svc.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{svc.desc}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">{svc.rating}</span>
                        </div>
                        <span className="text-slate-300 dark:text-slate-650 text-xs">•</span>
                        <span className="text-xs text-indigo-650 dark:text-indigo-400 font-extrabold">Starting at ₹{svc.startingAt}</span>
                      </div>
                    </div>
 
                    <button className="px-3 py-2 bg-slate-900 dark:bg-[#1E293B] group-hover:bg-indigo-600 dark:group-hover:bg-gradient-to-r dark:group-hover:from-blue-500 dark:group-hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm group-hover:shadow-indigo-500/20">
                      Book
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ─── Freelancer Section ─── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-white dark:bg-background border-y border-slate-200/40 dark:border-border/50"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest">Global Talents</span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-heading">Hire Verified Freelancers</h2>
            </div>
            <Link
              href="/freelancers"
              className="flex items-center gap-1 text-sm font-bold text-indigo-655 dark:text-indigo-400 hover:text-indigo-755 dark:hover:text-indigo-350 group mt-3 md:mt-0 transition-colors"
            >
              <span>Browse All Talents</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freelancers.map((fl) => (
              <div
                key={fl.id}
                className="bg-white dark:bg-card hover:bg-slate-50/50 dark:hover:bg-accent/60 border border-slate-200/60 dark:border-border/80 rounded-[24px] p-6 shadow-sm hover:shadow-xl hover-neon-cyan transition-all duration-300 flex flex-col justify-between cursor-pointer"
                onClick={() => window.location.href = `/freelancers/${fl.id}`}
              >
                {/* Profile Header */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-accent overflow-hidden relative border border-slate-100 dark:border-border shadow-sm flex-shrink-0">
                    <img src={fl.image} alt={fl.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">{fl.name}</h3>
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-100/50 dark:border-emerald-900/50 flex-shrink-0 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Verified
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{fl.role}</p>
 
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{fl.rating}</span>
                      <span className="text-slate-300 dark:text-slate-650 text-xs">•</span>
                      <span className="text-xs text-slate-400 dark:text-slate-450 font-medium">{fl.projects} Projects Completed</span>
                    </div>
                  </div>
                </div>
 
                {/* Skills Pills */}
                <div className="flex flex-wrap gap-1.5 my-5">
                  {fl.skills.map((skill) => (
                    <span key={skill} className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-background border border-slate-200/30 dark:border-border px-2.5 py-1 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
 
                {/* Footer details */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-border/80 pt-4 mt-1">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 dark:text-slate-400 font-medium leading-none">Hourly Rate</span>
                    <span className="text-base font-black text-slate-900 dark:text-white mt-1">₹{fl.rate.toLocaleString()} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ hr</span></span>
                  </div>
                  <button className="px-5 py-2.5 bg-slate-900 dark:bg-[#1E293B] hover:bg-indigo-650 dark:hover:bg-gradient-to-r dark:hover:from-purple-650 dark:hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-purple-500/20 shadow-sm">
                    Hire Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── Statistics Banner ─── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 my-20"
      >
        <div className="relative rounded-[32px] border border-slate-200/60 dark:border-border/80 bg-slate-900 dark:bg-card dark:glass p-8 lg:p-12 shadow-xl overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-8 items-center text-center">
            {[
              { val: '1M+', lbl: 'Products Listed', icon: ShoppingBag, color: 'text-blue-500' },
              { val: '50K+', lbl: 'Verified Vendors', icon: UserCheck, color: 'text-purple-500' },
              { val: '25K+', lbl: 'Expert Freelancers', icon: Users, color: 'text-indigo-500' },
              { val: '10M+', lbl: 'Orders Delivered', icon: Truck, color: 'text-emerald-500' },
              { val: '4.9/5', lbl: 'Customer Rating', icon: Star, color: 'text-amber-500' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col items-center p-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 dark:bg-muted border border-slate-700/50 dark:border-border flex items-center justify-center mb-3 shadow-md">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">{stat.val}</span>
                  <span className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 mt-2">{stat.lbl}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>
 
      {/* ─── Testimonials Section ─── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-gradient-to-b from-white to-[#F8FAFC] dark:from-background dark:to-background border-t border-slate-100 dark:border-border/30"
      >
        <div className="container mx-auto px-6 text-center">
          <span className="text-xs font-bold text-indigo-655 dark:text-indigo-400 uppercase tracking-widest">Endorsements</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5 mb-16 font-heading">What Our Users Say</h2>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {testimonials.map((test) => (
              <div
                key={test.name}
                className="bg-white/70 dark:bg-card backdrop-blur-md border border-white/60 dark:border-border/80 p-8 rounded-[24px] shadow-sm hover:shadow-xl hover-neon-purple transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed italic">
                    "{test.text}"
                  </p>
                </div>
 
                <div className="flex items-center gap-3.5 mt-8 border-t border-slate-100 dark:border-border pt-5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-accent flex-shrink-0">
                    <img src={test.avatar} alt={test.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{test.name}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
 
    </div>
  );
}
