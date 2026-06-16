'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Store, 
  DollarSign, 
  AlertCircle, 
  Check, 
  X, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Database,
  ArrowUpRight,
  UserX,
  FileCheck
} from 'lucide-react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface PendingVendor {
  id: number;
  businessName: string;
  ownerName: string;
  gstNumber: string;
  panNumber: string;
  category: string;
}

const INITIAL_PENDING_VENDORS: PendingVendor[] = [
  { id: 1, businessName: 'Vedic Herbs Ltd', ownerName: 'Aman Dixit', gstNumber: '27AAAAA1111A1Z1', panNumber: 'APZPD1234F', category: 'Health & Beauty' },
  { id: 2, businessName: 'Prime Gadgets India', ownerName: 'Sneha Rao', gstNumber: '29BBBBB2222B2Z2', panNumber: 'BPQPD5678G', category: 'Electronics' },
  { id: 3, businessName: 'Urban Home Cleaners', ownerName: 'Vikram Singh', gstNumber: '07CCCCC3333C3Z3', panNumber: 'CPRPD9012H', category: 'Home Services' }
];

export default function AdminDashboardPage() {
  const [pendingVendors, setPendingVendors] = useState<PendingVendor[]>(INITIAL_PENDING_VENDORS);

  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  const handleApprove = (id: number, name: string) => {
    setPendingVendors(prev => prev.filter(v => v.id !== id));
    toast.success(`Merchant "${name}" has been KYC-approved!`);
  };

  const handleReject = (id: number, name: string) => {
    setPendingVendors(prev => prev.filter(v => v.id !== id));
    toast.error(`Merchant "${name}" KYC registration rejected.`);
  };

  // Static stats values
  const stats = [
    { label: 'Platform GMV', value: 1484500, change: '+18.4%', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'Registered Users', value: 8490, change: '+12.2%', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { label: 'Active Sellers', value: 342, change: '+6.5%', icon: Store, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { label: 'KYC Pending', value: pendingVendors.length, change: 'Action Required', icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Centralized Admin Sidebar */}
      <AdminSidebar />

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-200/60 bg-white/70 backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-slate-900 font-display">System Administration</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Central Command Hub</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Systems Active
            </span>
          </div>
        </header>

        {/* Dashboard workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Top Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white/80 border border-white/60 rounded-[24px] p-5 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${stat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.change}</span>
                    </div>
                    <h3 className="text-2.5xl font-extrabold text-slate-900 font-heading">
                      {typeof stat.value === 'number' && stat.label.includes('GMV') ? formatPrice(stat.value) : stat.value}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Pending Vendor KYC Approvals (2 Cols wide) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-amber-500" />
                    <span>Pending KYC Merchant Approvals</span>
                  </h2>
                  <span className="text-[10px] font-bold bg-amber-55 text-amber-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-200/50">
                    {pendingVendors.length} Action Required
                  </span>
                </div>

                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {pendingVendors.length > 0 ? (
                      pendingVendors.map((vendor) => (
                        <motion.div
                          key={vendor.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -60, height: 0, padding: 0, marginBottom: 0 }}
                          className="bg-white/80 border border-white/60 rounded-[24px] p-4 md:p-5 shadow-xl backdrop-blur-md flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-slate-300 transition-all duration-300"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-slate-950 text-base">{vendor.businessName}</h4>
                              <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider border border-indigo-100">
                                {vendor.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              Owner: <span className="text-slate-800 font-bold">{vendor.ownerName}</span>
                            </p>
                            <p className="text-[10px] font-semibold text-slate-400 font-mono">
                              GST: {vendor.gstNumber} • PAN: {vendor.panNumber}
                            </p>
                          </div>

                          <div className="flex items-center gap-2.5 self-end md:self-auto">
                            <button
                              onClick={() => handleReject(vendor.id, vendor.businessName)}
                              className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all active:scale-95"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApprove(vendor.id, vendor.businessName)}
                              className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-slate-900/10 hover:bg-slate-800 active:scale-95"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-white/80 border border-white/60 rounded-[24px] p-6 shadow-xl backdrop-blur-md">
                        <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                        <h4 className="font-bold text-slate-900">KYC Queue Cleared</h4>
                        <p className="text-xs text-slate-500 mt-1">All incoming merchant registries have been vetted.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column: Platform health parameters & quick logs */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    <span>System Telemetry</span>
                  </h2>
                </div>

                <div className="bg-white/80 border border-white/60 rounded-[24px] p-5 shadow-xl backdrop-blur-md space-y-4">
                  {[
                    { label: 'API Gateway Latency', value: '42ms', desc: 'Active Load Balancer', status: 'Optimal', icon: Cpu, statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/60' },
                    { label: 'MySQL Replica Lag', value: '0.0ms', desc: 'Primary Master active', status: 'Healthy', icon: Database, statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/60' },
                    { label: 'Elasticsearch Index', value: '99.8%', desc: 'Syncing delta products', status: 'Optimal', icon: TrendingUp, statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/60' }
                  ].map((sys) => {
                    const Icon = sys.icon;
                    return (
                      <div key={sys.label} className="flex gap-3.5 p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="text-xs font-bold text-slate-900 truncate">{sys.label}</p>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.25 rounded uppercase tracking-wider border ${sys.statusColor}`}>
                              {sys.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{sys.desc}</p>
                          <p className="text-xs font-black text-slate-900 mt-1.5">{sys.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
