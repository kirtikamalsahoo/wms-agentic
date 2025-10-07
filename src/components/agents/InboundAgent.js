'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const InboundAgent = ({ isAgentRunning, onRunAgent }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('wh-delhi');

  // Warehouse data with different inbound volumes
  const warehouseData = {
    'wh-delhi': [
      { day: 'Mon', value: 85, color: 'from-blue-400 via-blue-500 to-blue-600', shadow: 'shadow-blue-500/60', glow: 'shadow-blue-400/40' },
      { day: 'Tue', value: 92, color: 'from-emerald-400 via-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/60', glow: 'shadow-emerald-400/40' },
      { day: 'Wed', value: 78, color: 'from-amber-400 via-amber-500 to-amber-600', shadow: 'shadow-amber-500/60', glow: 'shadow-amber-400/40' },
      { day: 'Thu', value: 95, color: 'from-purple-400 via-purple-500 to-purple-600', shadow: 'shadow-purple-500/60', glow: 'shadow-purple-400/40' },
      { day: 'Fri', value: 88, color: 'from-pink-400 via-pink-500 to-pink-600', shadow: 'shadow-pink-500/60', glow: 'shadow-pink-400/40' },
      { day: 'Sat', value: 65, color: 'from-orange-400 via-orange-500 to-orange-600', shadow: 'shadow-orange-500/60', glow: 'shadow-orange-400/40' },
      { day: 'Sun', value: 45, color: 'from-red-400 via-red-500 to-red-600', shadow: 'shadow-red-500/60', glow: 'shadow-red-400/40' }
    ],
    'wh-bhubaneswar': [
      { day: 'Mon', value: 72, color: 'from-blue-400 via-blue-500 to-blue-600', shadow: 'shadow-blue-500/60', glow: 'shadow-blue-400/40' },
      { day: 'Tue', value: 68, color: 'from-emerald-400 via-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/60', glow: 'shadow-emerald-400/40' },
      { day: 'Wed', value: 84, color: 'from-amber-400 via-amber-500 to-amber-600', shadow: 'shadow-amber-500/60', glow: 'shadow-amber-400/40' },
      { day: 'Thu', value: 91, color: 'from-purple-400 via-purple-500 to-purple-600', shadow: 'shadow-purple-500/60', glow: 'shadow-purple-400/40' },
      { day: 'Fri', value: 76, color: 'from-pink-400 via-pink-500 to-pink-600', shadow: 'shadow-pink-500/60', glow: 'shadow-pink-400/40' },
      { day: 'Sat', value: 58, color: 'from-orange-400 via-orange-500 to-orange-600', shadow: 'shadow-orange-500/60', glow: 'shadow-orange-400/40' },
      { day: 'Sun', value: 41, color: 'from-red-400 via-red-500 to-red-600', shadow: 'shadow-red-500/60', glow: 'shadow-red-400/40' }
    ],
    'wh-pune': [
      { day: 'Mon', value: 96, color: 'from-blue-400 via-blue-500 to-blue-600', shadow: 'shadow-blue-500/60', glow: 'shadow-blue-400/40' },
      { day: 'Tue', value: 89, color: 'from-emerald-400 via-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/60', glow: 'shadow-emerald-400/40' },
      { day: 'Wed', value: 93, color: 'from-amber-400 via-amber-500 to-amber-600', shadow: 'shadow-amber-500/60', glow: 'shadow-amber-400/40' },
      { day: 'Thu', value: 87, color: 'from-purple-400 via-purple-500 to-purple-600', shadow: 'shadow-purple-500/60', glow: 'shadow-purple-400/40' },
      { day: 'Fri', value: 94, color: 'from-pink-400 via-pink-500 to-pink-600', shadow: 'shadow-pink-500/60', glow: 'shadow-pink-400/40' },
      { day: 'Sat', value: 73, color: 'from-orange-400 via-orange-500 to-orange-600', shadow: 'shadow-orange-500/60', glow: 'shadow-orange-400/40' },
      { day: 'Sun', value: 52, color: 'from-red-400 via-red-500 to-red-600', shadow: 'shadow-red-500/60', glow: 'shadow-red-400/40' }
    ],
    'wh-kolkata': [
      { day: 'Mon', value: 63, color: 'from-blue-400 via-blue-500 to-blue-600', shadow: 'shadow-blue-500/60', glow: 'shadow-blue-400/40' },
      { day: 'Tue', value: 71, color: 'from-emerald-400 via-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/60', glow: 'shadow-emerald-400/40' },
      { day: 'Wed', value: 59, color: 'from-amber-400 via-amber-500 to-amber-600', shadow: 'shadow-amber-500/60', glow: 'shadow-amber-400/40' },
      { day: 'Thu', value: 82, color: 'from-purple-400 via-purple-500 to-purple-600', shadow: 'shadow-purple-500/60', glow: 'shadow-purple-400/40' },
      { day: 'Fri', value: 67, color: 'from-pink-400 via-pink-500 to-pink-600', shadow: 'shadow-pink-500/60', glow: 'shadow-pink-400/40' },
      { day: 'Sat', value: 55, color: 'from-orange-400 via-orange-500 to-orange-600', shadow: 'shadow-orange-500/60', glow: 'shadow-orange-400/40' },
      { day: 'Sun', value: 38, color: 'from-red-400 via-red-500 to-red-600', shadow: 'shadow-red-500/60', glow: 'shadow-red-400/40' }
    ]
  };

  const warehouses = [
    { id: 'wh-delhi', name: 'WH-Delhi', location: 'Delhi' },
    { id: 'wh-bhubaneswar', name: 'WH-Bhubaneswar', location: 'Bhubaneswar' },
    { id: 'wh-pune', name: 'WH-Pune', location: 'Pune' },
    { id: 'wh-kolkata', name: 'WH-Kolkata', location: 'Kolkata' }
  ];

  const currentWarehouseData = warehouseData[selectedWarehouse];
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
        {/* Left Card - Truck Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 p-4 shadow-2xl before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-2xl before:pointer-events-none"
        >
          <div className="relative z-10 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">🚛 Active Shipments</h3>
            <div className="flex justify-center items-center overflow-hidden">
              <motion.img
                src="/assets/truck.png"
                alt="Logistics Truck"
                className="w-80 h-80 object-contain"
                initial={{ scale: 0.8, opacity: 0, x: -100 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  x: [0, 25, -25, 0]
                }}
                transition={{ 
                  scale: { duration: 0.8 },
                  opacity: { duration: 0.8 },
                  x: { 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }
                }}
                whileHover={{ 
                  scale: 1.15,
                  y: [-8, -15, -8],
                  transition: { 
                    duration: 0.6,
                    y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                  }
                }}
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-2 space-y-1"
            >
              <div className="text-xl font-bold text-blue-400">24/7</div>
              <div className="text-xs text-white/70">Active Fleet Operations</div>
              <div className="flex justify-center space-x-3 mt-2">
                <div className="text-center">
                  <div className="text-sm font-semibold text-green-400">156</div>
                  <div className="text-xs text-white/60">Active Trucks</div>
                </div>
                {/* <div className="text-center">
                  <div className="text-sm font-semibold text-yellow-400">89%</div>
                  <div className="text-xs text-white/60">Efficiency Rate</div>
                </div> */}
              </div>
            </motion.div>
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
              <div className="relative h-full flex items-end justify-center space-x-3 pt-8">
                {currentWarehouseData.map((bar, index) => (
                  <div key={bar.day} className="flex flex-col items-center group">
                    {/* Value Display on Top */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 1.8 }}
                      className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/20">
                        <span className="text-xs text-white font-bold">{bar.value}</span>
                      </div>
                    </motion.div>

                    {/* Bar */}
                    <motion.div
                      initial={{ height: 0, opacity: 0, scale: 0.8 }}
                      animate={{ height: `${(bar.value / 100) * 160}px`, opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 1.8, 
                        delay: index * 0.2, 
                        type: "spring",
                        stiffness: 80,
                        damping: 12
                      }}
                      className={`w-12 bg-gradient-to-t ${bar.color} rounded-t-2xl shadow-xl ${bar.shadow} border-2 border-white/30 relative overflow-hidden group-hover:scale-110 transition-all duration-300`}
                      whileHover={{ 
                        scale: 1.2,
                        y: -8,
                        filter: "brightness(1.2)",
                        boxShadow: `0 20px 40px ${bar.glow}`
                      }}
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
                      className="text-sm text-white/90 font-bold mt-2 group-hover:text-white transition-colors duration-300"
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
              
              {/* Progress Indicator */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                  <span>Weekly Target: 420</span>
                  <span>Current: {weeklyTotal} ({targetProgress > 100 ? '+' : ''}{Math.round(targetProgress - 100)}%)</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    key={selectedWarehouse}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(targetProgress, 150)}%` }}
                    transition={{ duration: 2, delay: 3 }}
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 relative overflow-hidden"
                  >
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    />
                  </motion.div>
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
              {[
                { id: 'TC001234', supplier: 'TechCorp Industries', products: 'iPhone 15 Pro (50 units)', eta: '2024-01-15', status: 'In Transit' },
                { id: 'GE005678', supplier: 'Global Electronics Hub', products: 'MacBook Pro (30 units)', eta: '2024-01-16', status: 'Scheduled' },
                { id: 'FH009876', supplier: 'Fashion Hub Limited', products: 'Premium Shirts (100 units)', eta: '2024-01-17', status: 'Delayed' },
                { id: 'TC002345', supplier: 'TechCorp Industries', products: 'Samsung Galaxy S24 (40 units)', eta: '2024-01-18', status: 'Processing' },
                { id: 'GE006789', supplier: 'Global Electronics Hub', products: 'Gaming Laptops (15 units)', eta: '2024-01-19', status: 'In Transit' }
              ].map((shipment, index) => (
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

      {/* Delivery Slots Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">🚚 Delivery Slots & Received Goods</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Time Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { slot: '09:00 - 11:00', supplier: 'TechCorp Industries', items: '25 Electronics', status: 'Received', action: 'Complete' },
                { slot: '11:00 - 13:00', supplier: 'Fashion Hub Limited', items: '50 Apparel', status: 'In Progress', action: 'Processing' },
                { slot: '13:00 - 15:00', supplier: 'Global Electronics Hub', items: '15 Laptops', status: 'Scheduled', action: 'Prepare' },
                { slot: '15:00 - 17:00', supplier: 'Home Essentials Co', items: '30 Home Items', status: 'Scheduled', action: 'Prepare' }
              ].map((slot, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hover:bg-white/5 transition-all duration-300"
                >
                  <td className="px-6 py-4 text-sm font-medium text-white">{slot.slot}</td>
                  <td className="px-6 py-4 text-sm text-white">{slot.supplier}</td>
                  <td className="px-6 py-4 text-sm text-white/80">{slot.items}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${
                      slot.status === 'Received' ? 'bg-green-500/20 text-green-200 border-green-400/30' :
                      slot.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30' :
                      'bg-blue-500/20 text-blue-200 border-blue-400/30'
                    }`}>
                      {slot.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                        slot.status === 'Received' ? 'bg-white/10 text-white/60 border border-white/20' :
                        'bg-gradient-to-r from-purple-500/50 to-pink-500/50 text-white border border-white/20 hover:from-purple-500/70 hover:to-pink-500/70'
                      }`}
                    >
                      {slot.action}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

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
            <div className="text-3xl font-bold text-blue-400">47</div>
            <div className="text-sm text-white/70">Expected this week</div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
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
            <div className="text-3xl font-bold text-green-400">92%</div>
            <div className="text-sm text-white/70">On-time delivery rate</div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
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
            <div className="text-3xl font-bold text-orange-400">5</div>
            <div className="text-sm text-white/70">Require attention</div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "15%" }}
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
