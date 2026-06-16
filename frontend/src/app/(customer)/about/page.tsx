'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Lightbulb, TrendingUp, Award, AwardIcon } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Verified Sellers', value: '50,000+' },
    { label: 'Happy Customers', value: '10 Million+' },
    { label: 'Service Experts', value: '25,000+' },
    { label: 'Products Listed', value: '10M+' },
  ];

  const values = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: 'Customer Centricity',
      description: 'We place the satisfaction and security of our customers at the core of every transaction and feature we build.',
    },
    {
      icon: <Shield className="w-6 h-6 text-success" />,
      title: 'Trust & Transparency',
      description: 'Building secure payment flows, verified listings, and transparent seller feedback loops to foster trust.',
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-warning" />,
      title: 'Continuous Innovation',
      description: 'Pioneering unified shopping, expert services, and freelance talent hire under a single dashboard.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-secondary" />,
      title: 'Socio-Economic Growth',
      description: 'Empowering local small businesses, delivery personnel, and freelance creators across all of India.',
    },
  ];

  return (
    <div className="py-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-6 mb-6 tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent font-heading">
              India's Unified Smart Marketplace
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We started with a simple vision: to construct an all-in-one digital marketplace where any Indian can shop premium products, book reliable home services, and hire top-tier freelancers under one secure roof.
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card-premium text-center"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold font-heading text-foreground">
              Redefining convenience for the modern consumer
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Traditional platforms fragment your digital life. You buy clothes from one app, hire electricians from another, and look for professional video editors on specialized forums.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>MarketPlace Pro (BharatMart)</strong> brings them all together. Backed by state-of-the-art catalog services, secure escrow payments, and localized delivery systems, we create a fluid web experience for local consumers and global sellers.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden border border-border/50 p-8 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5"
          >
            <div className="flex gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">National Trust</h3>
                <p className="text-sm text-muted-foreground">Awarded as one of the fastest growing consumer tech platforms in India.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                <AwardIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Empowerment Award</h3>
                <p className="text-sm text-muted-foreground">Recognized for creating over 50,000 independent jobs for micro-sellers and gig workers.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <div>
          <h2 className="text-3xl font-bold font-heading text-center mb-12 text-foreground">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card-premium-interactive flex gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  {val.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{val.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{val.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
