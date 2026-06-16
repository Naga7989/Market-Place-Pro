'use client';

import { motion } from 'framer-motion';
import { Save, User, MapPin, Sparkles, Building } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProviderSettingsPage() {
  const handleSave = () => {
    toast.success('Business settings saved successfully!');
  };

  return (
    <div className="flex-1 bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Hub Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage your service business profile details and settings.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:bg-slate-800 active:scale-95"
        >
          <Save className="w-3.5 h-3.5" /> Save Changes
        </button>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 border border-white/60 rounded-[24px] p-6 shadow-xl backdrop-blur-md space-y-6"
        >
          <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-150">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Business Information</h3>
              <p className="text-xs text-slate-400 mt-0.5">Configure your brand name, description, and catalog information.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Business Name</label>
              <input
                type="text"
                defaultValue="Bharat Cleaning & Repairs"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Phone</label>
              <input
                type="text"
                defaultValue="+91 90000 00004"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Business Description / Bio</label>
              <textarea
                rows={4}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
                defaultValue="Expert home deep cleaning, sanitization, plumbing, and appliance repair service providers serving metro regions since 2021. Fully vetted and verified professional team."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Years of Experience</label>
              <input
                type="number"
                defaultValue="5"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Coverage City</label>
              <input
                type="text"
                defaultValue="Mumbai, Pune"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
