'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BuyerSidebar from '@/components/buyersidebar';

const BuyerDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            
            // Check if this is actually a buyer account
            if (data.role !== 'buyer') {
              alert('This account is not registered as a buyer.');
              await signOut(auth);
              router.push('/buyer/login');
              return;
            }
            
            setUserData(data);
            
            // Load featured products
            try {
              const productsQuery = query(
                collection(db, 'products'),
                where('status', '==', 'active'),
                orderBy('createdAt', 'desc'),
                limit(6)
              );
              const productsSnapshot = await getDocs(productsQuery);
              const products = productsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              setFeaturedProducts(products);
            } catch (productError) {
              console.log('No products found or error loading products:', productError);
              setFeaturedProducts([]);
            }
            
            // Load recent orders (if any)
            try {
              const ordersQuery = query(
                collection(db, 'orders'),
                where('buyerId', '==', user.uid),
                orderBy('createdAt', 'desc'),
                limit(5)
              );
              const ordersSnapshot = await getDocs(ordersQuery);
              const orders = ordersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              setRecentOrders(orders);
            } catch (orderError) {
              console.log('No orders found or error loading orders:', orderError);
              setRecentOrders([]);
            }
            
          } else {
            alert('User profile not found. Please contact support.');
            await signOut(auth);
            router.push('/buyer/login');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          alert('Error loading dashboard. Please try again.');
        }
      } else {
        router.push('/buyer/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Sidebar */}
      <BuyerSidebar userData={userData} />

      {/* Main Content */}
      <div className="pl-80 transition-all duration-300">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {userData?.name}!</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">3</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-lg font-bold text-green-600">₹2,450</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 mb-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                <span className="mr-3">🛍️</span>
                Discover Amazing Handcrafted Products
              </h2>
              <p className="text-xl text-gray-700 mb-6">Connect with talented artisans from across India</p>
              <div className="flex justify-center space-x-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all">
                  Browse Products
                </button>
                <button className="bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50 px-6 py-3 rounded-xl font-semibold transition-all">
                  Book a Session
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Total Orders</h3>
                    <p className="text-2xl font-bold text-green-600">{recentOrders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Wishlist Items</h3>
                    <p className="text-2xl font-bold text-blue-600">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Reviews Given</h3>
                    <p className="text-2xl font-bold text-purple-600">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Sessions Booked</h3>
                    <p className="text-2xl font-bold text-orange-600">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Products */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Featured Products</h3>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                View All Products
              </Button>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <Card key={product.id} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      {product.images && product.images[0] && (
                        <div className="relative">
                          <img 
                            src={product.images[0]} 
                            alt={product.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">No products available yet</h4>
                  <p className="text-gray-600">Check back soon for amazing handcrafted products!</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Orders */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h3>
            
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Card key={order.id} className="shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(-8)}</h4>
                          <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">₹{order.total}</p>
                          <span className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                            {order.status || 'Processing'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h4>
                  <p className="text-gray-600 mb-4">Start shopping to see your orders here!</p>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;

