'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BuyerSidebar from '@/components/buyersidebar';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'buyer') {
            setUserData(userDoc.data());
            await loadCartItems(user.uid);
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

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      const updatedItems = cartItems.map(item => {
        if (item.id === productId) {
          return {
            ...item,
            quantity: newQuantity,
            // Ensure no undefined values
            price: Number(item.price) || 0,
            title: item.title || 'Untitled Product',
            description: item.description || '',
            category: item.category || 'Other',
            sellerName: item.sellerName || 'Unknown Artisan',
            images: item.images || [],
            inStock: item.inStock !== false
          };
        }
        return item;
      });
      
      setCartItems(updatedItems);

      const cartRef = doc(db, 'carts', auth.currentUser.uid);
      const cartData = {
        items: updatedItems,
        updatedAt: new Date().toISOString(),
        userId: auth.currentUser.uid,
        totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
        totalValue: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };

      await updateDoc(cartRef, cartData);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
      // Reload cart items to sync with database
      await loadCartItems(auth.currentUser.uid);
    }
    setUpdating(false);
  };

  const removeFromCart = async (productId) => {
    setUpdating(true);
    try {
      const updatedItems = cartItems.filter(item => item.id !== productId);
      setCartItems(updatedItems);

      const cartRef = doc(db, 'carts', auth.currentUser.uid);
      
      if (updatedItems.length === 0) {
        // If cart is empty, set minimal data
        const cartData = {
          items: [],
          updatedAt: new Date().toISOString(),
          userId: auth.currentUser.uid,
          totalItems: 0,
          totalValue: 0
        };
        await setDoc(cartRef, cartData, { merge: true });
      } else {
        const cartData = {
          items: updatedItems,
          updatedAt: new Date().toISOString(),
          userId: auth.currentUser.uid,
          totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
          totalValue: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        };
        await updateDoc(cartRef, cartData);
      }
      
      alert('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
      // Reload cart items to sync with database
      await loadCartItems(auth.currentUser.uid);
    }
    setUpdating(false);
  };

  const loadCartItems = async (userId) => {
    try {
      const cartDoc = await getDoc(doc(db, 'carts', userId));
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const items = cartData.items || [];
        
        console.log('🛒 Loading cart items:', items.length);
        
        // Clean up any items with undefined values and log seller IDs
        const cleanItems = items.map(item => {
          console.log(`Cart item: ${item.title}, Seller ID: ${item.sellerId}`);
          
          return {
            id: item.id || '',
            title: item.title || 'Untitled Product',
            description: item.description || '',
            price: Number(item.price) || 0,
            originalPrice: item.originalPrice ? Number(item.originalPrice) : null,
            images: item.images || [],
            category: item.category || 'Other',
            sellerName: item.sellerName || 'Unknown Artisan',
            sellerId: item.sellerId, // Preserve original seller ID
            quantity: Number(item.quantity) || 1,
            addedAt: item.addedAt || new Date().toISOString(),
            inStock: item.inStock !== false,
            // Preserve all seller-related fields
            sellerShopName: item.sellerShopName || '',
            sellerLocation: item.sellerLocation || '',
            isVerifiedSeller: item.isVerifiedSeller || false,
            materials: item.materials || [],
            dimensions: item.dimensions || '',
            weight: item.weight || ''
          };
        });
        
        // Log items with missing seller IDs
        const itemsWithoutSellers = cleanItems.filter(item => !item.sellerId);
        if (itemsWithoutSellers.length > 0) {
          console.warn('⚠️ Cart items missing seller IDs:', itemsWithoutSellers.map(item => ({
            id: item.id,
            title: item.title
          })));
        }
        
        setCartItems(cleanItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const calculatePlatformFee = () => {
    const subtotal = calculateSubtotal();
    return Math.round(subtotal * 0.05); // 5% platform fee
  };

  const calculateDeliveryFee = () => {
    const totalItems = cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
    return totalItems * 50; // ₹50 per item delivery fee
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 50; // Free shipping above ₹500 (this is separate from delivery fee)
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculatePlatformFee() + calculateDeliveryFee() + calculateShipping();
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    setUpdating(true);
    
    try {
      const userId = auth.currentUser.uid;
      const orderDate = new Date().toISOString();
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Calculate order totals
      const subtotal = calculateSubtotal();
      const platformFee = calculatePlatformFee();
      const deliveryFee = calculateDeliveryFee();
      const shipping = calculateShipping();
      const total = calculateTotal();
      
      console.log('🚀 Starting checkout process...');
      console.log('📦 Cart items with seller IDs:', cartItems.map(item => ({
        title: item.title,
        sellerId: item.sellerId,
        hasValidSellerId: !!(item.sellerId && item.sellerId !== 'undefined' && item.sellerId !== '')
      })));
      
      // Group items by seller - with enhanced logging
      const itemsBySeller = cartItems.reduce((acc, item) => {
        let sellerId = item.sellerId;
        
        // Additional cleanup and validation
        if (!sellerId || sellerId === 'undefined' || sellerId === '' || sellerId === null) {
          console.error(`❌ Invalid seller ID for item "${item.title}":`, sellerId);
          console.error('Full item data:', item);
          return acc; // Skip this item
        }
        
        console.log(`✅ Valid seller ID found: ${sellerId} for item: ${item.title}`);
        
        if (!acc[sellerId]) {
          acc[sellerId] = [];
        }
        acc[sellerId].push(item);
        return acc;
      }, {});
      
      console.log('📊 Items grouped by seller:', Object.keys(itemsBySeller).map(sellerId => ({
        sellerId,
        itemCount: itemsBySeller[sellerId].length,
        items: itemsBySeller[sellerId].map(item => item.title)
      })));
      
      if (Object.keys(itemsBySeller).length === 0) {
        throw new Error('No items with valid seller IDs found. Please remove items from cart and add them again, or contact support.');
      }
      
      // Create orders for each seller
      const orderPromises = Object.entries(itemsBySeller).map(async ([sellerId, items]) => {
        console.log(`📝 Creating order for seller: ${sellerId} with ${items.length} items`);
        
        const sellerOrderId = `${orderId}_${sellerId}`;
        const sellerSubtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const sellerDeliveryFee = items.reduce((total, item) => total + (item.quantity * 50), 0);
        const sellerPlatformFee = Math.round(sellerSubtotal * 0.05);
        
        // Create order for seller with proper null checks
        const sellerOrder = {
          orderId: sellerOrderId,
          parentOrderId: orderId,
          sellerId: sellerId, // This should now be valid
          buyerId: userId,
          buyerDetails: {
            name: userData?.name || 'Customer',
            phone: userData?.phone || '',
            email: userData?.email || auth.currentUser?.email || '',
            address: userData?.address || 'Address not provided'
          },
          items: items.map(item => ({
            productId: item.id || '',
            title: item.title || 'Product',
            description: item.description || '',
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            images: Array.isArray(item.images) ? item.images : [],
            category: item.category || 'Other',
            materials: Array.isArray(item.materials) ? item.materials : [],
            dimensions: item.dimensions || '',
            weight: item.weight || '',
            totalPrice: (Number(item.price) || 0) * (Number(item.quantity) || 1)
          })),
          orderSummary: {
            itemsCount: items.length,
            totalQuantity: items.reduce((total, item) => total + (Number(item.quantity) || 1), 0),
            subtotal: sellerSubtotal,
            deliveryFee: sellerDeliveryFee,
            platformFee: sellerPlatformFee,
            total: sellerSubtotal + sellerDeliveryFee
          },
          status: 'pending',
          paymentStatus: 'paid',
          orderDate: orderDate,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          shippingAddress: userData?.address || 'Address not provided',
          specialInstructions: 'Please handle with care - handmade items',
          createdAt: orderDate,
          updatedAt: orderDate,
          timestamp: Date.now()
        };
        
        console.log(`💾 Saving seller order for seller ${sellerOrder.sellerId}:`, {
          orderId: sellerOrder.orderId,
          sellerId: sellerOrder.sellerId,
          itemCount: sellerOrder.items.length
        });
        
        // Save to seller's orders collection
        const docRef = await addDoc(collection(db, 'sellerOrders'), sellerOrder);
        console.log(`✅ Seller order created with document ID: ${docRef.id} for seller: ${sellerId}`);
        
        return sellerOrder;
      });
      
      const results = await Promise.all(orderPromises);
      const validResults = results.filter(r => r !== null);
      console.log(`🎉 Valid seller orders created: ${validResults.length}`);
      
      if (validResults.length === 0) {
        throw new Error('No valid seller orders could be created - all items have invalid seller IDs');
      }
      
      // Create buyer order record with proper null checks
      const buyerOrder = {
        orderId: orderId,
        userId: userId,
        userEmail: auth.currentUser?.email || '',
        items: cartItems.map(item => ({
          productId: item.id || '',
          title: item.title || 'Product',
          description: item.description || '',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          sellerId: item.sellerId || '',
          sellerName: item.sellerName || 'Artisan',
          images: Array.isArray(item.images) ? item.images : [],
          category: item.category || 'Other',
          totalPrice: (Number(item.price) || 0) * (Number(item.quantity) || 1)
        })),
        orderSummary: {
          subtotal: subtotal,
          platformFee: platformFee,
          deliveryFee: deliveryFee,
          shipping: shipping,
          total: total,
          itemCount: cartItems.length,
          totalQuantity: cartItems.reduce((total, item) => total + (Number(item.quantity) || 1), 0)
        },
        customerDetails: {
          name: userData?.name || 'Customer',
          phone: userData?.phone || '',
          email: userData?.email || auth.currentUser?.email || '',
          address: userData?.address || 'Address not provided'
        },
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'online',
        orderDate: orderDate,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: userData?.address || 'Address not provided',
        specialInstructions: '',
        createdAt: orderDate,
        updatedAt: orderDate,
        timestamp: Date.now()
      };
      
      console.log('Creating buyer order:', buyerOrder);
      const buyerDocRef = await addDoc(collection(db, 'buyerOrders'), buyerOrder);
      console.log('Buyer order created with ID:', buyerDocRef.id);
      
      console.log('🛒 Clearing cart...');
      
      // Clear the cart
      const cartRef = doc(db, 'carts', userId);
      await setDoc(cartRef, {
        items: [],
        updatedAt: new Date().toISOString(),
        userId: userId,
        totalItems: 0,
        subtotal: 0,
        platformFee: 0,
        deliveryFee: 0,
        shopping: 0,
        totalValue: 0
      });
      
      setCartItems([]);
      
      alert(`✅ Order placed successfully! Order ID: ${orderId}\n\n📦 Seller orders created: ${validResults.length}\n🚚 You will receive delivery updates soon. Thank you for supporting our artisans!`);
      
      // Redirect to browse page
      router.push('/buyer/browse');
      
    } catch (error) {
      console.error('💥 Error during checkout:', error);
      
      if (error.message.includes('seller IDs') || error.message.includes('Invalid seller')) {
        alert('❌ There was an issue with product seller information. Please try:\n\n1. Remove items from cart and add them again\n2. Refresh the page\n3. Contact support if the issue persists\n\nError: Some products are missing seller information.');
      } else if (error.message.includes('index')) {
        console.error('Firestore index error - continuing without complex queries');
        alert('⚠️ Order placed but there may be delays in showing it to sellers. Please contact support if issues persist.');
      } else if (error.message.includes('invalid data') || error.message.includes('undefined')) {
        console.error('Undefined value found in order data');
        alert('❌ There was an issue with your order data. Please try again or contact support.');
      } else if (error.code === 'permission-denied') {
        alert('❌ Permission denied. Please make sure you are logged in.');
      } else if (error.code === 'unavailable') {
        alert('❌ Network error. Please check your connection and try again.');
      } else {
        alert('❌ Failed to place order. Please try again.');
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">🏺</span>
          </div>
          <div className="text-xl font-semibold text-gray-700">Loading cart...</div>
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
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600">Review your selected items</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{cartItems.length} items in cart</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Cart Items</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <div key={item.id} className="p-6 flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {item.images && item.images[0] ? (
                              <img 
                                src={item.images[0]} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-400 text-2xl">🎨</span>
                              </div>
                            )}
                          </div>

                          {/* Enhanced Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                  {item.description}
                                </p>
                                <div className="flex flex-wrap items-center mt-2 space-x-2 space-y-1">
                                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                    {item.category}
                                  </span>
                                  {item.isHandmade && (
                                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                      🤲 Handmade
                                    </span>
                                  )}
                                  {item.isEcoFriendly && (
                                    <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                                      🌿 Eco-friendly
                                    </span>
                                  )}
                                </div>
                                
                                {/* Enhanced Seller Info */}
                                <div className="flex items-center mt-2 space-x-2">
                                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                      {(item.sellerName || 'A').charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-700 font-medium">
                                      {item.sellerName || 'Master Artisan'}
                                    </span>
                                    {item.sellerShopName && (
                                      <span className="text-xs text-gray-500 ml-1">
                                        • {item.sellerShopName}
                                      </span>
                                    )}
                                    <div className="flex items-center space-x-1 mt-0.5">
                                      <span className="text-xs text-gray-500">
                                        {item.isVerifiedSeller ? '✅ Verified' : '⏳ New Seller'}
                                      </span>
                                      {item.sellerLocation && (
                                        <span className="text-xs text-gray-400">
                                          • {item.sellerLocation.split(',')[0]}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Product Specifications */}
                                {(item.materials?.length > 0 || item.dimensions || item.weight) && (
                                  <div className="mt-2 text-xs text-gray-600">
                                    {item.materials?.length > 0 && (
                                      <p><span className="font-medium">Materials:</span> {item.materials.slice(0, 2).join(', ')}</p>
                                    )}
                                    {item.dimensions && (
                                      <p><span className="font-medium">Size:</span> {item.dimensions}</p>
                                    )}
                                    {item.weight && (
                                      <p><span className="font-medium">Weight:</span> {item.weight}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <button
                                onClick={() => removeFromCart(item.id)}
                                disabled={updating}
                                className="text-red-500 hover:text-red-700 p-1 ml-2"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>

                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-green-600">
                                  ₹{item.price}
                                </span>
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <span className="text-sm text-gray-400 line-through">
                                    ₹{item.originalPrice}
                                  </span>
                                )}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={updating || item.quantity <= 1}
                                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                
                                <span className="w-8 text-center font-semibold">
                                  {item.quantity}
                                </span>
                                
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={updating}
                                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="mt-3 text-right">
                              <span className="text-lg font-bold text-gray-900">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="shadow-lg sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{calculateSubtotal()}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Platform Fee (5%)</span>
                      <span>₹{calculatePlatformFee()}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee ({cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0)} items × ₹50)</span>
                      <span>₹{calculateDeliveryFee()}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>
                        {calculateShipping() === 0 ? (
                          <span className="text-green-600 font-medium">FREE</span>
                        ) : (
                          `₹${calculateShipping()}`
                        )}
                      </span>
                    </div>
                    
                    {calculateShipping() === 0 && (
                      <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                        🎉 You saved ₹50 on shipping!
                      </div>
                    )}
                    
                    <hr className="my-4" />
                    
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{calculateTotal()}</span>
                    </div>

                    <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded mb-2">
                      💡 Note: Platform fee helps us maintain the marketplace and support artisans
                    </div>

                    <div className="text-xs text-gray-500 bg-amber-50 p-2 rounded">
                      🚚 Delivery fee: ₹50 per item covers secure packaging and handling by artisans
                    </div>

                    <Button
                      onClick={handleCheckout}
                      disabled={updating}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-semibold shadow-lg mt-6"
                    >
                      {updating ? 'Processing Order...' : '🛒 Proceed to Checkout'}
                    </Button>

                    {/* Additional Info */}
                    <div className="mt-6 space-y-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Secure checkout</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>7-day return policy</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Handmade guarantee</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Empty Cart */
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Button
                  onClick={() => router.push('/buyer/browse')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold"
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
