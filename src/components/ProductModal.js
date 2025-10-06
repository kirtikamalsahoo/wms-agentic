'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { productData, categories } from '../data/products';
import FlyingCartAnimation from './FlyingCartAnimation';

const ProductModal = ({ product, isOpen, onClose, onOpenCart, onProductSelect }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [flyingAnimation, setFlyingAnimation] = useState({
    isActive: false,
    productImage: '',
    startPosition: null
  });
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowRecommendations(true);
  };

  const handleAddToCartWithAnimation = (productToAdd, event) => {
    // Get the position of the clicked button
    const rect = event.target.getBoundingClientRect();
    const startPosition = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    // Start the flying animation
    setFlyingAnimation({
      isActive: true,
      productImage: productToAdd.image,
      startPosition
    });

    // Add to cart
    addToCart(productToAdd);
  };

  const completeFlyingAnimation = () => {
    setFlyingAnimation({
      isActive: false,
      productImage: '',
      startPosition: null
    });
  };

  const getRecommendedProducts = () => {
    if (!product) return [];
    
    let recommendations = [];
    
    // Find the category and subcategory of the current product
    let productCategory = null;
    let productSubCategory = null;
    
    Object.keys(productData).forEach(category => {
      Object.keys(productData[category]).forEach(subCategory => {
        const found = productData[category][subCategory].find(p => p.id === product.id);
        if (found) {
          productCategory = category;
          productSubCategory = subCategory;
        }
      });
    });
    
    if (!productCategory) return [];
    
    // Get products from same subcategory first
    if (productSubCategory && productData[productCategory][productSubCategory]) {
      const sameSubCategoryProducts = productData[productCategory][productSubCategory]
        .filter(p => p.id !== product.id)
        .slice(0, 3);
      recommendations.push(...sameSubCategoryProducts);
    }
    
    // If we need more recommendations, add from related subcategories
    if (recommendations.length < 4) {
      // For phones, add phone accessories
      if (productSubCategory === 'phones' && productData.accessories?.phoneAccessories) {
        recommendations.push(...productData.accessories.phoneAccessories.slice(0, 2));
      }
      // For laptops, add laptop accessories
      else if (productSubCategory === 'laptops' && productData.accessories?.laptopAccessories) {
        recommendations.push(...productData.accessories.laptopAccessories.slice(0, 2));
      }
      // For other categories, add from same main category
      else {
        Object.keys(productData[productCategory]).forEach(subCat => {
          if (subCat !== productSubCategory && recommendations.length < 4) {
            recommendations.push(...productData[productCategory][subCat].slice(0, 1));
          }
        });
      }
    }
    
    return recommendations.slice(0, 4);
  };

  const recommendedProducts = getRecommendedProducts();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key={`modal-${product?.id || 'unknown'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowRecommendations(false);
            setQuantity(1);
            onClose();
          }}
        >
          <motion.div
            key={`modal-content-${product?.id || 'unknown'}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl border border-white/10 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Product Details</h2>
                <button
                  onClick={() => {
                    setShowRecommendations(false);
                    setQuantity(1);
                    onClose();
                  }}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all duration-300"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Image thumbnails */}
                  <div className="flex space-x-2">
                    {[product.image, product.image, product.image].map((img, index) => (
                      <button
                        key={`thumbnail-${product?.id || 'unknown'}-${index}`}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                          selectedImage === index 
                            ? 'border-blue-500' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  {/* Title and Rating */}
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={`star-${product?.id || 'unknown'}-${i}`}
                            className={`text-lg ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                        <span className="text-white font-medium">{product.rating}</span>
                      </div>
                      <span className="text-gray-400">({product.reviews} reviews)</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
                      {product.originalPrice > product.price && (
                        <>
                          <span className="text-xl text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm font-medium">
                            {product.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">Inclusive of all taxes</p>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                    <p className="text-gray-300">{product.description}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.features.map((feature, index) => (
                        <div
                          key={`feature-${product?.id || 'unknown'}-${index}`}
                          className="flex items-center space-x-2 text-sm text-gray-300"
                        >
                          <span className="text-green-400">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    <span className={`font-medium ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Quantity and Add to Cart */}
                  {product.inStock && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-white font-medium mb-2 block">Quantity</label>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white"
                          >
                            -
                          </button>
                          <span className="text-white font-medium w-8 text-center">{quantity}</span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          // Get button position for animation
                          const rect = e.target.getBoundingClientRect();
                          const startPosition = {
                            x: rect.left + rect.width / 2,
                            y: rect.top + rect.height / 2
                          };

                          // Start flying animation
                          setFlyingAnimation({
                            isActive: true,
                            productImage: product.image,
                            startPosition
                          });

                          // Add to cart
                          for (let i = 0; i < quantity; i++) {
                            addToCart(product);
                          }
                          setShowRecommendations(true);
                        }}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                                   rounded-xl text-white font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <span>🛒</span>
                        <span>Add to Cart - {formatPrice(product.price * quantity)}</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations Section */}
              <AnimatePresence key="recommendations">
                {showRecommendations && recommendedProducts.length > 0 && (
                  <motion.div
                    key={`recommendations-${product?.id || 'unknown'}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/10 pt-6 mt-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <span>✨</span>
                        <span>Recommended for You</span>
                      </h3>
                      <div className="text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                        People also buy
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {recommendedProducts.map((recProduct, index) => (
                        <motion.div
                          key={recProduct.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="bg-white/5 rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                          onClick={() => {
                            setShowRecommendations(false);
                            // Close current modal and open new product modal
                            if (onProductSelect) {
                              onProductSelect(recProduct);
                            }
                          }}
                        >
                          <div className="relative mb-3">
                            <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                              <img
                                src={recProduct.image}
                                alt={recProduct.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            {recProduct.discount && (
                              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                -{recProduct.discount}%
                              </span>
                            )}
                            <div className="absolute top-2 left-2 flex items-center space-x-1">
                              <span className="text-yellow-400 text-sm">⭐</span>
                              <span className="text-white text-sm">{recProduct.rating}</span>
                            </div>
                          </div>
                          
                          <h4 className="text-white font-medium mb-2 text-sm line-clamp-2">{recProduct.name}</h4>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-white font-bold text-lg">{formatPrice(recProduct.price)}</span>
                              {recProduct.originalPrice > recProduct.price && (
                                <span className="text-gray-400 text-xs line-through ml-1">
                                  {formatPrice(recProduct.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCartWithAnimation(recProduct, e);
                            }}
                            className="w-full py-2 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 
                                       rounded-lg text-green-400 hover:from-green-600/30 hover:to-blue-600/30 transition-all duration-300 text-sm flex items-center justify-center space-x-1"
                          >
                            <span>🛒</span>
                            <span>Add to Cart</span>
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="flex justify-center mt-6 space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowRecommendations(false);
                          setQuantity(1);
                          onClose();
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                                   rounded-xl text-white font-medium transition-all duration-300"
                      >
                        Continue Shopping
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (onOpenCart) {
                            onOpenCart();
                          }
                          setShowRecommendations(false);
                          setQuantity(1);
                          onClose();
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 
                                   rounded-xl text-white font-medium transition-all duration-300"
                      >
                        View Cart
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Flying Cart Animation */}
      <FlyingCartAnimation
        isActive={flyingAnimation.isActive}
        productImage={flyingAnimation.productImage}
        startPosition={flyingAnimation.startPosition}
        onComplete={completeFlyingAnimation}
      />
    </AnimatePresence>
  );
};

export default ProductModal;
