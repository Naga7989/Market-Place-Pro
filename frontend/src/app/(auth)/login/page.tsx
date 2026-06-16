'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Phone, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector, authActions } from '@/store';

// ─────────────────── Schemas ───────────────────
const emailLoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const otpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
});

const otpVerifySchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type EmailLoginData = z.infer<typeof emailLoginSchema>;
type OtpData = z.infer<typeof otpSchema>;
type OtpVerifyData = z.infer<typeof otpVerifySchema>;

// ─────────────────── OTP Input ───────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const inputs = Array(6).fill(0);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;
    const newValue = value.split('');
    newValue[index] = digit;
    onChange(newValue.join('').slice(0, 6));

    if (digit && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {inputs.map((_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-violet-500 focus:outline-none transition-colors"
        />
      ))}
    </div>
  );
}

// ─────────────────── Main Login Page ───────────────────
export default function LoginPage() {
  const [tab, setTab] = useState<'email' | 'otp'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [emailReadOnly, setEmailReadOnly] = useState(true);
  const [passwordReadOnly, setPasswordReadOnly] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Email form
  const emailForm = useForm<EmailLoginData>({ resolver: zodResolver(emailLoginSchema) });
  const phoneForm = useForm<OtpData>({ resolver: zodResolver(otpSchema) });

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleEmailLogin = async (data: EmailLoginData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
        toast.success('Welcome back! 🎉');
        router.push('/dashboard');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch {
      toast.error('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (data: OtpData) => {
    setOtpLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: data.phone, purpose: 'LOGIN' }),
      });
      const result = await res.json();
      if (result.success) {
        setPhone(data.phone);
        setOtpSent(true);
        setCountdown(30);
        toast.success('OTP sent to your mobile!');
      } else {
        toast.error(result.message || 'Failed to send OTP');
      }
    } catch {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) { toast.error('Enter the complete 6-digit OTP'); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
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
        toast.success('Logged in successfully! 🎉');
        router.push('/dashboard');
      } else {
        toast.error(result.message || 'Invalid OTP');
      }
    } catch {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`;
  };

  const features = [
    '10M+ products from 50K+ verified sellers',
    'Book 25K+ service professionals',
    'Hire top freelancers & experts',
    'Secure payments with Razorpay & UPI',
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
            Everything you need,<br />
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">all in one place</span>
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join millions of Indians who shop, book services, and hire talent every day.
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
          <p className="text-gray-500 text-sm">Trusted by 10M+ customers across India</p>
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
            <span className="text-gray-400 text-sm ml-2">4.8/5 from 2M+ reviews</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white font-display">MarketPlace Pro</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">Welcome back!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Login to your account to continue</p>

          {/* Tab switcher */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-8">
            {([['email', 'Email & Password'], ['otp', 'Mobile OTP']] as const).map(([value, label]) => (
              <button key={value} onClick={() => { setTab(value); setOtpSent(false); setOtp(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === value ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'email' ? (
              <motion.form key="email" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                onSubmit={emailForm.handleSubmit(handleEmailLogin)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input {...emailForm.register('email')} type="email" placeholder="you@example.com"
                      readOnly={emailReadOnly}
                      onFocus={() => setEmailReadOnly(false)}
                      autoComplete="username"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                  </div>
                  {emailForm.formState.errors.email && <p className="text-red-500 text-sm mt-1">{emailForm.formState.errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input {...emailForm.register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                      readOnly={passwordReadOnly}
                      onFocus={() => setPasswordReadOnly(false)}
                      autoComplete="current-password"
                      className="w-full pl-11 pr-11 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {emailForm.formState.errors.password && <p className="text-red-500 text-sm mt-1">{emailForm.formState.errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" /> Remember me
                  </label>
                  <Link href="/forgot-password" className="text-violet-600 hover:text-violet-700 font-medium">Forgot password?</Link>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 disabled:opacity-70">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login <ArrowRight className="w-4 h-4" /></>}
                </button>
              </motion.form>
            ) : (
              <motion.div key="otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                {!otpSent ? (
                  <form onSubmit={phoneForm.handleSubmit(handleSendOtp)}>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                      <div className="relative flex">
                        <span className="flex items-center px-3 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">🇮🇳 +91</span>
                        <input {...phoneForm.register('phone')} type="tel" placeholder="9876543210" maxLength={10}
                          className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-r-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                      </div>
                      {phoneForm.formState.errors.phone && <p className="text-red-500 text-sm mt-1">{phoneForm.formState.errors.phone.message}</p>}
                    </div>
                    <button type="submit" disabled={otpLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 disabled:opacity-70">
                      {otpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-8 h-8 text-violet-600" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">OTP sent to <span className="font-bold text-gray-900 dark:text-white">+91 {phone}</span></p>
                    </div>
                    <OtpInput value={otp} onChange={setOtp} />
                    <button onClick={handleVerifyOtp} disabled={isLoading || otp.length < 6}
                      className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 disabled:opacity-70">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify & Login <CheckCircle className="w-4 h-4" /></>}
                    </button>
                    <div className="text-center">
                      {countdown > 0 ? (
                        <p className="text-sm text-gray-500">Resend OTP in <span className="text-violet-600 font-bold">{countdown}s</span></p>
                      ) : (
                        <button onClick={() => phoneForm.handleSubmit(handleSendOtp)()} className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
            <div className="relative flex justify-center"><span className="bg-white dark:bg-gray-900 px-3 text-gray-500 text-sm">or continue with</span></div>
          </div>

          {/* Google Login */}
          <button onClick={handleGoogleLogin}
            className="w-full py-3 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-violet-600 hover:text-violet-700 font-bold">Sign up free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Import missing icons
import { ShoppingBag, Star } from 'lucide-react';
