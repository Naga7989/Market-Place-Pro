'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/layout/Sidebar';

export default function VendorStorePage() {
  const [storeName, setStoreName] = useState('TechMart Store');
  const [description, setDescription] = useState('The ultimate marketplace store for premium consumer electronics, gadgets, and tech accessories.');
  const [supportEmail, setSupportEmail] = useState('support@techmart.bazaarindia.in');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Bengaluru, Karnataka, India');
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
      toast.success('Store settings saved successfully! 🏪');
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-5">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight">My Store Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">Customize your storefront branding, description, and contact info</p>
        </div>

        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Banner & Logo */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/50 space-y-6"
            >
              <div className="relative h-48 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-dashed border-indigo-300">
                <button type="button" className="px-4 py-2 bg-white/90 hover:bg-white rounded-xl text-xs font-bold text-slate-700 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Upload Cover Banner
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-650 border-4 border-white -mt-16 ml-6 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  TM
                </div>
                <button type="button" className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:border-slate-300 transition-all hover:scale-[1.02]">
                  Change Logo
                </button>
              </div>
            </motion.div>

            {/* Store Form Details */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/50 space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Store Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Store Slug</label>
                  <div className="relative flex">
                    <span className="flex items-center px-4 border border-r-0 border-slate-200 rounded-l-xl bg-slate-50 text-slate-400 text-xs font-bold">
                      bazaarindia.in/store/
                    </span>
                    <input
                      type="text"
                      disabled
                      value="techmart-store"
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-r-xl bg-slate-50/50 text-slate-400 text-sm font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Store Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Support Phone</label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Business Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold"
                />
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
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-650 hover:from-indigo-500 hover:to-purple-550 text-white font-extrabold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}
