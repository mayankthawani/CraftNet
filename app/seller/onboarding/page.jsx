'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

const Onboarding = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    category: '',
    address: '',
    pincode: '',
    upiId: '',
    vishwakarmaId: '',
    about: '',
    skills: ''
  });
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        try {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists() && docSnap.data().profileComplete) {
            router.push('/seller/dashboard');
            return;
          }
          
          // Pre-fill form with existing data if available
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setFormData(prev => ({
              ...prev,
              name: userData.name || '',
              shopName: userData.shopName || '',
              category: userData.category || userData.craftType || '',
              address: userData.address || userData.location || '',
              pincode: userData.pincode || '',
              upiId: userData.upiId || '',
              vishwakarmaId: userData.vishwakarmaId || '',
              about: userData.about || '',
              skills: userData.skills ? userData.skills.join(', ') : ''
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          alert('Error loading profile data. Please check your internet connection.');
        }
      } else {
        router.push('/seller/login');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const validateForm = () => {
    const required = ['name', 'shopName', 'category', 'address', 'pincode'];
    for (let field of required) {
      if (!formData[field].trim()) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    if (formData.pincode.length !== 6 || !/^\d+$/.test(formData.pincode)) {
      alert('Please enter a valid 6-digit pincode');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uid || !validateForm()) return;

    setLoading(true);

    try {
      const userRef = doc(db, 'users', uid);
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      await setDoc(userRef, {
        ...formData,
        skills: skillsArray,
        profileComplete: true,
        role: 'seller',
        updatedAt: new Date().toISOString(),
        uid: uid,
        hasVishwakarmaId: !!formData.vishwakarmaId.trim()
      }, { merge: true });

      alert('Profile completed successfully!');
      router.push('/seller/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.code === 'unavailable') {
        alert('Network error. Please check your internet connection and try again.');
      } else if (error.code === 'permission-denied') {
        alert('Permission denied. Please make sure you are logged in.');
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🏺</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Artisan Profile
          </h1>
          <p className="text-gray-600">Let's set up your craft business profile</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop/Business Name *
              </label>
              <input
                type="text"
                placeholder="Enter your shop name"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Craft Category *
            </label>
            <input
              type="text"
              placeholder="e.g., Pottery, Textiles, Jewelry, Woodwork"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                placeholder="Enter your full address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                placeholder="6-digit pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                maxLength={6}
                required
              />
            </div>
          </div>

          {/* Government Benefits Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🏛️</span>
              <h3 className="text-lg font-semibold text-blue-900">Government Benefits</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  PM Vishwakarma ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter your PM Vishwakarma ID if you have one"
                  value={formData.vishwakarmaId}
                  onChange={(e) => setFormData({ ...formData, vishwakarmaId: e.target.value })}
                  className="w-full p-3 border border-blue-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-blue-700 mt-1">
                  This helps you get government benefits and recognition
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Don't have PM Vishwakarma ID?
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  Get up to ₹3 lakh loan, free training, and government recognition through PM Vishwakarma Yojana!
                </p>
                <Link 
                  href="/seller/vishwakarma-guide"
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <span className="mr-2">📋</span>
                  Learn How to Register
                </Link>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID (for payments)
            </label>
            <input
              type="text"
              placeholder="yourname@paytm or yourname@gpay"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills & Expertise
            </label>
            <input
              type="text"
              placeholder="e.g., Traditional pottery, Hand weaving, Silver jewelry (comma separated)"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Your Craft
            </label>
            <textarea
              placeholder="Tell customers about your craft, experience, and what makes your work special..."
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg min-h-[100px] focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 text-xl font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Saving Profile...' : 'Complete Profile & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
