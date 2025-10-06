'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const PaymentForm = ({ orderTotal, onNext, onBack, shippingAddress }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    selectedBank: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const banks = [
    { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
    { id: 'hdfc', name: 'HDFC Bank', logo: '🏛️' },
    { id: 'icici', name: 'ICICI Bank', logo: '🏢' },
    { id: 'axis', name: 'Axis Bank', logo: '🏪' },
    { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏦' },
    { id: 'pnb', name: 'Punjab National Bank', logo: '🏛️' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePayment = () => {
    const newErrors = {};

    if (!selectedPaymentMethod) {
      newErrors.method = 'Please select a payment method';
    } else if (selectedPaymentMethod === 'upi') {
      if (!paymentDetails.upiId.trim()) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!/^[\w.-]+@[\w.-]+$/.test(paymentDetails.upiId)) {
        newErrors.upiId = 'Please enter a valid UPI ID';
      }
    } else if (selectedPaymentMethod === 'netbanking') {
      if (!paymentDetails.selectedBank) {
        newErrors.selectedBank = 'Please select your bank';
      }
    } else if (selectedPaymentMethod === 'card') {
      if (!paymentDetails.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!paymentDetails.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.expiryDate)) {
        newErrors.expiryDate = 'Please enter date in MM/YY format';
      }
      if (!paymentDetails.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
      if (!paymentDetails.nameOnCard.trim()) {
        newErrors.nameOnCard = 'Name on card is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const paymentData = {
      method: selectedPaymentMethod,
      details: paymentDetails,
      amount: orderTotal,
      timestamp: new Date().toISOString()
    };

    onNext(paymentData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
            2
          </div>
          <h2 className="text-2xl font-bold text-white">Payment Method</h2>
        </div>

        {/* Order Summary */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/80">
              <span>Subtotal:</span>
              <span>₹{orderTotal}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Shipping:</span>
              <span className="text-green-400">FREE</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Tax:</span>
              <span>₹{Math.round(orderTotal * 0.18)}</span>
            </div>
            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total:</span>
                <span>₹{Math.round(orderTotal * 1.18)}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/60">
            <p>📍 Delivering to: {shippingAddress?.locality}, {shippingAddress?.city}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.method && (
            <p className="text-red-400 text-sm">{errors.method}</p>
          )}

          {/* UPI Payment */}
          <div className="space-y-4">
            <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={selectedPaymentMethod === 'upi'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="text-blue-500 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="text-white font-medium">UPI</h4>
                  <p className="text-white/60 text-sm">Pay using UPI ID</p>
                </div>
              </div>
            </label>

            {selectedPaymentMethod === 'upi' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="ml-4 space-y-3"
              >
                <div>
                  <input
                    type="text"
                    name="upiId"
                    value={paymentDetails.upiId}
                    onChange={handleChange}
                    placeholder="Enter your UPI ID (e.g., username@paytm)"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                      errors.upiId ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.upiId && (
                    <p className="text-red-400 text-sm mt-1">{errors.upiId}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {['paytm', 'phonepe', 'googlepay', 'amazonpay'].map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setPaymentDetails(prev => ({ ...prev, upiId: `${prev.upiId.split('@')[0] || 'user'}@${app}` }))}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-xs transition-all duration-300"
                    >
                      @{app}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Net Banking */}
          <div className="space-y-4">
            <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300">
              <input
                type="radio"
                name="paymentMethod"
                value="netbanking"
                checked={selectedPaymentMethod === 'netbanking'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="text-blue-500 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏦</span>
                <div>
                  <h4 className="text-white font-medium">Net Banking</h4>
                  <p className="text-white/60 text-sm">Pay using your bank account</p>
                </div>
              </div>
            </label>

            {selectedPaymentMethod === 'netbanking' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="ml-4"
              >
                <select
                  name="selectedBank"
                  value={paymentDetails.selectedBank}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                    errors.selectedBank ? 'border-red-500' : 'border-white/10'
                  }`}
                  style={{ backgroundColor: '#1f2937', color: 'white' }}
                >
                  <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select your bank</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                      {bank.logo} {bank.name}
                    </option>
                  ))}
                </select>
                {errors.selectedBank && (
                  <p className="text-red-400 text-sm mt-1">{errors.selectedBank}</p>
                )}
              </motion.div>
            )}
          </div>

          {/* Credit/Debit Card */}
          <div className="space-y-4">
            <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={selectedPaymentMethod === 'card'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="text-blue-500 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💳</span>
                <div>
                  <h4 className="text-white font-medium">Credit/Debit Card</h4>
                  <p className="text-white/60 text-sm">Visa, Mastercard, RuPay</p>
                </div>
              </div>
            </label>

            {selectedPaymentMethod === 'card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="ml-4 space-y-4"
              >
                <div>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                      errors.cardNumber ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentDetails.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        errors.expiryDate ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handleChange}
                      placeholder="CVV"
                      maxLength="4"
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                        errors.cvv ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.cvv && (
                      <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={paymentDetails.nameOnCard}
                    onChange={handleChange}
                    placeholder="Name on Card"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 ${
                      errors.nameOnCard ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.nameOnCard && (
                    <p className="text-red-400 text-sm mt-1">{errors.nameOnCard}</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex space-x-4 pt-6">
            <motion.button
              type="button"
              onClick={onBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg text-gray-300 font-medium transition-all duration-300"
              disabled={isProcessing}
            >
              Back to Address
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isProcessing}
              className="flex-1 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <span>💳</span>
                  <span>Pay ₹{Math.round(orderTotal * 1.18)}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default PaymentForm;
