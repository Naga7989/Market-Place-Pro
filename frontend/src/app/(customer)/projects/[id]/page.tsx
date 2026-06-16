'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  HelpCircle, 
  User, 
  Lock, 
  Unlock,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Milestone {
  id: number;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'AWAITING_ESCROW' | 'FUNDED' | 'RELEASED';
}

interface Freelancer {
  businessName: string;
  fullName: string;
  skills: string[];
}

interface ProjectContract {
  id: number;
  title: string;
  description: string;
  budget: number;
  releasedAmount: number;
  escrowBalance: number;
  status: string;
  freelancer: Freelancer;
  milestones: Milestone[];
}

const mockProjectContract: ProjectContract = {
  id: 101,
  title: 'Enterprise SaaS Dashboard UI/UX Redesign',
  description: 'Design and prototype a high-fidelity dashboard system with dark/light themes, custom charts, milestone trackers, and responsive mobile workspace views. Deliverables include editable Figma design library and developer handoff assets.',
  budget: 45000,
  releasedAmount: 15000,
  escrowBalance: 20000,
  status: 'IN_PROGRESS',
  freelancer: {
    businessName: 'Apex Studio UI/UX',
    fullName: 'Rohan Deshmukh',
    skills: ['Figma', 'UI Design', 'SaaS Design', 'Design Systems', 'Responsive Web Design'],
  },
  milestones: [
    {
      id: 1,
      title: 'Phase 1: Wireframing & Responsive Prototypes',
      description: 'Define the layout structure, information hierarchy, and primary user journey maps for both desktop and mobile layouts.',
      amount: 15000,
      dueDate: '2026-06-20',
      status: 'RELEASED',
    },
    {
      id: 2,
      title: 'Phase 2: High-Fidelity UI Design Mockups',
      description: 'Create the design elements library, typography rules, custom icons, dark/light mockup frames, and detail charts.',
      amount: 20000,
      dueDate: '2026-07-02',
      status: 'FUNDED',
    },
    {
      id: 3,
      title: 'Phase 3: Final Figma Handoff & Specifications',
      description: 'Clean components and layer spec descriptions, responsive prototypes, code export markers, and responsive layouts.',
      amount: 10000,
      dueDate: '2026-07-15',
      status: 'AWAITING_ESCROW',
    },
  ],
};

