'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Search, ShoppingCart, Bell, User, Menu, X, ChevronDown,
  Package, Heart, MapPin, LogOut, Settings, LayoutDashboard, Sun, Moon,
  Laptop, Shirt, Home, Sparkles, BookOpen, Activity
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAppDispatch, useAppSelector, authActions } from '@/store';
import { getUserRole } from '@/lib/utils';

const navLinks = [
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Freelancers', href: '/freelancers' },
  { label: 'Projects', href: '/projects' },
];

const categories = [
  { id: 1, name: "Electronics", slug: "electronics", desc: "Mobiles, Laptops & Tech", icon: Laptop },
  { id: 2, name: "Fashion", slug: "fashion", desc: "Apparel, Shoes & Styling", icon: Shirt },
  { id: 3, name: "Home & Kitchen", slug: "home-kitchen", desc: "Furniture, Decor & Dining", icon: Home },
  { id: 4, name: "Beauty", slug: "beauty", desc: "Cosmetics, Skincare & Fragrance", icon: Sparkles },
  { id: 5, name: "Books", slug: "books", desc: "Novels, Textbooks & Reads", icon: BookOpen },
  { id: 6, name: "Sports", slug: "sports", desc: "Fitness, Gear & Outdoor", icon: Activity },
];

interface NavbarProps {
  cartCount?: number;
  notificationCount?: number;
  isLoggedIn?: boolean;
  user?: { fullName: string; email: string; avatarUrl?: string; roles?: string[] };
}

