'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const InboundAgent = ({ isAgentRunning, onRunAgent }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('wh-delhi');

  // Warehouse data with different inbound volumes - Professional Color Palette
  const warehouseData = {
    'wh-delhi': [
      { day: 'Mon', value: 85, color: 'from-slate-600 via-slate-700 to-slate-800', shadow: 'shadow-slate-600/40', glow: 'shadow-slate-500/30' },
      { day: 'Tue', value: 92, color: 'from-indigo-600 via-indigo-700 to-indigo-800', shadow: 'shadow-indigo-600/40', glow: 'shadow-indigo-500/30' },
      { day: 'Wed', value: 78, color: 'from-blue-600 via-blue-700 to-blue-800', shadow: 'shadow-blue-600/40', glow: 'shadow-blue-500/30' },
      { day: 'Thu', value: 95, color: 'from-teal-600 via-teal-700 to-teal-800', shadow: 'shadow-teal-600/40', glow: 'shadow-teal-500/30' },
      { day: 'Fri', value: 88, color: 'from-emerald-600 via-emerald-700 to-emerald-800', shadow: 'shadow-emerald-600/40', glow: 'shadow-emerald-500/30' },
      { day: 'Sat', value: 65, color: 'from-cyan-600 via-cyan-700 to-cyan-800', shadow: 'shadow-cyan-600/40', glow: 'shadow-cyan-500/30' },
      { day: 'Sun', value: 45, color: 'from-sky-600 via-sky-700 to-sky-800', shadow: 'shadow-sky-600/40', glow: 'shadow-sky-500/30' }
    ],
    'wh-bhubaneswar': [
      { day: 'Mon', value: 72, color: 'from-slate-600 via-slate-700 to-slate-800', shadow: 'shadow-slate-600/40', glow: 'shadow-slate-500/30' },
      { day: 'Tue', value: 68, color: 'from-indigo-600 via-indigo-700 to-indigo-800', shadow: 'shadow-indigo-600/40', glow: 'shadow-indigo-500/30' },
      { day: 'Wed', value: 84, color: 'from-blue-600 via-blue-700 to-blue-800', shadow: 'shadow-blue-600/40', glow: 'shadow-blue-500/30' },
      { day: 'Thu', value: 91, color: 'from-teal-600 via-teal-700 to-teal-800', shadow: 'shadow-teal-600/40', glow: 'shadow-teal-500/30' },
      { day: 'Fri', value: 76, color: 'from-emerald-600 via-emerald-700 to-emerald-800', shadow: 'shadow-emerald-600/40', glow: 'shadow-emerald-500/30' },
      { day: 'Sat', value: 58, color: 'from-cyan-600 via-cyan-700 to-cyan-800', shadow: 'shadow-cyan-600/40', glow: 'shadow-cyan-500/30' },
      { day: 'Sun', value: 41, color: 'from-sky-600 via-sky-700 to-sky-800', shadow: 'shadow-sky-600/40', glow: 'shadow-sky-500/30' }
    ],
    'wh-pune': [
      { day: 'Mon', value: 96, color: 'from-slate-600 via-slate-700 to-slate-800', shadow: 'shadow-slate-600/40', glow: 'shadow-slate-500/30' },
      { day: 'Tue', value: 89, color: 'from-indigo-600 via-indigo-700 to-indigo-800', shadow: 'shadow-indigo-600/40', glow: 'shadow-indigo-500/30' },
      { day: 'Wed', value: 93, color: 'from-blue-600 via-blue-700 to-blue-800', shadow: 'shadow-blue-600/40', glow: 'shadow-blue-500/30' },
      { day: 'Thu', value: 87, color: 'from-teal-600 via-teal-700 to-teal-800', shadow: 'shadow-teal-600/40', glow: 'shadow-teal-500/30' },
      { day: 'Fri', value: 94, color: 'from-emerald-600 via-emerald-700 to-emerald-800', shadow: 'shadow-emerald-600/40', glow: 'shadow-emerald-500/30' },
      { day: 'Sat', value: 73, color: 'from-cyan-600 via-cyan-700 to-cyan-800', shadow: 'shadow-cyan-600/40', glow: 'shadow-cyan-500/30' },
      { day: 'Sun', value: 52, color: 'from-sky-600 via-sky-700 to-sky-800', shadow: 'shadow-sky-600/40', glow: 'shadow-sky-500/30' }
    ],
    'wh-kolkata': [
      { day: 'Mon', value: 63, color: 'from-slate-600 via-slate-700 to-slate-800', shadow: 'shadow-slate-600/40', glow: 'shadow-slate-500/30' },
      { day: 'Tue', value: 71, color: 'from-indigo-600 via-indigo-700 to-indigo-800', shadow: 'shadow-indigo-600/40', glow: 'shadow-indigo-500/30' },
      { day: 'Wed', value: 59, color: 'from-blue-600 via-blue-700 to-blue-800', shadow: 'shadow-blue-600/40', glow: 'shadow-blue-500/30' },
      { day: 'Thu', value: 82, color: 'from-teal-600 via-teal-700 to-teal-800', shadow: 'shadow-teal-600/40', glow: 'shadow-teal-500/30' },
      { day: 'Fri', value: 67, color: 'from-emerald-600 via-emerald-700 to-emerald-800', shadow: 'shadow-emerald-600/40', glow: 'shadow-emerald-500/30' },
      { day: 'Sat', value: 55, color: 'from-cyan-600 via-cyan-700 to-cyan-800', shadow: 'shadow-cyan-600/40', glow: 'shadow-cyan-500/30' },
      { day: 'Sun', value: 38, color: 'from-sky-600 via-sky-700 to-sky-800', shadow: 'shadow-sky-600/40', glow: 'shadow-sky-500/30' }
    ]
  };

  // Warehouse-specific shipment data
  const warehouseShipments = {
    'wh-delhi': [
      { id: 'DL001234', supplier: 'TechCorp Industries', products: 'iPhone 15 Pro (50 units)', eta: '2025-11-04', status: 'In Transit' },
      { id: 'DL005678', supplier: 'Global Electronics Hub', products: 'MacBook Pro (30 units)', eta: '2025-11-07', status: 'Scheduled' },
      { id: 'DL009876', supplier: 'Fashion Hub Limited', products: 'Premium Shirts (100 units)', eta: '2025-11-09', status: 'Delayed' },
      { id: 'DL002345', supplier: 'TechCorp Industries', products: 'Samsung Galaxy S24 (40 units)', eta: '2025-11-12', status: 'Processing' },
      { id: 'DL006789', supplier: 'Global Electronics Hub', products: 'Gaming Laptops (15 units)', eta: '2025-11-14', status: 'In Transit' }
    ],
    'wh-bhubaneswar': [
      { id: 'BB001345', supplier: 'Regional Tech Supply', products: 'Xiaomi Phones (35 units)', eta: '2025-11-05', status: 'Scheduled' },
      { id: 'BB005789', supplier: 'Eastern Electronics', products: 'Tablets (25 units)', eta: '2025-11-08', status: 'In Transit' },
      { id: 'BB009987', supplier: 'Coastal Fashion', products: 'Casual Wear (80 units)', eta: '2025-11-10', status: 'Processing' },
      { id: 'BB002456', supplier: 'Regional Tech Supply', products: 'Smart Watches (20 units)', eta: '2025-11-13', status: 'Scheduled' },
      { id: 'BB006890', supplier: 'Eastern Electronics', products: 'Headphones (45 units)', eta: '2025-11-15', status: 'In Transit' }
    ],
    'wh-pune': [
      { id: 'PN001456', supplier: 'Western Tech Hub', products: 'OnePlus Devices (40 units)', eta: '2025-11-03', status: 'In Transit' },
      { id: 'PN005890', supplier: 'Maharashtra Electronics', products: 'Smart TVs (12 units)', eta: '2025-11-06', status: 'Scheduled' },
      { id: 'PN009098', supplier: 'Pune Fashion House', products: 'Designer Shirts (60 units)', eta: '2025-11-11', status: 'In Transit' },
      { id: 'PN002567', supplier: 'Western Tech Hub', products: 'Bluetooth Speakers (55 units)', eta: '2025-11-13', status: 'Processing' },
      { id: 'PN006901', supplier: 'Maharashtra Electronics', products: 'Monitors (18 units)', eta: '2025-11-16', status: 'Scheduled' }
    ],
    'wh-kolkata': [
      { id: 'KL001567', supplier: 'Bengal Electronics', products: 'Vivo Smartphones (28 units)', eta: '2025-11-02', status: 'Processing' },
      { id: 'KL005901', supplier: 'Eastern Fashion Co', products: 'Traditional Wear (45 units)', eta: '2025-11-05', status: 'In Transit' },
      { id: 'KL009109', supplier: 'Kolkata Tech Center', products: 'Keyboards & Mouse (70 units)', eta: '2025-11-08', status: 'Scheduled' },
      { id: 'KL002678', supplier: 'Bengal Electronics', products: 'Power Banks (35 units)', eta: '2025-11-12', status: 'In Transit' },
      { id: 'KL006012', supplier: 'Eastern Fashion Co', products: 'Winter Jackets (25 units)', eta: '2025-11-14', status: 'Delayed' }
    ]
  };

  // Warehouse-specific delivery slots
  const warehouseDeliverySlots = {
    'wh-delhi': [
      { slot: '09:00 - 11:00', supplier: 'TechCorp Industries', items: '25 Electronics', status: 'Scheduled', action: 'Prepare' },
      { slot: '11:00 - 13:00', supplier: 'Fashion Hub Limited', items: '50 Apparel', status: 'In Progress', action: 'Processing' },
      { slot: '13:00 - 15:00', supplier: 'Global Electronics Hub', items: '15 Laptops', status: 'Scheduled', action: 'Prepare' },
      { slot: '15:00 - 17:00', supplier: 'Home Essentials Co', items: '30 Home Items', status: 'Scheduled', action: 'Prepare' }
    ],
    'wh-bhubaneswar': [
      { slot: '09:00 - 11:00', supplier: 'Regional Tech Supply', items: '20 Mobile Phones', status: 'Received', action: 'Complete' },
      { slot: '11:00 - 13:00', supplier: 'Coastal Fashion', items: '35 Casual Wear', status: 'Scheduled', action: 'Prepare' },
      { slot: '13:00 - 15:00', supplier: 'Eastern Electronics', items: '12 Tablets', status: 'In Progress', action: 'Processing' },
      { slot: '15:00 - 17:00', supplier: 'Local Suppliers', items: '18 Accessories', status: 'Scheduled', action: 'Prepare' }
    ],
    'wh-pune': [
      { slot: '09:00 - 11:00', supplier: 'Western Tech Hub', items: '30 Smart Devices', status: 'In Progress', action: 'Processing' },
      { slot: '11:00 - 13:00', supplier: 'Pune Fashion House', items: '40 Designer Items', status: 'Received', action: 'Complete' },
      { slot: '13:00 - 15:00', supplier: 'Maharashtra Electronics', items: '8 Smart TVs', status: 'Scheduled', action: 'Prepare' },
      { slot: '15:00 - 17:00', supplier: 'Local Distributors', items: '22 Audio Equipment', status: 'Scheduled', action: 'Prepare' }
    ],
    'wh-kolkata': [
      { slot: '09:00 - 11:00', supplier: 'Bengal Electronics', items: '15 Smartphones', status: 'Scheduled', action: 'Prepare' },
      { slot: '11:00 - 13:00', supplier: 'Eastern Fashion Co', items: '28 Traditional Wear', status: 'Received', action: 'Complete' },
      { slot: '13:00 - 15:00', supplier: 'Kolkata Tech Center', items: '32 Computer Peripherals', status: 'In Progress', action: 'Processing' },
      { slot: '15:00 - 17:00', supplier: 'Regional Suppliers', items: '14 Power Accessories', status: 'Scheduled', action: 'Prepare' }
    ]
  };

  // Warehouse-specific received goods
  const warehouseReceivedGoods = {
    'wh-delhi': [
      { date: '2025-11-01', supplier: 'TechCorp Industries', items: '25 Electronics', quantity: '25 units', status: 'Received', quality: 'Good' },
      { date: '2025-10-30', supplier: 'Fashion Hub Limited', items: '30 Apparel', quantity: '30 units', status: 'Received', quality: 'Excellent' },
      { date: '2025-10-28', supplier: 'Global Electronics Hub', items: '20 Laptops', quantity: '20 units', status: 'Received', quality: 'Good' },
      { date: '2025-10-26', supplier: 'Home Essentials Co', items: '40 Home Items', quantity: '40 units', status: 'Received', quality: 'Fair' }
    ],
    'wh-bhubaneswar': [
      { date: '2025-10-31', supplier: 'Regional Tech Supply', items: '18 Mobile Phones', quantity: '18 units', status: 'Received', quality: 'Excellent' },
      { date: '2025-10-29', supplier: 'Coastal Fashion', items: '25 Casual Wear', quantity: '25 units', status: 'Received', quality: 'Good' },
      { date: '2025-10-27', supplier: 'Eastern Electronics', items: '15 Tablets', quantity: '15 units', status: 'Received', quality: 'Good' },
      { date: '2025-10-26', supplier: 'Local Suppliers', items: '22 Accessories', quantity: '22 units', status: 'Received', quality: 'Excellent' }
    ],
    'wh-pune': [
      { date: '2025-11-01', supplier: 'Western Tech Hub', items: '28 Smart Devices', quantity: '28 units', status: 'Received', quality: 'Good' },
      { date: '2025-10-30', supplier: 'Pune Fashion House', items: '35 Designer Items', quantity: '35 units', status: 'Received', quality: 'Excellent' },
      { date: '2025-10-28', supplier: 'Maharashtra Electronics', items: '10 Smart TVs', quantity: '10 units', status: 'Received', quality: 'Good' },
      { date: '2025-10-27', supplier: 'Local Distributors', items: '20 Audio Equipment', quantity: '20 units', status: 'Received', quality: 'Fair' }
    ],
    'wh-kolkata': [
      { date: '2025-11-01', supplier: 'Bengal Electronics', items: '12 Smartphones', quantity: '12 units', status: 'Received', quality: 'Good' },
      { date: '2025-10-31', supplier: 'Eastern Fashion Co', items: '28 Traditional Wear', quantity: '28 units', status: 'Received', quality: 'Excellent' },
      { date: '2025-10-29', supplier: 'Kolkata Tech Center', items: '32 Computer Peripherals', quantity: '32 units', status: 'Received', quality: 'Good' },
      { date: '2025-10-27', supplier: 'Regional Suppliers', items: '16 Power Accessories', quantity: '16 units', status: 'Received', quality: 'Fair' }
    ]
  };

  // Warehouse-specific analytics data
  const warehouseAnalytics = {
    'wh-delhi': {
      incomingShipments: 47,
      incomingProgress: 78,
      onTimeRate: 92,
      onTimeProgress: 92,
      damagedItems: 5,
      damagedProgress: 15,
      activeTrucks: 156
    },
    'wh-bhubaneswar': {
      incomingShipments: 32,
      incomingProgress: 65,
      onTimeRate: 88,
      onTimeProgress: 88,
      damagedItems: 3,
      damagedProgress: 12,
      activeTrucks: 89
    },
    'wh-pune': {
      incomingShipments: 52,
      incomingProgress: 85,
      onTimeRate: 94,
      onTimeProgress: 94,
      damagedItems: 2,
      damagedProgress: 8,
      activeTrucks: 142
    },
    'wh-kolkata': {
      incomingShipments: 28,
      incomingProgress: 58,
      onTimeRate: 85,
      onTimeProgress: 85,
      damagedItems: 7,
      damagedProgress: 20,
      activeTrucks: 76
    }
  };

  const warehouses = [
    { id: 'wh-delhi', name: 'WH-Delhi', location: 'Delhi' },
    { id: 'wh-bhubaneswar', name: 'WH-Bhubaneswar', location: 'Bhubaneswar' },
    { id: 'wh-pune', name: 'WH-Pune', location: 'Pune' },
    { id: 'wh-kolkata', name: 'WH-Kolkata', location: 'Kolkata' }
  ];

  const currentWarehouseData = warehouseData[selectedWarehouse];
  const currentShipments = warehouseShipments[selectedWarehouse];
  const currentDeliverySlots = warehouseDeliverySlots[selectedWarehouse];
  const currentReceivedGoods = warehouseReceivedGoods[selectedWarehouse];
  const currentAnalytics = warehouseAnalytics[selectedWarehouse];
  
  const weeklyAverage = Math.round(currentWarehouseData.reduce((sum, day) => sum + day.value, 0) / 7);
  const peakDay = currentWarehouseData.reduce((max, day) => day.value > max.value ? day : max, currentWarehouseData[0]);
  const weeklyTotal = currentWarehouseData.reduce((sum, day) => sum + day.value, 0);
  const targetProgress = Math.min((weeklyTotal / 420) * 100, 150);

  const handleWarehouseChange = (warehouseId) => {
    setSelectedWarehouse(warehouseId);
  };
  return (
    <motion.div
      key="inbound"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Inbound Agent - Logistics Management</h2>
      
      {/* Truck Image and Bar Graph Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Left Card - Fleet Operations Dashboard */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-purple-900/40 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 p-6 shadow-2xl overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10 h-full">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center border border-blue-400/30"
                >
                  <span className="text-2xl">🚛</span>
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white">Fleet Operations</h3>
                  <p className="text-sm text-white/60">Real-time logistics dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300 font-semibold">LIVE</span>
              </div>
            </div>

            {/* Truck Image Section */}
            <div className="flex items-center justify-center mb-6">
              <motion.img
                src="/assets/truck.png"
                alt="Logistics Truck"
                className="w-48 h-36 object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1
                }}
                transition={{ 
                  scale: { duration: 0.8 },
                  opacity: { duration: 0.8 }
                }}
              />
            </div>

            {/* Main Metrics Grid - Simplified */}
            <div className="grid grid-cols-2 gap-6">
              {/* Active Shipments */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-400/20 hover:border-orange-400/40 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">📦</span>
                  <span className="text-base text-white/70 font-medium">Active Shipments</span>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                  26
                </div>
                <div className="text-sm text-white/50 mb-3">Currently in transit</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                    />
                  </div>
                  <span className="text-sm text-orange-300 font-semibold">65%</span>
                </div>
              </motion.div>

              {/* Active Trucks */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🚚</span>
                  <span className="text-base text-white/70 font-medium">Fleet Size</span>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  {currentAnalytics.activeTrucks}
                </div>
                <div className="text-sm text-white/50 mb-3">Active vehicles</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "87%" }}
                      transition={{ duration: 2, delay: 0.7 }}
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                  </div>
                  <span className="text-sm text-green-300 font-semibold">87%</span>
                </div>
              </motion.div>
            </div>


          </div>
        </motion.div>

        {/* Right Card - Bar Graph */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 p-4 shadow-2xl before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-2xl before:pointer-events-none"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">📊 Weekly Inbound Volume</h3>
              <div className="flex items-center space-x-4">
                {/* Warehouse Selector Dropdown */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative"
                >
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => handleWarehouseChange(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 cursor-pointer hover:bg-white/15"
                  >
                    {warehouses.map((warehouse) => (
                      <option 
                        key={warehouse.id} 
                        value={warehouse.id}
                        className="bg-gray-800 text-white"
                      >
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex items-center space-x-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30"
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-emerald-400 font-semibold">Live Data</span>
                </motion.div>
              </div>
            </div>

            {/* Chart Grid Background */}
            <div className="relative h-64 bg-gradient-to-b from-black/30 to-black/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              {/* Horizontal Grid Lines */}
              <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
                {[100, 75, 50, 25, 0].map((value, i) => (
                  <div key={value} className="flex items-center">
                    <span className="text-xs text-white/40 w-8 text-right mr-2">{value}</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                  </div>
                ))}
              </div>

              {/* Bar Chart */}
              <div className="relative h-full flex items-end justify-center space-x-3 pt-12 pb-8">
                {currentWarehouseData.map((bar, index) => (
                  <div key={bar.day} className="flex flex-col items-center relative">
                    {/* Bar */}
                    {/* Value Display on Top of Bar - Always Visible */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 1.8 }}
                      className="mb-2 z-10"
                    >
                      <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/20">
                        <span className="text-xs text-white font-bold">{bar.value}</span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ height: 0, opacity: 0, scale: 0.8 }}
                      animate={{ height: `${(bar.value / 100) * 140}px`, opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 1.8, 
                        delay: index * 0.2, 
                        type: "spring",
                        stiffness: 80,
                        damping: 12
                      }}
                      className={`w-12 bg-gradient-to-t ${bar.color} rounded-t-2xl shadow-xl ${bar.shadow} border-2 border-white/30 relative overflow-hidden`}
                    >
                      {/* Glossy Effect */}
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 2.5, delay: index * 0.15 + 0.8 }}
                        className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/20 to-white/40 rounded-t-2xl"
                      />
                      
                      {/* Shimmer Effect */}
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ 
                          duration: 2, 
                          delay: index * 0.1 + 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                        className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                      />

                      {/* Peak Indicator */}
                      {bar.value === peakDay.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 2.5 }}
                          className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                        >
                          <span className="text-xs">👑</span>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Day Label */}
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 2 }}
                      className="text-sm text-white/90 font-bold mt-2"
                    >
                      {bar.day}
                    </motion.span>

                    {/* Value Badge */}
                    {/* <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 2.2 }}
                      className="mt-1 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                    >
                      <span className="text-xs text-white/80 font-mono font-semibold">{bar.value}</span>
                    </motion.div> */}
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Statistics Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.5 }}
              className="mt-4 p-3 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-xl border border-white/20 backdrop-blur-sm"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs text-white/70">Weekly Average</span>
                  </div>
                  <div className="text-lg font-bold text-emerald-400">{weeklyAverage}</div>
                  <div className="text-xs text-white/50">shipments/day</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-xs text-white/70">Peak Day</span>
                  </div>
                  <div className="text-lg font-bold text-purple-400">{peakDay.value}</div>
                  <div className="text-xs text-white/50">{peakDay.day}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Shipment Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">📦 Shipment Schedule</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Tracking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">ETA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentShipments.map((shipment, index) => (
                <motion.tr 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hover:bg-white/5 transition-all duration-300"
                >
                  <td className="px-6 py-4 text-sm font-mono text-white">{shipment.id}</td>
                  <td className="px-6 py-4 text-sm text-white">{shipment.supplier}</td>
                  <td className="px-6 py-4 text-sm text-white/80">{shipment.products}</td>
                  <td className="px-6 py-4 text-sm text-white">{shipment.eta}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${
                      shipment.status === 'In Transit' ? 'bg-blue-500/20 text-blue-200 border-blue-400/30' :
                      shipment.status === 'Scheduled' ? 'bg-green-500/20 text-green-200 border-green-400/30' :
                      shipment.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30' :
                      'bg-red-500/20 text-red-200 border-red-400/30'
                    }`}>
                      {shipment.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Delivery Slots and Received Goods Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Table - Delivery Slots */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <span>🚚</span>
              <span>Delivery Slots</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Time Slot</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {currentDeliverySlots.map((slot, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="hover:bg-white/5 transition-all duration-300"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-white">{slot.slot}</td>
                    <td className="px-4 py-4 text-sm text-white">{slot.supplier}</td>
                    <td className="px-4 py-4 text-sm text-white/80">{slot.items}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${
                        slot.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30' :
                        'bg-blue-500/20 text-blue-200 border-blue-400/30'
                      }`}>
                        {slot.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right Table - Received Goods */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <span>📦</span>
              <span>Received Goods</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {currentReceivedGoods.map((goods, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="hover:bg-white/5 transition-all duration-300"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-white">{goods.date}</td>
                    <td className="px-4 py-4 text-sm text-white">{goods.supplier}</td>
                    <td className="px-4 py-4 text-sm text-white/80">{goods.items}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${
                        goods.quality === 'Excellent' ? 'bg-green-500/20 text-green-200 border-green-400/30' :
                        goods.quality === 'Good' ? 'bg-blue-500/20 text-blue-200 border-blue-400/30' :
                        'bg-yellow-500/20 text-yellow-200 border-yellow-400/30'
                      }`}>
                        {goods.quality}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Inbound Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center"
            >
              <span className="text-xl">📦</span>
            </motion.div>
            <h4 className="text-lg font-semibold text-white">Incoming Shipments</h4>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-400">{currentAnalytics.incomingShipments}</div>
            <div className="text-sm text-white/70">Expected this week</div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                key={selectedWarehouse + '-incoming'}
                initial={{ width: 0 }}
                animate={{ width: `${currentAnalytics.incomingProgress}%` }}
                transition={{ duration: 2, delay: 0.5 }}
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center"
            >
              <span className="text-xl">✅</span>
            </motion.div>
            <h4 className="text-lg font-semibold text-white">Goods Received</h4>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-400">{currentAnalytics.onTimeRate}%</div>
            <div className="text-sm text-white/70">On-time delivery rate</div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                key={selectedWarehouse + '-ontime'}
                initial={{ width: 0 }}
                animate={{ width: `${currentAnalytics.onTimeProgress}%` }}
                transition={{ duration: 2, delay: 0.7 }}
                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              animate={{ 
                boxShadow: ["0 0 0 0 rgba(251, 191, 36, 0.7)", "0 0 0 10px rgba(251, 191, 36, 0)", "0 0 0 0 rgba(251, 191, 36, 0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 bg-orange-500/30 rounded-full flex items-center justify-center"
            >
              <span className="text-xl">⚠️</span>
            </motion.div>
            <h4 className="text-lg font-semibold text-white">Damaged Items</h4>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-orange-400">{currentAnalytics.damagedItems}</div>
            <div className="text-sm text-white/70">Require attention</div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                key={selectedWarehouse + '-damaged'}
                initial={{ width: 0 }}
                animate={{ width: `${currentAnalytics.damagedProgress}%` }}
                transition={{ duration: 2, delay: 0.9 }}
                className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
              />
            </div>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default InboundAgent;
