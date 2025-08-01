'use client';

import React from 'react';
import Link from 'next/link';

const VishwakarmaGuide = () => {
  const eligibleTrades = [
    'Carpenter (बढ़ई)', 'Blacksmith (लोहार)', 'Tailor (दर्जी)', 'Cobbler (मोची)',
    'Potter (कुम्हार)', 'Weaver (बुनकर)', 'Mason (राजमिस्त्री)', 'Goldsmith (सुनार)',
    'Barber (नाई)', 'Washerman (धोबी)', 'Boat Maker (नाव बनाने वाला)', 'Armorer (शस्त्रकार)',
    'Lock Smith (ताला बनाने वाला)', 'Hammer and Toolkit Maker (हथौड़ा और औजार निर्माता)',
    'Fishing Net Maker (मछली पकड़ने के जाल बनाने वाला)', 'Sculptor (मूर्तिकार)',
    'Stone Carver (पत्थर तराशने वाला)', 'Basket/Mat/Broom/Rope Maker (टोकरी/चटाई/झाड़ू/रस्सी बनाने वाला)'
  ];

  const benefits = [
    { icon: '💰', title: 'Collateral-free Loan', desc: 'Up to ₹3 lakh at low interest rates' },
    { icon: '🎓', title: 'Free Training', desc: '5-7 days basic training + 15 days advanced training' },
    { icon: '🛠️', title: 'Modern Toolkit', desc: 'Up to ₹15,000 for modern tools and equipment' },
    { icon: '📜', title: 'Government Certificate', desc: 'Official recognition as skilled artisan' },
    { icon: '🏪', title: 'Market Linkage', desc: 'Connect with buyers and e-commerce platforms' },
    { icon: '💳', title: 'Digital Payments', desc: 'Support for digital transactions and UPI' }
  ];

  const documents = [
    { icon: '🆔', name: 'Aadhaar Card', required: true },
    { icon: '📱', name: 'Mobile Number (linked with Aadhaar)', required: true },
    { icon: '🏦', name: 'Bank Account Details', required: true },
    { icon: '📄', name: 'Ration Card', required: false },
    { icon: '📸', name: 'Passport Size Photo', required: true },
    { icon: '🏠', name: 'Address Proof', required: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/seller/onboarding" className="mr-4">
                <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <span className="mr-2">←</span>
                  Back to Profile
                </button>
              </Link>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">🏛️</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">PM Vishwakarma Yojana</h1>
                  <p className="text-gray-600">Government Support for Artisans</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">🚀 Transform Your Craft Business</h2>
          <p className="text-xl mb-6 opacity-90">
            Get up to ₹3 lakh loan, free training, and government recognition through PM Vishwakarma Yojana!
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="font-semibold">50+ Lakh</span> Artisans Benefited
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="font-semibold">₹13,000 Cr</span> Budget Allocated
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="font-semibold">18</span> Eligible Trades
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">🎁</span>
            What You Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start p-4 bg-blue-50 rounded-xl">
                <span className="text-2xl mr-4 flex-shrink-0">{benefit.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">✅</span>
            Eligibility Checklist
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements:</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Age 18 years or older</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Belong to eligible artisan trade</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Not a taxpayer (no income tax filed)</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 mr-3">✓</span>
                  <span>Not working in government job</span>
                </div>
              </div>
            </div>

            {/* Eligible Trades */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligible Trades:</h3>
              <div className="bg-blue-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {eligibleTrades.map((trade, index) => (
                    <div key={index} className="flex items-center text-sm text-blue-900">
                      <span className="mr-2">🔹</span>
                      {trade}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Required */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">📄</span>
            Documents Required
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc, index) => (
              <div key={index} className={`flex items-center p-4 rounded-xl ${
                doc.required ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <span className="text-2xl mr-3">{doc.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className={`text-xs ${doc.required ? 'text-red-600' : 'text-yellow-600'}`}>
                    {doc.required ? 'Required' : 'Optional'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Process */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">📝</span>
            How to Register (Step-by-Step)
          </h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Official Portal</h3>
                <p className="text-gray-600 mb-3">Go to the official PM Vishwakarma portal:</p>
                <a 
                  href="https://pmvishwakarma.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <span className="mr-2">🌐</span>
                  pmvishwakarma.gov.in
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Nearest CSC Center</h3>
                <p className="text-gray-600 mb-3">Visit your nearest Common Service Centre (CSC) for registration assistance:</p>
                <a 
                  href="https://locator.csccloud.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <span className="mr-2">📍</span>
                  Find CSC Near You
                </a>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Registration</h3>
                <p className="text-gray-600 mb-3">The CSC operator will help you with:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <span className="mr-2">👆</span>
                    <span className="text-sm">Biometric verification</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <span className="mr-2">📤</span>
                    <span className="text-sm">Document upload</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <span className="mr-2">📝</span>
                    <span className="text-sm">Form filling</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <span className="mr-2">🧾</span>
                    <span className="text-sm">Get receipt number</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Your Benefits</h3>
                <p className="text-gray-600 mb-3">After verification, you'll receive:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <span className="text-2xl block mb-1">📜</span>
                    <span className="text-sm font-medium">PM Vishwakarma Certificate</span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <span className="text-2xl block mb-1">🆔</span>
                    <span className="text-sm font-medium">Unique Vishwakarma ID</span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <span className="text-2xl block mb-1">💰</span>
                    <span className="text-sm font-medium">Access to Benefits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-yellow-900 mb-4 flex items-center">
            <span className="mr-3">⚠️</span>
            Important Notes
          </h2>
          <div className="space-y-3 text-yellow-800">
            <div className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>Registration is completely FREE. Don't pay anyone for registration.</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>You must visit CSC center in person for biometric verification.</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>Keep your acknowledgement receipt safe for future reference.</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2 mt-1">•</span>
              <span>Approval process may take 15-30 days after submission.</span>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">🆘</span>
            Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-3">Helpline Numbers:</h3>
              <div className="space-y-2 text-blue-800">
                <div>📞 Toll-Free: <strong>1800-11-6666</strong></div>
                <div>💬 WhatsApp: <strong>+91-11-2376-4444</strong></div>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="font-semibold text-green-900 mb-3">Office Hours:</h3>
              <div className="space-y-2 text-green-800">
                <div>🕒 Monday to Friday: 9:00 AM to 6:00 PM</div>
                <div>📧 Email: <strong>support@pmvishwakarma.gov.in</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Profile Button */}
        <div className="mt-8 text-center">
          <Link href="/seller/onboarding">
            <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105">
              ← Back to Complete Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VishwakarmaGuide;
