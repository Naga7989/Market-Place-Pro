'use client';

import { motion } from 'framer-motion';
import { RotateCcw, ShieldCheck, Truck, CreditCard, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ReturnsPage() {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  const steps = [
    { icon: <RotateCcw className="w-5 h-5 text-primary" />, title: '1. Initiate Request', desc: 'Go to Order History, select the item you want to return, and provide a reason.' },
    { icon: <Truck className="w-5 h-5 text-success" />, title: '2. Free Pickup', desc: 'Our courier partner will pick up the package from your delivery address within 24-48 hours.' },
    { icon: <ShieldCheck className="w-5 h-5 text-warning" />, title: '3. Quality Check', desc: 'Once the item reaches our fulfillment center, we perform a quality inspection.' },
    { icon: <CreditCard className="w-5 h-5 text-secondary" />, title: '4. Quick Refund', desc: 'Approved refunds are credited to your original payment method or wallet instantly.' },
  ];

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Order is eligible for return! Redirecting to return request form...');
    }, 1000);
  };

  return (
    <div className="py-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Header Hero */}
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
            Returns & Refunds
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-6 mb-6 tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent font-heading">
            Easy Returns & Instant Refunds
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We offer a hassle-free 7-day return policy for most items. Check return eligibility or read details below on how it works.
          </p>
        </div>

        {/* Check Return Eligibility Form */}
        <div className="max-w-xl mx-auto mb-20">
          <div className="card-premium">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">Check Return Eligibility</h3>
            <form onSubmit={handleCheckEligibility} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. #ORD12345)"
                required
                className="input-premium flex-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold rounded-xl transition-all shadow-md shadow-primary/10"
              >
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </form>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold font-heading text-center mb-12 text-foreground">
            How the Return Process Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card-premium flex flex-col items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4 flex-shrink-0">
                  {step.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wide">{step.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support Alert Box */}
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
          <HelpCircle className="w-8 h-8 text-primary flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Have any questions about returns, special order exceptions, or refunds status? Contact our <a href="/contact" className="text-primary font-bold hover:underline">Support team</a> 24/7.
          </p>
        </div>

      </div>
    </div>
  );
}
