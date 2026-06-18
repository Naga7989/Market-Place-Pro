'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Search, ShoppingCart, ShieldCheck, CreditCard, Users, ChevronDown, LucideIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

type Category = {
  Icon: LucideIcon;
  iconClass: string;
  name: string;
  count: string;
};

const categories: Category[] = [
  { Icon: ShoppingCart, iconClass: 'text-primary', name: 'Shopping & Orders', count: '12 articles' },
  { Icon: ShieldCheck, iconClass: 'text-success', name: 'Account & Security', count: '8 articles' },
  { Icon: CreditCard, iconClass: 'text-secondary', name: 'Payments & Refunds', count: '10 articles' },
  { Icon: Users, iconClass: 'text-warning', name: 'Partner Programs', count: '14 articles' },
];

const faqs = [
  {
    q: 'How do I track my order?',
    a: 'Navigate to the Track Order link in the footer, or go to Dashboard > Orders in your account to view real-time shipping milestones and tracking links.'
  },
  {
    q: 'What is the return policy?',
    a: 'We offer a standard 7-day hassle-free return window for most eligible items. Simply visit the Returns section in your profile to raise a return ticket.'
  },
  {
    q: 'How are home services verified?',
    a: 'All service partners undergo identity checks, police validation, and physical interviews. Escrows are released only after you mark the booking complete.'
  },
  {
    q: 'How do I register as a seller?',
    a: 'Go to the Partner section, click Sell on Marketplace, fill out the GST and warehouse details, and your store will be activated within 24 hours.'
  }
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header Search Hero */}
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
            Support Center
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-6 mb-8 tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent font-heading">
            How can we help you today?
          </h1>
          
          <div className="relative max-w-xl mx-auto shadow-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles, FAQs..."
              className="input-premium pl-12"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {categories.map(({ Icon, iconClass, name, count }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toast.success(`Viewing ${name} help articles.`)}
              className="card-premium-interactive flex flex-col items-center cursor-pointer text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
                <Icon className={`w-5 h-5 ${iconClass}`} />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{name}</h3>
              <span className="text-xs text-muted-foreground">{count}</span>
            </motion.div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div>
          <h2 className="text-2xl font-bold font-heading mb-8 text-foreground flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-border/50 bg-card overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-muted/30 transition-colors"
                    >
                      <span className="font-bold text-foreground text-base sm:text-lg">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4 font-sans">
                        {faq.a}
                      </div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-10">No FAQs found matching your search term.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
