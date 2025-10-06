'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import AddressForm from './checkout/AddressForm';
import PaymentForm from './checkout/PaymentForm';
import OrderSuccess from './checkout/OrderSuccess';

const Cart = ({ isOpen, onClose, onOpenOrders }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, address, payment, success
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddressNext = (addressData) => {
    setShippingAddress(addressData);
    setCheckoutStep('payment');
  };

  const handlePaymentNext = async (payment) => {
    setPaymentData(payment);
    
    // Create order data
    const orderData = {
      id: `ORD-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      items: cart.items,
      total: Math.round(cart.total * 1.18), // Including tax
      status: 'confirmed',
      shippingAddress,
      paymentMethod: payment.method,
      paymentDetails: payment.details
    };

    console.log('Processing order with items:', cart.items.map(item => `${item.name} (ID: ${item.id}, Qty: ${item.quantity})`));

    try {
      // Call the create order API through our local endpoint
      const apiPayload = {
        customer_id: 0, // You might want to use actual customer ID when user management is implemented
        products: cart.items.map(item => ({
          product_id: parseInt(item.id), // Convert to number as required by API
          quantity: item.quantity
        }))
      };

      console.log('Calling order creation API with payload:', apiPayload);
      
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });

      if (response.ok) {
        const apiResult = await response.json();
        console.log('Order creation API response:', apiResult);
        
        // Add API response data to orderData if needed
        orderData.apiOrderId = apiResult.data?.order_id || apiResult.order_id || null;
        orderData.apiStatus = 'success';
        orderData.apiResponse = apiResult;
      } else {
        console.error('Order creation API failed:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error details:', errorData);
        
        // Still proceed with local order but mark API status
        orderData.apiStatus = 'failed';
        orderData.apiError = errorData.error || errorData.details || `API call failed: ${response.statusText}`;
      }
    } catch (error) {
      console.error('Error calling order creation API:', error);
      // Still proceed with local order but mark API status
      orderData.apiStatus = 'error';
      orderData.apiError = error.message;
    }

    // Save order to localStorage (regardless of API success/failure)
    const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('userOrders', JSON.stringify(existingOrders));

    // Clear cart
    clearCart();
    
    setCheckoutStep('success');
  };

  const handleClose = () => {
    setCheckoutStep('cart');
    setShippingAddress(null);
    setPaymentData(null);
    onClose();
  };

  const handleBackToShopping = () => {
    handleClose();
  };

  const handleViewOrders = () => {
    handleClose();
    if (onOpenOrders) {
      onOpenOrders();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={checkoutStep === 'cart' ? onClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl border border-white/10 w-full max-h-[90vh] overflow-y-auto ${
              checkoutStep === 'cart' ? 'max-w-2xl' : 'max-w-4xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {checkoutStep === 'cart' && (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                      <span>🛒</span>
                      <span>Shopping Cart ({cart.items.length})</span>
                    </h2>
                    <button
                      onClick={handleClose}
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all duration-300"
                    >
                      ✕
                    </button>
                  </div>

                  {cart.items.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🛒</div>
                      <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
                      <p className="text-gray-400 mb-6">Add some products to get started</p>
                      <button
                        onClick={handleClose}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Cart Items */}
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {cart.items.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            className="bg-white/5 rounded-xl border border-white/10 p-4"
                          >
                            <div className="flex items-center space-x-4">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="text-white font-medium">{item.name}</h4>
                                <p className="text-gray-400 text-sm">{formatPrice(item.price)} each</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white text-sm"
                                >
                                  -
                                </button>
                                <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white text-sm"
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-semibold">{formatPrice(item.price * item.quantity)}</p>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-400 hover:text-red-300 text-sm transition-colors duration-300"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Summary */}
                      <div className="border-t border-white/10 pt-4">
                        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-white/80">
                              <span>Subtotal:</span>
                              <span>{formatPrice(cart.total)}</span>
                            </div>
                            <div className="flex justify-between text-white/80">
                              <span>Shipping:</span>
                              <span className="text-green-400">FREE</span>
                            </div>
                            <div className="flex justify-between text-white/80">
                              <span>Tax (18%):</span>
                              <span>{formatPrice(Math.round(cart.total * 0.18))}</span>
                            </div>
                            <div className="border-t border-white/10 pt-2">
                              <div className="flex justify-between">
                                <span className="text-lg font-semibold text-white">Total:</span>
                                <span className="text-2xl font-bold text-white">{formatPrice(Math.round(cart.total * 1.18))}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setCheckoutStep('address')}
                              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 
                                         rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                              <span>🚀</span>
                              <span>Proceed to Checkout</span>
                            </motion.button>
                            
                            <div className="flex space-x-3">
                              <button
                                onClick={clearCart}
                                className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-all duration-300"
                              >
                                Clear Cart
                              </button>
                              <button
                                onClick={handleClose}
                                className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all duration-300"
                              >
                                Continue Shopping
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'address' && (
                <AddressForm
                  onNext={handleAddressNext}
                  onBack={() => setCheckoutStep('cart')}
                />
              )}

              {checkoutStep === 'payment' && (
                <PaymentForm
                  orderTotal={cart.total}
                  shippingAddress={shippingAddress}
                  onNext={handlePaymentNext}
                  onBack={() => setCheckoutStep('address')}
                />
              )}

              {checkoutStep === 'success' && (
                <OrderSuccess
                  orderData={{
                    total: cart.total,
                    paymentMethod: paymentData?.method,
                    shippingAddress,
                    items: cart.items,
                    // Add the saved order data from localStorage to show API status
                    ...(() => {
                      const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
                      return orders[orders.length - 1] || {};
                    })()
                  }}
                  onBackToShopping={handleBackToShopping}
                  onViewOrders={handleViewOrders}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;
