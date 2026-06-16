'use client';

import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, BookMarked } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogPage() {
  const posts = [
    {
      title: '10 Essential Home Maintenance Tips for the Monsoon Season',
      category: 'Home Services',
      author: 'Vikram Mehta (Services Lead)',
      date: 'June 05, 2026',
      desc: 'Protect your home from humidity, electrical leaks, and plumbing blockages with this checklist created by certified electrical partners.',
      imageBg: 'bg-primary/10'
    },
    {
      title: 'Scaling Your Local D2C Brand: From 10 to 10,000 Orders',
      category: 'Seller Tips',
      author: 'Priya Sharma (Retail Advisor)',
      date: 'May 28, 2026',
      desc: 'Learn how our premium vendors optimize their search filters, structure pricing, and handle shipping logistics across India.',
      imageBg: 'bg-success/10'
    },
    {
      title: 'How to Write a Perfect Freelance Project Brief',
      category: 'Freelancing',
      author: 'Rohan Gupta (Product Manager)',
      date: 'April 14, 2026',
      desc: 'A complete step-by-step guide to writing design/code briefs that attract elite freelancers and ensure fast delivery.',
      imageBg: 'bg-warning/10'
    }
  ];

  return (
    <div className="py-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Hero */}
        <div className="text-center mb-20">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
            Resources & Blog
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-6 mb-6 tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent font-heading">
            Insights, Guides & Industry Tips
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover articles written by retail experts, service professionals, and tech freelancers to help you shop, sell, or hire successfully.
          </p>
        </div>

        {/* Featured Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card-premium-interactive flex flex-col justify-between overflow-hidden p-0"
            >
              <div>
                {/* Simulated Thumbnail */}
                <div className={`h-48 w-full ${post.imageBg} flex items-center justify-center border-b border-border/40 relative group-hover:scale-102 transition-transform duration-300`}>
                  <BookMarked className="w-12 h-12 text-primary/30" />
                  <span className="absolute top-4 left-4 px-2.5 py-1 bg-card/85 rounded-lg text-xs font-semibold text-foreground border border-border/50">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {post.author}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {post.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => toast.success('Redirecting to post details (Mock)...')}
                  className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/90 group/btn transition-colors"
                >
                  Read Article <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </div>
  );
}
