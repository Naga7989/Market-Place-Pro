'use client';

import { motion } from 'framer-motion';
import { Search, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phoneOrEmail) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTrackingData({
        orderId,
        status: 'In Transit',
        eta: 'June 15, 2026',
        milestones: [
          { status: 'Order Placed', time: 'June 10, 10:30 AM', done: true },
          { status: 'Packed & Dispatched', time: 'June 11, 2:15 PM', done: true },
          { status: 'In Transit (At Hub)', time: 'June 12, 9:00 AM', done: true, current: true },
          { status: 'Out for Delivery', time: 'Pending', done: false },
        ]
      });
      toast.success('Tracking data loaded successfully!');
    }, 1200);
  };

  return (
    <div className="py-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header Hero */}
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-widest">
            Track Order
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-6 mb-6 tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent font-heading">
            Track Your Shipment
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Enter your order tracking details below to find your dispatch status and delivery estimates.
          </p>
        </div>

        {/* Track Form */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="card-premium">
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. #ORD98765"
                  required
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Email Address or Phone Number</label>
                <input
                  type="text"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="e.g. user@example.com or 9876543210"
                  required
                  className="input-premium"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold rounded-xl transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> {loading ? 'Locating...' : 'Track Shipment'}
              </button>
            </form>
          </div>
        </div>

        {/* Tracking Output / Timeline */}
        {trackingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/40 pb-5 mb-6 gap-2">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold">Order Tracked</span>
                <h3 className="text-lg font-bold text-foreground">{trackingData.orderId}</h3>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Estimated Delivery</span>
                <p className="text-sm font-bold text-primary">{trackingData.eta}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative border-l-2 border-border/60 ml-3 space-y-8 pb-2">
              {trackingData.milestones.map((m: any, idx: number) => (
                <div key={idx} className="relative pl-8">
                  {/* Indicator Dot */}
                  <span className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-background ${
                    m.done 
                      ? 'border-primary text-primary' 
                      : 'border-border text-muted-foreground'
                  }`}>
                    {m.done && <CheckCircle2 className="w-4 h-4 fill-primary/10" />}
                  </span>
                  
                  <div>
                    <h4 className={`text-base font-bold ${
                      m.current 
                        ? 'text-primary' 
                        : m.done 
                          ? 'text-foreground' 
                          : 'text-muted-foreground'
                    }`}>
                      {m.status}
                    </h4>
                    <span className="text-xs text-muted-foreground">{m.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
