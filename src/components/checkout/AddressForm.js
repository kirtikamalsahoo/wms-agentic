'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AddressForm = ({ onNext, onBack }) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'home'
  });

  const [errors, setErrors] = useState({});

  // Load saved addresses on component mount
  useEffect(() => {
    const addresses = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
    setSavedAddresses(addresses);
    if (addresses.length === 0) {
      setShowAddressForm(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.locality.trim()) newErrors.locality = 'Locality is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Save address to localStorage
      const addressToSave = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      const updatedAddresses = [...savedAddresses, addressToSave];
      setSavedAddresses(updatedAddresses);
      localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
      
      onNext(formData);
    }
  };

  const handleUseSelectedAddress = () => {
    if (selectedAddressId) {
      const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddress) {
        onNext(selectedAddress);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto p-6"
    >
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            1
          </div>
          <h2 className="text-2xl font-bold text-white">Delivery Address</h2>
        </div>

        {/* Saved Addresses Section */}
        {savedAddresses.length > 0 && !showAddressForm && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Select Saved Address</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {savedAddresses.map((address) => (
                <motion.div
                  key={address.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 bg-white/5 rounded-xl border cursor-pointer transition-all duration-300 ${
                    selectedAddressId === address.id
                      ? 'border-blue-400/50 bg-blue-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedAddressId(address.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                          address.addressType === 'home' ? 'bg-green-500/20 text-green-400' :
                          address.addressType === 'work' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {address.addressType}
                        </span>
                        <span className="text-white font-medium">{address.fullName}</span>
                      </div>
                      <p className="text-white/80 text-sm mb-1">
                        {address.address}, {address.locality}
                      </p>
                      <p className="text-white/80 text-sm mb-1">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p className="text-white/60 text-sm">📞 {address.phoneNumber}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedAddressId === address.id && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex space-x-4 pt-4">
              <motion.button
                type="button"
                onClick={onBack}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg text-gray-300 font-medium transition-all duration-300"
              >
                Back to Cart
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowAddressForm(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-all duration-300"
              >
                + Add New Address
              </motion.button>
              <motion.button
                type="button"
                onClick={handleUseSelectedAddress}
                disabled={!selectedAddressId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </motion.button>
            </div>
          </div>
        )}

        {/* Address Form */}
        {(showAddressForm || savedAddresses.length === 0) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 ${
                    errors.fullName ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="Enter your full name"
                  required
                />
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="Enter your phone number"
                  required
                />
                {errors.phoneNumber && (
                  <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 ${
                  errors.address ? 'border-red-500' : 'border-white/10'
                }`}
                placeholder="Enter your complete address"
                rows="3"
                required
              />
              {errors.address && (
                <p className="text-red-400 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Locality/Area *
                </label>
                <input
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 ${
                    errors.locality ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="Enter locality/area"
                  required
                />
                {errors.locality && (
                  <p className="text-red-400 text-sm mt-1">{errors.locality}</p>
                )}
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 ${
                    errors.city ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="Enter your city"
                  required
                />
                {errors.city && (
                  <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 ${
                    errors.state ? 'border-red-500' : 'border-white/10'
                  }`}
                  style={{ backgroundColor: '#1f2937', color: 'white' }}
                  required
                >
                  <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select State</option>
                  <option value="andhra-pradesh" style={{ backgroundColor: '#1f2937', color: 'white' }}>Andhra Pradesh</option>
                  <option value="arunachal-pradesh" style={{ backgroundColor: '#1f2937', color: 'white' }}>Arunachal Pradesh</option>
                  <option value="assam" style={{ backgroundColor: '#1f2937', color: 'white' }}>Assam</option>
                  <option value="bihar" style={{ backgroundColor: '#1f2937', color: 'white' }}>Bihar</option>
                  <option value="chhattisgarh" style={{ backgroundColor: '#1f2937', color: 'white' }}>Chhattisgarh</option>
                  <option value="goa" style={{ backgroundColor: '#1f2937', color: 'white' }}>Goa</option>
                  <option value="gujarat" style={{ backgroundColor: '#1f2937', color: 'white' }}>Gujarat</option>
                  <option value="haryana" style={{ backgroundColor: '#1f2937', color: 'white' }}>Haryana</option>
                  <option value="himachal-pradesh" style={{ backgroundColor: '#1f2937', color: 'white' }}>Himachal Pradesh</option>
                  <option value="jharkhand" style={{ backgroundColor: '#1f2937', color: 'white' }}>Jharkhand</option>
                  <option value="karnataka" style={{ backgroundColor: '#1f2937', color: 'white' }}>Karnataka</option>
                  <option value="kerala" style={{ backgroundColor: '#1f2937', color: 'white' }}>Kerala</option>
                  <option value="madhya-pradesh" style={{ backgroundColor: '#1f2937', color: 'white' }}>Madhya Pradesh</option>
                  <option value="maharashtra" style={{ backgroundColor: '#1f2937', color: 'white' }}>Maharashtra</option>
                  <option value="manipur" style={{ backgroundColor: '#1f2937', color: 'white' }}>Manipur</option>
                  <option value="meghalaya" style={{ backgroundColor: '#1f2937', color: 'white' }}>Meghalaya</option>
                  <option value="mizoram" style={{ backgroundColor: '#1f2937', color: 'white' }}>Mizoram</option>
                  <option value="nagaland" style={{ backgroundColor: '#1f2937', color: 'white' }}>Nagaland</option>
                  <option value="odisha" style={{ backgroundColor: '#1f2937', color: 'white' }}>Odisha</option>
                  <option value="punjab" style={{ backgroundColor: '#1f2937', color: 'white' }}>Punjab</option>
                  <option value="rajasthan" style={{ backgroundColor: '#1f2937', color: 'white' }}>Rajasthan</option>
                  <option value="sikkim" style={{ backgroundColor: '#1f2937', color: 'white' }}>Sikkim</option>
                  <option value="tamil-nadu" style={{ backgroundColor: '#1f2937', color: 'white' }}>Tamil Nadu</option>
                  <option value="telangana" style={{ backgroundColor: '#1f2937', color: 'white' }}>Telangana</option>
                  <option value="tripura" style={{ backgroundColor: '#1f2937', color: 'white' }}>Tripura</option>
                  <option value="uttar-pradesh" style={{ backgroundColor: '#1f2937', color: 'white' }}>Uttar Pradesh</option>
                  <option value="uttarakhand" style={{ backgroundColor: '#1f2937', color: 'white' }}>Uttarakhand</option>
                  <option value="west-bengal" style={{ backgroundColor: '#1f2937', color: 'white' }}>West Bengal</option>
                  <option value="delhi" style={{ backgroundColor: '#1f2937', color: 'white' }}>Delhi</option>
                </select>
                {errors.state && (
                  <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 ${
                    errors.pincode ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="Enter PIN code"
                  required
                />
                {errors.pincode && (
                  <p className="text-red-400 text-sm mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Address Type
              </label>
              <div className="flex space-x-4">
                {['home', 'work', 'other'].map((type) => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      value={type}
                      checked={formData.addressType === type}
                      onChange={handleInputChange}
                      className="text-blue-500 focus:ring-blue-400 focus:ring-2"
                    />
                    <span className="text-white/80 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <motion.button
                type="button"
                onClick={onBack}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg text-gray-300 font-medium transition-all duration-300"
              >
                Back to Cart
              </motion.button>
              {showAddressForm && savedAddresses.length > 0 && (
                <motion.button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-all duration-300"
                >
                  Use Saved Address
                </motion.button>
              )}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all duration-300"
              >
                Continue to Payment
              </motion.button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default AddressForm;
