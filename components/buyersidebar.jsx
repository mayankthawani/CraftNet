'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const BuyerSidebar = ({ userData }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/buyer/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      )
    },
    {
      id: 'browse',
      name: 'Browse Products',
      href: '/buyer/browse',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'session',
      name: 'Book a Session',
      href: '/buyer/book-session',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      badge: 'New'
    },
    {
      id: 'orders',
      name: 'My Orders',
      href: '/buyer/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      id: 'Cart',
      name: 'Cart',
      href: '/buyer/cart',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    
    {
      id: 'live-sessions',
      name: 'Live Sessions',
      href: '/buyer/live-sessions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v10a2 2 0 002 2h6a2 2 0 002-2V7H7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 9h6m-6 4h6m-3 4h.01" />
        </svg>
      ),
      badge: 'Live'
    },
    {
      id: 'messages',
      name: 'Messages',
      href: '/buyer/messages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      id: 'profile',
      name: 'Profile Settings',
      href: '/buyer/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  const isActive = (href) => pathname === href;

  return (
    <div className={`bg-white shadow-xl rounded-2xl transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'} h-[calc(100vh-2rem)] fixed left-4 top-4 z-50`}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏺</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">CraftNet</h2>
                <p className="text-sm text-gray-500">Buyer Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && userData && (
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {userData.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData.email || userData.phone}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${isActive(item.href) 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <div className={`
              ${isActive(item.href) ? 'text-white' : 'text-gray-500 group-hover:text-orange-500'}
              transition-colors duration-200
            `}>
              {item.icon}
            </div>
            
            {!isCollapsed && (
              <>
                <span className="font-medium">{item.name}</span>
                {item.badge && (
                  <span className={`
                    px-2 py-1 text-xs font-bold rounded-full ml-auto
                    ${item.badge === 'New' ? 'bg-green-100 text-green-800' : 
                      item.badge === 'Live' ? 'bg-red-100 text-red-800 animate-pulse' : 
                      'bg-blue-100 text-blue-800'}
                  `}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
            
            {/* Active indicator */}
            {isActive(item.href) && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
            text-red-600 hover:bg-red-50 hover:text-red-700 group
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default BuyerSidebar;
