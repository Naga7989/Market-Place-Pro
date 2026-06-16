"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ShoppingCart,
  Bell,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  User,
  Package,
  Calendar,
  Heart,
  Wallet,
  LogOut,
  Store,
  LayoutDashboard,
  Zap,
  Briefcase,
  Home,
  Sparkles,
} from "lucide-react";
import { useAppSelector } from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useNotifications } from "@/hooks/useNotifications";
import { cn, getInitials, formatPrice, getUserRole } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { searchApi } from "@/lib/api";

const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Books",
  "Sports",
  "Toys",
  "Beauty",
  "Grocery",
];

const navLinks = [
  { href: "/products", label: "Products", icon: Package },
  { href: "/services", label: "Services", icon: Home },
  { href: "/freelancers", label: "Freelancers", icon: Briefcase },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { unreadCount } = useNotifications();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [suggestions, setSuggestions] = useState<Array<{ text: string; type: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchApi
        .suggestions(debouncedQuery)
        .then((res: any) => {
          setSuggestions(res.data.data.slice(0, 6));
          setShowSuggestions(true);
        })
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchOpen(false);
    }
  };

  const userMenuItems = [
    { href: "/profile", icon: User, label: "My Profile" },
    { href: "/orders", icon: Package, label: "My Orders" },
    { href: "/bookings", icon: Calendar, label: "My Bookings" },
    { href: "/profile?tab=wishlist", icon: Heart, label: "Wishlist" },
    { href: "/profile?tab=wallet", icon: Wallet, label: "Wallet", badge: user?.walletBalance ? formatPrice(user.walletBalance) : undefined },
    ...(getUserRole(user) === "vendor" ? [{ href: "/vendor/dashboard", icon: Store, label: "Vendor Dashboard" }] : []),
    ...(getUserRole(user) === "admin" ? [{ href: "/admin/dashboard", icon: LayoutDashboard, label: "Admin Panel" }] : []),
    ...(getUserRole(user) === "service_provider" ? [{ href: "/provider/dashboard", icon: Sparkles, label: "Expert Dashboard" }] : []),
    ...(getUserRole(user) === "freelancer" ? [{ href: "/freelancer/dashboard", icon: Briefcase, label: "Freelancer Hub" }] : []),
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
        style={{
          background: isScrolled
            ? "rgba(10, 15, 30, 0.85)"
            : "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-110">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl gradient-text hidden sm:block">
                BharatMart
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="flex-1 max-w-2xl hidden md:block" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative flex">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 px-3 text-sm bg-white/10 border border-white/20 rounded-l-xl text-foreground focus:outline-none cursor-pointer backdrop-blur-sm min-w-[110px]"
                >
                  <option value="All">All</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, services, freelancers..."
                  className="flex-1 h-10 px-4 text-sm bg-white/10 border-y border-white/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-white/15 transition-all"
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                />
                <button
                  type="submit"
                  className="h-10 px-4 gradient-primary rounded-r-xl flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Search className="w-4 h-4 text-white" />
                </button>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-12 left-0 right-0 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      {suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setSearchQuery(suggestion.text);
                            setShowSuggestions(false);
                            router.push(`/products?search=${encodeURIComponent(suggestion.text)}`);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
                        >
                          <Search className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm text-foreground">{suggestion.text}</span>
                          <span className="ml-auto text-xs text-muted-foreground capitalize">
                            {suggestion.type}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Nav Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname?.startsWith(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 ml-auto md:ml-0">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 gradient-primary rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </Link>

              {/* Notifications */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                    className="relative p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notifMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-4 border-b border-border flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">Notifications</h3>
                          <button className="text-xs text-primary hover:underline">Mark all read</button>
                        </div>
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          <p>No new notifications</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        getInitials(user?.name ?? "U")
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-foreground max-w-[80px] truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", userMenuOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-56 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-border">
                          <p className="font-semibold text-sm text-foreground">{user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              <item.icon className="w-4 h-4 text-muted-foreground" />
                              <span>{item.label}</span>
                              {item.badge && (
                                <span className="ml-auto text-xs font-semibold text-emerald-500">{item.badge}</span>
                              )}
                            </Link>
                          ))}
                          <div className="border-t border-border mt-2 pt-2">
                            <button
                              onClick={() => { setUserMenuOpen(false); logout(); }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary text-sm px-4 py-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                    Join Free
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/10 bg-black/40 backdrop-blur-xl"
            >
              <div className="px-4 py-3">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, services..."
                    className="flex-1 h-10 px-4 text-sm bg-white/10 border border-white/20 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                  <button type="submit" className="h-10 px-4 gradient-primary rounded-xl">
                    <Search className="w-4 h-4 text-white" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-white/10 bg-black/60 backdrop-blur-xl"
            >
              <nav className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      pathname?.startsWith(link.href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
