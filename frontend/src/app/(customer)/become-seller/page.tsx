'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, ArrowRight, DollarSign, LucideIcon } from 'lucide-react';
import Link from 'next/link';

type Highlight = { Icon: LucideIcon; iconClass: string; title: string; desc: string };

const highlights: Highlight[] = [
  { Icon: DollarSign, iconClass: 'text-primary', title: 'Low Commission Rates', desc: 'Keep maximum margins on your products. No hidden processing charges.' },
  { Icon: TrendingUp, iconClass: 'text-success', title: 'Analytics & Insights', desc: 'Real-time sales charts, item performance statistics, and user query trackers.' },
  { Icon: Users, iconClass: 'text-secondary', title: '10M+ Buyer Pool', desc: 'Instant exposure to millions of verified shoppers actively browsing listings.' },
];

const steps = [
  { title: '1. Register Account', desc: 'Create a partner profile and select "Seller (Product Vendor)" role.' },
  { title: '2. Upload Catalog', desc: 'List your items, set prices, stock details, and write specifications.' },
  { title: '3. Receive Orders', desc: 'Start getting customer requests across all major Indian states.' },
  { title: '4. Quick Payments', desc: 'Payments are settled to your bank account securely via Razorpay.' }
];

export default function BecomeSellerPage() {
  return (
    <div className="py-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
            Partner with us
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-6 mb-6 tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent font-heading">
            Sell to Millions of Customers
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Take your business online with BharatMart. Set up your store, upload your catalog, and start fulfilling customer orders with ease.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary/10 flex items-center gap-2 group"
            >
              Start Selling <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {highlights.map(({ Icon, iconClass, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-5">
                <Icon className={`w-5 h-5 ${iconClass}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Sell Steps */}
        <div>
          <h2 className="text-2xl font-bold font-heading text-center mb-12 text-foreground">
            4 Steps to Start Earning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="card-premium"
              >
                <h3 className="font-bold text-primary mb-2 text-sm uppercase tracking-wider">{step.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
