'use client';

import { motion } from 'framer-motion';

const OrderSuccess = ({ orderData, onBackToShopping, onViewOrders }) => {
  const orderId = `ORD-${Date.now().toString().slice(-8)}`;
  const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center"
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-4xl text-white">✅</span>
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h2>
          <p className="text-white/80 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 rounded-xl p-6 mb-6 text-left border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span>📦</span>
            <span>Order Details</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Order ID:</span>
              <span className="text-white font-mono font-bold">{orderData.id || orderId}</span>
            </div>
            {orderData.apiOrderId && (
              <div className="flex justify-between items-center">
                <span className="text-white/70">System Order ID:</span>
                <span className="text-white font-mono text-sm">{orderData.apiOrderId}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-white/70">Total Amount:</span>
              <span className="text-white font-bold">₹{Math.round(orderData.total * 1.18)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Payment Method:</span>
              <span className="text-white capitalize">{orderData.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Status:</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-400/30">
                Confirmed
              </span>
            </div>
            {orderData.apiStatus && (
              <div className="flex justify-between items-center">
                <span className="text-white/70">System Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm border ${
                  orderData.apiStatus === 'success' 
                    ? 'bg-green-500/20 text-green-400 border-green-400/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
                }`}>
                  {orderData.apiStatus === 'success' ? 'Synced ✓' : 'Pending Sync'}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Delivery Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 mb-6 border border-blue-400/20"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span>🚚</span>
            <span>Delivery Information</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📍</span>
              </div>
              <div>
                <p className="text-white font-medium">Delivering to:</p>
                <p className="text-white/70 text-sm">
                  {orderData.shippingAddress?.address}, {orderData.shippingAddress?.locality}
                </p>
                <p className="text-white/70 text-sm">
                  {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} - {orderData.shippingAddress?.pincode}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📅</span>
              </div>
              <div>
                <p className="text-white font-medium">Expected Delivery:</p>
                <p className="text-green-400 font-bold">{deliveryDate}</p>
                <p className="text-white/60 text-sm">Arriving in 3 days</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Items Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10"
        >
          <h4 className="text-lg font-semibold text-white mb-3">Items Ordered ({orderData.items?.length || 0})</h4>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {orderData.items?.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium line-clamp-1">{item.name}</p>
                  <p className="text-white/60 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="text-white font-bold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex space-x-4"
        >
          <motion.button
            onClick={onViewOrders}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>📋</span>
            <span>View My Orders</span>
          </motion.button>
          <motion.button
            onClick={onBackToShopping}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>🛍️</span>
            <span>Continue Shopping</span>
          </motion.button>
        </motion.div>

        {/* API Error Notice (if any) */}
        {orderData.apiStatus === 'failed' || orderData.apiStatus === 'error' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4 mb-6"
          >
            <div className="flex items-start space-x-3">
              <span className="text-yellow-400 text-xl">⚠️</span>
              <div>
                <h4 className="text-yellow-400 font-semibold mb-1">Notice</h4>
                <p className="text-white/80 text-sm">
                  Your order has been placed successfully locally, but there was an issue syncing with the warehouse system. 
                  Don&apos;t worry - your order is confirmed and will be processed normally.
                </p>
                {orderData.apiError && (
                  <p className="text-yellow-400/70 text-xs mt-2 font-mono">
                    Technical details: {orderData.apiError}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400">📧</span>
              </div>
              <p className="text-white/70 text-sm">Order confirmation sent to your email</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400">📱</span>
              </div>
              <p className="text-white/70 text-sm">Track your order via SMS updates</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400">🔒</span>
              </div>
              <p className="text-white/70 text-sm">Secure payment processed successfully</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;
