'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingBag, Star, TrendingUp,
  DollarSign, Users, Search, Filter, RefreshCw, ChevronDown,
  Calendar, MapPin, Eye, Edit2, Store, Tag, Settings, ShoppingCart
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import Sidebar from '@/components/layout/Sidebar';

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    sku: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  gstAmount: number;
  totalAmount: number;
  createdAt: string;
  notes: string;
  items: OrderItem[];
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-slate-100 text-slate-700 border border-slate-200/60',
  CONFIRMED: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
  PROCESSING: 'bg-amber-50 text-amber-705 border border-amber-200/60',
  SHIPPED: 'bg-blue-50 text-blue-700 border border-blue-200/60',
  DELIVERED: 'bg-emerald-50 text-emerald-705 border border-emerald-200/60',
  CANCELLED: 'bg-rose-50 text-rose-700 border border-rose-200/60',
};

const statusOptions = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function VendorOrdersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  // Fetch Vendor Orders
  const { data: ordersData, isLoading, error, refetch } = useQuery({
    queryKey: ['vendor-orders'],
    queryFn: async () => {
      const res = await apiClient.get('/orders/vendor');
      return res.data?.data?.content as Order[];
    },
  });

  const orders = ordersData || [];

  // Update Order Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const res = await apiClient.put(`/orders/${orderId}/status`, { status });
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success(`Order status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ['vendor-orders'] });
      // Update selected order view if open
      if (selectedOrder && selectedOrder.id === variables.orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: variables.status } : null);
      }
      setUpdatingOrderId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update order status');
      setUpdatingOrderId(null);
    }
  });

  const handleStatusChange = (orderId: number, status: string) => {
    setUpdatingOrderId(orderId);
    updateStatusMutation.mutate({ orderId, status });
  };

  // Filtering
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/70 border-b border-slate-200/60 backdrop-blur-md flex items-center justify-between px-8 z-10 flex-shrink-0">
          <h1 className="text-xl font-bold text-slate-900 font-display">Orders Management</h1>
          <button
            onClick={() => refetch()}
            className="p-2 rounded-xl text-slate-550 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Search & Filter Bar */}
            <div className="bg-white/80 p-4 rounded-[24px] shadow-xl border border-white/60 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search order no, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-250 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="w-5 h-5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 md:flex-initial px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                >
                  <option value="ALL">All Statuses</option>
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Orders Table/List */}
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
              </div>
            ) : error ? (
              <div className="bg-rose-50 text-rose-605 p-6 rounded-2xl border border-rose-200 text-center">
                <p className="font-semibold mb-2">Failed to load orders</p>
                <p className="text-sm">Please make sure you are logged in as a vendor/seller.</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white/80 rounded-[24px] p-12 text-center border border-white/60 shadow-xl backdrop-blur-md">
                <ShoppingBag className="w-16 h-16 text-slate-350 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No orders found</h3>
                <p className="text-slate-500 text-sm">
                  {searchTerm || statusFilter !== 'ALL' ? 'Try adjusting your filters.' : 'Your store has no orders yet.'}
                </p>
              </div>
            ) : (
              <div className="bg-white/80 rounded-[24px] border border-white/60 shadow-xl backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-450 uppercase tracking-wider">
                        <th className="px-6 py-4">Order Number</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Items</th>
                        <th className="px-6 py-4">Total Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">
                            {order.orderNumber}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-slate-800">{order.user?.fullName || 'Guest'}</p>
                              <p className="text-xs text-slate-400">{order.user?.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4 text-slate-700">
                            {order.items.reduce((acc, item) => acc + item.quantity, 0)} units
                          </td>
                          <td className="px-6 py-4 font-bold text-indigo-650">
                            {formatPrice(order.totalAmount)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[order.status] || statusColors.PENDING}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              {/* Status Update Dropdown */}
                              <div className="relative">
                                <select
                                  disabled={updatingOrderId === order.id}
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                  className="appearance-none pr-8 pl-3 py-1.5 border border-slate-250 bg-white text-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer disabled:opacity-50"
                                >
                                  {statusOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-450 pointer-events-none" />
                              </div>

                              {/* View Details button */}
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-1.5 border border-slate-250 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors active:scale-95"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] w-full max-w-2xl overflow-hidden border border-slate-200 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Order Details</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Order Number: {selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold border border-slate-250 rounded-xl hover:bg-slate-50 text-slate-650 transition-all active:scale-95"
                >
                  Close
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Status Indicator */}
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-[24px] border border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Order Status</span>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${statusColors[selectedOrder.status] || statusColors.PENDING}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block text-right">Payment Status</span>
                    <span className="text-sm font-bold text-slate-900 text-right block mt-1">{selectedOrder.paymentStatus}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50/50 p-4 rounded-[24px] border border-slate-100">
                    <div>
                      <p className="text-slate-400 text-xs">Full Name</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{selectedOrder.user?.fullName || 'Guest'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Email Address</p>
                      <p className="font-semibold text-slate-700 mt-0.5 truncate">{selectedOrder.user?.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-400 text-xs">Phone Number</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{selectedOrder.user?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Ordered Items</h4>
                  <div className="space-y-2.5">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3.5 bg-slate-50/30 rounded-2xl border border-slate-100">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{item.product.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">SKU: {item.product.sku} • {item.quantity} x {formatPrice(item.unitPrice)}</p>
                        </div>
                        <p className="font-bold text-indigo-650">{formatPrice(item.totalPrice)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Summary */}
                <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-650">
                      <span>Discount</span>
                      <span>-{formatPrice(selectedOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>GST (Taxes)</span>
                    <span>{formatPrice(selectedOrder.gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Charges</span>
                    <span>{formatPrice(selectedOrder.deliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-100 pt-3">
                    <span>Total Order Value</span>
                    <span>{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>

                {/* Order Notes */}
                {selectedOrder.notes && (
                  <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 text-sm">
                    <p className="text-amber-800 font-semibold mb-1">Order Notes:</p>
                    <p className="text-amber-700">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

