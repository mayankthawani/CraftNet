'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BuyerSidebar from '@/components/buyersidebar';
import ProductImageCarousel from '@/components/ProductImageCarousel';

const BrowseProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');
  const router = useRouter();

  const categories = [
    'All',
    'Pottery & Ceramics',
    'Textiles & Weaving',
    'Jewelry & Accessories',
    'Woodwork & Carving',
    'Metalwork',
    'Leather Craft',
    'Paintings & Art',
    'Home Decor',
    'Bags & Purses',
    'Traditional Crafts',
    'Other'
  ];

  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 - ₹1000', value: '500-1000' },
    { label: '₹1000 - ₹2500', value: '1000-2500' },
    { label: '₹2500 - ₹5000', value: '2500-5000' },
    { label: 'Above ₹5000', value: '5000+' }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'buyer') {
            setUserData(userDoc.data());
            await loadProducts();
          } else {
            router.push('/buyer/login');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Still load products even if user data fails
          await loadProducts();
        }
      } else {
        router.push('/buyer/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadProducts = async () => {
    try {
      console.log('Loading products from database...');
      
      // Try the complex query first
      try {
        const productsQuery = query(
          collection(db, 'products'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc')
        );
        
        const productsSnapshot = await getDocs(productsQuery);
        console.log('Found products:', productsSnapshot.docs.length);
        
        const productsList = await Promise.all(productsSnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          
          // Debug: Log all possible seller ID fields
          console.log('Raw product data for debugging:', {
            id: docSnapshot.id,
            title: data.title,
            sellerId: data.sellerId,
            userId: data.userId,
            createdBy: data.createdBy,
            seller: data.seller,
            artisanId: data.artisanId,
            uid: data.uid,
            // Log all fields to see what's available
            allFields: Object.keys(data)
          });
          
          // Determine seller ID - check multiple possible fields in order of preference
          // The actual user ID from Firebase Auth should be used
          let sellerId = data.sellerId || 
                        data.userId || 
                        data.createdBy || 
                        data.uid ||
                        data.seller || 
                        data.artisanId;
          
          console.log(`Product "${data.title}" - Detected seller ID: ${sellerId}`);
          
          // Fetch seller information for each product
          let sellerInfo = {
            name: 'Unknown Artisan',
            shopName: '',
            location: '',
            verified: false
          };
          
          if (sellerId) {
            try {
              const sellerDoc = await getDoc(doc(db, 'users', sellerId));
              if (sellerDoc.exists()) {
                const seller = sellerDoc.data();
                // Only consider this a valid seller if they have the seller role
                if (seller.role === 'seller') {
                  sellerInfo = {
                    name: seller.name || seller.shopName || 'Artisan',
                    shopName: seller.shopName || '',
                    location: seller.address || seller.location || '',
                    verified: seller.profileComplete || false,
                    category: seller.category || data.category
                  };
                  console.log(`✅ Found valid seller info for ${sellerId}:`, sellerInfo.name);
                } else {
                  console.warn(`❌ User ${sellerId} is not a seller (role: ${seller.role})`);
                  sellerId = null;
                }
              } else {
                console.warn(`❌ No user document found for ID: ${sellerId}`);
                sellerId = null;
              }
            } catch (sellerError) {
              console.error('Error fetching seller info:', sellerError);
              sellerId = null;
            }
          } else {
            console.warn(`❌ No seller ID found for product: ${data.title}`);
          }
          
          return {
            id: docSnapshot.id,
            ...data,
            sellerId: sellerId, // This is the corrected seller ID
            sellerInfo,
            // Enhanced product details
            materials: data.materials || [],
            dimensions: data.dimensions || '',
            weight: data.weight || '',
            careInstructions: data.careInstructions || '',
            artisanStory: data.artisanStory || '',
            craftingTime: data.craftingTime || '',
            isHandmade: data.isHandmade !== false,
            isEcoFriendly: data.isEcoFriendly || false,
            shippingInfo: data.shippingInfo || 'Standard shipping available'
          };
        }));
        
        // Log final results
        const productsWithValidSellers = productsList.filter(p => p.sellerId);
        const productsWithoutSellers = productsList.filter(p => !p.sellerId);
        
        console.log(`📊 Products loaded - Total: ${productsList.length}, With sellers: ${productsWithValidSellers.length}, Without sellers: ${productsWithoutSellers.length}`);
        
        if (productsWithoutSellers.length > 0) {
          console.warn('⚠️ Products without seller IDs:', productsWithoutSellers.map(p => ({
            id: p.id,
            title: p.title,
            rawData: {
              sellerId: p.sellerId,
              userId: p.userId,
              createdBy: p.createdBy,
              uid: p.uid
            }
          })));
        }
        
        setProducts(productsList);
        setFilteredProducts(productsList);
        console.log('Products loaded successfully:', productsList.length);
        return;
      } catch (indexError) {
        if (indexError.message.includes('index')) {
          console.log('Index error, trying simpler query...');
          // Fall through to simpler approach
        } else {
          throw indexError;
        }
      }
      
      // Fallback to simpler query without orderBy
      console.log('Trying alternative query without orderBy...');
      const simpleQuery = query(
        collection(db, 'products'),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(simpleQuery);
      
      const allProducts = snapshot.docs.map(doc => {
        const data = doc.data();
        // Check multiple seller ID fields
        const sellerId = data.sellerId || data.userId || data.createdBy || data.uid || data.seller || data.artisanId;
        
        console.log(`Fallback - Product "${data.title}" seller ID: ${sellerId}`);
        
        return {
          id: doc.id,
          ...data,
          sellerId: sellerId, // Ensure this is properly set
          sellerInfo: {
            name: data.sellerName || 'Unknown Artisan',
            shopName: '',
            location: '',
            verified: false
          }
        };
      });
      
      // Sort on client side
      allProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      
      console.log('Alternative query found products:', allProducts.length);
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      
    } catch (error) {
      console.error('Error loading products:', error);
      
      // Final fallback - get all products and filter client-side
      try {
        console.log('Trying final fallback query...');
        const allProductsQuery = collection(db, 'products');
        const snapshot = await getDocs(allProductsQuery);
        
        const allProducts = snapshot.docs.map(doc => {
          const data = doc.data();
          // Check multiple seller ID fields
          const sellerId = data.sellerId || data.userId || data.createdBy || data.uid || data.seller || data.artisanId;
          
          return {
            id: doc.id,
            ...data,
            sellerId: sellerId, // Ensure this is properly set
            sellerInfo: {
              name: data.sellerName || 'Unknown Artisan',
              shopName: '',
              location: '',
              verified: false
            }
          };
        });
        
        // Filter active products on client side
        const activeProducts = allProducts.filter(product => 
          product.status === 'active' || !product.status
        );
        
        // Sort by creation date
        activeProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        
        console.log('Final fallback found products:', activeProducts.length);
        setProducts(activeProducts);
        setFilteredProducts(activeProducts);
      } catch (fallbackError) {
        console.error('All queries failed:', fallbackError);
        setProducts([]);
        setFilteredProducts([]);
      }
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, sortBy, priceRange, products]);

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      if (priceRange === '5000+') {
        filtered = filtered.filter(product => product.price >= 5000);
      } else {
        filtered = filtered.filter(product => 
          product.price >= min && product.price <= max
        );
      }
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  };

  const handleAddToWishlist = (productId) => {
    // TODO: Implement wishlist functionality
    alert('Added to wishlist! (Feature coming soon)');
  };

  const handleAddToCart = async (productId) => {
    if (!auth.currentUser) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const product = filteredProducts.find(p => p.id === productId);
      if (!product) {
        alert('Product not found');
        return;
      }

      console.log('🛒 Adding product to cart:', {
        id: product.id,
        title: product.title,
        sellerId: product.sellerId,
        hasSellerInfo: !!product.sellerInfo
      });

      if (!product.sellerId) {
        console.error('❌ Product missing seller ID:', product);
        alert('This product is missing seller information. Please contact support or try refreshing the page.');
        return;
      }

      const cartRef = doc(db, 'carts', auth.currentUser.uid);
      const cartDoc = await getDoc(cartRef);
      
      let cartItems = [];
      if (cartDoc.exists()) {
        cartItems = cartDoc.data().items || [];
      }

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(item => item.id === productId);
      
      // Create cart item with enhanced details - ENSURE SELLER ID IS PROPERLY SET
      const cartItem = {
        id: product.id || '',
        title: product.title || 'Untitled Product',
        description: product.description || '',
        price: Number(product.price) || 0,
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        images: product.images && product.images.length > 0 ? product.images : [],
        category: product.category || 'Other',
        sellerName: product.sellerInfo?.name || product.sellerName || 'Unknown Artisan',
        sellerId: product.sellerId, // CRITICAL: This must be set and valid
        sellerShopName: product.sellerInfo?.shopName || '',
        sellerLocation: product.sellerInfo?.location || '',
        isVerifiedSeller: product.sellerInfo?.verified || false,
        materials: product.materials || [],
        dimensions: product.dimensions || '',
        weight: product.weight || '',
        isHandmade: product.isHandmade !== false,
        isEcoFriendly: product.isEcoFriendly || false,
        shippingInfo: product.shippingInfo || 'Standard shipping available',
        quantity: 1,
        addedAt: new Date().toISOString(),
        inStock: product.inStock !== false
      };

      console.log('✅ Cart item created with seller ID:', cartItem.sellerId);

      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += 1;
        cartItems[existingItemIndex].addedAt = new Date().toISOString();
        // Ensure sellerId is maintained
        cartItems[existingItemIndex].sellerId = product.sellerId;
      } else {
        cartItems.push(cartItem);
      }

      // Calculate totals with platform fee and delivery fee
      const subtotal = cartItems.reduce((total, item) => total + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
      const platformFee = Math.round(subtotal * 0.05);
      const totalItems = cartItems.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
      const deliveryFee = totalItems * 50;
      const shipping = subtotal > 500 ? 0 : 50;
      
      const cartData = {
        items: cartItems,
        updatedAt: new Date().toISOString(),
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser?.email || '',
        totalItems: totalItems,
        subtotal: subtotal,
        platformFee: platformFee,
        deliveryFee: deliveryFee,
        shipping: shipping,
        totalValue: subtotal + platformFee + deliveryFee + shipping,
        lastModified: new Date().toISOString()
      };

      console.log('💾 Saving cart with items having seller IDs:', cartItems.map(item => ({
        title: item.title,
        sellerId: item.sellerId
      })));

      await setDoc(cartRef, cartData, { merge: true });

      alert('Item added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      if (error.message.includes('invalid data') || error.message.includes('undefined')) {
        alert('Product data is incomplete. Please try again or contact support.');
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
    }
  };

  const handleViewProduct = (productId) => {
    router.push(`/buyer/product/${productId}`);
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Browse Products</h1>
                <p className="text-gray-600">Discover amazing handcrafted items from talented artisans</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Showing {filteredProducts.length} products</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Filters Section */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid - Better UI and visible details */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="w-full shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white rounded-2xl border border-gray-100">
                  <CardContent className="p-0">
                    {/* Product Image Container */}
                    <div className="relative h-56 w-full bg-gray-50 rounded-t-2xl overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <ProductImageCarousel images={product.images} product={product} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-400 text-5xl">🎨</span>
                        </div>
                      )}
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={() => handleAddToWishlist(product.id)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 hover:scale-110"
                      >
                        <svg className="w-5 h-5 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      {/* Enhanced Badges */}
                      <div className="absolute top-3 left-3 flex flex-col space-y-2">
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </div>
                        )}
                        {product.customizable && (
                          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            ✨ Custom
                          </div>
                        )}
                      </div>

                      {/* Stock Status */}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 rounded-t-2xl">
                          <div className="text-center text-white">
                            <span className="font-bold text-lg block mb-1">Out of Stock</span>
                            <span className="text-sm opacity-80">Notify when available</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Product Info Section - Better text arrangement */}
                    <div className="p-4 min-h-[160px] flex flex-col justify-between">
                      {/* Top Section - Category, Title, and Description */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-orange-600 font-semibold bg-orange-100 px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {product.views || Math.floor(Math.random() * 100) + 10}
                          </div>
                        </div>
                        
                        <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-1 mb-1">
                          {product.title}
                        </h3>
                        
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Middle Section - Rating and Price in compact layout */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-3 h-3 ${star <= (product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-xs text-gray-700 ml-1 font-medium">
                              {product.rating || 4.0}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              ({product.reviews?.length || Math.floor(Math.random() * 20) + 5})
                            </span>
                          </div>
                          
                          <div className="text-xs text-green-600 font-medium">
                            🚚 Free shipping
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-green-600">
                              ₹{product.price}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section - Enhanced seller info */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {(product.sellerInfo?.name || product.sellerName || 'A').charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-900 font-medium leading-tight">
                                {product.sellerInfo?.name || product.sellerName || 'Master Artisan'}
                              </p>
                              <div className="flex items-center space-x-1">
                                <p className="text-xs text-gray-500 leading-tight">
                                  {product.sellerInfo?.verified ? '✅ Verified' : '⏳ New Seller'}
                                </p>
                                {product.sellerInfo?.location && (
                                  <span className="text-xs text-gray-400">
                                    • {product.sellerInfo.location.split(',')[0]}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Additional product badges */}
                          <div className="flex flex-col space-y-1">
                            {product.isHandmade && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                🤲 Handmade
                              </span>
                            )}
                            {product.isEcoFriendly && (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                🌿 Eco-friendly
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Materials info */}
                        {product.materials && product.materials.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Materials:</span> {product.materials.slice(0, 2).join(', ')}
                              {product.materials.length > 2 && '...'}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleViewProduct(product.id)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-2 font-medium rounded-lg transition-all duration-200"
                          >
                            View
                          </Button>
                          <Button
                            onClick={() => handleAddToCart(product.id)}
                            disabled={!product.inStock}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs py-2 font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            {product.inStock ? 'Add Cart' : 'N/A'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || selectedCategory !== 'All' || priceRange !== 'all' 
                    ? 'Try adjusting your filters to see more products.'
                    : 'No products are currently available. Check back soon!'}
                </p>
                {(searchQuery || selectedCategory !== 'All' || priceRange !== 'all') && (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setPriceRange('all');
                      setSortBy('newest');
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseProducts;
                