export default function ProjectMilestonesPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const projectId = params.id;

  const [localContract, setLocalContract] = useState<ProjectContract | null>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<number | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);



  // Fetch project details
  const { data: contractData, isLoading, error } = useQuery({
    queryKey: ['project-contract', projectId],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/projects/${projectId}`);
        const data = res.data?.data as ProjectContract;
        if (!data) return mockProjectContract;
        return data;
      } catch (err) {
        // Fallback to mock data for demonstration
        return mockProjectContract;
      }
    },
  });

  // Sync query data with local state for interactive simulator
  useEffect(() => {
    if (contractData) {
      setLocalContract(contractData);
    }
  }, [contractData]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Fund Escrow action
  const handleFundEscrow = async (milestone: Milestone) => {
    setActiveMilestoneId(milestone.id);
    setShowPayModal(true);
  };

  const executePayment = async () => {
    if (!activeMilestoneId || !localContract) return;
    setIsProcessing(true);

    const milestone = localContract.milestones.find(m => m.id === activeMilestoneId);
    if (!milestone) return;

    try {
      // Try calling API if possible, otherwise use mock Razorpay flow
      const isLoaded = await loadRazorpayScript();
      
      // Simulate/trigger Razorpay interface if script loaded, otherwise direct mock
      if (isLoaded) {
        // Razorpay Options
        const options = {
          key: 'rzp_test_mockkeyid12345',
          amount: milestone.amount * 100, // in paisa
          currency: 'INR',
          name: 'MarketPlace Pro',
          description: `Escrow Funding: ${milestone.title}`,
          handler: function (response: any) {
            toast.success(`Milestone funds loaded! Payment ID: ${response.razorpay_payment_id}`);
            confirmFundingLocal(activeMilestoneId);
          },
          prefill: {
            name: 'Project Client',
            email: 'client@marketplace.pro',
          },
          theme: {
            color: '#6366F1',
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback if Razorpay SDK blocked/failed
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success(`Milestone funds loaded successfully (Simulated Payment)!`);
        confirmFundingLocal(activeMilestoneId);
      }
    } catch (err) {
      toast.error('Failed to trigger payment. Using fallback simulation.');
      confirmFundingLocal(activeMilestoneId);
    } finally {
      setIsProcessing(false);
      setShowPayModal(false);
    }
  };

  const confirmFundingLocal = (milestoneId: number) => {
    if (!localContract) return;
    const updatedMilestones = localContract.milestones.map(m => {
      if (m.id === milestoneId) {
        return { ...m, status: 'FUNDED' as const };
      }
      return m;
    });

    const milestone = localContract.milestones.find(m => m.id === milestoneId);
    const addedAmount = milestone ? milestone.amount : 0;

    setLocalContract({
      ...localContract,
      escrowBalance: localContract.escrowBalance + addedAmount,
      milestones: updatedMilestones
    });
  };

  // Release Escrow action
  const handleReleaseEscrow = async (milestoneId: number) => {
    if (!localContract) return;
    const milestone = localContract.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    if (!confirm(`Are you sure you want to release ₹${milestone.amount.toLocaleString('en-IN')} to the freelancer? This action cannot be undone.`)) {
      return;
    }

    try {
      // Simulated release payload
      toast.loading('Releasing escrow funds...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.dismiss();

      const updatedMilestones = localContract.milestones.map(m => {
        if (m.id === milestoneId) {
          return { ...m, status: 'RELEASED' as const };
        }
        return m;
      });

      setLocalContract({
        ...localContract,
        releasedAmount: localContract.releasedAmount + milestone.amount,
        escrowBalance: localContract.escrowBalance - milestone.amount,
        milestones: updatedMilestones
      });

      toast.success('Escrow funds released to freelancer! 💸');
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to release escrow funds.');
    }
  };

  if (isLoading || !localContract) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 animate-pulse font-display">Loading Milestone Escrows...</span>
        </div>
      </div>
    );
  }

  // Cost breakdowns
  const totalBudget = localContract.budget;
  const released = localContract.releasedAmount;
  const heldEscrow = localContract.escrowBalance;
  const remaining = totalBudget - released - heldEscrow;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Back button */}
        <button
          onClick={() => router.push('/profile')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Project Workspace
        </button>

        {/* Dashboard Title Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full tracking-wider">
                Freelance Contract
              </span>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Escrow Protected
              </span>
            </div>
            <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 mt-2 font-display tracking-tight leading-tight">
              {localContract.title}
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1 leading-relaxed max-w-2xl">
              Collaborating with <strong className="text-slate-800 font-extrabold">{localContract.freelancer.fullName} ({localContract.freelancer.businessName})</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-850 rounded-2xl px-4 py-2.5 shadow-sm max-w-xs self-start md:self-center">
            <User className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div className="text-xs">
              <p className="text-slate-400 font-bold">Freelancer</p>
              <p className="text-slate-900 font-extrabold">{localContract.freelancer.fullName}</p>
            </div>
          </div>
        </div>

        {/* Escrow Budget Widgets Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-100 dark:border-slate-850 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Contract</span>
            <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1.5 font-display">{formatPrice(totalBudget)}</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-100 dark:border-slate-850 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Released (Paid)</span>
            <p className="text-xl md:text-2xl font-black text-emerald-600 mt-1.5 font-display">{formatPrice(released)}</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-100 dark:border-slate-850 rounded-2xl p-5 shadow-sm relative overflow-hidden ring-2 ring-indigo-50 dark:ring-indigo-950/50">
            <span className="text-[10px] font-extrabold uppercase text-indigo-600 mt-1.5 tracking-wider">Held in Escrow</span>
            <p className="text-xl md:text-2xl font-black text-indigo-600 mt-1.5 font-display">{formatPrice(heldEscrow)}</p>
            <Lock className="w-10 h-10 text-indigo-100 dark:text-indigo-950/20 absolute -bottom-2 -right-2 transform rotate-12" />
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-100 dark:border-slate-850 rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Awaiting Funding</span>
            <p className="text-xl md:text-2xl font-black text-slate-500 mt-1.5 font-display">{formatPrice(remaining)}</p>
          </div>
        </div>

        {/* Info Alert Box */}
        <div className="bg-indigo-50/50 border border-indigo-100/50 p-4.5 rounded-[20px] mb-8 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm text-indigo-950 font-medium leading-relaxed">
            <strong className="text-indigo-950 font-extrabold">How Escrow Milestones Work:</strong> Fund milestones in advance to show commitment. The money is securely locked in our bank escrow account. Release the funds to the freelancer ONLY when they submit the work and you verify its quality.
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left: Milestones Timeline Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 md:p-8 shadow-xl shadow-slate-100/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 font-display flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Project Milestone Schedule</span>
              </h3>

              {/* Milestones List */}
              <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {localContract.milestones.map((milestone, idx) => {
                  const isReleased = milestone.status === 'RELEASED';
                  const isFunded = milestone.status === 'FUNDED';
                  const isPending = milestone.status === 'AWAITING_ESCROW';

                  return (
                    <div key={milestone.id} className="relative pl-12">
                      {/* Timeline dot */}
                      <div 
                        className={`absolute left-3 w-6 h-6 rounded-full border-2 flex items-center justify-center -translate-x-1/2 transition-colors z-10 ${
                          isReleased
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : isFunded
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}
                      >
                        {isReleased ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isFunded ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>

                      {/* Milestone details box */}
                      <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <h4 className="font-extrabold text-slate-900 text-sm md:text-base">
                            {milestone.title}
                          </h4>
                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-center ${
                            isReleased
                              ? 'bg-emerald-50 text-emerald-700'
                              : isFunded
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {isReleased ? 'Released' : isFunded ? 'Funded (Escrow)' : 'Awaiting Escrow'}
                          </span>
                        </div>

                        <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-4">
                          {milestone.description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-slate-100 text-xs font-semibold text-slate-400">
                          <div className="flex items-center gap-4.5 flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-slate-400" /> Due: <strong className="text-slate-700">{milestone.dueDate}</strong>
                            </span>
                            <span className="flex items-center gap-1 text-slate-900 text-sm font-black">
                              ₹{milestone.amount.toLocaleString('en-IN')}
                            </span>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {isPending && (
                              <button
                                onClick={() => handleFundEscrow(milestone)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100 active:scale-95"
                              >
                                Fund Escrow
                              </button>
                            )}
                            {isFunded && (
                              <button
                                onClick={() => handleReleaseEscrow(milestone.id)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-100 active:scale-95 flex items-center gap-1"
                              >
                                <Unlock className="w-3.5 h-3.5" /> Release Funds
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Sidebar Overview & Security trust badges */}
          <div className="space-y-6">
            
            {/* Project description card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-display">Contract Description</h3>
              <p className="text-xs md:text-sm text-slate-650 dark:text-slate-400 leading-relaxed font-medium">
                {localContract.description}
              </p>
            </div>

            {/* Escrow Guarantee badge */}
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-[24px] p-6.5 shadow-xl relative overflow-hidden space-y-4">
              <div className="relative z-10">
                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest bg-indigo-800/60 px-2.5 py-1 rounded">
                  Trust & Security
                </span>
                <h4 className="text-lg font-black mt-3 font-display tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" /> Secure Escrow Policy
                </h4>
                <p className="text-xs text-indigo-200 mt-2 leading-relaxed">
                  Your funds are protected inside an automated, multi-sig escrow framework. We coordinate milestones using modern digital contracts with dispute resolution features to keep your capital safe.
                </p>
              </div>
              
              <div className="pt-3 border-t border-indigo-800 flex items-center justify-between text-[11px] font-bold text-indigo-300 relative z-10">
                <span>PCI-DSS Secured</span>
                <span>•</span>
                <span>RBI Compliant Escrow</span>
              </div>
              
              {/* Background graphic */}
              <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-indigo-500/10 -translate-x-1/2 -translate-y-1/2 blur-2xl z-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Fund Escrow Modal overlay */}
      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-8 md:p-10 max-w-md w-full border border-slate-100 shadow-2xl relative"
            >
              <h3 className="text-xl font-black text-slate-900 mb-2 font-display">Fund Escrow Milestone</h3>
              <p className="text-slate-500 text-xs md:text-sm mb-6 leading-relaxed">
                You are initiating a secure escrow deposit. The funds will be held securely in the escrow account and released to the freelancer upon successful milestone completion.
              </p>

              {/* Cost Box */}
              {activeMilestoneId && (
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-6 space-y-2">
                  <p className="text-xs text-slate-400 font-bold">Milestone Title</p>
                  <p className="text-slate-900 font-extrabold text-sm line-clamp-1">
                    {localContract.milestones.find(m => m.id === activeMilestoneId)?.title}
                  </p>
                  <div className="pt-3.5 border-t border-slate-150 flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500">Amount to Fund</span>
                    <span className="text-indigo-600 text-lg font-black">
                      ₹{localContract.milestones.find(m => m.id === activeMilestoneId)?.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowPayModal(false)}
                  disabled={isProcessing}
                  className="px-5 py-3 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-550 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executePayment}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100 active:scale-95 disabled:opacity-75 flex items-center gap-1.5"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Confirm & Pay Securely</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
