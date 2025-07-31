'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LeftSidebar from '@/components/LeftSidebar';

export default function SellerLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Routes that don't need the sidebar (login, signup, onboarding)
  const noSidebarRoutes = ['/seller/login', '/seller/signup', '/seller/onboarding'];
  const showSidebar = !noSidebarRoutes.includes(pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        // Redirect to login if trying to access protected routes
        if (!noSidebarRoutes.includes(pathname)) {
          router.push('/seller/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🏺</span>
          </div>
          <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  // Show sidebar layout for authenticated users on dashboard routes
  if (authenticated && showSidebar) {
    return (
      <div className="flex min-h-screen bg-stone-50 p-4">
        <div className="fixed left-4 top-4 bottom-4 w-72 z-50">
          <LeftSidebar />
        </div>
        <main className="flex-1 ml-80 transition-all duration-300">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Show full-width layout for login, signup, onboarding pages
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
