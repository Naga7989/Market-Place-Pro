'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Twitter, Instagram, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight, Shield, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Returns', href: '/returns' },
    { label: 'Track Order', href: '/track' },
  ],
  sell: [
    { label: 'Sell on Marketplace', href: '/become-seller' },
    { label: 'Service Partner', href: '/become-provider' },
    { label: 'Freelancer Hub', href: '/become-freelancer' },
    { label: 'Delivery Partner', href: '/become-delivery' },
  ],
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setTimeout(() => {
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <footer className="bg-white dark:bg-muted border-t border-slate-200/80 dark:border-border/50 text-slate-600 dark:text-slate-400 transition-colors duration-300">
      {/* Main footer content */}
      <div className="container mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand Column (3/12) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-6 group w-fit">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-all duration-300">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                  MarketPlace<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed mb-6 max-w-sm text-slate-500 dark:text-slate-400">
                India's premier all-in-one smart marketplace. Shop premium products, hire expert freelancers, and book home services securely.
              </p>
            </div>

            <div className="space-y-3 mb-6 text-sm text-slate-500 dark:text-slate-400">
              <a href="mailto:support@marketplacepro.in" className="flex items-center gap-2.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                <Mail className="w-4 h-4 text-indigo-500" /> support@marketplacepro.in
              </a>
              <a href="tel:1800123456" className="flex items-center gap-2.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                <Phone className="w-4 h-4 text-indigo-500" /> 1800-123-456 (Toll Free)
              </a>
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-500" /> Bengaluru, Karnataka, India
              </span>
            </div>

            {/* Social links */}
            <div className="flex gap-2.5">
              {[
                { icon: <Twitter className="w-4 h-4" />, href: '#' },
                { icon: <Instagram className="w-4 h-4" />, href: '#' },
                { icon: <Facebook className="w-4 h-4" />, href: '#' },
                { icon: <Youtube className="w-4 h-4" />, href: '#' },
              ].map(({ icon, href }, i) => (
                <a key={i} href={href}
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-accent/40 border border-slate-200/50 dark:border-border/30 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:border-indigo-600 dark:hover:border-indigo-500 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns (2/12 each) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              Partner
            </h4>
            <ul className="space-y-3">
              {footerLinks.sell.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Subscription (3/12) */}
          <div className="lg:col-span-2 flex flex-col justify-start">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
              Stay Updated
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Subscribe to get exclusive discounts, expert tips, and feature updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-card/40 border border-slate-200/80 dark:border-border/50 focus:border-indigo-500 focus:bg-white text-sm text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl transition-all duration-300 outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7.5 h-7.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Security & Payment Methods */}
        <div className="mt-16 pt-8 border-t border-slate-200/60 dark:border-border/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mr-2">We Accept</span>
              {['Razorpay', 'UPI', 'Visa', 'Mastercard', 'Rupay', 'Net Banking', 'COD'].map((method) => (
                <span key={method} className="px-3 py-1 bg-slate-50 dark:bg-card/30 rounded-lg text-xs text-slate-600 dark:text-slate-400 font-medium border border-slate-200/60 dark:border-border/30">
                  {method}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> 256-bit SSL Secured
              </span>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg text-xs text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> PCI-DSS Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-border/20 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MarketPlace Pro Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <span className="text-red-500 animate-pulse">❤️</span> in India 🇮🇳 | GSTIN: 29XXXXX1234X1ZX
          </p>
        </div>
      </div>
    </footer>
  );
}

