'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MyOrders = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [customReturnReason, setCustomReturnReason] = useState('');
  const [orderToReturn, setOrderToReturn] = useState(null);
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  const [showReturnSuccessModal, setShowReturnSuccessModal] = useState(false);
  const [returnedOrders, setReturnedOrders] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Load orders from localStorage
      const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      setOrders(savedOrders);
      
      // Load returned orders from localStorage
      const savedReturnedOrders = JSON.parse(localStorage.getItem('returnedOrders') || '[]');
      setReturnedOrders(savedReturnedOrders);
    }
  }, [isOpen]);

  const fetchDeliveredOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const apiOrdersData = await response.json();
        // Filter only delivered orders from API
        const delivered = apiOrdersData.filter(order => order.is_delivered === true);
        setDeliveredOrders(delivered);
      } else {
        console.error('Failed to fetch orders from API');
        setDeliveredOrders([]);
      }
    } catch (error) {
      console.error('Error fetching delivered orders:', error);
      setDeliveredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-400/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '📦';
      case 'cancelled':
        return '❌';
      default:
        return '⏳';
    }
  };

  const filteredOrders = (() => {
    let result;
    if (filter === 'delivered') {
      result = deliveredOrders;
    } else {
      if (filter === 'all') {
        result = orders;
      } else {
        result = orders.filter(order => order.status === filter);
      }
    }
    
    // Sort by date to show recent orders first
    return result.sort((a, b) => {
      const dateA = new Date(a.date || a.order_date);
      const dateB = new Date(b.date || b.order_date);
      return dateB - dateA; // Descending order (newest first)
    });
  })();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDeliveryDate = (orderDate) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
    setCancelReason('');
    setCustomReason('');
  };

  const confirmCancelOrder = () => {
    if (!cancelReason) return;
    
    const finalReason = cancelReason === 'other' ? customReason : cancelReason;
    if (cancelReason === 'other' && !customReason.trim()) return;
    
    // Update the order status to cancelled
    const updatedOrders = orders.map(order => 
      order.id === orderToCancel.id 
        ? { ...order, status: 'cancelled', cancelReason: finalReason, cancelDate: new Date().toISOString() }
        : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
    
    // Update selected order if it's the one being cancelled
    if (selectedOrder && selectedOrder.id === orderToCancel.id) {
      setSelectedOrder({ ...orderToCancel, status: 'cancelled', cancelReason: finalReason });
    }
    
    setShowCancelModal(false);
    setOrderToCancel(null);
    setCancelReason('');
    setCustomReason('');
  };

  const isOrderAlreadyReturned = (order) => {
    return returnedOrders.some(returnedOrder => 
      returnedOrder.orderId === order.id && 
      returnedOrder.productName === order.product_name
    );
  };

  const handleReturnOrder = (order) => {
    // Check if this order has already been returned
    if (isOrderAlreadyReturned(order)) {
      alert('⚠️ This product has already been returned and cannot be returned again.');
      return;
    }
    
    setOrderToReturn(order);
    setShowReturnModal(true);
    setReturnReason('');
    setCustomReturnReason('');
    setIsSubmittingReturn(false);
  };

  const confirmReturnOrder = async () => {
    if (!returnReason) return;
    
    const finalReason = returnReason === 'other' ? customReturnReason : returnReason;
    if (returnReason === 'other' && !customReturnReason.trim()) return;
    
    setIsSubmittingReturn(true);
    
    let response;
    try {
      // Prepare the API payload
      const returnRequestPayload = {
        order_group_id: orderToReturn.order_group_id || orderToReturn.id || 0,
        product_id: orderToReturn.product_id || 0,
        reason_for_return: finalReason,
        return_quantity: orderToReturn.quantity || 1
      };

      console.log('Submitting return request:', returnRequestPayload);

      // Call the return request API through our Next.js API route to avoid CORS issues
      response = await fetch('/api/return-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(returnRequestPayload)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Return request successful:', responseData);
        
        // Save the returned order to prevent duplicate returns
        const returnRecord = {
          orderId: orderToReturn.id,
          productName: orderToReturn.product_name,
          reason: finalReason,
          returnDate: new Date().toISOString(),
          quantity: orderToReturn.quantity
        };
        
        const updatedReturnedOrders = [...returnedOrders, returnRecord];
        setReturnedOrders(updatedReturnedOrders);
        localStorage.setItem('returnedOrders', JSON.stringify(updatedReturnedOrders));
        
        // Close return modal and show success modal
        setShowReturnModal(false);
        setShowReturnSuccessModal(true);
        return; // Exit early on success
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Return request failed:', errorData);
        alert(`❌ Failed to submit return request. Please try again later. Error: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting return request:', error);
      alert('🔌 Failed to submit return request due to network error. Please check your connection and try again.');
    } finally {
      setIsSubmittingReturn(false);
    }
    
    // Only reset these if there was an error (success case returns early)
    setShowReturnModal(false);
    setOrderToReturn(null);
    setReturnReason('');
    setCustomReturnReason('');
  };

  const cancelReasons = [
    'Changed my mind about the purchase',
    'Found a better price elsewhere',
    'Ordered by mistake',
    'Need to change delivery address',
    'Product not needed anymore',
    'Delivery taking too long',
    'Payment issues',
    'other'
  ];

  const returnReasons = [
    'Product is defective or damaged',
    'Product does not match description',
    'Wrong product delivered',
    'Product not as expected',
    'Better price found elsewhere',
    'No longer needed',
    'Size/fit issues',
    'Quality concerns',
    'other'
  ];

  // Helper function to get product image based on product name
  const getProductImage = (productName) => {
    if (!productName) return '/file.svg';
    
    const name = productName.toLowerCase();
    
    // Exact product name mapping to icons/emojis as image sources
    const productImageMap = {
      // Electronics - Phones
      'iphone 14 pro': '📱',
      'samsung galaxy s23': '📱',
      'oneplus 11r': '📱',
      'google pixel 7': '📱',
      'redmi note 12 pro': '📱',
      
      // Electronics - Laptops
      'macbook air m2': '💻',
      'dell xps 13': '💻',
      'hp spectre x360': '💻',
      'lenovo thinkpad x1 carbon': '💻',
      'asus rog zephyrus g14': '💻',
      
      // Food Items
      'basmati rice 5kg': '🍚',
      'wheat flour 10kg': '🌾',
      'toor dal 2kg': '🫘',
      'sunflower oil 1l': '🫗',
      'sugar 5kg': '🧂',
      
      // Personal Care
      'colgate toothpaste 200g': '🦷',
      'dettol handwash 500ml': '🧴',
      'surf excel 2kg': '🧽',
      'harpic toilet cleaner 1l': '🧴',
      'lifebuoy soap pack of 4': '🧼',
      
      // Clothing - Men
      'men t-shirt': '👕',
      'men jeans': '👖',
      'men formal shirt': '👔',
      'men jacket': '🧥',
      'men sneakers': '👟',
      
      // Clothing - Women
      'women kurti': '👗',
      'women saree': '🥻',
      'women top': '👚',
      'women dress': '👗',
      'women heels': '👠',
      
      // Shoes
      'running shoes': '🏃‍♂️',
      'casual sneakers': '👟',
      'formal shoes': '👞',
      'high heels': '👠',
      'sports shoes': '⚽',
      
      // Accessories
      'iphone case': '📱',
      'samsung charger': '🔌',
      'oneplus earbuds': '🎧',
      'redmi power bank 10000mah': '🔋',
      'pixel screen protector': '📱',
      'laptop sleeve 15.6"': '💻',
      'dell docking station': '🖥️',
      'hp laptop bag': '💼',
      'lenovo wireless mouse': '🖱️',
      'asus cooling pad': '❄️'
    };
    
    // Check for exact match first
    const exactMatch = productImageMap[name];
    if (exactMatch) {
      return createEmojiDataUrl(exactMatch);
    }
    
    // Category-based fallback matching
    if (name.includes('iphone') || name.includes('samsung') || name.includes('oneplus') || 
        name.includes('pixel') || name.includes('redmi') || name.includes('phone')) {
      return createEmojiDataUrl('📱');
    } else if (name.includes('macbook') || name.includes('dell') || name.includes('hp') || 
               name.includes('lenovo') || name.includes('asus') || name.includes('laptop')) {
      return createEmojiDataUrl('💻');
    } else if (name.includes('rice') || name.includes('wheat') || name.includes('dal') || 
               name.includes('oil') || name.includes('sugar')) {
      return createEmojiDataUrl('🍚');
    } else if (name.includes('toothpaste') || name.includes('handwash') || name.includes('soap') || 
               name.includes('cleaner') || name.includes('surf')) {
      return createEmojiDataUrl('🧴');
    } else if (name.includes('t-shirt') || name.includes('shirt') || name.includes('jeans') || 
               name.includes('jacket') || name.includes('kurti') || name.includes('saree') || 
               name.includes('top') || name.includes('dress')) {
      return createEmojiDataUrl('👕');
    } else if (name.includes('shoes') || name.includes('sneakers') || name.includes('heels')) {
      return createEmojiDataUrl('👟');
    } else if (name.includes('case') || name.includes('charger') || name.includes('earbuds') || 
               name.includes('power bank') || name.includes('mouse') || name.includes('bag')) {
      return createEmojiDataUrl('🔌');
    }
    
    // Ultimate fallback
    return '/file.svg';
  };

  // Helper function to create emoji data URL for image src
  const createEmojiDataUrl = (emoji) => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <rect width="64" height="64" fill="#1f2937" rx="8"/>
        <text x="32" y="40" font-size="24" text-anchor="middle" fill="white">${emoji}</text>
      </svg>
    `)}`;
  };

  // Helper function to normalize order data structure
  const normalizeOrder = (order, isApiOrder = false) => {
    if (isApiOrder) {
      // Normalize API order structure to match localStorage structure
      return {
        id: order.order_id,
        date: order.order_date,
        status: 'delivered', // Since we're filtering delivered orders
        total: 0, // API doesn't provide total, so we'll calculate or set to 0
        items: [{
          name: order.product_name,
          quantity: order.quantity,
          price: 0, // Not provided in API
          image: getProductImage(order.product_name)
        }],
        shippingAddress: {
          fullName: order.customer_name,
          city: 'N/A',
          state: 'N/A'
        },
        customer_name: order.customer_name,
        product_name: order.product_name,
        quantity: order.quantity,
        delivered_at: order.delivered_at,
        isApiOrder: true,
        ...order
      };
    }
    return order;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">My Orders</h2>
              <p className="text-white/60 text-sm">Track and manage your orders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300"
          >
            ✕
          </button>
        </div>

        <div className="flex h-full max-h-[calc(90vh-120px)]">
          {/* Orders List */}
          <div className="flex-1 p-6">
            {/* Filter Tabs */}
            <div className="flex space-x-2 mb-6">
              {[
                { id: 'all', label: 'All Orders', count: orders.length },
                { id: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
                { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
                { id: 'delivered', label: 'Delivered', count: deliveredOrders.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFilter(tab.id);
                    if (tab.id === 'delivered') {
                      fetchDeliveredOrders();
                    }
                  }}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                    filter === tab.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Orders */}
            <div className="space-y-4 overflow-y-auto max-h-[600px]">
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 animate-spin">⏳</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Loading orders...</h3>
                  <p className="text-gray-400">Please wait while we fetch your orders.</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
                  <p className="text-gray-400">
                    {filter === 'all' ? 'You haven\'t placed any orders yet.' : `No ${filter} orders found.`}
                  </p>
                </div>
              ) : (
                filteredOrders.map((rawOrder) => {
                  const order = normalizeOrder(rawOrder, filter === 'delivered');
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedOrder(order)}
                      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 p-4 cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-semibold">Order #{order.id}</h3>
                          <p className="text-white/60 text-sm">{formatDate(order.date)}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          {filter !== 'delivered' && (
                            <span className="text-white font-bold">₹{order.total || 0}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex -space-x-2">
                          {filter === 'delivered' ? (
                            <img
                              src={getProductImage(order.product_name)}
                              alt={order.product_name || 'Product'}
                              className="w-8 h-8 rounded-full border-2 border-gray-800 object-cover"
                              onError={(e) => {
                                e.target.src = '/file.svg';
                              }}
                            />
                          ) : (
                            (order.items || []).slice(0, 3).map((item, index) => (
                              <img
                                key={index}
                                src={item.image || '/file.svg'}
                                alt={item.name || 'Product'}
                                className="w-8 h-8 rounded-full border-2 border-gray-800 object-cover"
                                onError={(e) => {
                                  e.target.src = '/file.svg';
                                }}
                              />
                            ))
                          )}
                          {filter !== 'delivered' && (order.items || []).length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-gray-800 bg-white/10 flex items-center justify-center text-xs text-white">
                              +{(order.items || []).length - 3}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm">
                            {filter === 'delivered' ? order.product_name : `${(order.items || []).length} item${(order.items || []).length > 1 ? 's' : ''}`}
                          </p>
                          <p className="text-white/60 text-xs">
                            {filter === 'delivered' ? `Qty: ${order.quantity}` : 
                             (order.status === 'delivered' ? 'Delivered' : `Expected: ${calculateDeliveryDate(order.date)}`)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-white/60 text-sm">
                          <span>📍</span>
                          <span>
                            {filter === 'delivered' ? order.customer_name : 
                             `${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.state || 'N/A'}`}
                          </span>
                        </div>
                        <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors duration-300">
                          View Details →
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Order Details Panel */}
          <AnimatePresence>
            {selectedOrder && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="w-96 bg-white/5 border-l border-white/10 p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Order Details</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300"
                  >
                    ✕
                  </button>
                </div>

                {/* Order Info */}
                <div className="space-y-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-3">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Order ID:</span>
                        <span className="text-white font-mono">{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Date:</span>
                        <span className="text-white">{formatDate(selectedOrder.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)} {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Total:</span>
                        <span className="text-white font-bold">₹{selectedOrder.total || 0}</span>
                      </div>
                      {selectedOrder.isApiOrder && (
                        <div className="flex justify-between">
                          <span className="text-white/70">Source:</span>
                          <span className="text-blue-400 text-xs">Backend API</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <span>📍</span>
                      <span>Shipping Address</span>
                    </h4>
                    <div className="text-sm text-white/70 space-y-1">
                      <p className="text-white font-medium">
                        {selectedOrder.customer_name || selectedOrder.shippingAddress?.fullName || 'N/A'}
                      </p>
                      <p>{selectedOrder.shippingAddress?.address || 'Address not available'}</p>
                      <p>{selectedOrder.shippingAddress?.locality || ''}</p>
                      <p>
                        {selectedOrder.shippingAddress?.city || 'N/A'}, {' '}
                        {selectedOrder.shippingAddress?.state || 'N/A'}
                        {selectedOrder.shippingAddress?.pincode && 
                          ` - ${selectedOrder.shippingAddress.pincode}`
                        }
                      </p>
                      <p>📞 {selectedOrder.shippingAddress?.phoneNumber || 'N/A'}</p>
                      {selectedOrder.isApiOrder && selectedOrder.delivered_at && (
                        <p className="text-green-400 text-xs mt-2">
                          ✅ Delivered on: {formatDate(selectedOrder.delivered_at)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-3">
                    Items ({selectedOrder.isApiOrder ? 1 : (selectedOrder.items || []).length})
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedOrder.isApiOrder ? (
                      <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                        <img
                          src={getProductImage(selectedOrder.product_name)}
                          alt={selectedOrder.product_name || 'Product'}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = '/file.svg';
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium line-clamp-2">
                            {selectedOrder.product_name}
                          </p>
                          <p className="text-white/60 text-xs">
                            Qty: {selectedOrder.quantity}
                          </p>
                        </div>
                        <p className="text-white font-bold text-sm">
                          Price not available
                        </p>
                      </div>
                    ) : (
                      (selectedOrder.items || []).map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                          <img
                            src={item.image || '/file.svg'}
                            alt={item.name || 'Product'}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/file.svg';
                            }}
                          />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium line-clamp-2">
                              {item.name}
                            </p>
                            <p className="text-white/60 text-xs">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-white font-bold text-sm">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {selectedOrder.status === 'confirmed' && !selectedOrder.isApiOrder && (
                    <button 
                      onClick={() => handleCancelOrder(selectedOrder)}
                      className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-400 transition-all duration-300"
                    >
                      Cancel Order
                    </button>
                  )}
                  
                  {selectedOrder.status === 'delivered' || selectedOrder.isApiOrder ? (
                    isOrderAlreadyReturned(selectedOrder) ? (
                      <button 
                        disabled
                        className="w-full py-3 bg-gray-500/20 border border-gray-400/30 rounded-lg text-gray-400 cursor-not-allowed"
                      >
                        ✅ Return Already Requested
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleReturnOrder(selectedOrder)}
                        className="w-full py-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 rounded-lg text-orange-400 transition-all duration-300"
                      >
                        🔄 Request Return
                      </button>
                    )
                  ) : (
                    <button className="w-full py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-400 transition-all duration-300">
                      Track Order
                    </button>
                  )}
                  
                  {selectedOrder.status === 'delivered' && (
                    <button className="w-full py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-400 transition-all duration-300">
                      Rate & Review
                    </button>
                  )}
                  
                  {selectedOrder.isApiOrder && (
                    <div className="p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                      <p className="text-blue-300 text-xs text-center">
                        This order is managed by the backend system
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cancel Order Reason Modal */}
        <AnimatePresence>
          {showCancelModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowCancelModal(false);
                  setOrderToCancel(null);
                  setCancelReason('');
                  setCustomReason('');
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-red-500/20 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-red-500/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <span className="text-red-400 text-xl">⚠️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Cancel Order</h3>
                      <p className="text-red-300 text-sm">Order #{orderToCancel?.id}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Please select a reason for canceling this order. This helps us improve our service.
                  </p>
                </div>

                {/* Cancel Reasons */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    {cancelReasons.map((reason, index) => (
                      <motion.label
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                          cancelReason === reason
                            ? 'bg-red-500/10 border-red-500/30 text-red-300'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="radio"
                          name="cancelReason"
                          value={reason}
                          checked={cancelReason === reason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          cancelReason === reason
                            ? 'border-red-400 bg-red-400'
                            : 'border-gray-400'
                        }`}>
                          {cancelReason === reason && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {reason === 'other' ? 'Other (please specify)' : reason}
                        </span>
                      </motion.label>
                    ))}
                  </div>

                  {/* Custom Reason Input */}
                  <AnimatePresence>
                    {cancelReason === 'other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                      >
                        <textarea
                          value={customReason}
                          onChange={(e) => setCustomReason(e.target.value)}
                          placeholder="Please specify your reason for canceling..."
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 
                                     focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent 
                                     transition-all duration-300 resize-none"
                          rows={3}
                          maxLength={200}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">Please provide a brief reason</span>
                          <span className="text-xs text-gray-400">{customReason.length}/200</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowCancelModal(false);
                        setOrderToCancel(null);
                        setCancelReason('');
                        setCustomReason('');
                      }}
                      className="flex-1 py-3 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 rounded-lg text-gray-300 transition-all duration-300"
                    >
                      Keep Order
                    </button>
                    <button
                      onClick={confirmCancelOrder}
                      disabled={!cancelReason || (cancelReason === 'other' && !customReason.trim())}
                      className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Return Order Modal */}
        <AnimatePresence>
          {showReturnModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowReturnModal(false);
                  setOrderToReturn(null);
                  setReturnReason('');
                  setCustomReturnReason('');
                  setIsSubmittingReturn(false);
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-orange-500/20 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-orange-500/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <span className="text-orange-400 text-xl">🔄</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Return Request</h3>
                      <p className="text-orange-300 text-sm">Order #{orderToReturn?.id}</p>
                    </div>
                  </div>
                  <div className="bg-orange-500/10 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={getProductImage(orderToReturn?.product_name)}
                        alt={orderToReturn?.product_name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white font-medium text-sm">{orderToReturn?.product_name}</p>
                        <p className="text-white/60 text-xs">Qty: {orderToReturn?.quantity}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Please select a reason for returning this product. We&apos;ll process your request within 24 hours.
                  </p>
                </div>

                {/* Return Reasons */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    {returnReasons.map((reason, index) => (
                      <motion.label
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                          returnReason === reason
                            ? 'bg-orange-500/10 border-orange-500/30 text-orange-300'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="radio"
                          name="returnReason"
                          value={reason}
                          checked={returnReason === reason}
                          onChange={(e) => setReturnReason(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          returnReason === reason
                            ? 'border-orange-400 bg-orange-400'
                            : 'border-gray-400'
                        }`}>
                          {returnReason === reason && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {reason === 'other' ? 'Other (please specify)' : reason}
                        </span>
                      </motion.label>
                    ))}
                  </div>

                  {/* Custom Return Reason Input */}
                  <AnimatePresence>
                    {returnReason === 'other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                      >
                        <textarea
                          value={customReturnReason}
                          onChange={(e) => setCustomReturnReason(e.target.value)}
                          placeholder="Please specify your reason for return..."
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 
                                     focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent 
                                     transition-all duration-300 resize-none"
                          rows={3}
                          maxLength={200}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">Please provide details about the issue</span>
                          <span className="text-xs text-gray-400">{customReturnReason.length}/200</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Return Policy Info */}
                  <div className="mb-6 p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
                    <h4 className="text-blue-300 text-sm font-medium mb-2">📋 Return Policy</h4>
                    <ul className="text-xs text-blue-200 space-y-1">
                      <li>• Returns accepted within 7 days of delivery</li>
                      <li>• Product should be in original condition</li>
                      <li>• Refund will be processed within 5-7 business days</li>
                      <li>• Return shipping charges may apply</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowReturnModal(false);
                        setOrderToReturn(null);
                        setReturnReason('');
                        setCustomReturnReason('');
                        setIsSubmittingReturn(false);
                      }}
                      className="flex-1 py-3 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 rounded-lg text-gray-300 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmReturnOrder}
                      disabled={!returnReason || (returnReason === 'other' && !customReturnReason.trim()) || isSubmittingReturn}
                      className="flex-1 py-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 rounded-lg text-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingReturn ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        'Submit Return Request'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Return Success Modal */}
        <AnimatePresence>
          {showReturnSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowReturnSuccessModal(false);
                  setOrderToReturn(null);
                  setReturnReason('');
                  setCustomReturnReason('');
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-green-500/20 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-green-500/20 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-400 text-3xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Return Request Submitted!</h3>
                  <p className="text-green-300 text-sm">Order #{orderToReturn?.id}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="bg-green-500/10 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={getProductImage(orderToReturn?.product_name)}
                        alt={orderToReturn?.product_name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white font-medium text-sm">{orderToReturn?.product_name}</p>
                        <p className="text-white/60 text-xs">Qty: {orderToReturn?.quantity}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-white text-sm mb-2">Your return request has been successfully submitted!</p>
                      <p className="text-green-300 text-xs">We&apos;ll process your request within 24 hours.</p>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-400/20">
                    <h4 className="text-blue-300 text-sm font-medium mb-2">📋 What happens next?</h4>
                    <ul className="text-xs text-blue-200 space-y-1">
                      <li>• Our team will review your return request</li>
                      <li>• You&apos;ll receive a confirmation email shortly</li>
                      <li>• Pickup will be scheduled within 2-3 days</li>
                      <li>• Refund processed within 5-7 business days</li>
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      setShowReturnSuccessModal(false);
                      setOrderToReturn(null);
                      setReturnReason('');
                      setCustomReturnReason('');
                    }}
                    className="w-full py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-400 transition-all duration-300"
                  >
                    Great! Got it
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MyOrders;
