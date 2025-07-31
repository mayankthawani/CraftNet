'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);

            // Check if user needs to complete onboarding
            if (!data.profileComplete) {
              router.push('/seller/onboarding');
              return;
            }
          } else {
            // User document doesn't exist, redirect to onboarding
            router.push('/seller/onboarding');
            return;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          alert('Error loading user data. Please try again.');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">🏺</span>
          </div>
          <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="space-y-8">
      {/* Welcome Header with Rural Theme */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 rounded-3xl shadow-lg p-8 border border-orange-200">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <span className="text-white font-bold text-4xl">🏺</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Welcome back, {userData.name}!</h1>
              <p className="text-gray-600 text-xl">Your Artisan Dashboard</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">✅ Profile Complete</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">🏆 Premium Member</span>
              </div>
            </div>
          </div>
          <div className="text-center lg:text-right">
            <div className="text-3xl font-bold text-orange-600">₹15,240</div>
            <div className="text-gray-600">This Month's Earnings</div>
            <div className="text-sm text-green-600 mt-1">↗️ +23% Growth</div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards for Rural Artisans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-green-100">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-600 font-medium">+18% this week</div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900">₹45,680</p>
            <p className="text-gray-600">Total Earnings</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span className="mr-1">📅</span>
              <span>Last 6 months</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-600 font-medium">+5 new products</div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-gray-600">Total Products</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span className="mr-1">⭐</span>
              <span>4.8 average rating</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-100">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🛍️</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-purple-600 font-medium">12 pending</div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-gray-600">Total Orders</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span className="mr-1">🚚</span>
              <span>98% successful delivery</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-orange-100">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-orange-600 font-medium">+42 new followers</div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900">2,840</p>
            <p className="text-gray-600">Customer Views</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span className="mr-1">📍</span>
              <span>Orders from 15 states</span>
            </div>
          </div>
        </div>
      </div>

      {/* Artisan Profile & Skills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-2">🏪</span>
              Shop Information
            </h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Edit</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-xl">
                <span className="text-sm text-orange-700 font-medium">Shop Name</span>
                <p className="text-lg font-semibold text-gray-900">{userData.shopName || 'Not set yet'}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <span className="text-sm text-green-700 font-medium">Craft Category</span>
                <p className="text-lg font-semibold text-gray-900">{userData.category || 'Not set yet'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <span className="text-sm text-blue-700 font-medium">Address</span>
                <p className="text-lg font-semibold text-gray-900">{userData.address || 'Not set yet'}</p>
                <p className="text-sm text-gray-600">Pin Code: {userData.pincode || 'N/A'}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <span className="text-sm text-purple-700 font-medium">UPI ID</span>
                <p className="text-lg font-semibold text-gray-900">{userData.upiId || 'Not set yet'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">🎨</span>
            Skills
          </h3>
          <div className="space-y-4">
            {userData.skills && userData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, index) => (
                  <span key={index} className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-3 py-2 rounded-full text-sm font-medium border border-orange-200">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added yet</p>
            )}
            
            <div className="mt-6 p-4 bg-amber-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">About You</h4>
              <p className="text-gray-700 leading-relaxed">{userData.about || 'Tell us about your craft...'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Rural Artisans */}
      <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg p-8 border border-orange-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          <span className="mr-2">⚡</span>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="group bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 hover:scale-105">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📸</div>
            <div className="text-lg font-bold">Add New Product</div>
            <div className="text-sm opacity-90">Upload your craft</div>
          </button>
          
          <button className="group bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 hover:scale-105">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📋</div>
            <div className="text-lg font-bold">View Orders</div>
            <div className="text-sm opacity-90">Manage orders</div>
          </button>
          
          <button className="group bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 hover:scale-105">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎥</div>
            <div className="text-lg font-bold">Live Session</div>
            <div className="text-sm opacity-90">Start teaching</div>
          </button>
          
          <button className="group bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 hover:scale-105">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🤖</div>
            <div className="text-lg font-bold">AI Assistant</div>
            <div className="text-sm opacity-90">Get help</div>
          </button>
        </div>
      </div>

      {/* Success Tips for Rural Artisans */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">💡</span>
          Success Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">📱</div>
            <h4 className="font-bold text-gray-900 mb-2">Take Better Photos</h4>
            <p className="text-gray-600 text-sm">Use good lighting for product photos. This increases sales by 70%.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">💬</div>
            <h4 className="font-bold text-gray-900 mb-2">Engage with Customers</h4>
            <p className="text-gray-600 text-sm">Reply quickly to messages. Happy customers return for more purchases.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="font-bold text-gray-900 mb-2">Regular Updates</h4>
            <p className="text-gray-600 text-sm">Add new products weekly. This attracts more customers to your shop.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
