'use client';

import { motion } from 'framer-motion';
import { Terminal, Users, Globe, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BecomeFreelancerPage() {
  const categories = [
    'Software & Web Apps', 'Graphic Design & Logos', 'Content Writing & SEO', 'Video Editing & VFX', 'Digital Marketing', 'Translation Services'
  ];

  const benefits = [
    { icon: <Globe className="w-5 h-5 text-primary" />, title: 'Global Opportunities', desc: 'Find high-paying project listings and get hired by buyers across all sectors.' },
    { icon: <Shield className="w-5 h-5 text-success" />, title: 'Secure Escrow System', desc: 'No unpaid invoices. Payments are held in secure escrow and released on milestones.' },
    { icon: <Users className="w-5 h-5 text-secondary" />, title: 'Freelancer Community', desc: 'Access exclusive networking forums, partner templates, and learning guides.' }
  ];

  return (
    <div className="py-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
            Freelancer Partner Hub
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-6 mb-6 tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent font-heading">
            Work on Your Own Terms
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Create a profile, list your skills, submit proposals to open projects, and receive secure payments from verified clients across India.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary/10 flex items-center gap-2 group"
            >
              Sign Up as Freelancer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-5">
                {b.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Popular Skills */}
        <div className="card-premium max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold font-heading mb-8 text-foreground flex items-center justify-center gap-2">
            <Terminal className="w-6 h-6 text-primary" /> Popular Talents in Demand
          </h2>
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
