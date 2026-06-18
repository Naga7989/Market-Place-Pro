'use client';

import { motion } from 'framer-motion';
import { Briefcase, Heart, Globe, Sparkles, LucideIcon } from 'lucide-react';
import toast from 'react-hot-toast';

type Perk = { Icon: LucideIcon; iconClass: string; title: string; desc: string };

const perks: Perk[] = [
  { Icon: Heart, iconClass: 'text-destructive', title: 'Health & Wellness', desc: 'Comprehensive medical insurance, wellness stipends, and mental health counseling support.' },
  { Icon: Globe, iconClass: 'text-primary', title: 'Remote-First Culture', desc: 'Work from anywhere in India with set home-office setups and internet bills covered.' },
  { Icon: Sparkles, iconClass: 'text-warning', title: 'Growth & Learning', desc: 'Generous annual learning budgets, mentorship programs, and sponsored certification plans.' },
];

const jobs = [
  { title: 'Senior Full Stack Engineer', dept: 'Engineering', location: 'Bengaluru / Remote', type: 'Full-time' },
  { title: 'Product UI/UX Designer', dept: 'Design', location: 'Bengaluru / Remote', type: 'Full-time' },
  { title: 'Lead Marketing Specialist', dept: 'Growth', location: 'Remote', type: 'Full-time' },
  { title: 'Operations Associate', dept: 'Operations', location: 'Mumbai', type: 'Full-time' },
  { title: 'Customer Support Lead', dept: 'Support', location: 'Remote', type: 'Full-time' },
];

export default function CareersPage() {
  return (
    <div className="py-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Hero */}
        <div className="text-center mb-20">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
            Join the team
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-6 mb-6 tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent font-heading">
            Build the Future of Commerce
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Help us build a unified platform that empowers millions of Indian buyers, sellers, home service experts, and creators to trade securely.
          </p>
        </div>

        {/* Culture / Perks Grid */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold font-heading text-center mb-12 text-foreground">
            Perks & Benefits at MarketPlace Pro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {perks.map(({ Icon, iconClass, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card-premium-interactive"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-5 flex-shrink-0">
                <Icon className={`w-5 h-5 ${iconClass}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
          </div>
        </div>

        {/* Open Roles Section */}
        <div>
          <h2 className="text-2xl font-bold font-heading text-center mb-12 text-foreground">
            Current Open Roles
          </h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            {jobs.map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="card-premium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" /> {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>{job.dept}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="px-3 py-1 bg-muted rounded-lg text-xs font-semibold text-muted-foreground">
                    {job.type}
                  </span>
                  <button 
                    onClick={() => toast.success(`Application form for ${job.title} opened.`)}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold transition-all"
                  >
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
