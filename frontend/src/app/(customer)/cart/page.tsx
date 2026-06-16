'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ChevronRight, 
  Shield, 
  Truck, 
  Package, 
  ArrowLeft,
  Star,
  CheckCircle,
  ShoppingBag,
  Sparkles,
  X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatPrice } from '@/lib/utils';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartItem {
  id: number;
  product: { 
    id: number; 
    name: string; 
    salePrice: number; 
    discountPercent: number; 
    images?: { imageUrl: string; isPrimary: boolean }[];
    category?: { name: string };
  };
  quantity: number;
  unitPrice: number;
}

const RECOMMENDED_PRODUCTS = [
  {
    id: 1,
    name: 'Logitech MX Master 3S Wireless Mouse',
    price: 9495,
    originalPrice: 10995,
    discount: 13,
    rating: 4.8,
    reviews: 1240,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop&q=60',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Keychron K2 Wireless Mechanical Keyboard',
    price: 7499,
    originalPrice: 8999,
    discount: 16,
    rating: 4.7,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=60',
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Sony WH-1000XM4 Noise Canceling Headphones',
    price: 19990,
    originalPrice: 24990,
    discount: 20,
    rating: 4.9,
    reviews: 3210,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=60',
    category: 'Audio'
  },
  {
    id: 4,
    name: 'Minimalist Cork Dual-Sided Desk Mat',
    price: 999,
    originalPrice: 1999,
    discount: 50,
    rating: 4.5,
    reviews: 450,
    image: 'https://images.unsplash.com/photo-1632292224971-0d45778b3af0?w=300&auto=format&fit=crop&q=60',
    category: 'Office'
  }
];

