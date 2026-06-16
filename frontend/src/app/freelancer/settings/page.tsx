'use client';

import { motion } from 'framer-motion';
import { Save, User, Laptop, Sparkles, Building, Code } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FreelancerSettingsPage() {
  const handleSave = () => {
    toast.success('Professional profile saved successfully!');
  };

  return (
    <div className="flex-1 bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Hub Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">Configure your professional profile, portfolio, and skills.</p>
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
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Professional Profile</h3>
              <p className="text-xs text-slate-400 mt-0.5">Customize your rate, skills list, and portfolio link definitions.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Hourly Rate (INR)</label>
              <input
                type="number"
                defaultValue="1500"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Specialization / Title</label>
              <input
                type="text"
                defaultValue="Fullstack Developer (React & Spring Boot)"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Bio</label>
              <textarea
                rows={4}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
                defaultValue="Experienced software developer with 4+ years of hands-on expertise building scalable web platforms and API layers. Specializing in React, Next.js, Java Spring Boot, and MySQL."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills (Comma Separated)</label>
              <input
                type="text"
                defaultValue="React, Spring Boot, TypeScript, Java, SQL, Tailwind"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">GitHub Profile</label>
              <input
                type="text"
                defaultValue="https://github.com/freelancer"
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
