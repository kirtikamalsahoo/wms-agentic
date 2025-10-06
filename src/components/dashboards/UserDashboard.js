'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, productData, getTrendingProducts } from '../../data/products';
import { CartProvider, useCart } from '../../context/CartContext';
import ProductModal from '../ProductModal';
import Cart from '../Cart';
import FlyingCartAnimation from '../FlyingCartAnimation';
import MyOrders from '../MyOrders';
import { productImages, getRandomImage, getImageByCategory, getSpecificProductImage, getSmartProductImage as getEnhancedProductImage } from '../../utils/productImages';

// Use the enhanced smart image mapping function from utils

const UserDashboardContent = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [aiSearchFocused, setAiSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [flyingAnimation, setFlyingAnimation] = useState({
    isActive: false,
    productImage: '',
    startPosition: null
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  
  const { getCartItemsCount, addToCart } = useCart();
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const trendingProducts = getTrendingProducts();

  // Get all products for selected category/subcategory
  const getAllProducts = () => {
    let allProducts = [];
    
    if (selectedCategory === 'all') {
      // Get all products from all categories
      Object.keys(productData).forEach(category => {
        Object.keys(productData[category]).forEach(subCategory => {
          allProducts.push(...productData[category][subCategory]);
        });
      });
    } else {
      // Get products from selected category
      if (selectedSubCategory === 'all') {
        Object.keys(productData[selectedCategory] || {}).forEach(subCategory => {
          allProducts.push(...productData[selectedCategory][subCategory]);
        });
      } else {
        allProducts = productData[selectedCategory]?.[selectedSubCategory] || [];
      }
    }
    
    return allProducts;
  };

  const filteredProducts = getAllProducts().filter(product => {
    // If AI search results are showing, don't filter regular products by search query
    // Only filter if no AI search results are displayed or if it's a regular product search
    if (showSearchResults) {
      return true; // Show all products when AI results are displayed
    }
    
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddToCartWithAnimation = (product, element) => {
    // Get the position of the clicked element
    const rect = element.getBoundingClientRect();
    const startPosition = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    // Start the flying animation
    setFlyingAnimation({
      isActive: true,
      productImage: product.image,
      startPosition
    });

    // Add to cart
    addToCart(product);
  };

  const completeFlyingAnimation = () => {
    setFlyingAnimation({
      isActive: false,
      productImage: '',
      startPosition: null
    });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory('all');
  };

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // AI Search API call
  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowSearchResults(false);
    setSearchError(null);
    
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          top_k: 5
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle different possible response structures
        // The API returns data in 'products' array
        const results = data.products || data.results || data.data || data || [];
        setSearchResults(Array.isArray(results) ? results : []);
        setSearchError(null);
        setShowSearchResults(true);
        console.log('AI Search Results:', results); // Debug log
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Search API failed:', response.statusText, errorData);
        setSearchError(errorData.error || `Search failed: ${response.statusText}`);
        setSearchResults([]);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Error calling AI search API:', error);
      setSearchError('Failed to connect to search service. Please try again.');
      setSearchResults([]);
      setShowSearchResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Get subcategories for selected category
  const getSubCategories = () => {
    if (selectedCategory === 'all') return [];
    return categories.find(cat => cat.id === selectedCategory)?.subCategories || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xl">🛍️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Product Explorer</h1>
                <p className="text-sm text-gray-400">Welcome back, {user}</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setIsCartOpen(true)}
                data-cart-button
                className="relative px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-all duration-300 flex items-center space-x-2"
              >
                <span className="text-lg">🛒</span>
                <span>Cart</span>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </motion.button>

              {/* User Avatar Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl ring-2 ring-white/20 hover:ring-white/40"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      {/* Header with user info */}
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-purple-500/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{user}</p>
                            <p className="text-purple-300 text-xs">Premium User</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu items */}
                      <div className="py-2">
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.15)' }}
                          onClick={() => {
                            setIsOrdersOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-gray-200 hover:text-white transition-all duration-200 flex items-center space-x-3 group"
                        >
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                          </div>
                          <div>
                            <span className="font-medium">My Orders</span>
                            <p className="text-xs text-gray-400">View order history</p>
                          </div>
                        </motion.button>

                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.15)' }}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full text-left px-4 py-3 text-gray-200 hover:text-white transition-all duration-200 flex items-center space-x-3 group"
                        >
                          <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                            <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.98C19.47,12.66 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.02L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.65 15.48,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.52,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11.02C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.52,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.48,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.98Z"/>
                            </svg>
                          </div>
                          <div>
                            <span className="font-medium">Settings</span>
                            <p className="text-xs text-gray-400">Account preferences</p>
                          </div>
                        </motion.button>
                        
                        <div className="mx-2 my-2 border-t border-gray-600"></div>
                        
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                          onClick={() => {
                            onLogout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-gray-200 hover:text-red-400 transition-all duration-200 flex items-center space-x-3 group"
                        >
                          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
                            </svg>
                          </div>
                          <div>
                            <span className="font-medium">Sign Out</span>
                            <p className="text-xs text-gray-400">Leave your account</p>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* AI Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 relative z-20"
        >
          <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-white">AI-Powered Search</h2>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>
              <motion.img 
                src="/assets/search.png" 
                alt="AI Search"
                animate={isSearching ? {
                  scale: [1, 1.2, 1.3, 1.1, 1],
                  x: [0, -30, 80, -20, 120, 0],
                  rotate: [0, -8, 15, -5, 12, 0]
                } : {}}
                transition={isSearching ? {
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
                className={`${isSearching ? 'w-96 h-96' : 'w-64 h-64'} object-contain transition-all duration-300`}
              />
            </div>
            
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: aiSearchFocused 
                    ? '0 0 30px rgba(139, 92, 246, 0.3)' 
                    : '0 0 10px rgba(139, 92, 246, 0.1)'
                }}
                className="relative"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setAiSearchFocused(true)}
                  onBlur={(e) => {
                    // Add delay to allow clicking on suggestions
                    setTimeout(() => setAiSearchFocused(false), 200);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSearching && searchQuery.trim()) {
                      handleAISearch();
                    }
                  }}
                  placeholder="Ask AI: 'Find me budget phones under ₹30k' or 'Show trending electronics'..."
                  className="w-full px-16 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  {/* <span className="text-purple-400 text-xl">🔍</span> */}
                  <span className="text-purple-400 text-xl">✨</span>
                </div>
                <button 
                  onClick={handleAISearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all duration-300 flex items-center space-x-2"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <span>Search</span>
                  )}
                </button>
              </motion.div>
              
              <AnimatePresence>
                {aiSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 z-50 shadow-2xl"
                  >
                    <div className="text-gray-400 text-sm mb-2">AI Suggestions:</div>
                    <div className="space-y-2">
                      {['Show Nike Products', 'Trending fashion items', 'Home essentials', 'Latest laptops'].map((suggestion, index) => (
                        <button
                          key={`ai-suggestion-${index}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchQuery(suggestion);
                            setAiSearchFocused(false);
                            // Trigger search after a short delay to allow state to update
                            setTimeout(() => {
                              handleAISearch();
                            }, 100);
                          }}
                          className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* AI Search Results Section */}
        <AnimatePresence>
          {showSearchResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <span>🤖</span>
                  <span>AI Search Results</span>
                  <span className="text-sm text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                    &quot;{searchQuery}&quot;
                  </span>
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 text-sm">
                    {searchResults.length} results found
                  </span>
                  <button
                    onClick={() => setShowSearchResults(false)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {searchError ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 backdrop-blur-xl bg-red-500/5 rounded-xl border border-red-500/20"
                >
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Search Error</h3>
                  <p className="text-red-400 mb-4">{searchError}</p>
                  <button
                    onClick={handleAISearch}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-medium transition-all duration-300"
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={`ai-result-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 group relative"
                    >
                      {/* Product Image */}
                      <div className="relative mb-4">
                        <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                          <img
                            src={result.image || result.product_image || getEnhancedProductImage(result)}
                            alt={result.product_name || result.title || result.name || 'AI Product'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback to smart image if the provided image fails to load
                              e.target.src = getEnhancedProductImage(result);
                            }}
                          />
                        </div>
                        {result.discount && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            -{result.discount}%
                          </span>
                        )}
                        <div className="absolute top-2 left-2 flex items-center space-x-1">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-white text-sm">{result.rating || '4.2'}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          AI
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                            {result.product_name || result.title || result.name || 'AI Recommendation'}
                          </h4>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {result.description || result.content || 'AI-powered search result based on your query.'}
                          </p>
                          {result.brand && (
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-blue-400 text-xs bg-blue-500/20 px-2 py-1 rounded-full">
                                {result.brand}
                              </span>
                              {result.color && (
                                <span className="text-gray-400 text-xs">
                                  Color: {result.color}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {result.score && (
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-white text-sm">Relevance: {(result.score * 100).toFixed(1)}%</span>
                          <div className="flex-1 bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${result.score * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {result.price && (
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-white font-bold text-lg">
                              {typeof result.price === 'number' ? formatPrice(result.price) : result.price}
                            </span>
                            {result.originalPrice && result.originalPrice > result.price && (
                              <span className="text-gray-400 text-sm line-through ml-2">
                                {formatPrice(result.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            {result.category && (
                              <span className="text-purple-400 text-sm bg-purple-500/20 px-2 py-1 rounded-full">
                                {result.category}
                              </span>
                            )}
                            {result.sub_category && (
                              <span className="text-blue-400 text-xs bg-blue-500/20 px-2 py-1 rounded-full">
                                {result.sub_category}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Stock Information */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">Stock:</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          (result.stock === undefined || result.stock > 0)
                            ? 'text-green-400 bg-green-400/10' 
                            : 'text-red-400 bg-red-400/10'
                        }`}>
                          {result.stock !== undefined 
                            ? (result.stock > 0 ? `${result.stock} available` : 'Out of Stock')
                            : 'Available'
                          }
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Convert API result to product format for modal
                            const productForModal = {
                              id: result.product_id || `ai-product-${index}`,
                              name: result.product_name || result.title || 'AI Recommended Product',
                              description: result.description || 'AI-powered product recommendation based on your search.',
                              price: result.price || 0,
                              originalPrice: result.originalPrice || (result.price ? result.price * 1.2 : 0),
                              brand: result.brand || 'Unknown Brand',
                              category: result.category || 'General',
                              subCategory: result.sub_category || 'Other',
                              color: result.color || 'Not specified',
                              inStock: result.stock > 0,
                              stock: result.stock || 0,
                              image: result.image || result.product_image || getEnhancedProductImage(result),
                              rating: result.rating || 4.2,
                              discount: result.discount || null,
                              features: result.features || ['AI Recommended', 'High Quality', 'Popular Choice'],
                              specifications: result.specifications || {
                                'Brand': result.brand || 'Unknown',
                                'Category': result.category || 'General',
                                'Color': result.color || 'Not specified',
                                'Stock': result.stock || 0
                              }
                            };
                            console.log('Opening product modal for AI result:', productForModal);
                            handleProductClick(productForModal);
                          }}
                          className="flex-1 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg text-purple-400 hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <span>👁️</span>
                          <span>View Details</span>
                        </motion.button>
                        
                        {(result.stock === undefined || result.stock > 0) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Convert API result to product format for cart
                              const productForCart = {
                                id: result.product_id || `ai-product-${index}`,
                                name: result.product_name || result.title || 'AI Recommended Product',
                                description: result.description || 'AI-powered product recommendation based on your search.',
                                price: result.price || 0,
                                originalPrice: result.originalPrice || (result.price ? result.price * 1.2 : 0),
                                brand: result.brand || 'Unknown Brand',
                                category: result.category || 'General',
                                subCategory: result.sub_category || 'Other',
                                color: result.color || 'Not specified',
                                image: result.image || result.product_image || getEnhancedProductImage(result),
                                inStock: true,
                                stock: result.stock || 100, // Default stock if not provided
                                rating: result.rating || 4.2,
                                discount: result.discount || null
                              };
                              console.log('Adding AI product to cart:', productForCart);
                              handleAddToCartWithAnimation(productForCart, e.target);
                              showToast(`${result.product_name || 'AI Product'} added to cart!`, 'success');
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg text-green-400 hover:from-green-600/30 hover:to-blue-600/30 transition-all duration-300 flex items-center justify-center"
                            title="Add to Cart"
                          >
                            🛒
                          </motion.button>
                        )}
                      </div>

                      {/* AI Badge */}
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium opacity-80">
                        AI Result
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No AI results found</h3>
                  <p className="text-gray-400 mb-4">The AI couldn&apos;t find relevant results for your query.</p>
                  <p className="text-sm text-purple-400">Try rephrasing your search or use different keywords.</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trending Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <span>🔥</span>
              <span>Trending Products</span>
            </h3>
            <div className="flex items-center space-x-2 text-green-400">
              <span className="text-sm">📈 Hot Picks</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handleProductClick(product)}
                className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative mb-4">
                  <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {product.discount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      -{product.discount}%
                    </span>
                  )}
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-white text-sm">{product.rating}</span>
                  </div>
                </div>
                
                <h4 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h4>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-white font-bold text-lg">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-gray-400 text-sm line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${product.inStock ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.inStock) {
                      handleAddToCartWithAnimation(product, e.target);
                    } else {
                      handleProductClick(product);
                    }
                  }}
                  className={`w-full py-2 border rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    product.inStock
                      ? 'bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30 text-green-400 hover:from-green-600/30 hover:to-blue-600/30'
                      : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 text-blue-400 hover:from-blue-600/30 hover:to-purple-600/30'
                  }`}
                >
                  <span>{product.inStock ? '🛒' : '👁️'}</span>
                  <span>{product.inStock ? 'Add to Cart' : 'View Details'}</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <motion.button
              onClick={() => handleCategoryChange('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-blue-500/20 border-blue-500/50 ring-2 ring-blue-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="text-2xl mb-2">📦</div>
              <div className="text-white font-medium text-sm">All Categories</div>
              <div className="text-gray-400 text-xs">All items</div>
            </motion.button>
            
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-500/20 border-blue-500/50 ring-2 ring-blue-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-white font-medium text-sm">{category.name}</div>
                <div className="text-gray-400 text-xs">{category.subCategories?.length || 0} subcategories</div>
              </motion.button>
            ))}
          </div>
          
          {/* Subcategories */}
          {getSubCategories().length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <h4 className="text-lg font-medium text-white mb-3">Subcategories</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedSubCategory('all')}
                  className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                    selectedSubCategory === 'all'
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  All {categories.find(cat => cat.id === selectedCategory)?.name}
                </button>
                {getSubCategories().map((subCategory) => (
                  <button
                    key={subCategory.id}
                    onClick={() => setSelectedSubCategory(subCategory.id)}
                    className={`px-4 py-2 rounded-lg border transition-all duration-300 flex items-center space-x-2 ${
                      selectedSubCategory === subCategory.id
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{subCategory.icon}</span>
                    <span>{subCategory.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* All Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              {showSearchResults && (
                <span className="text-sm text-gray-400 bg-gray-500/20 px-2 py-1 rounded-full">
                  Browse More
                </span>
              )}
              <span>
                {selectedCategory === 'all' ? 'All Products' : 
                 `${categories.find(cat => cat.id === selectedCategory)?.name || ''} ${
                   selectedSubCategory !== 'all' ? 
                   `- ${getSubCategories().find(sub => sub.id === selectedSubCategory)?.name || ''}` : 
                   ''
                 }`}
              </span>
            </h3>
            <span className="text-gray-400">
              {filteredProducts.length} products found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handleProductClick(product)}
                className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative mb-4">
                  <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {product.discount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      -{product.discount}%
                    </span>
                  )}
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-white text-sm">{product.rating}</span>
                  </div>
                </div>
                
                <h4 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h4>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-white font-bold text-lg">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-gray-400 text-sm line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${product.inStock ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.inStock) {
                      handleAddToCartWithAnimation(product, e.target);
                    } else {
                      handleProductClick(product);
                    }
                  }}
                  className={`w-full py-2 border rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    product.inStock
                      ? 'bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30 text-green-400 hover:from-green-600/30 hover:to-blue-600/30'
                      : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 text-blue-400 hover:from-blue-600/30 hover:to-purple-600/30'
                  }`}
                >
                  <span>{product.inStock ? '🛒' : '👁️'}</span>
                  <span>{product.inStock ? 'Add to Cart' : 'View Details'}</span>
                </motion.button>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400">Try adjusting your search or category filter</p>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Stats */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Products', value: getAllProducts().length + '+', icon: '📦' },
            { label: 'Categories', value: categories.length.toString(), icon: '📂' },
            { label: 'In Stock', value: '89%', icon: '✅' },
            { label: 'Cart Items', value: getCartItemsCount().toString(), icon: '🛒' },
          ].map((stat, index) => (
            <div key={`quick-stat-${index}`} className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div> */}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-2xl backdrop-blur-xl border ${
              toastMessage.type === 'success' 
                ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>{toastMessage.type === 'success' ? '✅' : '❌'}</span>
              <span className="font-medium">{toastMessage.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onProductSelect={(product) => {
          setSelectedProduct(product);
          setIsProductModalOpen(true);
        }}
      />
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      <MyOrders
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />
      
      {/* Flying Cart Animation */}
      <FlyingCartAnimation
        isActive={flyingAnimation.isActive}
        productImage={flyingAnimation.productImage}
        startPosition={flyingAnimation.startPosition}
        onComplete={completeFlyingAnimation}
      />
    </div>
  );
};

// Main component with CartProvider
const UserDashboard = ({ user, onLogout }) => {
  return (
    <CartProvider>
      <UserDashboardContent user={user} onLogout={onLogout} />
    </CartProvider>
  );
};

export default UserDashboard;