export function Navbar({ cartCount = 0, notificationCount = 0, isLoggedIn = false, user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux store integration
  const { user: reduxUser, isAuthenticated: reduxIsAuthenticated } = useAppSelector((state) => state.auth);
  const reduxCartItems = useAppSelector((state) => state.cart.items);
  const reduxUnreadNotifications = useAppSelector((state) => state.notifications.unreadCount);
  
  const finalIsLoggedIn = reduxIsAuthenticated || isLoggedIn;
  const finalUser = (reduxUser ? {
    fullName: (reduxUser as any).fullName || reduxUser.name || '',
    email: reduxUser.email || '',
    avatarUrl: (reduxUser as any).avatarUrl || (reduxUser as any).avatar,
    roles: (reduxUser as any).roles
  } : user) as { fullName: string; email: string; avatarUrl?: string; roles?: string[] } | undefined;

  const liveCartCount = reduxCartItems.reduce((acc, item) => acc + item.quantity, 0) || cartCount;
  const liveNotificationCount = reduxUnreadNotifications || notificationCount;

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [wishlistCount, setWishlistCount] = useState(0);

  // Sync dark mode configuration on mount
  useEffect(() => {
    setMounted(true);
    
    // Sync wishlist count from localStorage
    if (typeof window !== 'undefined') {
      try {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistCount(storedWishlist.length);
      } catch (err) {
        setWishlistCount(0);
      }
    }
  }, []);

  // Poll for wishlist updates periodically
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      try {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (storedWishlist.length !== wishlistCount) {
          setWishlistCount(storedWishlist.length);
        }
      } catch (err) {}
    }, 1500);
    return () => clearInterval(interval);
  }, [mounted, wishlistCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    dispatch(authActions.logout());
    setUserMenuOpen(false);
    router.push('/login');
  };

  const toggleDark = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-border/50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md shadow-primary/10 group-hover:scale-105 transition-transform duration-200">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground font-heading hidden sm:block tracking-tight">
                MarketPlace<span className="text-primary">Pro</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {/* Categories Trigger */}
              <div className="relative">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200"
                >
                  <span>Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {categoriesOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setCategoriesOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 mt-2 w-[480px] bg-card dark:glass-dark border border-border rounded-2xl shadow-xl p-4 grid grid-cols-2 gap-2 z-50"
                      >
                        <div className="col-span-2 pb-2 border-b border-border mb-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Popular Categories</span>
                        </div>
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <Link
                              key={cat.id}
                              href={`/products?category=${cat.slug}`}
                              onClick={() => setCategoriesOpen(false)}
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted text-foreground transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-medium text-foreground">{cat.name}</div>
                                <div className="text-[11px] text-muted-foreground">{cat.desc}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 rounded-xl text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                >
                  {pathname.startsWith(link.href) && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={pathname.startsWith(link.href) ? "text-primary font-semibold" : ""}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Search bar - desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search products, services..."
                  className="w-full pl-10 pr-4 py-2 bg-muted/40 dark:bg-muted/20 border border-border/40 hover:border-border/80 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 text-sm text-foreground placeholder:text-muted-foreground rounded-xl transition-all duration-300 outline-none"
                />
              </form>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 ml-auto">
              {/* Mobile search */}
              <button onClick={() => setSearchOpen(true)} className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Dark mode toggle */}
              <button onClick={toggleDark} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
                {mounted && resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {liveCartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {liveCartCount > 9 ? '9+' : liveCartCount}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              {mounted && finalIsLoggedIn && (
                <button className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
                  <Bell className="w-5 h-5" />
                  {liveNotificationCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {liveNotificationCount > 9 ? '9+' : liveNotificationCount}
                    </span>
                  )}
                </button>
              )}

              {/* User menu / Auth buttons */}
              {mounted && finalIsLoggedIn && finalUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl hover:bg-muted/40 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow">
                      {finalUser.avatarUrl ? (
                        <img src={finalUser.avatarUrl} alt={finalUser.fullName} className="w-full h-full object-cover" />
                      ) : (
                        finalUser.fullName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-foreground max-w-[90px] truncate">
                      {finalUser.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-card dark:glass-dark border border-border rounded-2xl shadow-xl py-1 overflow-hidden z-50"
                        >
                          <div className="px-4 py-2.5 border-b border-border">
                            <p className="font-semibold text-foreground text-sm leading-none">{finalUser.fullName}</p>
                            <p className="text-muted-foreground text-[11px] truncate mt-1">{finalUser.email}</p>
                          </div>

                          <div className="p-1.5">
                            {[
                              getUserRole(finalUser) === 'vendor'
                                ? { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Vendor Dashboard', href: '/vendor/dashboard' }
                                : getUserRole(finalUser) === 'admin'
                                ? { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Admin Panel', href: '/admin/dashboard' }
                                : getUserRole(finalUser) === 'service_provider'
                                ? { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Expert Dashboard', href: '/provider/dashboard' }
                                : getUserRole(finalUser) === 'freelancer'
                                ? { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Freelancer Hub', href: '/freelancer/dashboard' }
                                : { icon: <User className="w-4 h-4" />, label: 'My Profile', href: '/profile' },
                              { icon: <Package className="w-4 h-4" />, label: 'My Orders', href: '/orders' },
                              { icon: <Heart className="w-4 h-4" />, label: 'Wishlist', href: '/wishlist' },
                              { icon: <MapPin className="w-4 h-4" />, label: 'Addresses', href: '/addresses' },
                              { icon: <Settings className="w-4 h-4" />, label: 'Settings', href: '/settings' },
                            ].map(({ icon, label, href }) => (
                              <Link
                                key={href}
                                href={href}
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                              >
                                <span className="text-muted-foreground">{icon}</span>
                                <span>{label}</span>
                                </Link>
                            ))}
                          </div>

                          <div className="border-t border-border p-1.5">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link href="/login" className="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary text-sm px-4 py-2 rounded-xl">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-card overflow-hidden"
            >
              <div className="container mx-auto px-4 py-3 space-y-1">
                {/* Categories Trigger inside Mobile Menu */}
                <div>
                  <button
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <span>Categories</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileCategoriesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-6 pr-2 py-1 space-y-1"
                      >
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <Link
                              key={cat.id}
                              href={`/products?category=${cat.slug}`}
                              onClick={() => { setMobileOpen(false); setMobileCategoriesOpen(false); }}
                              className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            >
                              <Icon className="w-4 h-4 text-primary" />
                              <span>{cat.name}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      pathname.startsWith(link.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-16 px-4"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, services, freelancers..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border text-foreground text-lg placeholder:text-muted-foreground outline-none shadow-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-4 py-4 bg-card border border-border rounded-2xl text-foreground shadow-2xl hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