export default function CartPage() {
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);



  // Fetch cart
  const { data: cartData, isLoading, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await apiClient.get('/cart');
      return res.data?.data;
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      return apiClient.put(`/cart/items/${itemId}`, { quantity });
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return apiClient.delete(`/cart/items/${itemId}`);
    },
    onSuccess: () => {
      toast.success('Item removed from cart');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  });

  // Add recommended product to cart
  const addRecommendedMutation = useMutation({
    mutationFn: async (productId: number) => {
      return apiClient.post('/cart/items', {
        productId,
        quantity: 1,
      });
    },
    onSuccess: () => {
      toast.success('Recommended product added to cart!');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add item. Please log in.');
    }
  });

  const applyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));
    if (couponCode === 'SAVE10') {
      setAppliedCoupon({ code: 'SAVE10', discount: 100 });
      toast.success('Coupon applied! You saved ₹100');
    } else {
      toast.error('Invalid or expired coupon code');
    }
    setApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 animate-pulse font-display">Loading your cart...</span>
        </div>
      </div>
    );
  }

  const cart = cartData?.cart;
  const items: CartItem[] = cart?.items || [];

  // Calculate pricing backup details locally
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryThreshold = 499;
  const deliveryCharge = subtotal >= deliveryThreshold || subtotal === 0 ? 0 : 49;
  const gst = Math.round(subtotal * 0.18);
  const couponDiscount = appliedCoupon?.discount ?? 0;
  const total = subtotal + deliveryCharge + gst - couponDiscount;

  // Free shipping progress variables
  const amountToFreeShipping = deliveryThreshold - subtotal;
  const freeShippingProgress = Math.min(100, (subtotal / deliveryThreshold) * 100);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Empty Cart layout */}
          <div className="text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[32px] p-8 md:p-14 shadow-2xl shadow-slate-100/50 max-w-lg mx-auto mb-16">
            <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
              <ShoppingCart className="w-10 h-10 text-indigo-650" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3 font-display tracking-tight">Your Cart is Empty</h2>
            <p className="text-slate-550 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Explore our wide variety of premium items, services, and experts to start building your cart.
            </p>
            <Link 
              href="/products" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm px-8 py-4 rounded-2xl inline-flex items-center gap-2.5 shadow-lg shadow-indigo-150 transition-all active:scale-[0.97]"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Recommended products carousel */}
          <div className="border-t border-slate-200 pt-12">
            <div className="flex items-center gap-2.5 mb-8">
              <Sparkles className="w-5.5 h-5.5 text-indigo-650" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Trending Recommendations</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {RECOMMENDED_PRODUCTS.map((prod) => (
                <div key={prod.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group flex flex-col justify-between">
                  <div className="relative aspect-square bg-slate-50 dark:bg-slate-950 overflow-hidden">
                    <img src={prod.image} alt={prod.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-2 left-2 bg-indigo-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                      -{prod.discount}% OFF
                    </span>
                  </div>
                  
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider">{prod.category}</span>
                      <h4 className="font-extrabold text-slate-800 text-xs leading-relaxed mt-2 line-clamp-2">{prod.name}</h4>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] text-slate-500 font-bold">{prod.rating}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-extrabold text-sm">{formatPrice(prod.price)}</span>
                        <span className="text-slate-400 line-through text-[10px]">{formatPrice(prod.originalPrice)}</span>
                      </div>
                      <button
                        onClick={() => addRecommendedMutation.mutate(prod.id)}
                        disabled={addRecommendedMutation.isPending}
                        className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all active:scale-90"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Title */}
        <h1 className="text-2.5xl md:text-3.5xl font-black text-slate-900 mb-8 font-display tracking-tight flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-indigo-600" />
          <span>Shopping Cart</span>
          <span className="text-xs font-black text-indigo-650 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {items.reduce((s, i) => s + i.quantity, 0)} Items
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const primaryImage = item.product.images?.find(img => img.isPrimary)?.imageUrl || '';
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -60, height: 0, padding: 0, marginBottom: 0 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-5 shadow-xl shadow-slate-100/50 flex gap-4 md:gap-5"
                  >
                    {/* Image Block */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {primaryImage ? (
                        <img src={primaryImage} alt={item.product.name} className="object-cover w-full h-full" />
                      ) : (
                        <Package className="w-8 h-8 text-slate-300" />
                      )}
                    </div>

                    {/* Metadata and Controls */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <span className="text-[10px] font-extrabold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md tracking-wider">
                            {item.product.category?.name || 'Catalog'}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm md:text-base leading-snug line-clamp-2">
                          {item.product.name}
                        </h3>
                        
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="text-slate-900 font-extrabold text-sm md:text-base">{formatPrice(item.unitPrice)}</span>
                          {item.product.discountPercent > 0 && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {item.product.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Controls Row */}
                      <div className="mt-4 flex items-center justify-between gap-3 pt-3.5 border-t border-slate-100">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 shadow-inner">
                          <button 
                            onClick={() => updateQuantityMutation.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                            disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                            className="p-2 hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700 disabled:opacity-40"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-slate-800">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantityMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                            disabled={updateQuantityMutation.isPending}
                            className="p-2 hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                          <span className="font-black text-indigo-600 text-sm md:text-base">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                          <button 
                            onClick={() => removeItemMutation.mutate(item.id)}
                            disabled={removeItemMutation.isPending}
                            className="p-2.5 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Back Button */}
            <div className="bg-white/80 border border-white/60 rounded-[20px] p-4 shadow-sm flex items-center justify-between">
              <Link href="/products" className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-indigo-650 transition-colors uppercase tracking-wider">
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/70 dark:border-slate-800/70 rounded-[24px] p-6 md:p-8 shadow-xl shadow-slate-150/40 sticky top-24 space-y-6">
              
              {/* Header */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800 font-display">Order Summary</h3>

              {/* Free Shipping Progress Bar */}
              {subtotal < deliveryThreshold ? (
                <div className="space-y-2.5 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-300">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Add {formatPrice(amountToFreeShipping)} more for FREE delivery</span>
                    <Truck className="w-4.5 h-4.5" />
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${freeShippingProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <CheckCircle className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>Your order qualifies for FREE Delivery!</span>
                </div>
              )}

              {/* Calculations */}
              <div className="space-y-3.5 text-sm font-bold text-slate-500">
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
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      Coupon ({appliedCoupon?.code})
                    </span>
                    <span className="font-black">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="border-t border-slate-100 pt-4.5">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-extrabold text-slate-900 text-sm">Grand Total</span>
                  <span className="text-2.5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Coupon Field */}
              <div className="pt-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Apply Promo Code</label>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-700">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      Active: {appliedCoupon.code}
                    </span>
                    <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-red-650 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SAVE10"
                      className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none placeholder:text-slate-400"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!couponCode || applyingCoupon}
                      className="px-4.5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-[0.96]"
                    >
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {!appliedCoupon && (
                  <p className="text-[10px] text-slate-455 mt-1.5 font-bold">Use code <span className="text-indigo-600 font-extrabold">SAVE10</span> for ₹100 flat discount.</p>
                )}
              </div>

              {/* Checkout CTA */}
              <Link 
                href="/checkout"
                className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-[right_center] text-white font-extrabold rounded-2xl active:scale-[0.99] transition-all duration-500 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                <span>Proceed to Checkout</span>
                <ChevronRight className="w-5 h-5" />
              </Link>

              {/* Trust parameters */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                {[
                  { icon: <Shield className="w-4 h-4 text-emerald-600" />, text: 'Secure 256-bit SSL transaction gateway' },
                  { icon: <Truck className="w-4 h-4 text-indigo-600" />, text: 'Free dispatch on orders above ₹499' },
                  { icon: <Package className="w-4 h-4 text-indigo-600" />, text: 'Hassle-free 7-day return policy' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-[11px] font-bold text-slate-455 leading-tight">
                    {icon}
                    <span>{text}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
