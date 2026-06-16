'use client';

import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const wishlistItems = [
    { id: 1, name: 'iPhone 15 Pro Max', price: 134900, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
    { id: 3, name: 'Nike Air Max 2024', price: 8995, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 font-display flex items-center gap-3">
          <Heart className="text-violet-600 fill-violet-600 w-6 h-6" /> My Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your Wishlist is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Save items you like to view or purchase them later.</p>
            <Link href="/products" className="px-8 py-3 bg-violet-600 text-white font-bold rounded-xl shadow-md">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-gray-50" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-1">{item.name}</h3>
                    <p className="text-violet-600 dark:text-violet-400 font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-violet-600 text-white rounded-xl text-xs font-semibold hover:bg-violet-750 transition-colors">
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                    <button className="p-2 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 rounded-xl text-gray-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
