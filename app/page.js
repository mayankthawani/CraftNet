"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="bg-white min-h-screen text-gray-900">
      {/* Navigation */}
      <nav className="px-4 lg:px-8 py-4 bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">🏺</span>
            </div>
            <span className="text-2xl lg:text-3xl font-bold text-gray-900">CraftNet</span>
            <span className="hidden sm:inline text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              Rural India
            </span>
          </div>
          <div className="hidden lg:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-orange-600 font-medium text-lg transition-colors">
              Home
            </a>
            <a href="#features" className="text-gray-700 hover:text-orange-600 font-medium text-lg transition-colors">
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-orange-600 font-medium text-lg transition-colors"
            >
              How It Works
            </a>
            <a href="#contact" className="text-gray-700 hover:text-orange-600 font-medium text-lg transition-colors">
              Contact
            </a>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg transform hover:scale-105 transition-all">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 lg:px-8 py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div>
              <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-6 py-3 rounded-full mb-8 text-lg font-semibold shadow-md">
                🌾 Empowering Rural Artisans Across India
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                From Village to World
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  Your Craft Matters
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-700 mb-12 leading-relaxed font-medium">
                Connect rural artisans with customers worldwide. Simple technology that works on any phone. Sell your
                traditional crafts, earn better income, preserve your heritage.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">

                <Link href="/seller/signup">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-xl transform hover:scale-105 transition-all">
                    🏺 Start Selling Your Crafts
                  </Button>
                </Link>
                <Link href="/buyer/signup">
                  <Button className="bg-white border-3 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-xl transform hover:scale-105 transition-all">
                    🛍️ Buy Authentic Crafts
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Works on Basic Phones</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Available in Local Languages</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>No Technical Knowledge Needed</span>
                </div>
              </div>
            </div>

            {/* Hero Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1594736797933-d0b22d3ecc44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Indian artisan working on pottery"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Traditional textile weaving"
                    className="w-full h-56 object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Handmade jewelry crafting"
                    className="w-full h-56 object-cover rounded-2xl shadow-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Rural craftwork"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-orange-100">
                <div className="text-2xl font-bold text-orange-600">50K+</div>
                <div className="text-sm text-gray-600">Happy Artisans</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-green-100">
                <div className="text-2xl font-bold text-green-600">₹100Cr+</div>
                <div className="text-sm text-gray-600">Earned by Artisans</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Gallery */}
      <section className="px-4 lg:px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Authentic Crafts from Rural India</h2>
          <p className="text-xl text-center text-gray-600 mb-16">
            Discover the beauty of traditional craftsmanship
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <img
              src="https://images.unsplash.com/photo-1610375461246-83df859d849d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
              alt="Handmade pottery"
              className="w-full h-32 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
            />
            <img
              src="https://images.unsplash.com/photo-1591814468924-caf88d1232e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
              alt="Traditional textiles"
              className="w-full h-32 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
            />
            <img
              src="https://images.unsplash.com/photo-1610375461369-d613b564d8e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
              alt="Handcrafted jewelry"
              className="w-full h-32 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
            />
            <img
              src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
              alt="Wooden crafts"
              className="w-full h-32 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
            />
            <img
              src="https://images.unsplash.com/photo-1582582494215-0caec148d6cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
              alt="Traditional paintings"
              className="w-full h-32 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
            />
            <img
              src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
              alt="Handicrafts"
              className="w-full h-32 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Rural Focus Section */}
      <section className="px-4 lg:px-8 py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-6xl mb-4 block">🌾</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">Built for Rural India</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <span className="text-3xl mb-3 block">📱</span>
                  <h3 className="text-lg font-bold mb-2">Works on Any Phone</h3>
                  <p className="text-gray-600 text-sm">From smartphones to basic phones</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <span className="text-3xl mb-3 block">🗣️</span>
                  <h3 className="text-lg font-bold mb-2">Local Languages</h3>
                  <p className="text-gray-600 text-sm">Hindi, Tamil, Telugu, Bengali +15 more</p>
                </div>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed">
                We understand rural challenges. That's why CraftNet works with slow internet, basic phones,
                and provides support in your local language.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Rural village scene"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-2xl font-bold">2,500+ Villages</div>
                <div className="text-lg opacity-90">Across 28 States</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 lg:px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-4">Simple Tools, Big Results</h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            Everything you need to turn your craft into a thriving business
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8 border-2 border-orange-100 rounded-2xl hover:shadow-2xl hover:border-orange-300 transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📸</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Easy Photo Upload</h3>
              <p className="text-gray-600 leading-relaxed">
                Take photos with any phone camera. Our AI makes them look professional automatically
              </p>
            </Card>

            <Card className="text-center p-8 border-2 border-green-100 rounded-2xl hover:shadow-2xl hover:border-green-300 transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🗣️</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Voice Descriptions</h3>
              <p className="text-gray-600 leading-relaxed">
                Speak about your product in your language. We'll create beautiful descriptions
              </p>
            </Card>

            <Card className="text-center p-8 border-2 border-purple-100 rounded-2xl hover:shadow-2xl hover:border-purple-300 transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎥</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Live Craft Sessions</h3>
              <p className="text-gray-600 leading-relaxed">
                Teach your craft online. Earn extra income by sharing your knowledge
              </p>
            </Card>

            <Card className="text-center p-8 border-2 border-yellow-100 rounded-2xl hover:shadow-2xl hover:border-yellow-300 transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Direct Bank Payments</h3>
              <p className="text-gray-600 leading-relaxed">
                Money goes straight to your bank account. No delays, no complications
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 lg:px-8 py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-16">How It Works</h2>

          {/* For Artisans */}
          <div className="mb-20">
            <h3 className="text-3xl lg:text-4xl font-bold text-center text-orange-600 mb-12 flex items-center justify-center gap-4">
              <span className="text-5xl">🏺</span> For Village Artisans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  <span className="text-white text-3xl font-bold">1</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Simple Sign Up</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Just your phone number and Aadhaar. Our village representative will help you
                </p>
              </div>
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  <span className="text-white text-3xl font-bold">2</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Show Your Craft</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Take photos or record videos. Speak in your language about your products
                </p>
              </div>
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  <span className="text-white text-3xl font-bold">3</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Earn More Money</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Get orders from across India and abroad. Fair prices for your beautiful work
                </p>
              </div>
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold text-center text-green-600 mb-12 flex items-center justify-center gap-4">
              <span className="text-5xl">🛍️</span> For Craft Lovers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  <span className="text-white text-3xl font-bold">1</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Discover Authentic Crafts</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Browse thousands of genuine handmade products from rural India
                </p>
              </div>
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  <span className="text-white text-3xl font-bold">2</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Connect with Artisans</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Chat directly with makers, customize orders, learn their stories
                </p>
              </div>
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  <span className="text-white text-3xl font-bold">3</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Support Rural Communities</h4>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Every purchase directly supports village families and preserves traditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="px-4 lg:px-8 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-4">
            Real Stories from Rural India
          </h2>
          <p className="text-xl text-center text-gray-600 mb-16">
            See how CraftNet is changing lives in villages across India
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8 border-2 border-orange-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
                  alt="Ravi Kumar - Potter"
                  className="w-20 h-20 rounded-2xl object-cover mr-6 border-4 border-orange-100"
                />
                <div>
                  <h4 className="font-bold text-2xl text-gray-900">Ravi Kumar</h4>
                  <p className="text-gray-600 text-lg">Potter from Khurja, Uttar Pradesh</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-red-600 font-semibold">₹8,000</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm text-green-600 font-semibold">₹25,000/month</span>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <img
                  src="https://images.unsplash.com/photo-1578761499019-d9ae8ab76e24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                  alt="Ravi's pottery work"
                  className="w-full h-32 object-cover rounded-xl"
                />
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                "मैं 30 साल से मिट्टी के बर्तन बनाता था लेकिन सिर्फ गांव में बेच पाता था। CraftNet के साथ अब मेरे बर्तन दिल्ली, मुंबई तक
                जाते हैं। मेरे बेटे की पढ़ाई का खर्च निकल जाता है।"
              </p>
              <p className="text-gray-600 text-base italic mb-4">
                "I've been making pottery for 30 years but could only sell in my village. With CraftNet, my pots now
                reach Delhi and Mumbai. I can afford my son's education."
              </p>
              <div className="text-yellow-500 text-2xl">⭐⭐⭐⭐⭐</div>
            </Card>

            <Card className="p-8 border-2 border-pink-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1594736797933-d0b22d3ecc44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
                  alt="Meera Devi - Textile Weaver"
                  className="w-20 h-20 rounded-2xl object-cover mr-6 border-4 border-pink-100"
                />
                <div>
                  <h4 className="font-bold text-2xl text-gray-900">Meera Devi</h4>
                  <p className="text-gray-600 text-lg">Textile Weaver from Bhuj, Gujarat</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-red-600 font-semibold">₹5,000</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm text-green-600 font-semibold">₹18,000/month</span>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <img
                  src="https://images.unsplash.com/photo-1591814468924-caf88d1232e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                  alt="Meera's textile work"
                  className="w-full h-32 object-cover rounded-xl"
                />
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                "મારી દીકરીએ મને CraftNet વાપરતા શીખવ્યું. હવે હું પોતે જ ફોટો લઈ શકું છું અને સાડીઓ વેચી શકું છું. બહુ સરળ છે!"
              </p>
              <p className="text-gray-600 text-base italic mb-4">
                "My daughter taught me to use CraftNet. Now I can take photos myself and sell sarees. It's very simple!"
              </p>
              <div className="text-yellow-500 text-2xl">⭐⭐⭐⭐⭐</div>
            </Card>
          </div>

          <div className="mt-16">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Craft Categories on CraftNet</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                <div className="text-center">
                  <img
                    src="https://images.unsplash.com/photo-1578761499019-d9ae8ab76e24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                    alt="Pottery"
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                  />
                  <span className="text-orange-600 font-semibold">Pottery</span>
                </div>
                <div className="text-center">
                  <img
                    src="https://images.unsplash.com/photo-1591814468924-caf88d1232e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                    alt="Textiles"
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                  />
                  <span className="text-green-600 font-semibold">Textiles</span>
                </div>
                <div className="text-center">
                  <img
                    src="https://images.unsplash.com/photo-1582582494215-0caec148d6cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                    alt="Paintings"
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                  />
                  <span className="text-blue-600 font-semibold">Paintings</span>
                </div>
                <div className="text-center">
                  <img
                    src="https://images.unsplash.com/photo-1610375461369-d613b564d8e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                    alt="Jewelry"
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                  />
                  <span className="text-purple-600 font-semibold">Jewelry</span>
                </div>
                <div className="text-center">
                  <img
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                    alt="Woodwork"
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                  />
                  <span className="text-red-600 font-semibold">Woodwork</span>
                </div>
                <div className="text-center">
                  <img
                    src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                    alt="Handicrafts"
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                  />
                  <span className="text-yellow-600 font-semibold">Handicrafts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Income Comparison Visual */}
      <section className="px-4 lg:px-8 py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            See the Income Transformation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-600 mb-6">Before CraftNet</h3>
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Village market"
                className="w-full h-48 object-cover rounded-2xl mb-6 filter grayscale"
              />
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-red-600 mb-2">₹3,000-8,000</div>
                <div className="text-gray-600">Monthly Income</div>
                <div className="text-sm text-gray-500 mt-2">• Limited to local markets</div>
                <div className="text-sm text-gray-500">• Lower prices</div>
                <div className="text-sm text-gray-500">• Seasonal demand</div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-6">After CraftNet</h3>
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Global marketplace"
                className="w-full h-48 object-cover rounded-2xl mb-6"
              />
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">₹15,000-35,000</div>
                <div className="text-gray-600">Monthly Income</div>
                <div className="text-sm text-green-600 mt-2">• Global customer reach</div>
                <div className="text-sm text-green-600">• Premium pricing</div>
                <div className="text-sm text-green-600">• Year-round orders</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 lg:px-8 py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center relative">
          <span className="text-6xl mb-6 block">🌟</span>
          <h2 className="text-4xl lg:text-6xl font-bold mb-8">Your Craft, Your Future</h2>
          <p className="text-xl lg:text-2xl mb-12 opacity-95 leading-relaxed">
            Join the digital revolution that's empowering rural India. Turn your traditional skills into a modern
            business.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-12 py-6 rounded-2xl text-xl lg:text-2xl font-bold shadow-2xl transform hover:scale-105 transition-all">
              🏺 Start Selling Today
            </Button>
            <Button className="border-3 border-white text-white hover:bg-white hover:text-orange-600 px-12 py-6 rounded-2xl text-xl lg:text-2xl font-bold shadow-2xl transform hover:scale-105 transition-all">
              🛍️ Explore Crafts
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-lg opacity-90">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📞</span>
              <span>Free Phone Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <span>Village Representatives</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span>No Setup Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">🏺</span>
                </div>
                <span className="text-2xl font-bold">CraftNet</span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Connecting rural artisans with the world through simple technology
              </p>
              <div className="flex space-x-4">
                <span className="text-2xl">🇮🇳</span>
                <span className="text-gray-300">Made in India, for India</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-xl text-orange-400">For Artisans</h4>
              <ul className="space-y-3 text-gray-300 text-lg">
                <li className="hover:text-white cursor-pointer transition-colors">📱 How to Start</li>
                <li className="hover:text-white cursor-pointer transition-colors">📸 Photo Guide</li>
                <li className="hover:text-white cursor-pointer transition-colors">💰 Payment Help</li>
                <li className="hover:text-white cursor-pointer transition-colors">🗣️ Language Support</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-xl text-green-400">For Customers</h4>
              <ul className="space-y-3 text-gray-300 text-lg">
                <li className="hover:text-white cursor-pointer transition-colors">🛍️ Browse Products</li>
                <li className="hover:text-white cursor-pointer transition-colors">📦 How to Order</li>
                <li className="hover:text-white cursor-pointer transition-colors">🔄 Return Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">⭐ Reviews</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-xl text-blue-400">Contact & Support</h4>
              <ul className="space-y-3 text-gray-300 text-lg">
                <li className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <span>1800-CRAFT-NET</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">💬</span>
                  <span>WhatsApp Support</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">📧</span>
                  <span>help@craftnet.in</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <span>All India Coverage</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <p className="text-gray-300 text-lg">
                © 2025 CraftNet. Empowering Rural India 🌾 Made with ❤️ for Artisans 🇮🇳
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <span className="hover:text-white cursor-pointer">Privacy Policy</span>
                <span className="hover:text-white cursor-pointer">Terms of Service</span>
                <span className="hover:text-white cursor-pointer">Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
