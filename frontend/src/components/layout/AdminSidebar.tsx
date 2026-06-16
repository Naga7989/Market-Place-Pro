'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Settings,
  Store,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Admin Panel', href: '/admin/dashboard' },
  { icon: Users, label: 'User Directory', href: '/admin/users' },
  { icon: ShieldCheck, label: 'Vendor KYC Hub', href: '/admin/vendors' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-card border-r border-border/40 h-full flex-shrink-0">
      {/* Admin Logo Section */}
      <div className="p-6 border-b border-border/40">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/10 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-foreground text-sm tracking-tight">Admin Hub</p>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">MarketPlace Pro</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/admin/dashboard' && pathname.startsWith(link.href));
          
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

      {/* Admin Profile Footer */}
      <div className="p-4 border-t border-border/40">
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/45 border border-border/20 shadow-inner">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-destructive/10 to-primary/10 flex items-center justify-center text-destructive font-extrabold text-sm border border-destructive/10">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">Super Admin</p>
            <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Control Panel</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
