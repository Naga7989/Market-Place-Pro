'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingBag, Star, TrendingUp,
  DollarSign, Settings, Plus, Trash2, Edit2, Store, Tag, PlusCircle
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  salePrice: number;
  discountPercent: number;
  status: string;
  productType: string;
  isFeatured: boolean;
  category?: { id: number; name: string };
  inventory?: { quantity: number };
}

interface Category {
  id: number;
  name: string;
}

const sidebarLinks = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', href: '/vendor/dashboard' },
  { icon: <Package className="w-5 h-5" />, label: 'Products', href: '/vendor/products', active: true },
  { icon: <ShoppingBag className="w-5 h-5" />, label: 'Orders', href: '/vendor/orders' },
  { icon: <Store className="w-5 h-5" />, label: 'My Store', href: '/vendor/store' },
];

export default function VendorProductsPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states for new product
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, []);

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['vendor-products'],
    queryFn: async () => {
      // In local dev, we fetch the first page of products
      const res = await apiClient.get('/products?size=50');
      return res.data?.data?.content as Product[];
    },
  });

  // Fetch categories (for select dropdown)
  const { data: categoriesData } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories/tree');
      return res.data?.data as Category[];
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async () => {
      if (!categoryId) throw new Error('Please select a category');
      
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const body = {
        name,
        slug,
        sku,
        basePrice,
        salePrice,
        discountPercent: basePrice > salePrice ? ((basePrice - salePrice) / basePrice) * 100 : 0,
        description,
        shortDescription,
        status: 'ACTIVE',
        productType: 'PHYSICAL',
        isFeatured: false,
        isFlashSaleEligible: false,
      };

      return apiClient.post(`/products?categoryId=${categoryId}`, body);
    },
    onSuccess: () => {
      toast.success('Product created successfully!');
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      setShowAddForm(false);
      // Reset form
      setName('');
      setSku('');
      setBasePrice(0);
      setSalePrice(0);
      setDescription('');
      setShortDescription('');
      setCategoryId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create product');
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiClient.delete(`/products/${id}`);
    },
    onSuccess: () => {
      toast.success('Product deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    },
  });

  const products = productsData || [];
  const categories = categoriesData || [];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200/60 h-full">
        <div className="p-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Seller Hub</p>
              <p className="text-xs text-slate-400">MarketPlace Pro</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                link.active
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50'
                  : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Product Inventory</h1>
            <p className="text-sm text-slate-400">Manage and upload products</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-white/80 border border-white/60 rounded-[24px]"></div>
              <div className="h-32 bg-white/80 border border-white/60 rounded-[24px]"></div>
            </div>
          ) : (
            <div className="bg-white/80 border border-white/60 rounded-[24px] shadow-xl backdrop-blur-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-left">Product</th>
                      <th className="px-6 py-4 text-left">SKU</th>
                      <th className="px-6 py-4 text-left">Category</th>
                      <th className="px-6 py-4 text-right">Price</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <span className="text-2xl">📦</span>
                          <div>
                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-slate-400">ID: {product.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-600">{product.sku}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{product.category?.name || 'General'}</td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-bold text-slate-900">{formatPrice(product.salePrice)}</p>
                          {product.basePrice > product.salePrice && (
                            <p className="text-xs text-slate-400 line-through">{formatPrice(product.basePrice)}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 border rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border-emerald-200/60`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => deleteProductMutation.mutate(product.id)}
                              disabled={deleteProductMutation.isPending}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors active:scale-95"
                            >
                              <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-2xl max-w-xl w-full relative z-10 overflow-y-auto max-h-[90vh]"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Product</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. iPhone 15 Pro Max"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-250 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. IPH15-PRO-256"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-250 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Base Price (INR)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-250 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Sale Price (INR)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-250 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Select Category</label>
                <select
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  value={categoryId || ''}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-250 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One line highlight"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-250 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed specs, details, packaging"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-250 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => createProductMutation.mutate()}
                disabled={createProductMutation.isPending}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all"
              >
                {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
