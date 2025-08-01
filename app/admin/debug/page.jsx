'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DebugPage = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDebug = async () => {
    setLoading(true);
    const debug = {
      products: [],
      users: [],
      sellerOrders: [],
      issues: []
    };

    try {
      // Check products
      console.log('🔍 Debugging products...');
      const productsSnapshot = await getDocs(collection(db, 'products'));
      debug.products = productsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          sellerId: data.sellerId,
          userId: data.userId,
          createdBy: data.createdBy,
          uid: data.uid,
          seller: data.seller,
          artisanId: data.artisanId,
          status: data.status,
          allFields: Object.keys(data)
        };
      });

      // Check users
      console.log('🔍 Debugging users...');
      const usersSnapshot = await getDocs(collection(db, 'users'));
      debug.users = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          role: data.role,
          shopName: data.shopName,
          email: data.email,
          profileComplete: data.profileComplete
        };
      });

      // Check seller orders
      console.log('🔍 Debugging seller orders...');
      const ordersSnapshot = await getDocs(collection(db, 'sellerOrders'));
      debug.sellerOrders = ordersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          orderId: data.orderId,
          sellerId: data.sellerId,
          buyerId: data.buyerId,
          status: data.status,
          itemCount: data.items?.length || 0
        };
      });

      // Find issues
      const sellers = debug.users.filter(u => u.role === 'seller');
      const sellerIds = sellers.map(s => s.id);
      
      debug.products.forEach(product => {
        const possibleSellerIds = [
          product.sellerId,
          product.userId,
          product.createdBy,
          product.uid,
          product.seller,
          product.artisanId
        ].filter(Boolean);

        if (possibleSellerIds.length === 0) {
          debug.issues.push({
            type: 'NO_SELLER_ID',
            productId: product.id,
            productTitle: product.title,
            message: 'Product has no seller ID in any field'
          });
        } else {
          const validSellerIds = possibleSellerIds.filter(id => sellerIds.includes(id));
          if (validSellerIds.length === 0) {
            debug.issues.push({
              type: 'INVALID_SELLER_ID',
              productId: product.id,
              productTitle: product.title,
              possibleIds: possibleSellerIds,
              message: 'Product has seller IDs but none match actual sellers'
            });
          }
        }
      });

      setDebugInfo(debug);
      console.log('Debug info:', debug);

    } catch (error) {
      console.error('Debug error:', error);
      debug.issues.push({
        type: 'DEBUG_ERROR',
        message: error.message
      });
      setDebugInfo(debug);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Database Debug Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runDebug}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Running Debug...' : 'Run Debug Analysis'}
            </Button>
          </CardContent>
        </Card>

        {debugInfo && (
          <div className="space-y-6">
            {/* Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Issues Found ({debugInfo.issues.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {debugInfo.issues.length === 0 ? (
                  <p className="text-green-600">No issues found!</p>
                ) : (
                  <div className="space-y-3">
                    {debugInfo.issues.map((issue, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                        <h4 className="font-semibold text-red-800">{issue.type}</h4>
                        <p className="text-red-700">{issue.message}</p>
                        {issue.productTitle && (
                          <p className="text-sm text-red-600">Product: {issue.productTitle} (ID: {issue.productId})</p>
                        )}
                        {issue.possibleIds && (
                          <p className="text-sm text-red-600">Possible IDs: {issue.possibleIds.join(', ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle>Products ({debugInfo.products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Title</th>
                        <th className="p-2 text-left">Seller ID</th>
                        <th className="p-2 text-left">User ID</th>
                        <th className="p-2 text-left">Created By</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debugInfo.products.map((product, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{product.title}</td>
                          <td className="p-2">{product.sellerId || 'NULL'}</td>
                          <td className="p-2">{product.userId || 'NULL'}</td>
                          <td className="p-2">{product.createdBy || 'NULL'}</td>
                          <td className="p-2">{product.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Users */}
            <Card>
              <CardHeader>
                <CardTitle>Users ({debugInfo.users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">ID</th>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Role</th>
                        <th className="p-2 text-left">Shop Name</th>
                        <th className="p-2 text-left">Complete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debugInfo.users.map((user, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-mono text-xs">{user.id}</td>
                          <td className="p-2">{user.name}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.role === 'seller' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-2">{user.shopName}</td>
                          <td className="p-2">{user.profileComplete ? '✅' : '❌'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Seller Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Orders ({debugInfo.sellerOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Order ID</th>
                        <th className="p-2 text-left">Seller ID</th>
                        <th className="p-2 text-left">Buyer ID</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debugInfo.sellerOrders.map((order, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-mono text-xs">{order.orderId}</td>
                          <td className="p-2 font-mono text-xs">{order.sellerId}</td>
                          <td className="p-2 font-mono text-xs">{order.buyerId}</td>
                          <td className="p-2">{order.status}</td>
                          <td className="p-2">{order.itemCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPage;
