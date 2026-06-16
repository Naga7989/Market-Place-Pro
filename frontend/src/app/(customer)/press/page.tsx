'use client';

import { motion } from 'framer-motion';
import { Newspaper, Calendar, Mail, ExternalLink, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PressPage() {
  const pressReleases = [
    {
      title: 'BharatMart raises Series B financing to scale micro-vendor solutions',
      date: 'May 15, 2026',
      summary: 'Funding will be utilized to implement AI cataloging, secure Razorpay verification methods, and expand service categories across tier-2 cities.',
      link: '#'
    },
    {
      title: 'Unified Service & Talent Booking goes live nationwide',
      date: 'March 10, 2026',
      summary: 'With over 25,000 service pros onboarded, users can now book verified electricians, cleaning crews, and hire software freelancers in minutes.',
      link: '#'
    },
    {
      title: 'MarketPlace Pro logs 10 Million registered buyers in India',
      date: 'December 20, 2025',
      summary: 'Rapid expansion driven by easy mobile-first interface, regional languages, and trusted local logistics partners.',
      link: '#'
    }
  ];

  return (
    <div className="py-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Hero */}
        <div className="text-center mb-20">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
            Press Room
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-6 mb-6 tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent font-heading">
            Latest News & Media Updates
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Read our announcements, corporate updates, and access our media kits to learn more about the marketplace.
          </p>
        </div>

        {/* Media Kit & Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Download Media Assets</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Access official company logos, high-resolution management photos, product screenshots, and official boilerplate text for public publications.
              </p>
            </div>
            <button
              onClick={() => toast.success('Brand assets zip download started!')}
              className="w-fit px-5 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Brand Assets (Zip, 45MB)
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Media Contact</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                For media inquiries, expert opinions, or corporate information requests, please contact our public relations team.
              </p>
            </div>
            <a
              href="mailto:press@marketplacepro.in"
              className="w-fit px-5 py-3 border border-border bg-transparent hover:bg-muted text-foreground rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-primary" /> press@marketplacepro.in
            </a>
          </motion.div>
        </div>

        {/* Press Releases Section */}
        <div>
          <h2 className="text-2xl font-bold font-heading mb-10 text-foreground flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-primary" /> Press Releases
          </h2>
          <div className="space-y-6">
            {pressReleases.map((pr, i) => (
              <motion.div
                key={pr.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="card-premium-interactive"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-3">
                  <Calendar className="w-3.5 h-3.5" /> {pr.date}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 hover:text-primary transition-colors">
                  <a href={pr.link} className="flex items-center gap-2">
                    {pr.title} <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  </a>
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pr.summary}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
