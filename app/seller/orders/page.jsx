'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'seller') {
            setUserData(userDoc.data());
            await loadOrders(user.uid);
          } else {
            router.push('/seller/login');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        router.push('/seller/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadOrders = async (sellerId) => {
    try {
      console.log('=== ORDER LOADING DEBUG ===');
      console.log('Loading orders for seller:', sellerId);
      console.log('Current user:', auth.currentUser?.uid);
      
      // First, try to get all documents from sellerOrders collection to debug
      console.log('Fetching all seller orders for debugging...');
      const allOrdersQuery = collection(db, 'sellerOrders');
      const allOrdersSnapshot = await getDocs(allOrdersQuery);
      
      console.log('Total orders in sellerOrders collection:', allOrdersSnapshot.docs.length);
      
      if (allOrdersSnapshot.docs.length === 0) {
        console.log('❌ No orders found in sellerOrders collection at all');
        setOrders([]);
        return;
      }
      
      // Log all orders with their seller IDs
      const allOrders = allOrdersSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Order document:', {
          id: doc.id,
          sellerId: data.sellerId,
          buyerId: data.buyerId,
          orderId: data.orderId,
          status: data.status,
          createdAt: data.createdAt
        });
        return {
          id: doc.id,
          sellerId: data.sellerId,
          ...data
        };
      });
      
      const uniqueSellerIds = [...new Set(allOrders.map(order => order.sellerId))];
      console.log('All unique seller IDs found in orders:', uniqueSellerIds);
      console.log('Current seller ID to match:', sellerId);
      console.log('Seller ID type:', typeof sellerId);
      
      // Check for exact matches and similar matches
      const exactMatches = allOrders.filter(order => order.sellerId === sellerId);
      console.log('Exact matches found:', exactMatches.length);
      
      const similarMatches = allOrders.filter(order => 
        String(order.sellerId).includes(String(sellerId)) || 
        String(sellerId).includes(String(order.sellerId))
      );
      console.log('Similar matches found:', similarMatches.length);
      
      // Filter orders for this specific seller
      const sellerOrders = exactMatches;
      console.log('Final orders for current seller:', sellerOrders.length);
      
      if (sellerOrders.length === 0) {
        console.log('❌ No orders found for seller:', sellerId);
        console.log('Available seller IDs:', uniqueSellerIds);
        console.log('Check if your seller account was created properly');
        
        // Additional debugging - check user document
        try {
          const userDoc = await getDoc(doc(db, 'users', sellerId));
          if (userDoc.exists()) {
            console.log('User document exists:', userDoc.data());
          } else {
            console.log('❌ No user document found for seller ID:', sellerId);
          }
        } catch (userError) {
          console.error('Error checking user document:', userError);
        }
      } else {
        console.log('✅ Found orders for seller:', sellerOrders.length);
      }
      
      // Sort orders by timestamp or createdAt
      sellerOrders.sort((a, b) => {
        const timeA = a.timestamp || new Date(a.createdAt || 0).getTime();
        const timeB = b.timestamp || new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      
      setOrders(sellerOrders);
      console.log('=== END ORDER LOADING DEBUG ===');
      
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const orderRef = doc(db, 'sellerOrders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      );
      
      alert(`Order status updated to: ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'New Order' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' },
      preparing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Preparing' },
      ready: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Ready for Pickup' },
      dispatched: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Dispatched' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">🏺</span>
          </div>
          <div className="text-xl font-semibold text-gray-700">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Main Content - Full Width */}
      <div className="transition-all duration-300">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => router.push('/seller/dashboard')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2"
                  >
                    ← Back to Dashboard
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-600">Manage your customer orders and deliveries</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{orders.length} total orders</p>
                <p className="text-xs text-gray-500">
                  {orders.filter(order => order.status === 'pending').length} pending orders
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Debug Information */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="mb-6 bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
                <p className="text-sm text-yellow-700">
                  Current User ID: {auth.currentUser?.uid || 'Not logged in'}
                </p>
                <p className="text-sm text-yellow-700">
                  Orders found: {orders.length}
                </p>
                <Button
                  onClick={() => loadOrders(auth.currentUser?.uid)}
                  className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-4 py-2"
                >
                  Refresh Orders
                </Button>
              </CardContent>
            </Card>
          )}

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="shadow-lg border border-gray-200">
                  <CardHeader className="bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">
                          Order #{order.orderId?.split('_')[1] || order.id}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Placed on {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <div className="mt-2 text-lg font-bold text-green-600">
                          ₹{order.orderSummary?.total || 0}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Customer Information */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">📞 Customer Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><span className="font-medium">Name:</span> {order.buyerDetails?.name || 'N/A'}</p>
                          <p><span className="font-medium">Phone:</span> {order.buyerDetails?.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Address:</span></p>
                          <p className="text-gray-700">{order.shippingAddress || order.buyerDetails?.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">📦 Ordered Items</h3>
                      <div className="space-y-3">
                        {(order.items || []).map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 bg-white border rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {item.images && item.images[0] ? (
                                <img 
                                  src={item.images[0]} 
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-gray-400 text-xl">🎨</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.title || 'Product'}</h4>
                              <p className="text-sm text-gray-600 line-clamp-1">{item.description || 'No description'}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                                  {item.category}
                                </span>
                                <div className="text-right">
                                  <p className="text-sm font-medium">₹{item.price} × {item.quantity}</p>
                                  <p className="text-lg font-bold text-green-600">₹{item.totalPrice}</p>
                                </div>
                              </div>
                              {item.materials && item.materials.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Materials: {item.materials.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mb-6 p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">💰 Payment Summary</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Items ({order.orderSummary?.totalQuantity || 0})</span>
                          <span>₹{order.orderSummary?.subtotal || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Fee</span>
                          <span>₹{order.orderSummary?.deliveryFee || 0}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>Platform Fee (5%)</span>
                          <span>-₹{order.orderSummary?.platformFee || 0}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Your Earnings</span>
                          <span className="text-green-600">
                            ₹{(order.orderSummary?.total || 0) - (order.orderSummary?.platformFee || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Instructions */}
                    <div className="mb-6 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                      <h3 className="font-semibold text-amber-800 mb-2">🚚 Next Steps</h3>
                      {order.status === 'pending' && (
                        <p className="text-amber-700 text-sm">
                          <strong>New Order Received!</strong> Please confirm this order and start preparing the items. 
                          Contact your nearby delivery partner to arrange pickup once ready.
                        </p>
                      )}
                      {order.status === 'confirmed' && (
                        <p className="text-amber-700 text-sm">
                          Order confirmed! Please start preparing the items and contact your delivery partner.
                        </p>
                      )}
                      {order.status === 'preparing' && (
                        <p className="text-amber-700 text-sm">
                          Items are being prepared. Contact your delivery partner to schedule pickup.
                        </p>
                      )}
                      {order.status === 'ready' && (
                        <p className="text-amber-700 text-sm">
                          Items are ready! Please hand over to your delivery partner for dispatch.
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            disabled={updating}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            ✅ Confirm Order
                          </Button>
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            disabled={updating}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            ❌ Cancel Order
                          </Button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          disabled={updating}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          🔨 Start Preparing
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          disabled={updating}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          📦 Mark as Ready
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'dispatched')}
                          disabled={updating}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          🚛 Mark as Dispatched
                        </Button>
                      )}
                      
                      {/* Contact Customer Button */}
                      {order.buyerDetails?.phone && (
                        <Button
                          onClick={() => window.open(`tel:${order.buyerDetails.phone}`)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          📞 Call Customer
                        </Button>
                      )}
                    </div>

                    {/* Delivery Instructions */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">
                        <strong>Delivery Partner Info:</strong> Contact local delivery services like Dunzo, Porter, or local courier services. 
                        Estimated delivery: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN') : 'Not specified'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-600 mb-6">
                  When customers place orders for your products, they will appear here.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/seller/products')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 mr-3"
                  >
                    Add More Products
                  </Button>
                  <Button
                    onClick={() => loadOrders(auth.currentUser?.uid)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
                  >
                    Refresh Orders
                  </Button>
                </div>
                
                {/* Debug info for no orders */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
                  <h4 className="font-semibold text-gray-700 mb-2">Debug Information:</h4>
                  <p className="text-sm text-gray-600">User ID: {auth.currentUser?.uid}</p>
                  <p className="text-sm text-gray-600">Role: {userData?.role}</p>
                  <p className="text-sm text-gray-600">Shop Name: {userData?.shopName || 'Not set'}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;
