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

// Individual Warehouse Card Component
const WarehouseCard = ({ warehouse }) => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(warehouse.route);
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
      <div className="relative h-full p-8 flex flex-col justify-between">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
            {warehouse.icon}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
            {warehouse.name}
          </h3>
          <p className="text-white/80 text-sm mb-6">
            📍 {warehouse.location}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3">
            <div className="text-green-400 text-lg font-bold">{warehouse.stats.capacity}</div>
            <div className="text-white/60 text-xs">Capacity</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3">
            <div className="text-blue-400 text-lg font-bold">{warehouse.stats.dailyOrders}</div>
            <div className="text-white/60 text-xs">Daily Orders</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3">
            <div className="text-purple-400 text-lg font-bold">{warehouse.stats.suppliers}</div>
            <div className="text-white/60 text-xs">Suppliers</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="absolute bottom-6 left-8 right-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 
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

// Interactive India Map Component
const IndiaMap = ({ warehouses, onLocationClick }) => {
  const [hoveredLocation, setHoveredLocation] = useState(null);

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-900/30 to-green-900/30 
                    rounded-2xl border border-white/20 backdrop-blur-md overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10" />
      
      {/* Map Title */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-white font-bold text-lg mb-1">🇮🇳 India Warehouse Network</h3>
        <p className="text-white/60 text-sm">Click on markers to navigate</p>
      </div>
      
      {/* Simplified Map Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* India Outline (Simplified) */}
        <div className="relative w-80 h-80">
          <svg viewBox="0 0 400 400" className="w-full h-full opacity-30">
            <path
              d="M100,50 Q200,30 300,60 Q350,120 340,200 Q320,280 280,320 Q200,350 120,340 Q60,280 50,200 Q60,120 100,50 Z"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
          </svg>
          
          {/* Warehouse Markers */}
          {warehouses.map((warehouse, index) => {
            // Position markers roughly on the map
            const positions = {
              delhi: { x: '45%', y: '25%' },
              bbsr: { x: '75%', y: '65%' },
              pune: { x: '35%', y: '70%' },
              kolkata: { x: '80%', y: '55%' }
            };
            
            const position = positions[warehouse.id];
            
            return (
              <div
                key={warehouse.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: position.x, top: position.y }}
                onClick={() => onLocationClick(warehouse)}
                onMouseEnter={() => setHoveredLocation(warehouse)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                {/* Pulsing Ring */}
                <div className="absolute inset-0 w-8 h-8 rounded-full bg-yellow-400/20 animate-ping" />
                
                {/* Marker */}
                <div className={`relative w-6 h-6 rounded-full bg-gradient-to-br ${warehouse.theme} 
                                border-2 border-white shadow-lg transform transition-all duration-300
                                group-hover:scale-125 group-hover:shadow-2xl`}>
                  <div className="absolute inset-0 rounded-full bg-white/20" />
                </div>
                
                {/* Location Label */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 
                                bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                whitespace-nowrap z-10">
                  <div className="text-white text-xs font-semibold">{warehouse.name}</div>
                  <div className="text-white/60 text-xs">{warehouse.stats.capacity} capacity</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
        <div className="text-white text-xs font-semibold mb-2">Legend</div>
        <div className="flex items-center space-x-2 text-xs text-white/80">
          <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
          <span>Warehouse Location</span>
        </div>
      </div>
    </div>
  );
};

// Main Products Overview Page
export default function ProductsOverviewPage() {
  const router = useRouter();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLocationClick = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setTimeout(() => {
      router.push(warehouse.route);
    }, 500);
  };

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
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl 
                       border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
          >
            <span className="mr-3 transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            Back to Home
          </Link>
        </div>

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
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-green-400 mb-2">1,670</div>
              <div className="text-white/80 text-sm">Daily Orders</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">45</div>
              <div className="text-white/80 text-sm">Total Suppliers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-orange-400 mb-2">80.25%</div>
              <div className="text-white/80 text-sm">Avg Capacity</div>
            </div>
          </div>
        </div>

        {/* Interactive India Map */}
        <div className="mb-12">
          <IndiaMap warehouses={warehouses} onLocationClick={handleLocationClick} />
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

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            🚀 Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 text-center 
                            border border-blue-500/30 hover:border-blue-400/60 transition-all cursor-pointer group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h4 className="text-white font-semibold mb-2">Analytics Dashboard</h4>
              <p className="text-white/60 text-sm">View cross-warehouse analytics and insights</p>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-6 text-center 
                            border border-green-500/30 hover:border-green-400/60 transition-all cursor-pointer group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📦</div>
              <h4 className="text-white font-semibold mb-2">Inventory Management</h4>
              <p className="text-white/60 text-sm">Global inventory tracking and optimization</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 text-center 
                            border border-purple-500/30 hover:border-purple-400/60 transition-all cursor-pointer group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
              <h4 className="text-white font-semibold mb-2">AI Operations</h4>
              <p className="text-white/60 text-sm">Smart automation and predictive analytics</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm">
            🌟 Powered by Advanced Warehouse Management Technology
          </p>
        </div>
      </div>

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
