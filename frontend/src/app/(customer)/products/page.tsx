'use client';

import { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal, 
  Search, 
  ChevronDown, 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  Package,
  ChevronRight
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatPrice } from '@/lib/utils';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

interface Product {
  id: number;
  name: string;
  salePrice: number;
  basePrice: number;
  discountPercent: number;
  averageRating?: number;
  category?: { name: string };
  images?: ProductImage[];
}

// ─────────────────── Filter Sidebar Component ───────────────────
function FilterSidebar({ 
  filters, 
  onFilterChange, 
  onReset, 
  onClose 
}: {
  filters: Record<string, string | number>;
  onFilterChange: (key: string, value: string | number | null) => void;
  onReset: () => void;
  onClose?: () => void;
}) {
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹2,000', min: 500, max: 2000 },
    { label: '₹2,000 - ₹10,000', min: 2000, max: 10000 },
    { label: '₹10,000 - ₹50,000', min: 10000, max: 50000 },
    { label: 'Above ₹50,000', min: 50000, max: 999999 },
  ];

  const ratings = [4, 3, 2, 1];

  return (
    <div className="w-full space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <h3 className="font-bold text-foreground text-lg flex items-center gap-2.5">
          <SlidersHorizontal className="w-5 h-5 text-primary" /> 
          <span>Filters</span>
        </h3>
        {onClose && (
          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 rounded-xl bg-card border border-border/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => {
            const isActive = filters.minPrice == range.min && filters.maxPrice == range.max;
            return (
              <button
                key={range.label}
                onClick={() => {
                  onFilterChange('minPrice', range.min);
                  onFilterChange('maxPrice', range.max);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${
                  isActive
                    ? 'border-primary/50 bg-primary/5 text-primary shadow-sm shadow-primary/5'
                    : 'border-border/60 bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                <span>{range.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Minimum Rating</h4>
        <div className="space-y-2">
          {ratings.map((rating) => {
            const isActive = filters.minRating == rating;
            return (
              <button
                key={rating}
                onClick={() => onFilterChange('minRating', rating)}
                className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${
                  isActive
                    ? 'border-primary/50 bg-primary/5 text-primary shadow-sm shadow-primary/5'
                    : 'border-border/60 bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-1">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                  {[...Array(5 - rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-muted/30" />
                  ))}
                  <span className="ml-1 text-xs text-muted-foreground/85 font-normal">& up</span>
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Availability</h4>
        <button
          onClick={() => onFilterChange('inStock', filters.inStock == 1 ? 0 : 1)}
          className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${
            filters.inStock == 1
              ? 'border-primary/50 bg-primary/5 text-primary shadow-sm shadow-primary/5'
              : 'border-border/60 bg-card/40 text-muted-foreground hover:border-primary/30'
          }`}
        >
          <span className="text-sm">In Stock Only</span>
          <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-255 ${filters.inStock == 1 ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
            <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-255 ${filters.inStock == 1 ? 'translate-x-3.5' : 'translate-x-0'}`} />
          </div>
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-3 text-primary border border-primary/20 dark:border-primary/30 rounded-xl hover:bg-primary/5 transition-all text-sm font-bold active:scale-[0.98]"
      >
        Clear Filters
      </button>
    </div>
  );
}

// ─────────────────── Product Card Component ───────────────────
function ProductCard({ 
  product, 
  viewMode,
  isWishlisted, 
  toggleWishlist 
}: { 
  product: Product; 
  viewMode: 'grid' | 'list';
  isWishlisted: boolean; 
  toggleWishlist: (p: Product, e: React.MouseEvent) => void;
}) {
  const queryClient = useQueryClient();
  
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post('/cart/items', {
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      toast.success('Added to cart!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add to cart. Please log in.');
    },
  });

  const primaryImage = product.images?.find((img) => img.isPrimary)?.imageUrl || '';

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card border border-border/40 rounded-2xl p-4 flex flex-col sm:flex-row gap-5 shadow-premium-sm hover:shadow-premium-md hover:border-primary/25 transition-all duration-300 group"
      >
        <Link href={`/products/${product.id}`} className="relative block w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-muted/20 flex-shrink-0">
          {primaryImage ? (
            <img 
              src={primaryImage} 
              alt={product.name} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <Package className="w-12 h-12 text-muted-foreground/35 group-hover:scale-108 transition-transform duration-300" />
            </div>
          )}
          {product.discountPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 price-discount">
              -{Math.round(product.discountPercent)}%
            </span>
          )}
          <button
            onClick={(e) => toggleWishlist(product, e)}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-background/80 text-muted-foreground hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </Link>

        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2.5 py-0.5 rounded-md">
                {product.category?.name || 'General'}
              </span>
              {product.averageRating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-xs text-muted-foreground font-bold">{product.averageRating}</span>
                </div>
              )}
            </div>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-bold text-foreground text-base sm:text-lg group-hover:text-primary transition-colors leading-snug line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="price-main text-xl">{formatPrice(product.salePrice)}</span>
              {product.basePrice > product.salePrice && (
                <span className="price-original text-sm">{formatPrice(product.basePrice)}</span>
              )}
            </div>
            
            <button
              onClick={() => addToCartMutation.mutate()}
              disabled={addToCartMutation.isPending}
              className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-md hover:shadow-primary/20"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-premium-sm hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 group"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square bg-muted/20 overflow-hidden">
          {primaryImage ? (
            <img 
              src={primaryImage} 
              alt={product.name} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <Package className="w-12 h-12 text-muted-foreground/35 group-hover:scale-108 transition-transform duration-300" />
            </div>
          )}
          {product.discountPercent > 0 && (
            <span className="absolute top-3 left-3 price-discount">
              -{Math.round(product.discountPercent)}%
            </span>
          )}
          <button
            onClick={(e) => toggleWishlist(product, e)}
            className={`absolute top-3 right-3 w-8.5 h-8.5 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-background/80 text-muted-foreground hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="p-4 flex flex-col justify-between h-[155px]">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded-md">
                {product.category?.name || 'General'}
              </span>
              {product.averageRating && (
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span className="text-[11px] text-muted-foreground font-bold">{product.averageRating}</span>
                </div>
              )}
            </div>
            <h3 className="font-bold text-foreground text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="price-main text-base">{formatPrice(product.salePrice)}</span>
              {product.basePrice > product.salePrice && (
                <span className="price-original text-xs">{formatPrice(product.basePrice)}</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCartMutation.mutate();
              }}
              disabled={addToCartMutation.isPending}
              className="p-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────── Products Content Component ───────────────────
function ProductsContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  const categoryId = searchParams.get('categoryId');
  const categorySlug = searchParams.get('category');
  const query = searchParams.get('q') || searchParams.get('search');

  // Load wishlist from local storage and listen to storage updates
  useEffect(() => {
    const syncWishlist = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistIds(stored.map((item: any) => item.id));
      } catch (err) {}
    };
    syncWishlist();
    window.addEventListener('storage', syncWishlist);
    return () => window.removeEventListener('storage', syncWishlist);
  }, []);

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const index = stored.findIndex((item: any) => item.id === product.id);
      if (index > -1) {
        stored.splice(index, 1);
        toast.success('Removed from wishlist');
      } else {
        stored.push({ id: product.id, name: product.name, price: product.salePrice });
        toast.success('Added to wishlist!');
      }
      localStorage.setItem('wishlist', JSON.stringify(stored));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {}
  };

  const handleFilterChange = (key: string, value: string | number | null) => {
    setFilters(prev => {
      if (value === null || value === 0 || value === '') {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }
      return { ...prev, [key]: value };
    });
    setPage(0);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(0);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['products', { categoryId, categorySlug, query, sortBy, page, ...filters }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: '16',
        sortBy,
        ...(categoryId ? { categoryId } : {}),
        ...(categorySlug ? { categorySlug } : {}),
        ...(query ? { q: query } : {}),
        ...Object.fromEntries(
          Object.entries(filters).map(([k, v]) => [k, v.toString()])
        ),
      });
      const endpoint = query ? `/products/search?${params}` : `/products?${params}`;
      const res = await apiClient.get(endpoint);
      return res.data;
    },
  });

  const products: Product[] = data?.data?.content ?? [];
  const totalPages: number = data?.data?.totalPages ?? 1;
  const totalElements: number = data?.data?.totalElements ?? 0;

  // Render active filter chips
  const activeFilters = Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null);

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-primary transition-colors">Catalog</Link>
          {(query || categoryId || categorySlug) && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-bold">
                {query ? `Search: ${query}` : 'Filtered'}
              </span>
            </>
          )}
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground font-display tracking-tight flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              <span>
                {query ? `Search Results for "${query}"` : (categoryId || categorySlug) ? 'Browse Category' : 'Product Catalog'}
              </span>
            </h1>
            {totalElements > 0 && (
              <p className="text-muted-foreground text-sm mt-2 font-medium">
                We found <span className="text-primary font-bold">{totalElements.toLocaleString()}</span> products matching your criteria
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* Mobile filter button */}
            <button 
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-card border border-border/60 rounded-xl text-sm font-bold text-foreground hover:border-primary/20 hover:bg-primary/5 transition-all shadow-premium-sm"
            >
              <Filter className="w-4 h-4 text-primary" /> 
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-none min-w-[170px]">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-card border border-border/60 rounded-xl text-sm font-bold text-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer shadow-premium-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-border/50 rounded-xl overflow-hidden shadow-premium-sm bg-card">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted/40'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted/40'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips Bar */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-4 rounded-xl bg-card border border-border/40 shadow-premium-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">Active:</span>
            {activeFilters.map(([key, val]) => {
              let displayVal = val;
              if (key === 'minPrice') displayVal = `Min ₹${val}`;
              if (key === 'maxPrice') displayVal = `Max ₹${val}`;
              if (key === 'minRating') displayVal = `★ ${val}+`;
              if (key === 'inStock') displayVal = 'In Stock';

              return (
                <button
                  key={key}
                  onClick={() => handleFilterChange(key, null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all"
                >
                  <span>{displayVal}</span>
                  <X className="w-3 h-3" />
                </button>
              );
            })}
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 ml-auto"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-premium-sm sticky top-24">
              <FilterSidebar 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onReset={handleResetFilters} 
              />
            </div>
          </div>

          {/* Mobile Filter Overlay (Framer Motion Drawer) */}
          <AnimatePresence>
            {showFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                {/* Backdrop blur */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                />
                {/* Drawer */}
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                  className="absolute right-0 top-0 h-full w-80 bg-background border-l border-border/40 p-6 overflow-y-auto shadow-2xl flex flex-col"
                >
                  <FilterSidebar 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                    onReset={handleResetFilters}
                    onClose={() => setShowFilters(false)} 
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Products Catalog Display */}
          <div className="flex-1">
            {isLoading ? (
              /* Shimmer loading list skeleton */
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-5`}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card border border-border/30 rounded-2xl overflow-hidden p-3 space-y-4 animate-pulse">
                    <div className="aspect-square bg-muted/40 rounded-xl shimmer" />
                    <div className="space-y-2.5 px-1 pb-2">
                      <div className="h-3.5 bg-muted/40 rounded w-1/3 shimmer" />
                      <div className="h-4 bg-muted/40 rounded w-3/4 shimmer" />
                      <div className="h-4 bg-muted/40 rounded w-1/2 shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-5`}>
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                      isWishlisted={wishlistIds.includes(product.id)}
                      toggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 pb-6">
                    <button 
                      onClick={() => setPage(p => Math.max(0, p - 1))} 
                      disabled={page === 0}
                      className="px-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm font-bold disabled:opacity-40 hover:border-primary/50 hover:text-primary transition-all active:scale-[0.97]"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setPage(i)}
                        className={`w-10.5 h-10.5 rounded-xl text-sm font-bold transition-all active:scale-[0.95] ${
                          page === i 
                            ? 'bg-primary text-white shadow-md shadow-primary/20' 
                            : 'border border-border/50 bg-card hover:border-primary/50 hover:text-primary'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
                      disabled={page >= totalPages - 1}
                      className="px-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm font-bold disabled:opacity-40 hover:border-primary/50 hover:text-primary transition-all active:scale-[0.97]"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Premium Empty State */
              <div className="text-center py-20 bg-card border border-border/40 rounded-3xl p-8 max-w-lg mx-auto shadow-premium-sm">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No Products Found</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                  We couldn't find any products matching your active filters or query. Try resetting filters or searching for something else.
                </p>
                <button 
                  onClick={handleResetFilters} 
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20 active:scale-97"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 animate-pulse">Loading Catalog...</span>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
