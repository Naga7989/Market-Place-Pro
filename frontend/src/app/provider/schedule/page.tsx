'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Save, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProviderSchedulePage() {
  const handleSave = () => {
    toast.success('Availability settings saved successfully!');
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="flex-1 bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Schedule & Availability</h1>
          <p className="text-xs text-slate-400 mt-0.5">Define your daily hours and service time slots.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:bg-slate-800 active:scale-95"
        >
          <Save className="w-3.5 h-3.5" /> Save Shifts
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
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Weekly Working Shifts</h3>
              <p className="text-xs text-slate-400 mt-0.5">Toggle working days and set active hours for home visits.</p>
            </div>
          </div>

          <div className="space-y-4">
            {days.map((day) => (
              <div
                key={day}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 hover:border-slate-350 rounded-2xl bg-slate-50/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked={day !== 'Sunday'}
                    id={`check-${day}`}
                    className="form-checkbox w-4.5 h-4.5 text-indigo-650 border-slate-300 focus:ring-indigo-550 rounded"
                  />
                  <label htmlFor={`check-${day}`} className="text-sm font-bold text-slate-900 cursor-pointer select-none">
                    {day}
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <select className="bg-white border border-slate-250 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                    <option value="08:00">08:00 AM</option>
                    <option value="09:00" selected={day !== 'Saturday'}>09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                  </select>
                  <span className="text-xs text-slate-400">to</span>
                  <select className="bg-white border border-slate-250 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all">
                    <option value="17:00">05:00 PM</option>
                    <option value="18:00" selected={day !== 'Saturday'}>06:00 PM</option>
                    <option value="20:00">08:00 PM</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
