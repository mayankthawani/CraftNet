'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Onboarding = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    category: '',
    address: '',
    pincode: '',
    upiId: '',
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
        uid: uid
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
