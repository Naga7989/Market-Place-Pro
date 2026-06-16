'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save, Shield, Bell
} from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/layout/Sidebar';

export default function VendorSettingsPage() {
  const [commRate] = useState('5.0%');
  const [gstIn, setGstIn] = useState('29GGGGG1314R9Z0');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [payoutBank] = useState('HDFC Bank - **** 5678');
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Force Light Mode on Mount
  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Account settings saved! ⚙️');
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-5">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight">Seller Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage tax details, legal compliance, and notification preferences</p>
        </div>

        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Business Registration */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/50 space-y-5"
            >
              <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" /> 
                <span>Legal & Tax Verification</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">GSTIN (GST Number)</label>
                  <input
                    type="text"
                    value={gstIn}
                    onChange={(e) => setGstIn(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">PAN Card Number</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Commission Rate</p>
                  <p className="text-base font-black text-slate-800 mt-1">{commRate}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payout Bank Details</p>
                  <p className="text-base font-black text-slate-800 mt-1">{payoutBank}</p>
                </div>
              </div>
            </motion.div>

            {/* Notifications Settings */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/50 space-y-4"
            >
              <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" /> 
                <span>Notifications Settings</span>
              </h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={emailNotify}
                    onChange={(e) => setEmailNotify(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-550 transition-colors"
                  />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-950 transition-colors">
                    Send email updates for new orders and payouts
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={smsNotify}
                    onChange={(e) => setSmsNotify(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-550 transition-colors"
                  />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-950 transition-colors">
                    Send mobile SMS OTP and status updates
                  </span>
                </label>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex justify-end"
            >
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-650 hover:from-indigo-500 hover:to-purple-555 text-white font-extrabold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}
