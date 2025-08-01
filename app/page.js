"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="bg-white min-h-screen text-gray-900 overflow-x-hidden">
      {/* Mobile-First Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🏺</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CraftNet</span>
            <span className="hidden sm:inline text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              Rural India
            </span>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-orange-600 font-medium text-lg transition-colors">Home</a>
            <a href="#features" className="text-gray-700 hover:text-orange-600 font-medium text-lg transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-orange-600 font-medium text-lg transition-colors">How It Works</a>
            <a href="#contact" className="text-gray-700 hover:text-orange-600 font-medium text-lg transition-colors">Contact</a>
          </div>
          
          <Button className="hidden lg:block bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 py-4 bg-white border-t border-gray-100 space-y-4">
            <a href="#" className="block text-gray-700 hover:text-orange-600 font-medium text-lg py-2 transition-colors">Home</a>
            <a href="#features" className="block text-gray-700 hover:text-orange-600 font-medium text-lg py-2 transition-colors">Features</a>
            <a href="#how-it-works" className="block text-gray-700 hover:text-orange-600 font-medium text-lg py-2 transition-colors">How It Works</a>
            <a href="#contact" className="block text-gray-700 hover:text-orange-600 font-medium text-lg py-2 transition-colors">Contact</a>
            <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold shadow-lg mt-4">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile-Optimized Hero Section */}
      <section className="pt-20 px-4 py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-5"></div>
        <div className="max-w-7xl mx-auto relative w-full">
          <div className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Hero Text - Mobile First */}
            <div className="mb-12 lg:mb-0">
              <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-4 py-2 rounded-full mb-6 text-sm sm:text-base font-semibold shadow-md">
                🌾 Empowering Rural Artisans
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                From Village to World
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  Your Craft Matters
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed font-medium px-2 sm:px-0">
                Connect rural artisans with customers worldwide. Simple technology that works on any phone.
              </p>
              
              {/* Mobile-Optimized CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/seller/signup" className="flex-1 sm:flex-none">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl transform hover:scale-105 transition-all active:scale-95">
                    🏺 Start Selling
                  </Button>
                </Link>
                <Link href="/buyer/signup" className="flex-1 sm:flex-none">
                  <Button className="w-full bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl transform hover:scale-105 transition-all active:scale-95">
                    🛍️ Buy Crafts
                  </Button>
                </Link>
              </div>
              
              {/* Mobile-Friendly Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                <div className="flex items-center justify-center sm:justify-start gap-2 bg-white/50 rounded-lg p-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Works on Any Phone</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 bg-white/50 rounded-lg p-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Local Languages</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 bg-white/50 rounded-lg p-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>No Tech Knowledge</span>
                </div>
              </div>
            </div>

            {/* Mobile-Optimized Hero Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3 sm:space-y-4">
                  <img
                    src="image1.png"
                    alt="Indian artisan working"
                    className="w-full h-32 sm:h-48 object-cover rounded-xl sm:rounded-2xl shadow-lg"
                  />
                  <img
                    src="image2.png"
                    alt="Traditional weaving"
                    className="w-full h-40 sm:h-56 object-cover rounded-xl sm:rounded-2xl shadow-lg"
                  />
                </div>
                <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                  <img
                    src="image3.png"
                    alt="Handmade jewelry"
                    className="w-full h-40 sm:h-56 object-cover rounded-xl sm:rounded-2xl shadow-lg"
                  />
                  <img
                    src="image4.png"
                    alt="Rural craftwork"
                    className="w-full h-32 sm:h-48 object-cover rounded-xl sm:rounded-2xl shadow-lg"
                  />
                </div>
              </div>
              
              {/* Mobile-Friendly Floating Stats */}
              <div className="absolute -bottom-4 -left-2 bg-white rounded-xl p-3 shadow-xl border border-orange-100 text-center">
                <div className="text-lg font-bold text-orange-600">50K+</div>
                <div className="text-xs text-gray-600">Artisans</div>
              </div>
              <div className="absolute -top-4 -right-2 bg-white rounded-xl p-3 shadow-xl border border-green-100 text-center">
                <div className="text-lg font-bold text-green-600">₹100Cr+</div>
                <div className="text-xs text-gray-600">Earned</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Product Showcase */}
      <section className="px-4 py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold text-center text-gray-900 mb-3 sm:mb-4">Authentic Crafts</h2>
          <p className="text-lg sm:text-xl text-center text-gray-600 mb-8 sm:mb-16">From Rural India</p>
          
          {/* Mobile Swipeable Gallery */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {[
              "https://images.unsplash.com/photo-1610375461246-83df859d849d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1610375461369-d613b564d8e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1582582494215-0caec148d6cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
            ].map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Craft ${index + 1}`}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer shadow-lg flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-First Rural Focus Section */}
      <section className="px-4 py-12 sm:py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Mobile-First Content */}
            <div className="mb-8 lg:mb-0">
              <div className="text-4xl sm:text-6xl mb-4 text-center lg:text-left">🌾</div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 text-center lg:text-left">
                Built for Rural India
              </h2>
              
              {/* Mobile-Optimized Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                  <span className="text-2xl sm:text-3xl mb-2 sm:mb-3 block">📱</span>
                  <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">Works on Any Phone</h3>
                  <p className="text-gray-600 text-sm">Smartphones to basic phones</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                  <span className="text-2xl sm:text-3xl mb-2 sm:mb-3 block">🗣️</span>
                  <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">Local Languages</h3>
                  <p className="text-gray-600 text-sm">Hindi, Tamil, Telugu +15 more</p>
                </div>
              </div>
              
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed text-center lg:text-left">
                We understand rural challenges. CraftNet works with slow internet and basic phones.
              </p>
            </div>
            
            {/* Mobile-Optimized Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Rural village scene"
                className="w-full h-64 sm:h-80 object-cover rounded-xl sm:rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl sm:rounded-2xl"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                <div className="text-xl sm:text-2xl font-bold">2,500+ Villages</div>
                <div className="text-sm sm:text-lg opacity-90">Across 28 States</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Features */}
      <section id="features" className="px-4 py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-3 sm:mb-4">
            Simple Tools, Big Results
          </h2>
          <p className="text-lg sm:text-xl text-center text-gray-600 mb-8 sm:mb-16 max-w-3xl mx-auto">
            Everything you need for your craft business
          </p>
          
          {/* Mobile-First Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: "📸", title: "Easy Photo Upload", desc: "Take photos with any camera. AI makes them professional", color: "orange" },
              { icon: "🗣️", title: "Voice Descriptions", desc: "Speak in your language. We create descriptions", color: "green" },
              { icon: "🎥", title: "Live Craft Sessions", desc: "Teach online. Earn extra income", color: "purple" },
              { icon: "💰", title: "Direct Payments", desc: "Money to your bank. No delays", color: "yellow" }
            ].map((feature, index) => (
              <Card key={index} className={`text-center p-4 sm:p-6 lg:p-8 border-2 border-${feature.color}-100 rounded-xl sm:rounded-2xl hover:shadow-2xl hover:border-${feature.color}-300 transition-all transform hover:-translate-y-1 active:scale-95`}>
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
                  <span className="text-2xl sm:text-4xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-Optimized How It Works */}
      <section id="how-it-works" className="px-4 py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-8 sm:mb-16">How It Works</h2>

          {/* Mobile-First For Artisans */}
          <div className="mb-12 sm:mb-20">
            <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center text-orange-600 mb-6 sm:mb-12 flex items-center justify-center gap-2 sm:gap-4">
              <span className="text-3xl sm:text-5xl">🏺</span> For Artisans
            </h3>
            
            {/* Mobile Stack Layout */}
            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:gap-12">
              {[
                { num: "1", title: "Simple Sign Up", desc: "Just phone & Aadhaar. Village rep helps" },
                { num: "2", title: "Show Your Craft", desc: "Photos/videos. Speak in your language" },
                { num: "3", title: "Earn More", desc: "Orders from India & abroad. Fair prices" }
              ].map((step, index) => (
                <div key={index} className="text-center group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">{step.num}</span>
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4 text-gray-900">{step.title}</h4>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile-First For Customers */}
          <div>
            <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center text-green-600 mb-6 sm:mb-12 flex items-center justify-center gap-2 sm:gap-4">
              <span className="text-3xl sm:text-5xl">🛍️</span> For Buyers
            </h3>
            
            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:gap-12">
              {[
                { num: "1", title: "Discover Crafts", desc: "Browse authentic handmade products" },
                { num: "2", title: "Connect with Makers", desc: "Chat directly, customize orders" },
                { num: "3", title: "Support Communities", desc: "Every purchase helps village families" }
              ].map((step, index) => (
                <div key={index} className="text-center group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">{step.num}</span>
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4 text-gray-900">{step.title}</h4>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Success Stories */}
      <section className="px-4 py-12 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-3 sm:mb-4">
            Real Stories
          </h2>
          <p className="text-lg sm:text-xl text-center text-gray-600 mb-8 sm:mb-16">
            From Rural India
          </p>
          
          {/* Mobile-Stacked Stories */}
          <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12">
            {[
              {
                name: "Ravi Kumar",
                role: "Potter from Khurja, UP",
                before: "₹8,000",
                after: "₹25,000/month",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
                craft: "https://images.unsplash.com/photo-1578761499019-d9ae8ab76e24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
                quote: "My pots now reach Delhi and Mumbai. I can afford my son's education."
              },
              {
                name: "Meera Devi",
                role: "Weaver from Bhuj, Gujarat",
                before: "₹5,000",
                after: "₹18,000/month",
                image: "https://images.unsplash.com/photo-1594736797933-d0b22d3ecc44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
                craft: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
                quote: "Now I can take photos myself and sell sarees. It's very simple!"
              }
            ].map((story, index) => (
              <Card key={index} className="p-4 sm:p-6 lg:p-8 border-2 border-orange-100 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden">
                <div className="flex items-center mb-4 sm:mb-6">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl object-cover mr-3 sm:mr-4 lg:mr-6 border-2 sm:border-4 border-orange-100"
                  />
                  <div>
                    <h4 className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900">{story.name}</h4>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">{story.role}</p>
                    <div className="flex items-center gap-2 mt-1 sm:mt-2">
                      <span className="text-xs sm:text-sm text-red-600 font-semibold">{story.before}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-xs sm:text-sm text-green-600 font-semibold">{story.after}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <img
                    src={story.craft}
                    alt={`${story.name}'s work`}
                    className="w-full h-24 sm:h-32 object-cover rounded-lg sm:rounded-xl"
                  />
                </div>
                
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4 italic">
                  "{story.quote}"
                </p>
                
                <div className="text-yellow-500 text-lg sm:text-2xl">⭐⭐⭐⭐⭐</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-Optimized CTA */}
      <section className="px-4 py-12 sm:py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center relative">
          <span className="text-4xl sm:text-6xl mb-4 sm:mb-6 block">🌟</span>
          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8">Your Craft, Your Future</h2>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-12 opacity-95 leading-relaxed px-2">
            Join the digital revolution empowering rural India
          </p>
          
          {/* Mobile-First CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl text-lg sm:text-xl lg:text-2xl font-bold shadow-2xl transform hover:scale-105 active:scale-95 transition-all">
              🏺 Start Selling Today
            </Button>
            <Button className="border-2 sm:border-3 border-white text-white hover:bg-white hover:text-orange-600 px-8 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl text-lg sm:text-xl lg:text-2xl font-bold shadow-2xl transform hover:scale-105 active:scale-95 transition-all">
              🛍️ Explore Crafts
            </Button>
          </div>
          
          {/* Mobile-Optimized Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-sm sm:text-lg opacity-90">
            <div className="flex items-center justify-center gap-2 bg-white/10 rounded-lg p-3">
              <span className="text-xl sm:text-2xl">📞</span>
              <span>Free Support</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/10 rounded-lg p-3">
              <span className="text-xl sm:text-2xl">🏠</span>
              <span>Village Reps</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/10 rounded-lg p-3">
              <span className="text-xl sm:text-2xl">💰</span>
              <span>No Setup Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-8 sm:py-16">
        <div className="px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Brand */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg sm:text-xl">🏺</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold">CraftNet</span>
              </div>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Connecting rural artisans worldwide through simple technology
              </p>
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-4">
                <span className="text-xl sm:text-2xl">🇮🇳</span>
                <span className="text-gray-300 text-sm sm:text-base">Made in India, for India</span>
              </div>
            </div>

            {/* Footer Links - Mobile Optimized */}
            {[
              { title: "For Artisans", color: "orange", items: ["How to Start", "Photo Guide", "Payment Help", "Language Support"] },
              { title: "For Customers", color: "green", items: ["Browse Products", "How to Order", "Return Policy", "Reviews"] },
              { title: "Contact", color: "blue", items: ["1800-CRAFT-NET", "WhatsApp Support", "help@craftnet.in", "All India Coverage"] }
            ].map((section, index) => (
              <div key={index} className="text-center sm:text-left">
                <h4 className={`font-bold mb-4 sm:mb-6 text-lg sm:text-xl text-${section.color}-400`}>{section.title}</h4>
                <ul className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base lg:text-lg">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="hover:text-white cursor-pointer transition-colors py-1">
                      {section.title === "Contact" ? (
                        <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                          <span className="text-base sm:text-xl">
                            {itemIndex === 0 ? "📞" : itemIndex === 1 ? "💬" : itemIndex === 2 ? "📧" : "📍"}
                          </span>
                          <span>{item}</span>
                        </div>
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-6 sm:pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-center lg:text-left">
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                © 2025 CraftNet. Empowering Rural India 🌾 Made with ❤️ for Artisans 🇮🇳
              </p>
              <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                <span className="hover:text-white cursor-pointer">Privacy</span>
                <span className="hover:text-white cursor-pointer">Terms</span>
                <span className="hover:text-white cursor-pointer">Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
