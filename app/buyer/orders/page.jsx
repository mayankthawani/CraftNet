'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BuyerSidebar from '@/components/buyersidebar';

const BuyerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const router = useRouter();

  const statusFilters = [
    { value: 'all', label: 'All Orders', count: 0 },
    { value: 'confirmed', label: 'Confirmed', count: 0 },
    { value: 'preparing', label: 'Being Prepared', count: 0 },
    { value: 'ready', label: 'Ready for Pickup', count: 0 },
    { value: 'dispatched', label: 'Dispatched', count: 0 },
    { value: 'delivered', label: 'Delivered', count: 0 }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'buyer') {
            setUserData(userDoc.data());
            await loadBuyerOrders(user.uid);
          } else {
            router.push('/buyer/login');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        router.push('/buyer/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadBuyerOrders = async (buyerId) => {
    try {
      console.log('Loading orders for buyer:', buyerId);
      
      // Get orders from buyerOrders collection
      const buyerOrdersQuery = query(
        collection(db, 'buyerOrders'),
        where('userId', '==', buyerId)
      );
      
      const buyerOrdersSnapshot = await getDocs(buyerOrdersQuery);
      console.log('Found buyer orders:', buyerOrdersSnapshot.docs.length);
      
      if (buyerOrdersSnapshot.docs.length === 0) {
        setOrders([]);
        return;
      }
      
      // Get corresponding seller orders for status updates
      const sellerOrdersQuery = query(
        collection(db, 'sellerOrders'),
        where('buyerId', '==', buyerId)
      );
      
      const sellerOrdersSnapshot = await getDocs(sellerOrdersQuery);
      console.log('Found seller orders:', sellerOrdersSnapshot.docs.length);
      
      // Create a map of seller orders by parent order ID
      const sellerOrdersMap = {};
      sellerOrdersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.parentOrderId) {
          if (!sellerOrdersMap[data.parentOrderId]) {
            sellerOrdersMap[data.parentOrderId] = [];
          }
          sellerOrdersMap[data.parentOrderId].push({
            id: doc.id,
            ...data
          });
        }
      });
      
      // Process buyer orders and merge with seller order statuses
      const ordersList = buyerOrdersSnapshot.docs.map(doc => {
        const buyerOrder = { id: doc.id, ...doc.data() };
        const relatedSellerOrders = sellerOrdersMap[buyerOrder.orderId] || [];
        
        // Determine overall order status based on seller orders
        let overallStatus = 'pending';
        let statusDetails = [];
        
        if (relatedSellerOrders.length > 0) {
          const statuses = relatedSellerOrders.map(so => so.status);
          const uniqueStatuses = [...new Set(statuses)];
          
          // Logic to determine overall status
          if (statuses.every(s => s === 'delivered')) {
            overallStatus = 'delivered';
          } else if (statuses.some(s => s === 'dispatched')) {
            overallStatus = 'dispatched';
          } else if (statuses.some(s => s === 'ready')) {
            overallStatus = 'ready';
          } else if (statuses.some(s => s === 'preparing')) {
            overallStatus = 'preparing';
          } else if (statuses.some(s => s === 'confirmed')) {
            overallStatus = 'confirmed';
          }
          
          // Create status details for each seller
          statusDetails = relatedSellerOrders.map(so => ({
            sellerId: so.sellerId,
            status: so.status,
            items: so.items,
            orderSummary: so.orderSummary,
            estimatedDelivery: so.estimatedDelivery
          }));
        }
        
        return {
          ...buyerOrder,
          overallStatus,
          statusDetails,
          sellerOrders: relatedSellerOrders
        };
      });
      
      // Sort by creation date (most recent first)
      ordersList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      
      console.log('Processed orders:', ordersList.length);
      setOrders(ordersList);
      
    } catch (error) {
      console.error('Error loading buyer orders:', error);
      setOrders([]);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Order Placed', icon: '⏳' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed by Seller', icon: '✅' },
      preparing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Being Prepared', icon: '🔨' },
      ready: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Ready for Pickup', icon: '📦' },
      dispatched: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Dispatched', icon: '🚛' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered', icon: '🎉' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled', icon: '❌' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        <span className="mr-2">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getStatusCounts = () => {
    const counts = {};
    orders.forEach(order => {
      const status = order.overallStatus || 'pending';
      counts[status] = (counts[status] || 0) + 1;
      counts.all = (counts.all || 0) + 1;
    });
    return counts;
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.overallStatus === selectedStatus);

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">🏺</span>
          </div>
          <div className="text-xl font-semibold text-gray-700">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Sidebar */}
      <BuyerSidebar userData={userData} />

      {/* Main Content */}
      <div className="pl-80 transition-all duration-300">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600">Track your orders and delivery status</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{filteredOrders.length} orders</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Status Filter Tabs */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {statusFilters.map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedStatus(filter.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedStatus === filter.value
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                    {statusCounts[filter.value] && (
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedStatus === filter.value ? 'bg-white text-orange-500' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {statusCounts[filter.value]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
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
                        {getStatusBadge(order.overallStatus)}
                        <div className="mt-2 text-lg font-bold text-green-600">
                          ₹{order.orderSummary?.total || 0}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
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
                                  by {item.sellerName || 'Artisan'}
                                </span>
                                <div className="text-right">
                                  <p className="text-sm font-medium">₹{item.price} × {item.quantity}</p>
                                  <p className="text-lg font-bold text-green-600">₹{item.totalPrice}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Details by Seller */}
                    {order.statusDetails && order.statusDetails.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">🔄 Order Status by Seller</h3>
                        <div className="space-y-3">
                          {order.statusDetails.map((detail, index) => (
                            <div key={index} className="p-4 bg-blue-50 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium text-blue-900">Seller {index + 1}</h4>
                                {getStatusBadge(detail.status)}
                              </div>
                              <div className="text-sm text-blue-800">
                                <p>Items: {detail.items?.length || 0}</p>
                                {detail.estimatedDelivery && (
                                  <p>Expected: {new Date(detail.estimatedDelivery).toLocaleDateString('en-IN')}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Payment Summary */}
                    <div className="mb-6 p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">💰 Payment Summary</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Items ({order.orderSummary?.itemCount || 0})</span>
                          <span>₹{order.orderSummary?.subtotal || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Platform Fee</span>
                          <span>₹{order.orderSummary?.platformFee || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Fee</span>
                          <span>₹{order.orderSummary?.deliveryFee || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>{order.orderSummary?.shipping === 0 ? 'FREE' : `₹${order.orderSummary?.shipping || 0}`}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total Paid</span>
                          <span className="text-green-600">₹{order.orderSummary?.total || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">📍 Delivery Address</h3>
                      <p className="text-gray-700">{order.shippingAddress || 'Address not provided'}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {order.overallStatus === 'delivered' && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          ⭐ Rate & Review
                        </Button>
                      )}
                      
                      {['dispatched', 'delivered'].includes(order.overallStatus) && (
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          📄 Download Invoice
                        </Button>
                      )}
                      
                      {!['delivered', 'cancelled'].includes(order.overallStatus) && (
                        <Button className="bg-gray-600 hover:bg-gray-700 text-white">
                          📞 Contact Seller
                        </Button>
                      )}

                      <Button 
                        onClick={() => router.push(`/buyer/orders/${order.id}`)}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        👁️ View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedStatus === 'all' ? 'No Orders Yet' : `No ${statusFilters.find(f => f.value === selectedStatus)?.label} Orders`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedStatus === 'all' 
                    ? "You haven't placed any orders yet. Start shopping for amazing handcrafted items!"
                    : "No orders found with this status."
                  }
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/buyer/browse')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 mr-3"
                  >
                    Start Shopping
                  </Button>
                  {selectedStatus !== 'all' && (
                    <Button
                      onClick={() => setSelectedStatus('all')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
                    >
                      View All Orders
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerOrdersPage;
