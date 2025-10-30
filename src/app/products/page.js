'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Warehouse data
const warehouses = [
  {
    id: 'delhi',
    name: 'Delhi Central Warehouse',
    icon: '🏢',
    location: 'New Delhi, India',
    theme: 'from-blue-500 to-blue-700',
    route: '/products/delhi',
    stats: {
      capacity: '85%',
      dailyOrders: '420',
      suppliers: '12'
    }
  },
  {
    id: 'bbsr',
    name: 'BBSR Distribution Center',
    icon: '🏭',
    location: 'Bhubaneswar, Odisha',
    theme: 'from-green-500 to-green-700',
    route: '/products/bbsr',
    stats: {
      capacity: '72%',
      dailyOrders: '380',
      suppliers: '10'
    }
  },
  {
    id: 'pune',
    name: 'Pune Regional Hub',
    icon: '🏪',
    location: 'Pune, Maharashtra',
    theme: 'from-purple-500 to-purple-700',
    route: '/products/pune',
    stats: {
      capacity: '91%',
      dailyOrders: '450',
      suppliers: '15'
    }
  },
  {
    id: 'kolkata',
    name: 'Kolkata East Zone',
    icon: '🏬',
    location: 'Kolkata, West Bengal',
    theme: 'from-orange-500 to-orange-700',
    route: '/products/kolkata',
    stats: {
      capacity: '68%',
      dailyOrders: '350',
      suppliers: '8'
    }
  }
];

// Suppliers data
const suppliersList = [
  { id: 1, name: 'TechCorp Industries', category: 'Electronics', warehouses: ['Delhi', 'Pune'], rating: 4.8, status: 'Active' },
  { id: 2, name: 'Global Electronics Hub', category: 'Electronics', warehouses: ['Delhi', 'Kolkata'], rating: 4.7, status: 'Active' },
  { id: 3, name: 'Fashion Hub Limited', category: 'Fashion', warehouses: ['Delhi', 'BBSR'], rating: 4.6, status: 'Active' },
  { id: 4, name: 'Regional Tech Supply', category: 'Electronics', warehouses: ['BBSR'], rating: 4.5, status: 'Active' },
  { id: 5, name: 'Eastern Electronics', category: 'Electronics', warehouses: ['BBSR', 'Kolkata'], rating: 4.4, status: 'Active' },
  { id: 6, name: 'Coastal Fashion', category: 'Fashion', warehouses: ['BBSR'], rating: 4.3, status: 'Active' },
  { id: 7, name: 'Western Tech Hub', category: 'Electronics', warehouses: ['Pune'], rating: 4.9, status: 'Active' },
  { id: 8, name: 'Maharashtra Electronics', category: 'Electronics', warehouses: ['Pune'], rating: 4.6, status: 'Active' },
  { id: 9, name: 'Pune Fashion House', category: 'Fashion', warehouses: ['Pune'], rating: 4.7, status: 'Active' },
  { id: 10, name: 'Bengal Electronics', category: 'Electronics', warehouses: ['Kolkata'], rating: 4.4, status: 'Active' },
  { id: 11, name: 'Eastern Fashion Co', category: 'Fashion', warehouses: ['Kolkata'], rating: 4.5, status: 'Active' },
  { id: 12, name: 'Kolkata Tech Center', category: 'Electronics', warehouses: ['Kolkata'], rating: 4.3, status: 'Active' },
  { id: 13, name: 'Home Essentials Co', category: 'Household', warehouses: ['Delhi', 'Pune'], rating: 4.2, status: 'Active' },
  { id: 14, name: 'Local Distributors', category: 'Accessories', warehouses: ['Pune'], rating: 4.1, status: 'Active' },
  { id: 15, name: 'Local Suppliers', category: 'Accessories', warehouses: ['BBSR'], rating: 4.0, status: 'Active' },
  { id: 16, name: 'Regional Suppliers', category: 'Accessories', warehouses: ['Kolkata'], rating: 4.2, status: 'Active' },
  { id: 17, name: 'Premium Goods Ltd', category: 'Fashion', warehouses: ['Delhi', 'Pune'], rating: 4.8, status: 'Active' },
  { id: 18, name: 'Smart Devices Inc', category: 'Electronics', warehouses: ['Delhi', 'BBSR', 'Pune'], rating: 4.7, status: 'Active' },
  { id: 19, name: 'Quality Home Products', category: 'Household', warehouses: ['BBSR', 'Kolkata'], rating: 4.4, status: 'Active' },
  { id: 20, name: 'Fashion Forward Co', category: 'Fashion', warehouses: ['All'], rating: 4.6, status: 'Active' },
  { id: 21, name: 'Tech Solutions Hub', category: 'Electronics', warehouses: ['Delhi', 'Pune'], rating: 4.5, status: 'Active' },
  { id: 22, name: 'Lifestyle Accessories', category: 'Accessories', warehouses: ['Delhi', 'BBSR'], rating: 4.3, status: 'Active' },
  { id: 23, name: 'Universal Suppliers', category: 'Household', warehouses: ['All'], rating: 4.1, status: 'Active' }
];

