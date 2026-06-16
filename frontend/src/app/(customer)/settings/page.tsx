'use client';

import { useState } from 'react';
import { Settings, Save, Shield, Bell, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerSettingsPage() {
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);
  const [promoNotify, setPromoNotify] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Account settings updated! ⚙️');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container mx-auto px-4 max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display flex items-center gap-3">
          <Settings className="text-violet-600 w-6 h-6" /> Account Settings
        </h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Notifications */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-850 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-violet-500" /> Notifications
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotify}
                  onChange={(e) => setEmailNotify(e.target.checked)}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email updates about my orders and transactions</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotify}
                  onChange={(e) => setSmsNotify(e.target.checked)}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile SMS updates for order deliveries</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={promoNotify}
                  onChange={(e) => setPromoNotify(e.target.checked)}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Receive marketing promotions and offers</span>
              </label>
            </div>
          </div>

          {/* Security / Password */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-850 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-violet-500" /> Security
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-violet-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-violet-500 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
