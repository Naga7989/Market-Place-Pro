'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Star,
  Settings,
  Sparkles,
  LogOut,
  User
} from 'lucide-react';
import { useAppDispatch, useAppSelector, authActions } from '@/store';
import { useRouter } from 'next/navigation';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/provider/dashboard' },
  { icon: Calendar, label: 'Bookings', href: '/provider/bookings' },
  { icon: Clock, label: 'Schedule', href: '/provider/schedule' },
  { icon: Star, label: 'Reviews', href: '/provider/reviews' },
  { icon: Settings, label: 'Settings', href: '/provider/settings' },
];

export default function ProviderSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    dispatch(authActions.logout());
    router.push('/login');
  };

  const displayName = (user as any)?.fullName || user?.name || 'Service Provider';

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-card border-r border-border/40 h-full flex-shrink-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-border/40">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/10 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-foreground text-sm tracking-tight">Expert Hub</p>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">MarketPlace Pro</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/provider/dashboard' && pathname.startsWith(link.href));
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              }`}
            >
              <Icon className="w-4.5 h-4.5" /> 
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout & Profile Footer */}
      <div className="p-4 border-t border-border/40 space-y-2">
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/45 border border-border/20 shadow-inner">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary font-extrabold text-sm border border-primary/10">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{displayName}</p>
            <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Verified Expert</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
