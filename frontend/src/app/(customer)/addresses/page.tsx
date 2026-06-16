'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddressesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/profile?tab=addresses');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600"></div>
    </div>
  );
}
