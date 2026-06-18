'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, ArrowRight, ShieldAlert, Award, LucideIcon } from 'lucide-react';
import Link from 'next/link';

type ValueProp = { Icon: LucideIcon; iconClass: string; title: string; desc: string };

const valueProps: ValueProp[] = [
  { Icon: ClipboardCheck, iconClass: 'text-primary', title: 'Guaranteed Weekly Settlements', desc: 'All verified services booked and completed are settled to your bank account weekly.' },
  { Icon: Award, iconClass: 'text-success', title: 'Flexible Work Hours', desc: 'Accept bookings only when you are online. Manage your own schedules.' },
  { Icon: ShieldAlert, iconClass: 'text-secondary', title: 'Safety & Insurance Support', desc: 'On-job accidental coverage and safety verification protocols for all bookings.' },
];

export default function BecomeProviderPage() {
  const categories = [
    'Appliance Repairs', 'Plumbing & Wiring', 'Cleaning & Sanitation', 'Beauty & Grooming', 'Home Automations', 'Tutor & Academic Support'
  ];

  return (
    <div className="py-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
            Service Expert Partner
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-6 mb-6 tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent font-heading">
            Grow Your Home Service Business
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Join India's leading home service booking network. Get access to verified customer bookings in your local area and earn steadily.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary/10 flex items-center gap-2 group"
            >
              Register as Service Partner <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {valueProps.map(({ Icon, iconClass, title, desc }, i) => (
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

        {/* Categories Supported */}
        <div className="card-premium max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold font-heading mb-8 text-foreground">Popular Service Categories</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <span key={c} className="px-4 py-2 bg-muted border border-border/50 rounded-xl text-sm font-medium text-muted-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
