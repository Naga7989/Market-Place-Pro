'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useEffect } from 'react';

interface OrderItem {
  id: number;
  product: { name: string };
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {


  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await apiClient.get('/orders');
      return res.data?.data?.content as Order[];
    },
  });

  const orders = ordersData || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 animate-pulse font-display">Loading orders catalog...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#F8FAFC] dark:bg-[#0F172A] px-4">
        <p className="text-red-650 font-bold mb-4">Failed to load orders. Please login.</p>
        <Link 
          href="/login" 
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all shadow-md"
        >
          Login Account
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2.5xl md:text-3.5xl font-black text-slate-900 dark:text-slate-100 mb-8 font-display tracking-tight flex items-center gap-3">
          <ShoppingBag className="text-indigo-600 w-8 h-8" />
          <span>My Orders</span>
          {orders.length > 0 && (
            <span className="text-xs font-black text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full uppercase tracking-wider">
              {orders.length} Placed
            </span>
          )}
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[32px] p-12 text-center shadow-xl shadow-slate-100/50 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mx-auto mb-5">
              <Package className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 font-display">No Orders Placed Yet</h3>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">You haven't purchased any products or booked any services yet.</p>
            <Link 
              href="/products" 
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all inline-block text-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/60 dark:border-slate-800/60 rounded-[24px] p-6 shadow-xl shadow-slate-100/40 hover:shadow-2xl hover:border-indigo-100 transition-all duration-300"
              >
                {/* Header info */}
                <div className="flex justify-between items-start flex-wrap gap-4 pb-4.5 border-b border-slate-100 text-xs md:text-sm font-bold text-slate-500">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Order Number</p>
                    <p className="text-slate-800 font-extrabold">#{order.orderNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Date Placed</p>
                    <p className="text-slate-700 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Total Amount</p>
                    <p className="text-indigo-600 font-black">{formatPrice(order.totalAmount)}</p>
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="py-4 space-y-2 font-medium text-slate-650 text-xs md:text-sm leading-relaxed">
                  {order.items?.slice(0, 2).map((item) => (
                    <p key={item.id} className="truncate">
                      {item.product?.name} <span className="text-slate-400 text-xs font-semibold">({item.quantity} units)</span>
                    </p>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-xs text-indigo-650 font-bold">+ {order.items.length - 2} more items</p>
                  )}
                </div>

                {/* Footer action */}
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-750 transition-colors uppercase tracking-wider"
                  >
                    <span>Track Shipment & View Details</span> 
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
