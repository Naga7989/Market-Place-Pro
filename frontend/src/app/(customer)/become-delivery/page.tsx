'use client';

import { motion } from 'framer-motion';
import { Bike, DollarSign, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BecomeDeliveryPage() {
  const highlights = [
    { icon: <DollarSign className="w-5 h-5 text-primary" />, title: 'Attractive Pay & Incentives', desc: 'Earn competitive trip charges, distance premiums, and peak-hour bonus payouts.' },
    { icon: <Clock className="w-5 h-5 text-success" />, title: 'Flexible Delivery Slots', desc: 'Work part-time or full-time. Choose your own schedules and service range.' },
    { icon: <ShieldCheck className="w-5 h-5 text-secondary" />, title: 'Insurance & Safety Kits', desc: 'Rider medical insurance and delivery gear support provided directly by us.' }
  ];

  return (
    <div className="py-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
            Fulfillment Partner
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-6 mb-6 tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent font-heading">
            Earn with Every Delivery
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Become a delivery rider with BharatMart. Deliver customer orders safely across your city and secure stable weekly earnings.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => toast.success('Delivery partner onboarding application form opened.')}
              className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary/10 flex items-center gap-2 group"
            >
              Apply as Delivery Rider <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-5">
                {h.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{h.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{h.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Requirements */}
        <div className="card-premium max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-heading mb-6 text-foreground text-center flex items-center justify-center gap-2">
            <Bike className="w-6 h-6 text-primary" /> What You Need to Join
          </h2>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary" /> Must be at least 18 years old.
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary" /> Own a smartphone with a valid active mobile number.
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary" /> Own a two-wheeler (bicycle, motorcycle, or electric scooter).
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary" /> Possess a valid Indian driving license and registration certificate (RC).
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
