'use client';

import React, { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const sellerSignup = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhoneToEmail = (phoneNumber) => {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Validate Indian phone number (10 digits starting with 6-9)
    if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
      // Use seller email format to differentiate from buyers
      return `seller_${cleaned}@craftnet.app`;
    }
    
    return null;
  };

  const validateInputs = () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return false;
    }

    if (!phone.trim()) {
      alert('Please enter your phone number');
      return false;
    }

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10 || !/^[6-9]/.test(cleaned)) {
      alert('Please enter a valid 10-digit Indian mobile number starting with 6-9');
      return false;
    }

    if (!password.trim()) {
      alert('Please enter a password');
      return false;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateInputs()) {
      return;
    }

    const email = formatPhoneToEmail(phone);
    if (!email) {
      alert('Invalid phone number format');
      return;
    }

    setLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        phone: phone.replace(/\D/g, ''), // Store clean phone number
        email: email,
        role: 'buyer',
        createdAt: new Date().toISOString(),
        uid: user.uid
      });

      alert('Signup successful! Welcome to CraftNet!');
      
      // TODO: Redirect to dashboard or home page
      console.log('User created:', user);
      
    } catch (error) {
      console.error('Error creating account:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/email-already-in-use') {
        alert('This phone number is already registered as a seller. Please use a different number or try logging in.');
      } else if (error.code === 'auth/weak-password') {
        alert('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid phone number format. Please try again.');
      } else {
        alert('Failed to create seller account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🏺</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Join CraftNet
          </CardTitle>
          <p className="text-gray-600">Sign up as a Seller</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="Enter your 10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-lg"
              maxLength={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: 9876543210 (10 digits starting with 6-9)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Create a password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-lg"
            />
          </div>
          
          {/* Permanent Role Field - Read-only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <div className="w-full p-3 border border-gray-300 rounded-lg text-lg bg-gray-50 cursor-not-allowed">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">🏪 Seller Account</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">PERMANENT</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This account type cannot be changed after registration
            </p>
          </div>
          
          <Button 
            onClick={handleSignup} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 text-lg font-semibold"
          >
            {loading ? 'Creating Seller Account...' : 'Create Seller Account'}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Want to buy products instead?{" "}
              <Link
                href="/buyer/signup"
                className="text-orange-600 hover:text-orange-700 font-medium underline"
              >
                Register as Buyer
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <Link
                href="/seller/login"
                className="text-orange-600 hover:text-orange-700 font-medium underline"
              >
                Seller Login
              </Link>
            </p>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default sellerSignup;
