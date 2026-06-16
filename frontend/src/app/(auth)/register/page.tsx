'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Phone, User, ArrowRight, CheckCircle, Loader2, ShoppingBag, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAppDispatch, authActions } from '@/store';

// ─────────────────── Schema ───────────────────
const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      'Must contain uppercase, lowercase, number, and special character'),
  role: z.enum(['CUSTOMER', 'SELLER', 'SERVICE_PROVIDER', 'FREELANCER']),
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailReadOnly, setEmailReadOnly] = useState(true);
  const [passwordReadOnly, setPasswordReadOnly] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CUSTOMER',
    }
  });

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        dispatch(authActions.setUser({
          user: result.data.user,
          tokens: {
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken
          }
        }));
        toast.success('Account created successfully! 🎉');
        router.push('/');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch {
      toast.error('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    'Access 10M+ products from verified vendors',
    'Book certified experts for home services',
    'Hire top freelance professionals across domains',
    'Secure transactions with Razorpay & UPI',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0A0F1E] via-[#1a0533] to-[#0A0F1E] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full opacity-10 animate-float"
              style={{ width: `${i * 80 + 100}px`, height: `${i * 80 + 100}px`, left: `${i * 15}%`, top: `${i * 12 + 5}%`, background: '#7C3AED', animationDelay: `${i * 0.8}s` }} />
          ))}
        </div>

        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white font-display">MarketPlace Pro</span>
          </Link>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold text-white mb-4 font-display">
            Start your journey<br />
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">with BharatMart today</span>
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Create an account to shop, offer services, or start hiring talent on India's biggest platform.
          </p>
          <div className="space-y-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-violet-400 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-gray-500 text-sm">Trusted by 10M+ users across India</p>
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
            <span className="text-gray-400 text-sm ml-2">4.8/5 rating</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white font-display">MarketPlace Pro</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Join the multi-vendor marketplace platform</p>

          <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input {...register('fullName')} type="text" placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                </div>
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input {...register('email')} type="email" placeholder="john@example.com"
                    readOnly={emailReadOnly}
                    onFocus={() => setEmailReadOnly(false)}
                    autoComplete="new-password"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                <div className="relative flex">
                  <span className="flex items-center px-3 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">🇮🇳 +91</span>
                  <input {...register('phone')} type="tel" placeholder="9876543210" maxLength={10}
                    className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-r-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I want to register as</label>
                <select {...register('role')} 
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all">
                  <option value="CUSTOMER">Customer (Buyer)</option>
                  <option value="SELLER">Seller (Product Vendor)</option>
                  <option value="SERVICE_PROVIDER">Service Expert</option>
                  <option value="FREELANCER">Freelancer (Talent)</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  readOnly={passwordReadOnly}
                  onFocus={() => setPasswordReadOnly(false)}
                  autoComplete="new-password"
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-start gap-2.5 text-sm">
              <input type="checkbox" required id="terms" className="mt-1 rounded border-gray-300 focus:ring-violet-500 text-violet-600" />
              <label htmlFor="terms" className="text-gray-600 dark:text-gray-400">
                I agree to the <Link href="/terms-of-service" className="text-violet-600 font-medium hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-violet-600 font-medium hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 disabled:opacity-70">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign Up <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-600 hover:text-violet-700 font-bold">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}


