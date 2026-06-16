'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ChevronRight, 
  Plus, 
  MapPin, 
  CheckCircle,
  ShoppingCart,
  Shield,
  ArrowLeft,
  Check,
  Lock,
  Package
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Address {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressType: string;
  isDefault: boolean;
}

interface CartItem {
  id: number;
  product: { id: number; name: string; salePrice: number; discountPercent: number; };
  quantity: number;
  unitPrice: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');
  
  // Checkout Progress State - dynamic indicator
  const [currentStep, setCurrentStep] = useState<2 | 3>(2);

  // Quick inline address state
  const [showAddForm, setShowAddForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');



  // Fetch cart
  const { data: cartData, isLoading: loadingCart } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await apiClient.get('/cart');
      return res.data?.data;
    },
  });

  // Fetch addresses
  const { data: addressesData, isLoading: loadingAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await apiClient.get('/users/addresses');
      const list = res.data?.data as Address[];
      if (list && list.length > 0) {
        const defaultAddr = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId(defaultAddr.id);
      }
      return list;
    },
  });

  // Sync step changes based on selected address
  useEffect(() => {
    if (selectedAddressId) {
      setCurrentStep(3); // Shipping complete, now on payment
    } else {
      setCurrentStep(2); // Still selecting shipping
    }
  }, [selectedAddressId]);

  // Add address mutation
  const addAddressMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post('/users/addresses', {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        addressType: 'HOME',
        isDefault: true,
      });
    },
    onSuccess: (res) => {
      toast.success('Address added successfully!');
      const newAddress = res.data?.data as Address;
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setSelectedAddressId(newAddress.id);
      setShowAddForm(false);
      // Reset form
      setFullName('');
      setPhone('');
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('');
      setPincode('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add address');
    },
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAddressId) throw new Error('Please select a shipping address');
      return apiClient.post('/orders', {
        addressId: selectedAddressId,
        paymentMethod,
      });
    },
    onSuccess: (res) => {
      toast.success('Order placed successfully!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      const order = res.data?.data;
      router.push(`/orders/${order.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to place order');
    },
  });

  const cart = cartData?.cart;
  const items: CartItem[] = cart?.items || [];
  const addresses: Address[] = addressesData || [];

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 animate-pulse font-display">Securing Checkout details...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A] text-center px-4 py-20">
        <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-6 shadow-inner animate-bounce">
          <ShoppingCart className="w-10 h-10 text-indigo-600" />
        </div>
        <h3 className="text-3xl font-extrabold text-slate-900 mb-3 font-display tracking-tight">Your Cart is Empty</h3>
        <p className="text-slate-550 text-sm max-w-sm mb-8 mx-auto leading-relaxed">Add high-quality products or services to your cart before proceeding to checkout.</p>
        <button 
          onClick={() => router.push('/products')} 
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm px-8 py-4 rounded-2xl flex items-center gap-2.5 mx-auto shadow-lg shadow-indigo-150 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          <span>Browse All Products</span>
        </button>
      </div>
    );
  }

  // Calculate pricing backup details if summary not returned
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryCharge = subtotal >= 499 ? 0 : 49;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + deliveryCharge + gst;

  // Step indicator data
  const steps = [
    { id: 1, label: 'Cart', icon: ShoppingCart, completed: true, active: false },
    { id: 2, label: 'Shipping', icon: MapPin, completed: !!selectedAddressId, active: !selectedAddressId },
    { id: 3, label: 'Payment', icon: CreditCard, completed: false, active: !!selectedAddressId }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Checkout Steps Progress Bar */}
        <div className="mb-12 max-w-2xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 p-6 rounded-[24px] shadow-xl shadow-slate-100/40">
          <div className="flex items-center justify-between relative px-2">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            
            {/* Active connection line */}
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: selectedAddressId ? '100%' : '50%' }}
            />

            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      step.completed
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : step.active
                        ? 'bg-white border-indigo-600 text-indigo-600 ring-4 ring-indigo-50 shadow-md'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    {step.completed ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span 
                    className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2.5 transition-colors ${
                      step.completed || step.active ? 'text-indigo-900 font-extrabold' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secure Checkout Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-150">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Lock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">Secure Checkout</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Your transaction is fully encrypted and secure</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
            <span>SSL Secured</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Address Selection & Payment Toggles */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Shipping Address Panel */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 md:p-8 shadow-xl shadow-slate-100/50">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-150 flex items-center gap-3 font-display">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center text-sm font-black">1</span>
                  <span>Shipping Address</span>
                </h3>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-650 hover:text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" /> 
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {showAddForm ? (
                /* Styled Address Form */
                <div className="space-y-4 p-6 border border-indigo-100 rounded-2xl bg-indigo-50/10 shadow-sm">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 mb-2">New Shipping Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Recipient Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 placeholder-slate-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Contact Phone Number</label>
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 placeholder-slate-400"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Address Line 1</label>
                    <input
                      type="text"
                      placeholder="Street name, Building No, Area"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      placeholder="Apartment, Suite, Landmark"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">City</label>
                      <input
                        type="text"
                        placeholder="Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 placeholder-slate-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">State</label>
                      <input
                        type="text"
                        placeholder="Maharashtra"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 placeholder-slate-400"
                      />
                    </div>
                    <div className="space-y-1 col-span-2 md:col-span-1">
                      <label className="text-xs font-bold text-slate-500">Pincode</label>
                      <input
                        type="text"
                        placeholder="400001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 placeholder-slate-400"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end pt-3">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-5 py-3 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => addAddressMutation.mutate()}
                      disabled={addAddressMutation.isPending}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-95 disabled:opacity-50"
                    >
                      {addAddressMutation.isPending ? 'Saving...' : 'Save & Select Address'}
                    </button>
                  </div>
                </div>
              ) : loadingAddresses ? (
                /* Loading skeletal state */
                <div className="space-y-3">
                  <div className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
                  <div className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <p className="text-sm text-slate-500 mb-5">You haven't saved any shipping addresses yet.</p>
                  <button 
                    onClick={() => setShowAddForm(true)} 
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all hover:bg-indigo-700 shadow-md shadow-indigo-100"
                  >
                    Create New Address
                  </button>
                </div>
              ) : (
                /* Address cards list */
                <div className="grid gap-4">
                  {addresses.map((address) => {
                    const isSelected = selectedAddressId === address.id;
                    return (
                      <label
                        key={address.id}
                        className={`flex items-start gap-4 p-5 border rounded-2xl cursor-pointer transition-all duration-300 relative bg-white ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-lg shadow-indigo-50/40'
                            : 'border-slate-100 hover:border-slate-250 hover:bg-slate-50/40 shadow-sm'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingAddress"
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-sm flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900">{address.fullName}</span>
                            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wide">
                              {address.addressType}
                            </span>
                            {address.isDefault && (
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wide">
                                Default
                              </span>
                            )}
                          </div>
                          
                          <p className="text-slate-600 text-xs md:text-sm mt-2 leading-relaxed">
                            {address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}
                            <br />
                            {address.city}, {address.state} - <span className="font-bold text-slate-800">{address.pincode}</span>
                          </p>
                          
                          <div className="text-[11px] text-slate-400 mt-3 font-semibold flex items-center gap-1">
                            <span>Phone:</span>
                            <span className="text-slate-700">{address.phone}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white absolute top-5 right-5 shadow-md shadow-indigo-200">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 2: Payment Method Choice Blocks */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 md:p-8 shadow-xl shadow-slate-100/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-150 flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 font-display">
                <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center text-sm font-black">2</span>
                <span>Payment Method</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                
                {/* COD Choice card */}
                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`relative flex items-center gap-4.5 p-6 border rounded-2xl cursor-pointer transition-all duration-300 bg-white ${
                    paymentMethod === 'COD'
                      ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-lg shadow-indigo-50/40'
                      : 'border-slate-100 hover:border-slate-250 hover:bg-slate-50/40 shadow-sm'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="text-indigo-600 focus:ring-indigo-500 mr-2.5"
                  />
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-slate-900 text-sm">Cash on Delivery (COD)</p>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">Pay in cash or UPI when your package is delivered</p>
                  </div>
                  {paymentMethod === 'COD' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </label>

                {/* Razorpay Online Choice Card */}
                <label
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`relative flex items-center gap-4.5 p-6 border rounded-2xl cursor-pointer transition-all duration-300 bg-white ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-lg shadow-indigo-50/40'
                      : 'border-slate-100 hover:border-slate-250 hover:bg-slate-50/40 shadow-sm'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="text-indigo-600 focus:ring-indigo-500 mr-2.5"
                  />
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-slate-900 text-sm">Secure Online Payment</p>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">UPI, Credit/Debit Cards, NetBanking, Wallet (Razorpay)</p>
                  </div>
                  {paymentMethod === 'RAZORPAY' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/70 dark:border-slate-800/70 rounded-[24px] p-6 md:p-8 shadow-xl shadow-slate-150/40 sticky top-24 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800 font-display">Order Summary</h3>
                <span className="text-[11px] font-bold text-indigo-600 tracking-wider uppercase bg-indigo-50 dark:bg-indigo-955/20 px-2.5 py-1 rounded-md mt-2 inline-block">
                  Secure Checkout
                </span>
              </div>

              {/* Items List inside card */}
              <div className="space-y-4 max-h-52 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-xs gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-bold line-clamp-2 leading-relaxed">
                        {item.product.name}
                      </p>
                      <p className="text-slate-400 font-semibold mt-1">
                        Qty: <span className="text-indigo-600">{item.quantity}</span> • {formatPrice(item.unitPrice)}/unit
                      </p>
                    </div>
                    <span className="text-slate-900 font-black flex-shrink-0 mt-0.5">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="border-t border-slate-100 pt-4 space-y-3.5 text-sm font-bold text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className={deliveryCharge === 0 ? 'text-emerald-600 font-extrabold' : 'text-slate-900 font-black'}>
                    {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span className="text-slate-900 font-black">{formatPrice(gst)}</span>
                </div>
              </div>

              {/* Total display */}
              <div className="border-t border-slate-150 pt-4 flex justify-between items-baseline">
                <span className="font-extrabold text-slate-900 text-sm">Grand Total</span>
                <span className="text-2.5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={() => placeOrderMutation.mutate()}
                disabled={!selectedAddressId || placeOrderMutation.isPending}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-[right_center] text-white font-extrabold rounded-2xl active:scale-[0.99] transition-all duration-500 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{placeOrderMutation.isPending ? 'Processing Secure Order...' : 'Place Secure Order'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Security Lock Parameter */}
              <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 justify-center leading-normal pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
                <span>256-Bit SSL Encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

