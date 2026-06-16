'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  ClipboardList, 
  CheckCircle2, 
  Circle, 
  CreditCard, 
  Lock, 
  Shield, 
  Check 
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface OrderItem {
  id: number;
  product: { id: number; name: string };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  deliveryCharges: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: string;
  shippingAddress: Address;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = params.id;



  // Fetch order details
  const { data: orderData, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await apiClient.get(`/orders/${orderId}`);
      return res.data?.data as Order;
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post(`/orders/${orderId}/cancel`);
    },
    onSuccess: () => {
      toast.success('Order cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    },
  });

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

  // Create Razorpay payment session mutation
  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(`/payments/razorpay/create/${orderId}`);
      return res.data?.data;
    },
    onSuccess: async (data) => {
      const isMock = data.keyId === 'rzp_test_MOCK_KEY' || data.keyId === 'rzp_test_PLACEHOLDER' || !data.keyId;
      if (isMock) {
        toast.success('Mock Payment Gateway: Simulating processing...', { icon: '💳' });
        setTimeout(() => {
          verifyPaymentMutation.mutate({
            razorpay_order_id: data.razorpayOrderId,
            razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(2, 11),
            razorpay_signature: 'mock_signature_approved',
          });
        }, 1500);
        return;
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load Razorpay SDK. Please check your network connection.');
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'MarketPlace Pro',
        description: `Secure Payment for Order #${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          verifyPaymentMutation.mutate({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: orderData?.shippingAddress?.fullName || '',
          contact: orderData?.shippingAddress?.phone || '',
        },
        theme: {
          color: '#6366F1',
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment checkout cancelled.');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    },
  });

  // Verify Razorpay payment signature mutation
  const verifyPaymentMutation = useMutation({
    mutationFn: async (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
      return apiClient.post('/payments/razorpay/verify', payload);
    },
    onSuccess: () => {
      toast.success('Payment verified and order confirmed! 🎉');
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Payment verification failed');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 animate-pulse font-display">Loading order information...</span>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A] text-center px-4">
        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2 font-display">Order Not Found</h3>
        <button 
          onClick={() => router.push('/orders')} 
          className="px-6 py-3 bg-indigo-605 text-white font-extrabold rounded-xl shadow-md transition-all hover:bg-indigo-700"
        >
          Back to Order Directory
        </button>
      </div>
    );
  }

  const order = orderData;
  const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back navigation */}
        <button
          onClick={() => router.push('/orders')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </button>

        {/* Order details header banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2.5xl md:text-3.5xl font-black text-slate-900 dark:text-slate-100 font-display tracking-tight leading-tight">
              Order Details
            </h1>
            <p className="text-slate-550 dark:text-slate-400 text-xs md:text-sm mt-1">
              Order Number: <strong className="text-indigo-600 font-extrabold">#{order.orderNumber}</strong> • Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
            </p>
          </div>
          <div className={`self-start sm:self-center text-xs font-extrabold px-4.5 py-2 rounded-full uppercase tracking-wider ${
            order.status === 'DELIVERED'
              ? 'bg-emerald-50 text-emerald-700'
              : order.status === 'CANCELLED'
              ? 'bg-red-50 text-red-700'
              : 'bg-indigo-50 text-indigo-700'
          }`}>
            Status: {order.status}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Main info */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Step 1: Progress Tracker */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 md:p-8 shadow-xl shadow-slate-100/40">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-6 font-display">Tracking Timeline</h3>
              
              {order.status === 'CANCELLED' ? (
                <div className="p-4 bg-red-50 border border-red-100 text-red-750 rounded-2xl text-xs font-bold text-center">
                  🚫 This shipment has been cancelled.
                </div>
              ) : (
                <div className="relative flex justify-between items-center w-full px-1">
                  {/* Line connecting circles */}
                  <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-700"
                      style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center z-10 relative">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCompleted
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 text-slate-200" />}
                        </div>
                        <span
                          className={`text-[9px] font-black mt-2 tracking-wider ${
                            isCurrent
                              ? 'text-indigo-600'
                              : isCompleted
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 2: Items list */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 md:p-8 shadow-xl shadow-slate-100/40 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4 font-display">
                <Package className="w-5 h-5 text-indigo-600" /> Items in Shipment
              </h3>
              
              <div className="divide-y divide-slate-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-4 flex justify-between items-start gap-4 hover:bg-slate-50/30 transition-colors px-1 rounded-xl">
                    <div className="min-w-0">
                      <Link 
                        href={`/products/${item.product?.id}`} 
                        className="font-extrabold text-sm text-slate-900 hover:text-indigo-600 line-clamp-2 leading-relaxed"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="text-xs font-semibold text-slate-450 mt-1">
                        {formatPrice(item.unitPrice)} x {item.quantity} units
                      </p>
                    </div>
                    <span className="font-extrabold text-sm text-slate-900 flex-shrink-0 mt-0.5">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary sidebar */}
          <div className="space-y-6">
            {/* Delivery address */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/40">
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4 font-display">
                <MapPin className="w-4 h-4 text-indigo-600" /> Shipping Destination
              </h4>
              <div className="text-xs md:text-sm space-y-1.5 font-medium text-slate-600 leading-relaxed">
                <p className="font-extrabold text-slate-900">{order.shippingAddress?.fullName}</p>
                <p>
                  {order.shippingAddress?.addressLine1}
                  {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                </p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - <span className="font-bold text-slate-800">{order.shippingAddress?.pincode}</span>
                </p>
                <div className="border-t border-slate-100 pt-2.5 mt-2.5 font-bold text-slate-500">
                  Phone: <span className="text-slate-800 font-extrabold">{order.shippingAddress?.phone}</span>
                </div>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/40 space-y-4">
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-display">
                <CreditCard className="w-4 h-4 text-indigo-600" /> Transaction details
              </h4>
              
              <div className="text-sm space-y-3.5 font-bold text-slate-500">
                <div className="flex justify-between items-center">
                  <span>Method</span>
                  <span className="text-slate-900 font-black">
                    {order.paymentMethod === 'RAZORPAY' ? 'Online (Razorpay)' : 'Cash on Delivery'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Payment Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    order.paymentStatus === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-700'
                      : order.paymentStatus === 'PENDING'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {order.paymentStatus === 'COMPLETED' ? (
                      <>
                        <Check className="w-3 h-3" /> PAID
                      </>
                    ) : (
                      order.paymentStatus
                    )}
                  </span>
                </div>

                {order.paymentMethod === 'RAZORPAY' && order.paymentStatus === 'PENDING' && order.status !== 'CANCELLED' && (
                  <div className="pt-3.5 border-t border-slate-100 space-y-3">
                    <button
                      onClick={() => createPaymentMutation.mutate()}
                      disabled={createPaymentMutation.isPending || verifyPaymentMutation.isPending}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-[right_center] text-white font-extrabold rounded-2xl active:scale-[0.99] transition-all duration-500 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                    >
                      {createPaymentMutation.isPending || verifyPaymentMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Securing Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4.5 h-4.5" />
                          <span>Pay Now {formatPrice(order.totalAmount)}</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5 leading-normal">
                      <Shield className="w-4 h-4 text-emerald-600" /> 
                      <span>PCI-DSS Secured by Razorpay</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Total breakdown */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/40 space-y-4">
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-display">
                <ClipboardList className="w-4 h-4 text-indigo-600" /> Invoice Breakdown
              </h4>
              
              <div className="space-y-3 text-sm font-bold text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-black">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="text-slate-900 font-black">{formatPrice(order.deliveryCharges)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span className="text-slate-900 font-black">{formatPrice(order.taxAmount)}</span>
                </div>
                <div className="border-t border-slate-100 pt-3.5 flex justify-between items-baseline">
                  <span className="font-extrabold text-slate-900">Grand Total</span>
                  <span className="text-2.5xl font-black text-indigo-600">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              {/* Cancel Button */}
              {['PENDING', 'CONFIRMED'].includes(order.status) && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to cancel this order?')) {
                      cancelOrderMutation.mutate();
                    }
                  }}
                  disabled={cancelOrderMutation.isPending}
                  className="w-full mt-4 py-3.5 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-extrabold rounded-xl transition-all active:scale-[0.98]"
                >
                  {cancelOrderMutation.isPending ? 'Cancelling Shipment...' : 'Request Cancellation'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