// Individual Warehouse Card Component
const WarehouseCard = ({ warehouse }) => {
  const router = useRouter();
  
  const handleClick = () => {
    window.open(warehouse.route, '_blank');
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 
                 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
    >
      {/* Background with Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${warehouse.theme} opacity-80`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col">
        {/* Header */}
        <div className="text-center flex-shrink-0">
          <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
            {warehouse.icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
            {warehouse.name}
          </h3>
          <p className="text-white/80 text-xs mb-4">
            📍 {warehouse.location}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4 flex-shrink-0">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-2">
            <div className="text-green-400 text-sm font-bold">{warehouse.stats.capacity}</div>
            <div className="text-white/60 text-xs">Capacity</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-2">
            <div className="text-blue-400 text-sm font-bold">{warehouse.stats.dailyOrders}</div>
            <div className="text-white/60 text-xs">Orders</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-2">
            <div className="text-purple-400 text-sm font-bold">{warehouse.stats.suppliers}</div>
            <div className="text-white/60 text-xs">Suppliers</div>
          </div>
        </div>

        {/* Action Button - Now relative instead of absolute */}
        <div className="mt-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30 
                          group-hover:bg-white/30 transition-all duration-300">
            <div className="text-white font-semibold text-sm group-hover:text-yellow-300">
              🔍 View Live Warehouse
            </div>
            <div className="text-white/60 text-xs mt-1">
              Click to explore →
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
};



// Main Products Overview Page
// Orders data
const ordersList = [
  { id: 'ORD-2024-001', customer: 'Tech Solutions Pvt Ltd', warehouse: 'Delhi', items: 15, value: '₹45,600', status: 'Processing', priority: 'High', time: '09:15 AM' },
  { id: 'ORD-2024-002', customer: 'Fashion Hub Corp', warehouse: 'BBSR', items: 8, value: '₹23,400', status: 'Shipped', priority: 'Medium', time: '09:32 AM' },
  { id: 'ORD-2024-003', customer: 'Electronics World', warehouse: 'Pune', items: 22, value: '₹78,900', status: 'Processing', priority: 'High', time: '09:45 AM' },
  { id: 'ORD-2024-004', customer: 'Home Essentials Ltd', warehouse: 'Kolkata', items: 12, value: '₹34,200', status: 'Delivered', priority: 'Low', time: '10:15 AM' },
  { id: 'ORD-2024-005', customer: 'Smart Devices Inc', warehouse: 'Delhi', items: 18, value: '₹56,700', status: 'Processing', priority: 'Medium', time: '10:30 AM' },
  { id: 'ORD-2024-006', customer: 'Quality Fashion', warehouse: 'BBSR', items: 6, value: '₹18,300', status: 'Packed', priority: 'Medium', time: '10:45 AM' },
  { id: 'ORD-2024-007', customer: 'Tech Innovations', warehouse: 'Pune', items: 25, value: '₹89,400', status: 'Processing', priority: 'High', time: '11:00 AM' },
  { id: 'ORD-2024-008', customer: 'Lifestyle Products', warehouse: 'Kolkata', items: 9, value: '₹27,600', status: 'Shipped', priority: 'Low', time: '11:20 AM' },
  { id: 'ORD-2024-009', customer: 'Premium Electronics', warehouse: 'Delhi', items: 14, value: '₹42,800', status: 'Processing', priority: 'High', time: '11:35 AM' },
  { id: 'ORD-2024-010', customer: 'Fashion Forward Co', warehouse: 'BBSR', items: 11, value: '₹31,500', status: 'Delivered', priority: 'Medium', time: '11:50 AM' },
  { id: 'ORD-2024-011', customer: 'Western Tech Hub', warehouse: 'Pune', items: 20, value: '₹67,200', status: 'Processing', priority: 'High', time: '12:10 PM' },
  { id: 'ORD-2024-012', customer: 'Bengal Suppliers', warehouse: 'Kolkata', items: 7, value: '₹21,900', status: 'Packed', priority: 'Low', time: '12:25 PM' },
  { id: 'ORD-2024-013', customer: 'Capital Electronics', warehouse: 'Delhi', items: 16, value: '₹48,700', status: 'Processing', priority: 'Medium', time: '12:40 PM' },
  { id: 'ORD-2024-014', customer: 'Coastal Fashion', warehouse: 'BBSR', items: 13, value: '₹39,400', status: 'Shipped', priority: 'Medium', time: '01:05 PM' },
  { id: 'ORD-2024-015', customer: 'Maharashtra Tech', warehouse: 'Pune', items: 19, value: '₹58,600', status: 'Processing', priority: 'High', time: '01:20 PM' },
  { id: 'ORD-2024-016', customer: 'Eastern Electronics', warehouse: 'Kolkata', items: 10, value: '₹29,800', status: 'Delivered', priority: 'Low', time: '01:35 PM' },
  { id: 'ORD-2024-017', customer: 'Premium Goods Ltd', warehouse: 'Delhi', items: 21, value: '₹73,500', status: 'Processing', priority: 'High', time: '01:50 PM' },
  { id: 'ORD-2024-018', customer: 'Regional Suppliers', warehouse: 'BBSR', items: 5, value: '₹16,200', status: 'Packed', priority: 'Low', time: '02:10 PM' },
  { id: 'ORD-2024-019', customer: 'Pune Fashion House', warehouse: 'Pune', items: 17, value: '₹52,400', status: 'Processing', priority: 'Medium', time: '02:25 PM' },
  { id: 'ORD-2024-020', customer: 'Kolkata Tech Center', warehouse: 'Kolkata', items: 12, value: '₹36,900', status: 'Shipped', priority: 'Medium', time: '02:40 PM' }
];

export default function ProductsOverviewPage() {
  const router = useRouter();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuppliers, setShowSuppliers] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black 
                      flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white text-lg font-semibold">Loading Warehouse Network...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        {/* <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl 
                       border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
          >
            <span className="mr-3 transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            Back to Home
          </Link>
        </div> */}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500 bg-clip-text text-transparent">
            🏭 Warehouse Management System
          </h1>
          <p className="text-gray-300 text-xl mb-8">
            Select a warehouse location to view live operations and inventory
          </p>
          
          {/* Network Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-blue-400 mb-2">4</div>
              <div className="text-white/80 text-sm">Active Warehouses</div>
            </div>
            <div 
              onClick={() => setShowOrders(true)}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="text-3xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">1,670</div>
              <div className="text-white/80 text-sm group-hover:text-white transition-colors">Daily Orders</div>
              <div className="text-xs text-white/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to view orders</div>
            </div>
            <div 
              onClick={() => setShowSuppliers(true)}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">23</div>
              <div className="text-white/80 text-sm group-hover:text-white transition-colors">Total Suppliers</div>
              <div className="text-xs text-white/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to view list</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-orange-400 mb-2">80.25%</div>
              <div className="text-white/80 text-sm">Avg Capacity</div>
            </div>
          </div>
        </div>

        {/* Warehouse Cards Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            🏢 Select Your Warehouse
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {warehouses.map((warehouse) => (
              <WarehouseCard key={warehouse.id} warehouse={warehouse} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm">
            🌟 Powered by Invent Gen AI Team
          </p>
        </div>
      </div>

      {/* Orders Modal */}
      {showOrders && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-5xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">📋 Today&apos;s Live Orders</h3>
                <p className="text-white/60">Real-time order tracking across all warehouses</p>
              </div>
              <button 
                onClick={() => setShowOrders(false)}
                className="text-white/60 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Orders List */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {ordersList.map((order) => (
                  <div 
                    key={order.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-white font-semibold text-sm group-hover:text-cyan-400 transition-colors">
                            {order.id}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded-full border ${
                            order.warehouse === 'Delhi' ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' :
                            order.warehouse === 'BBSR' ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                            order.warehouse === 'Pune' ? 'bg-purple-500/20 text-purple-300 border-purple-400/30' :
                            'bg-orange-500/20 text-orange-300 border-orange-400/30'
                          }`}>
                            📍 {order.warehouse}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full border ${
                            order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                            order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' :
                            order.status === 'Delivered' ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                            'bg-purple-500/20 text-purple-300 border-purple-400/30'
                          }`}>
                            {order.status}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full border ${
                            order.priority === 'High' ? 'bg-red-500/20 text-red-300 border-red-400/30' :
                            order.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                            'bg-gray-500/20 text-gray-300 border-gray-400/30'
                          }`}>
                            {order.priority} Priority
                          </span>
                        </div>
                        <div className="text-white/80 text-sm mb-1">{order.customer}</div>
                        <div className="text-white/60 text-xs">⏰ {order.time}</div>
                      </div>

                      {/* Order Stats */}
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-cyan-400 font-bold text-lg">{order.items}</div>
                          <div className="text-white/60 text-xs">Items</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-bold text-lg">{order.value}</div>
                          <div className="text-white/60 text-xs">Value</div>
                        </div>
                        <div className="text-center">
                          <div className={`w-3 h-3 rounded-full ${
                            order.status === 'Processing' ? 'bg-yellow-400 animate-pulse' :
                            order.status === 'Shipped' ? 'bg-blue-400' :
                            order.status === 'Delivered' ? 'bg-green-400' :
                            'bg-purple-400'
                          }`}></div>
                          <div className="text-white/60 text-xs mt-1">Status</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <div className="flex items-center justify-between">
                <div className="text-white/60 text-sm">
                  Total: <span className="text-white font-semibold">{ordersList.length} orders</span> processed today across all warehouses
                </div>
                <button 
                  onClick={() => setShowOrders(false)}
                  className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Modal */}
      {showSuppliers && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-4xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">📦 All Suppliers Network</h3>
                <p className="text-white/60">Complete list of our trusted supplier partners</p>
              </div>
              <button 
                onClick={() => setShowSuppliers(false)}
                className="text-white/60 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Suppliers Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliersList.map((supplier) => (
                  <div 
                    key={supplier.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group"
                  >
                    {/* Supplier Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-cyan-400 transition-colors">
                          {supplier.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full border ${
                            supplier.category === 'Electronics' ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' :
                            supplier.category === 'Fashion' ? 'bg-purple-500/20 text-purple-300 border-purple-400/30' :
                            supplier.category === 'Household' ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                            'bg-orange-500/20 text-orange-300 border-orange-400/30'
                          }`}>
                            {supplier.category}
                          </span>
                          <span className="bg-green-500/20 text-green-300 border border-green-400/30 px-2 py-1 text-xs rounded-full">
                            {supplier.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white text-sm font-semibold">{supplier.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Warehouses Served */}
                    <div className="mb-3">
                      <div className="text-xs text-white/60 mb-2">Serves Warehouses:</div>
                      <div className="flex flex-wrap gap-1">
                        {supplier.warehouses.map((warehouse, index) => (
                          <span 
                            key={index}
                            className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded border border-cyan-400/30"
                          >
                            {warehouse}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-black/20 rounded p-2 text-center">
                        <div className="text-white font-semibold">ID: {supplier.id.toString().padStart(3, '0')}</div>
                        <div className="text-white/60">Supplier ID</div>
                      </div>
                      <div className="bg-black/20 rounded p-2 text-center">
                        <div className="text-green-400 font-semibold">Active</div>
                        <div className="text-white/60">Status</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <div className="flex items-center justify-between">
                <div className="text-white/60 text-sm">
                  Total: <span className="text-white font-semibold">{suppliersList.length} suppliers</span> across all warehouses
                </div>
                <button 
                  onClick={() => setShowSuppliers(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selection Overlay */}
      {selectedWarehouse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4 animate-bounce">{selectedWarehouse.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">Loading {selectedWarehouse.name}</h3>
            <p className="text-white/60">Redirecting to live warehouse view...</p>
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mt-4" />
          </div>
        </div>
      )}
    </div>
  );
}
