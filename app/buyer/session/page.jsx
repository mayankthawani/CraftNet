'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, getDoc, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BuyerSidebar from '@/components/buyersidebar';

const SessionsPage = () => {
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '60',
    sessionType: 'learning',
    message: ''
  });
  const [booking, setBooking] = useState(false);
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
    'Traditional Crafts',
    'Other'
  ];

  const sessionTypes = [
    { value: 'learning', label: 'Learning Session', price: 500, desc: 'Learn basic techniques' },
    { value: 'advanced', label: 'Advanced Workshop', price: 1000, desc: 'Master advanced skills' },
    { value: 'consultation', label: 'Consultation', price: 300, desc: 'Get expert advice' },
    { value: 'custom', label: 'Custom Project', price: 800, desc: 'Work on your project' }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'buyer') {
            setUserData(userDoc.data());
            await loadArtisans();
          } else {
            router.push('/buyer/login');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          await loadArtisans();
        }
      } else {
        router.push('/buyer/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadArtisans = async () => {
    try {
      console.log('Loading artisans...');
      
      // Get all users with seller role and completed profiles
      const usersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'seller'),
        where('profileComplete', '==', true)
      );
      
      const usersSnapshot = await getDocs(usersQuery);
      console.log('Found artisans:', usersSnapshot.docs.length);
      
      const artisansList = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || data.shopName || 'Master Artisan',
          shopName: data.shopName || '',
          category: data.category || 'Traditional Crafts',
          skills: data.skills || [],
          about: data.about || 'Experienced artisan with traditional knowledge',
          address: data.address || '',
          upiId: data.upiId || '',
          experience: data.experience || '5+ years',
          rating: data.rating || (Math.random() * 2 + 3.5).toFixed(1), // Random rating between 3.5-5.5
          sessionsCompleted: data.sessionsCompleted || Math.floor(Math.random() * 200) + 50,
          hourlyRate: data.hourlyRate || (Math.floor(Math.random() * 500) + 300), // ₹300-800 per hour
          availability: data.availability || 'Available',
          languages: data.languages || ['Hindi', 'English'],
          specializations: data.specializations || data.skills?.slice(0, 3) || ['Traditional Craft'],
          joinedDate: data.createdAt || new Date().toISOString(),
          profileComplete: data.profileComplete,
          hasVishwakarmaId: data.hasVishwakarmaId || false
        };
      });

      // Sort by rating and sessions completed
      artisansList.sort((a, b) => {
        const scoreA = parseFloat(a.rating) * 100 + a.sessionsCompleted;
        const scoreB = parseFloat(b.rating) * 100 + b.sessionsCompleted;
        return scoreB - scoreA;
      });

      setArtisans(artisansList);
      setFilteredArtisans(artisansList);
      console.log('Artisans loaded successfully:', artisansList.length);
      
    } catch (error) {
      console.error('Error loading artisans:', error);
      setArtisans([]);
      setFilteredArtisans([]);
    }
  };

  useEffect(() => {
    filterArtisans();
  }, [searchQuery, selectedCategory, artisans]);

  const filterArtisans = () => {
    let filtered = [...artisans];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(artisan =>
        artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artisan.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artisan.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        artisan.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(artisan => artisan.category === selectedCategory);
    }

    setFilteredArtisans(filtered);
  };

  const openBookingModal = (artisan) => {
    setBookingModal(artisan);
    setBookingData({
      date: '',
      time: '',
      duration: '60',
      sessionType: 'learning',
      message: ''
    });
  };

  const closeBookingModal = () => {
    setBookingModal(null);
    setBookingData({
      date: '',
      time: '',
      duration: '60',
      sessionType: 'learning',
      message: ''
    });
  };

  const calculateSessionPrice = () => {
    if (!bookingModal) return 0;
    const sessionTypeData = sessionTypes.find(type => type.value === bookingData.sessionType);
    const duration = parseInt(bookingData.duration) || 60;
    const basePrice = sessionTypeData?.price || 500;
    return Math.round((basePrice * duration) / 60);
  };

  const handleBookSession = async () => {
    if (!bookingModal || !bookingData.date || !bookingData.time) {
      alert('Please fill in all required fields');
      return;
    }

    setBooking(true);

    try {
      const sessionBooking = {
        artisanId: bookingModal.id,
        artisanName: bookingModal.name,
        artisanCategory: bookingModal.category,
        buyerId: auth.currentUser.uid,
        buyerName: userData?.name || 'Customer',
        buyerEmail: userData?.email || auth.currentUser.email,
        sessionDate: bookingData.date,
        sessionTime: bookingData.time,
        duration: parseInt(bookingData.duration),
        sessionType: bookingData.sessionType,
        sessionTypeLabel: sessionTypes.find(type => type.value === bookingData.sessionType)?.label,
        price: calculateSessionPrice(),
        message: bookingData.message,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'sessionBookings'), sessionBooking);
      console.log('Session booking created:', docRef.id);

      alert(`Session booked successfully! 
      
Booking ID: ${docRef.id}
Artisan: ${bookingModal.name}
Date: ${bookingData.date}
Time: ${bookingData.time}
Duration: ${bookingData.duration} minutes
Price: ₹${calculateSessionPrice()}

The artisan will confirm your booking soon. You'll receive updates via email.`);

      closeBookingModal();

    } catch (error) {
      console.error('Error booking session:', error);
      alert('Failed to book session. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">🏺</span>
          </div>
          <div className="text-xl font-semibold text-gray-700">Loading artisans...</div>
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
                <h1 className="text-2xl font-bold text-gray-900">Live Learning Sessions</h1>
                <p className="text-gray-600">Book one-on-one sessions with master artisans</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{filteredArtisans.length} artisans available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Filters Section */}
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Artisans</label>
                  <Input
                    type="text"
                    placeholder="Search by name, skill, or craft..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Craft Category</label>
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

                {/* Session Types Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Session Types Available:</h3>
                  <div className="space-y-1 text-xs text-blue-800">
                    <div>📚 Learning Session - ₹500/hour</div>
                    <div>🎓 Advanced Workshop - ₹1000/hour</div>
                    <div>💬 Consultation - ₹300/hour</div>
                    <div>🛠️ Custom Project - ₹800/hour</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Artisans Grid */}
          {filteredArtisans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtisans.map((artisan) => (
                <Card key={artisan.id} className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl border border-gray-100">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">{artisan.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{artisan.name}</h3>
                        <p className="text-sm text-gray-600">{artisan.category}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${star <= Math.floor(artisan.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-sm text-gray-700 ml-1">{artisan.rating}</span>
                            <span className="text-xs text-gray-500 ml-2">({artisan.sessionsCompleted} sessions)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Shop Name */}
                    {artisan.shopName && (
                      <div className="mb-3">
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          🏪 {artisan.shopName}
                        </span>
                      </div>
                    )}

                    {/* Specializations */}
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Specializations:</h4>
                      <div className="flex flex-wrap gap-1">
                        {artisan.specializations.map((spec, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* About */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 line-clamp-2">{artisan.about}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 p-2 rounded-lg text-center">
                        <div className="text-lg font-bold text-green-700">₹{artisan.hourlyRate}</div>
                        <div className="text-xs text-green-600">Starting Price</div>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-lg text-center">
                        <div className="text-lg font-bold text-blue-700">{artisan.experience}</div>
                        <div className="text-xs text-blue-600">Experience</div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="mr-2">🗣️</span>
                        <span>Languages: {artisan.languages.join(', ')}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="mr-2">📍</span>
                        <span>{artisan.address.split(',')[0] || 'Location Available'}</span>
                      </div>
                      {artisan.hasVishwakarmaId && (
                        <div className="flex items-center text-xs text-green-600">
                          <span className="mr-2">🏛️</span>
                          <span>Government Certified (PM Vishwakarma)</span>
                        </div>
                      )}
                    </div>

                    {/* Availability Status */}
                    <div className="mb-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        artisan.availability === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        🟢 {artisan.availability}
                      </span>
                    </div>

                    {/* Book Session Button */}
                    <Button
                      onClick={() => openBookingModal(artisan)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 font-semibold rounded-lg transition-all duration-200"
                    >
                      📅 Book Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">👨‍🎨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No artisans found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || selectedCategory !== 'All' 
                    ? 'Try adjusting your search or filters.'
                    : 'No artisans are currently available for sessions.'}
                </p>
                {(searchQuery || selectedCategory !== 'All') && (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Book Session with {bookingModal.name}</h2>
                <button onClick={closeBookingModal} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Artisan Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{bookingModal.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{bookingModal.name}</h3>
                    <p className="text-sm text-gray-600">{bookingModal.category}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{bookingModal.about}</p>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                {/* Session Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type *</label>
                  <select
                    value={bookingData.sessionType}
                    onChange={(e) => setBookingData({...bookingData, sessionType: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {sessionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} - ₹{type.price}/hour ({type.desc})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      min={getMinDate()}
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                    <select
                      value={bookingData.time}
                      onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <select
                    value={bookingData.duration}
                    onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements (Optional)</label>
                  <textarea
                    value={bookingData.message}
                    onChange={(e) => setBookingData({...bookingData, message: e.target.value})}
                    placeholder="Tell the artisan what you'd like to learn or any specific requirements..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    rows={3}
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Session Summary:</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Session Type:</span>
                      <span>{sessionTypes.find(type => type.value === bookingData.sessionType)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{bookingData.duration} minutes</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total Price:</span>
                      <span>₹{calculateSessionPrice()}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={closeBookingModal}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBookSession}
                    disabled={booking || !bookingData.date || !bookingData.time}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3"
                  >
                    {booking ? 'Booking...' : `Book Session - ₹${calculateSessionPrice()}`}
                  </Button>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  * You'll receive confirmation and payment instructions via email. Sessions can be conducted online or in-person as per artisan's availability.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
