import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | MarketPlace Pro',
    default: 'MarketPlace Pro - Shop, Book & Hire Everything',
  },
  description: 'India\'s #1 multi-vendor marketplace for products, home services, and freelance talent.',
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar cartCount={3} notificationCount={2} isLoggedIn={false} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
