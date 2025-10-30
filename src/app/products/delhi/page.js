'use client';

import { useState } from 'react';


// Delhi warehouse products data
const warehouseProducts = [
  // Electronics
  { id: 1, name: 'iPhone 15 Pro', quantity: 85, category: 'Electronics', maxCapacity: 120 },
  { id: 2, name: 'Samsung Galaxy S24', quantity: 92, category: 'Electronics', maxCapacity: 150 },
  { id: 3, name: 'MacBook Air M2', quantity: 45, category: 'Electronics', maxCapacity: 80 },
  { id: 4, name: 'Dell XPS Laptop', quantity: 38, category: 'Electronics', maxCapacity: 70 },
  { id: 5, name: 'iPad Pro', quantity: 67, category: 'Electronics', maxCapacity: 100 },
  
  // Household
  { id: 6, name: 'Eco Detergent', quantity: 160, category: 'Household', maxCapacity: 220 },
  { id: 7, name: 'Bamboo Tissue', quantity: 75, category: 'Household', maxCapacity: 120 },
  { id: 8, name: 'Microfiber Towels', quantity: 130, category: 'Household', maxCapacity: 160 },
  { id: 9, name: 'Enzyme Dishwash', quantity: 105, category: 'Household', maxCapacity: 140 },
  { id: 10, name: 'Citrus Floor Cleaner', quantity: 88, category: 'Household', maxCapacity: 110 },
  
  // Fashion
  { id: 11, name: 'Nike Air Jordans', quantity: 124, category: 'Fashion', maxCapacity: 180 },
  { id: 12, name: 'Adidas Hoodie', quantity: 95, category: 'Fashion', maxCapacity: 140 },
  { id: 13, name: 'Levi\'s Jeans', quantity: 156, category: 'Fashion', maxCapacity: 200 },
  { id: 14, name: 'Zara T-Shirts', quantity: 203, category: 'Fashion', maxCapacity: 280 },
  { id: 15, name: 'H&M Dresses', quantity: 78, category: 'Fashion', maxCapacity: 120 },
  
  // Accessories
  { id: 16, name: 'Apple Watch Series 9', quantity: 52, category: 'Accessories', maxCapacity: 80 },
  { id: 17, name: 'Ray-Ban Sunglasses', quantity: 89, category: 'Accessories', maxCapacity: 130 },
  { id: 18, name: 'Louis Vuitton Bags', quantity: 34, category: 'Accessories', maxCapacity: 60 },
  { id: 19, name: 'Fossil Watches', quantity: 71, category: 'Accessories', maxCapacity: 110 },
  { id: 20, name: 'Beats Headphones', quantity: 96, category: 'Accessories', maxCapacity: 140 }
];

// Inbound items data
const inboundItems = [
  { id: 'inb1', name: 'Basmati Rice Premium', quantity: 200, status: 'Arriving Today', supplier: 'Delhi Agro Ltd', eta: '1:45 PM' },
  { id: 'inb2', name: 'Darjeeling Tea', quantity: 180, status: 'Processing', supplier: 'Mountain Tea Co', eta: 'Processing' },
  { id: 'inb3', name: 'Organic Baby Food', quantity: 100, status: 'Scheduled', supplier: 'Pure Care Inc', eta: '3:30 PM' },
  { id: 'inb4', name: 'Health Bars', quantity: 150, status: 'Unloading', supplier: 'Wellness Foods', eta: 'In Progress' },
  { id: 'inb5', name: 'Antiseptic Gel', quantity: 250, status: 'Quality Check', supplier: 'MediCare Delhi', eta: 'Quality Check' }
];

// Dispatch items data
const dispatchItems = [
  { id: 'disp1', name: 'Rajma Beans', quantity: 75, status: 'Ready to Ship', destination: 'Gurgaon Store', priority: 'High' },
  { id: 'disp2', name: 'Premium Diapers', quantity: 45, status: 'In Transit', destination: 'Noida Warehouse', priority: 'Medium' },
  { id: 'disp3', name: 'Mustard Oil', quantity: 35, status: 'Loading', destination: 'Faridabad Hub', priority: 'High' },
  { id: 'disp4', name: 'Herbal Shampoo', quantity: 50, status: 'Delivered', destination: 'Delhi South', priority: 'Low' },
  { id: 'disp5', name: 'Masala Chai', quantity: 80, status: 'Packed', destination: 'NCR Branch', priority: 'Medium' }
];

// Returns items data
const returnsItems = [
  { id: 'ret1', name: 'Damaged Flour Bags', quantity: 18, status: 'Pending Review', reason: 'Packaging Damage', returnDate: 'Today' },
  { id: 'ret2', name: 'Expired Juice', quantity: 12, status: 'Processing', reason: 'Expiry Date', returnDate: 'Yesterday' },
  { id: 'ret3', name: 'Defective Bottles', quantity: 20, status: 'Reprocessing', reason: 'Manufacturing Defect', returnDate: '2 days ago' },
  { id: 'ret4', name: 'Wrong SKU Labels', quantity: 25, status: 'Relabeling', reason: 'Labeling Error', returnDate: 'Today' },
  { id: 'ret5', name: 'Cracked Containers', quantity: 8, status: 'Disposal', reason: 'Physical Damage', returnDate: 'Yesterday' }
];

const ProductCard = ({ product, onHover, onLeave }) => {
  // Calculate stock level percentage
  const stockPercentage = (product.quantity / product.maxCapacity) * 100;
  
  // Determine color based on stock level
  const getStockColor = () => {
    if (stockPercentage >= 70) return 'from-green-500 to-emerald-600';
    if (stockPercentage >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  // Delhi theme - Vibrant and diverse gradients
  const getGradientColor = () => {
    const gradients = [
      'from-[#06b6d4] to-[#0891b2]', // Cyan blue
      'from-[#f59e0b] to-[#d97706]', // Golden amber
      'from-[#8b5cf6] to-[#7c3aed]', // Purple violet
      'from-[#10b981] to-[#059669]', // Emerald green
      'from-[#f97316] to-[#ea580c]', // Orange
      'from-[#ec4899] to-[#db2777]', // Pink rose
      'from-[#6366f1] to-[#4f46e5]', // Indigo
      'from-[#84cc16] to-[#65a30d]', // Lime green
      'from-[#14b8a6] to-[#0d9488]', // Teal
      'from-[#f472b6] to-[#ec4899]'  // Hot pink
    ];
    return gradients[product.id % gradients.length];
  };

  // Get product-specific icon
  const getProductIcon = () => {
    const productName = product.name.toLowerCase();
    // Electronics
    if (productName.includes('iphone')) return '📱';
    if (productName.includes('samsung') || productName.includes('galaxy')) return '�';
    if (productName.includes('macbook') || productName.includes('laptop')) return '💻';
    if (productName.includes('dell') || productName.includes('xps')) return '💻';
    if (productName.includes('ipad')) return '�';
    
    // Household
    if (productName.includes('detergent') || productName.includes('eco')) return '�';
    if (productName.includes('tissue') || productName.includes('bamboo')) return '�';
    if (productName.includes('towel') || productName.includes('microfiber')) return '🏠';
    if (productName.includes('dishwash') || productName.includes('enzyme')) return '🍽️';
    if (productName.includes('floor cleaner') || productName.includes('citrus')) return '�';
    
    // Fashion
    if (productName.includes('nike') || productName.includes('jordans')) return '👟';
    if (productName.includes('adidas') || productName.includes('hoodie')) return '👕';
    if (productName.includes('levi') || productName.includes('jeans')) return '👖';
    if (productName.includes('zara') || productName.includes('t-shirt')) return '👕';
    if (productName.includes('h&m') || productName.includes('dress')) return '👗';
    
    // Accessories
    if (productName.includes('apple watch')) return '⌚';
    if (productName.includes('ray-ban') || productName.includes('sunglasses')) return '🕶️';
    if (productName.includes('louis vuitton') || productName.includes('bag')) return '�';
    if (productName.includes('fossil') || productName.includes('watch')) return '⌚';
    if (productName.includes('beats') || productName.includes('headphones')) return '🎧';
    
    return '📦'; // Default icon
  };

  return (
    <div
      className={`relative w-24 h-32 rounded-lg backdrop-blur-sm bg-gradient-to-br ${getGradientColor()} 
                  border border-white/20 shadow-lg cursor-pointer transform transition-all duration-300 
                  hover:scale-105 hover:shadow-2xl group`}
      onMouseEnter={() => onHover(product)}
      onMouseLeave={onLeave}
    >
      {/* Stock level indicator */}
      <div className="absolute top-2 right-2 w-3 h-3 rounded-full border border-white/30">
        <div 
          className={`w-full h-full rounded-full bg-gradient-to-r ${getStockColor()}`}
          style={{ 
            transform: `scale(${Math.max(0.3, stockPercentage / 100)})`,
            transition: 'transform 0.3s ease'
          }}
        />
      </div>
      
      {/* Product icon */}
      <div className="flex items-center justify-center h-full">
        <div className="text-3xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300 animate-bounce">
          {getProductIcon()}
        </div>
      </div>
      
      {/* Product name overlay */}
      <div className="absolute bottom-1 left-1 right-1 text-center">
        <span className="text-white/90 text-xs font-bold bg-black/40 rounded px-1 py-0.5 backdrop-blur-sm">
          {product.name.split(' ')[0]}
        </span>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

// Enhanced Rack-style card with brand-specific compartments - More informative design
const RackProductCard = ({ product, bins = 8, onHover, onLeave }) => {
  const pct = Math.max(0, Math.min(100, (product.quantity / product.maxCapacity) * 100));
  const filled = Math.round((pct / 100) * bins);
  const cols = bins === 6 ? 3 : 4; // 2 rows always
  const empty = bins - filled;

  const handleMouseEnter = (e) => onHover(product, e);

  // Generate brand data for each compartment
  const generateBrandData = () => {
    const brands = {
      'Electronics': ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Asus', 'Lenovo'],
      'Household': ['EcoClean', 'Fresh Home', 'Green Clean', 'Pure Living', 'Home Essentials', 'Clean & Shine', 'Sparkling', 'Natural Care'],
      'Fashion': ['Nike', 'Adidas', 'Puma', 'Levi\'s', 'Zara', 'H&M', 'Uniqlo', 'Gap'],
      'Accessories': ['Apple', 'Ray-Ban', 'Louis Vuitton', 'Fossil', 'Beats', 'Oakley', 'Gucci', 'Rolex']
    };
    
    const categoryBrands = brands[product.category] || brands['Electronics'];
    const compartments = [];
    
    for (let i = 0; i < bins; i++) {
      if (i < filled) {
        const brand = categoryBrands[i % categoryBrands.length];
        const baseQuantity = Math.floor(product.quantity / filled);
        const remainder = product.quantity % filled;
        const quantity = baseQuantity + (i < remainder ? 1 : 0);
        const maxPerCompartment = Math.floor(product.maxCapacity / bins);
        const fillPercentage = Math.min(100, (quantity / maxPerCompartment) * 100);
        
        compartments.push({
          id: i + 1,
          brand,
          quantity,
          maxCapacity: maxPerCompartment,
          fillPercentage,
          isEmpty: false
        });
      } else {
        compartments.push({
          id: i + 1,
          brand: null,
          quantity: 0,
          maxCapacity: Math.floor(product.maxCapacity / bins),
          fillPercentage: 0,
          isEmpty: true
        });
      }
    }
    
    return compartments;
  };

  const compartments = generateBrandData();

  // Get product category icon
  const getCategoryIcon = () => {
    switch (product.category) {
      case 'Electronics': return '📱';
      case 'Household': return '🏠';
      case 'Fashion': return '👕';
      case 'Accessories': return '⌚';
      default: return '📦';
    }
  };

  // Handle compartment hover - Updated to show empty compartments too
  const handleCompartmentHover = (compartment, e) => {
    const compartmentData = {
      ...product,
      compartmentId: compartment.id,
      brand: compartment.isEmpty ? 'Empty' : compartment.brand,
      compartmentQuantity: compartment.quantity,
      compartmentCapacity: compartment.maxCapacity,
      compartmentFill: compartment.fillPercentage
    };
    onHover(compartmentData, e);
  };

  // Handle rack header hover (for general product info)
  const handleRackHover = (e) => {
    onHover(product, e);
  };

  return (
    <div
      className="group relative w-64 rounded-xl border-2 border-cyan-400/40 bg-gray-900/60 backdrop-blur-md shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105"
    >
      {/* Rack Header with clear labeling */}
      <div 
        className="px-3 pt-2 pb-1 border-b border-cyan-400/30 cursor-pointer"
        onMouseEnter={handleRackHover}
        onMouseLeave={onLeave}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCategoryIcon()}</span>
            <span className="text-white/90 text-sm font-semibold truncate pr-2">{product.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-cyan-300 font-bold">{Math.round(pct)}%</span>
            <span className="text-xs text-gray-400">FULL</span>
          </div>
        </div>
        
        {/* Rack ID and Category */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-cyan-300 font-mono bg-cyan-500/20 px-2 py-0.5 rounded">
            RACK-{product.id.toString().padStart(3, '0')}
          </span>
          <span className="text-xs text-gray-300 bg-gray-700/50 px-2 py-0.5 rounded">
            {product.category}
          </span>
        </div>
      </div>

      {/* Storage Compartments Visualization */}
      <div className="px-3 py-3">
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
            <span className="flex items-center gap-1">
              📦 <strong>Storage Compartments</strong>
            </span>
            <span>{filled}/{bins} occupied</span>
          </div>
          <div className="text-[10px] text-gray-400 mb-1">
            Hover over each compartment to see brand details
          </div>
        </div>
        
        <div
          className="grid gap-1.5 mb-3"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {compartments.map((compartment, i) => (
            <div
              key={i}
              className={`relative h-8 w-full rounded-[4px] border-2 transition-all duration-300 cursor-pointer z-10 ${
                !compartment.isEmpty
                  ? 'bg-gray-800 border-cyan-300 hover:border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)] hover:z-20' 
                  : 'bg-white/20 border-cyan-200/40 hover:bg-white/30'
              }`}
              onMouseEnter={(e) => {
                e.stopPropagation();
                handleCompartmentHover(compartment, e);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                onLeave();
              }}
            >
              {/* Compartment number - Enhanced visibility */}
              <span className="absolute top-0.5 left-1 text-[8px] font-bold text-white bg-gray-800/80 px-1 py-0 rounded-sm shadow-md border border-white/20 z-20">
                {compartment.id}
              </span>
              
              {/* Battery-style fill indicator */}
              {!compartment.isEmpty && (
                <div className="absolute inset-1 rounded-[2px] overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r transition-all duration-500 ${
                      compartment.fillPercentage >= 80 ? 'from-green-400 to-emerald-500' :
                      compartment.fillPercentage >= 50 ? 'from-yellow-400 to-orange-500' :
                      compartment.fillPercentage >= 25 ? 'from-orange-400 to-red-500' :
                      'from-red-500 to-red-600'
                    }`}
                    style={{ width: `${compartment.fillPercentage}%` }}
                  />
                  {/* Battery segments - Enhanced visibility */}
                  <div className="absolute inset-0 flex">
                    {[25, 50, 75].map((segment) => (
                      <div
                        key={segment}
                        className="border-r border-gray-700/80 shadow-sm"
                        style={{ width: '25%' }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Brand indicator dot */}
              {!compartment.isEmpty && (
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
              )}
              
              {/* Fill percentage text - Enhanced visibility */}
              {!compartment.isEmpty && (
                <span className="absolute bottom-0.5 right-0.5 text-[8px] font-black text-white bg-black/60 px-0.5 py-0 rounded-sm shadow-lg border border-white/20">
                  {Math.round(compartment.fillPercentage)}%
                </span>
              )}
              
              {/* Brand initial (first letter of brand name) - Enhanced visibility */}
              {!compartment.isEmpty && (
                <span className="absolute top-0.5 left-0.5 text-[7px] font-black text-cyan-100 bg-gray-900/70 px-0.5 py-0 rounded-sm shadow-md border border-cyan-300/30">
                  {compartment.brand.charAt(0)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Detailed Status Information */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between bg-black/20 rounded-lg px-2 py-1">
            <span className="text-gray-300">Current Stock:</span>
            <span className="text-white font-semibold">{product.quantity} units</span>
          </div>
          <div className="flex items-center justify-between bg-black/20 rounded-lg px-2 py-1">
            <span className="text-gray-300">Max Capacity:</span>
            <span className="text-cyan-300 font-semibold">{product.maxCapacity} units</span>
          </div>
          <div className="flex items-center justify-between bg-black/20 rounded-lg px-2 py-1">
            <span className="text-gray-300">Active Brands:</span>
            <span className="text-purple-300 font-semibold">{filled} brands</span>
          </div>
          <div className="flex items-center justify-between bg-black/20 rounded-lg px-2 py-1">
            <span className="text-gray-300">Available Space:</span>
            <span className="text-green-300 font-semibold">{product.maxCapacity - product.quantity} units</span>
          </div>
        </div>

        {/* Visual Legend */}
        <div className="flex items-center justify-between mt-3 text-[10px] text-gray-300">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-[3px] bg-gradient-to-r from-cyan-400 to-blue-500 border border-cyan-300" />
            <span>Occupied ({filled})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-[3px] bg-white/20 border border-cyan-200/40" />
            <span>Empty ({empty})</span>
          </div>
        </div>
      </div>
      
      {/* Hover Ring Effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-cyan-400/0 group-hover:ring-cyan-400/60 transition" />
      
      {/* Rack Status Badge */}
      <div className="absolute -top-2 -right-2">
        <div className={`w-4 h-4 rounded-full border-2 border-white ${
          pct >= 70 ? 'bg-purple-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-emerald-500'
        } animate-pulse`} />
      </div>
    </div>
  );
};

// Circular gauge with Delhi theme - Updated with attractive colors
const CircularGauge = ({ percent = 58, title = 'Free Space' }) => {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="bg-gray-800/40 border border-white/10 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">{title}</h3>
        <button className="text-white/60 hover:text-white text-sm">✕</button>
      </div>
      <div className="relative mx-auto w-56 h-56">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(#06b6d4 ${clamped}%, rgba(255,255,255,0.12) ${clamped}% 100%)`
          }}
        />
        <div className="absolute inset-4 rounded-full bg-gray-900/90 border border-white/10 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{Math.round(clamped)}%</div>
            <div className="text-xs text-gray-400 mt-1">Free space</div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-300 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-cyan-400 inline-block" /> Free</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-white/20 inline-block" /> Used</div>
      </div>
    </div>
  );
};

const OperationalItemCard = ({ item, type, onHover, onLeave }) => {
  const getStatusColor = () => {
    switch (item.status) {
      case 'Arriving Today':
      case 'Ready to Ship':
      case 'Delivered':
      case 'Reprocessing':
        return 'from-green-500 to-emerald-600';
      case 'Processing':
      case 'In Transit':
      case 'Loading':
      case 'Packed':
      case 'Relabeling':
        return 'from-yellow-500 to-orange-500';
      case 'Scheduled':
      case 'Unloading':
      case 'Quality Check':
      case 'Pending Review':
      case 'Disposal':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Delhi theme gradients - More attractive colors
  const getTypeGradient = () => {
    switch (type) {
      case 'inbound':
        return 'from-cyan-600/80 to-blue-600/80';
      case 'dispatch':
        return 'from-emerald-600/80 to-teal-600/80';
      case 'returns':
        return 'from-purple-600/80 to-violet-600/80';
      default:
        return 'from-gray-600/80 to-gray-700/80';
    }
  };

  // Get item-specific icon
  const getItemIcon = () => {
    const itemName = item.name.toLowerCase();
    
    // Product-specific icons
    if (itemName.includes('rice') || itemName.includes('basmati')) return '🍚';
    if (itemName.includes('tea') || itemName.includes('darjeeling')) return '🍵';
    if (itemName.includes('baby') || itemName.includes('formula')) return '🍼';
    if (itemName.includes('health') || itemName.includes('bars')) return '🥜';
    if (itemName.includes('antiseptic') || itemName.includes('gel')) return '🧴';
    if (itemName.includes('rajma') || itemName.includes('beans')) return '🫘';
    if (itemName.includes('diaper')) return '👶';
    if (itemName.includes('oil') || itemName.includes('mustard')) return '🫒';
    if (itemName.includes('shampoo') || itemName.includes('herbal')) return '🧴';
    if (itemName.includes('chai') || itemName.includes('masala')) return '🍵';
    if (itemName.includes('bottles')) return '🍾';
    if (itemName.includes('containers')) return '🫙';
    if (itemName.includes('labels') || itemName.includes('sku')) return '🏷️';
    if (itemName.includes('damaged') || itemName.includes('flour')) return '📦';
    
    // Fallback based on type
    if (type === 'inbound') return '📥';
    if (type === 'dispatch') return '📤';
    if (type === 'returns') return '↩️';
    
    return '📦'; // Default icon
  };

  // Get status indicator icon
  const getStatusIcon = () => {
    switch (item.status) {
      case 'Arriving Today': return '🚚';
      case 'Processing': return '⚙️';
      case 'Scheduled': return '📅';
      case 'Unloading': return '📦';
      case 'Quality Check': return '🔍';
      case 'Ready to Ship': return '✅';
      case 'In Transit': return '🚛';
      case 'Loading': return '📦';
      case 'Delivered': return '✨';
      case 'Packed': return '📦';
      case 'Pending Review': return '⏳';
      case 'Reprocessing': return '🔄';
      case 'Relabeling': return '🏷️';
      case 'Disposal': return '🗑️';
      default: return '📋';
    }
  };

  return (
    <div
      className={`relative w-24 h-36 rounded-lg backdrop-blur-sm bg-gradient-to-br ${getTypeGradient()} 
                  border border-white/30 shadow-lg cursor-pointer transform transition-all duration-300 
                  hover:scale-105 hover:shadow-xl group`}
      onMouseEnter={() => onHover(item)}
      onMouseLeave={onLeave}
    >
      {/* Status indicator */}
      <div className="absolute top-1 right-1 w-2 h-2 rounded-full border border-white/30">
        <div 
          className={`w-full h-full rounded-full bg-gradient-to-r ${getStatusColor()}`}
        />
      </div>
      
      {/* Item quantity */}
      <div className="absolute top-1 left-1 text-white text-xs font-bold bg-black/40 rounded px-1">
        {item.quantity}
      </div>
      
      {/* Item icon */}
      <div className="flex flex-col items-center justify-center h-full space-y-2">
        <div className="text-2xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300 animate-pulse">
          {getItemIcon()}
        </div>
        <div className="text-lg animate-bounce" style={{animationDelay: '0.5s'}}>
          {getStatusIcon()}
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

const TooltipCard = ({ item, position, type }) => {
  if (!item || !position) return null;
  
  // Handle different item types
  const isProduct = type === 'product';
  const isCompartment = isProduct && item.compartmentId !== undefined;
  const stockPercentage = isProduct ? (item.quantity / item.maxCapacity) * 100 : null;
  const compartmentPercentage = isCompartment ? item.compartmentFill : null;
  
  const getStockStatus = () => {
    if (!isProduct) return null;
    const percentage = isCompartment ? compartmentPercentage : stockPercentage;
    if (percentage >= 70) return { text: 'Well Stocked', color: 'text-green-400' };
    if (percentage >= 40) return { text: 'Low Stock', color: 'text-yellow-400' };
    return { text: 'Critical', color: 'text-red-400' };
  };

  const status = getStockStatus();

  return (
    <div 
      className="fixed z-50 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-2xl"
      style={{ 
        left: position.x + 10, 
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <h3 className="text-white font-semibold text-lg mb-2">
        {isCompartment ? `${item.name} - Compartment ${item.compartmentId}` : item.name}
      </h3>
      <div className="space-y-1 text-sm">
        {isProduct ? (
          // Product tooltip content
          <>
            {isCompartment ? (
              // Compartment-specific tooltip
              <>
                <p className="text-gray-300">Brand: <span className={item.brand === 'Empty' ? 'text-gray-500 font-semibold' : 'text-cyan-400 font-semibold'}>{item.brand}</span></p>
                {item.brand !== 'Empty' && (
                  <div className="mt-2 p-2 bg-gray-800/50 rounded border border-gray-600">
                    <p className="text-xs text-gray-400 mb-1">Brand Inventory Details:</p>
                    <div className="space-y-1 text-xs">
                      {item.category === 'Electronics' && item.brand === 'Apple' && (
                        <>
                          <p className="text-white">📱 iPhone 15 Pro: <span className="text-green-400">12 units</span></p>
                          <p className="text-white">💻 MacBook Air: <span className="text-yellow-400">8 units</span></p>
                          <p className="text-white">📱 iPad Pro: <span className="text-green-400">15 units</span></p>
                        </>
                      )}
                      {item.category === 'Electronics' && item.brand === 'Samsung' && (
                        <>
                          <p className="text-white">📱 Galaxy S24: <span className="text-green-400">18 units</span></p>
                          <p className="text-white">📺 Smart TV: <span className="text-yellow-400">6 units</span></p>
                          <p className="text-white">⌚ Galaxy Watch: <span className="text-green-400">10 units</span></p>
                        </>
                      )}
                      {item.category === 'Fashion' && item.brand === 'Nike' && (
                        <>
                          <p className="text-white">👟 Air Jordans: <span className="text-green-400">22 units</span></p>
                          <p className="text-white">👕 T-Shirts: <span className="text-yellow-400">14 units</span></p>
                          <p className="text-white">🧢 Caps: <span className="text-green-400">8 units</span></p>
                        </>
                      )}
                      {item.category === 'Fashion' && item.brand === 'Adidas' && (
                        <>
                          <p className="text-white">👟 Sneakers: <span className="text-green-400">16 units</span></p>
                          <p className="text-white">🧥 Hoodies: <span className="text-yellow-400">11 units</span></p>
                          <p className="text-white">👕 Jerseys: <span className="text-green-400">9 units</span></p>
                        </>
                      )}
                      {item.category === 'Household' && item.brand === 'EcoClean' && (
                        <>
                          <p className="text-white">🧽 Detergent: <span className="text-green-400">25 units</span></p>
                          <p className="text-white">🧻 Tissues: <span className="text-yellow-400">18 units</span></p>
                          <p className="text-white">🧹 Floor Cleaner: <span className="text-green-400">12 units</span></p>
                        </>
                      )}
                      {item.category === 'Accessories' && item.brand === 'Apple' && (
                        <>
                          <p className="text-white">⌚ Apple Watch: <span className="text-green-400">8 units</span></p>
                          <p className="text-white">🎧 AirPods: <span className="text-yellow-400">15 units</span></p>
                          <p className="text-white">📱 Cases: <span className="text-green-400">20 units</span></p>
                        </>
                      )}
                      {/* Generic fallback for other brands */}
                      {!(['Apple', 'Samsung', 'Nike', 'Adidas', 'EcoClean'].includes(item.brand)) && (
                        <p className="text-white">📦 {item.brand} Products: <span className="text-green-400">{Math.floor(item.compartmentQuantity * 0.6)} units</span></p>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-gray-300">Category: <span className="text-purple-400">{item.category}</span></p>
                <p className="text-gray-300">Compartment: <span className="text-yellow-400">#{item.compartmentId}</span></p>
                <p className="text-gray-300">
                  Stock: <span className="text-white font-medium">{item.compartmentQuantity}</span>
                  <span className="text-gray-400">/{item.compartmentCapacity} units</span>
                </p>
                <p className="text-gray-300">
                  Status: <span className={item.brand === 'Empty' ? 'text-gray-500' : status.color}>{item.brand === 'Empty' ? 'Available Space' : status.text}</span>
                </p>
                {item.brand !== 'Empty' ? (
                  <div className="mt-2">
                    <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                      <div 
                        className={`h-full bg-gradient-to-r ${
                          compartmentPercentage >= 80 ? 'from-green-400 to-emerald-500' :
                          compartmentPercentage >= 50 ? 'from-yellow-400 to-orange-500' :
                          compartmentPercentage >= 25 ? 'from-orange-400 to-red-500' :
                          'from-red-500 to-red-600'
                        } transition-all duration-300`}
                        style={{ width: `${compartmentPercentage}%` }}
                      />
                      {/* Battery segments overlay */}
                      <div className="absolute inset-0 flex">
                        {[25, 50, 75].map((segment) => (
                          <div
                            key={segment}
                            className="border-r border-gray-600/70"
                            style={{ width: '25%' }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      <span className="text-cyan-300 font-medium">{compartmentPercentage.toFixed(1)}%</span> compartment filled
                    </p>
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                      <div className="h-full bg-gray-600" style={{ width: '0%' }} />
                      {/* Battery segments overlay for empty */}
                      <div className="absolute inset-0 flex">
                        {[25, 50, 75].map((segment) => (
                          <div
                            key={segment}
                            className="border-r border-gray-600/70"
                            style={{ width: '25%' }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      <span className="text-gray-500 font-medium">0.0%</span> compartment filled - <span className="text-green-400">Ready for new stock</span>
                    </p>
                  </div>
                )}
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <p className="text-xs text-gray-400">
                    <strong className="text-gray-300">Total Rack:</strong> {item.quantity}/{item.maxCapacity} units
                  </p>
                </div>
              </>
            ) : (
              // Regular product tooltip
              <>
                <p className="text-gray-300">Category: <span className="text-cyan-400">{item.category}</span></p>
                <p className="text-gray-300">
                  Quantity: <span className="text-white font-medium">{item.quantity}</span>
                  <span className="text-gray-400">/{item.maxCapacity}</span>
                </p>
                <p className="text-gray-300">
                  Status: <span className={status.color}>{status.text}</span>
                </p>
                <div className="mt-2">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${
                        stockPercentage >= 70 ? 'from-green-500 to-emerald-600' :
                        stockPercentage >= 40 ? 'from-yellow-500 to-orange-500' :
                        'from-red-500 to-red-600'
                      } transition-all duration-300`}
                      style={{ width: `${stockPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{stockPercentage.toFixed(1)}% filled</p>
                </div>
              </>
            )}
          </>
        ) : (
          // Operational item tooltip content
          <>
            <p className="text-gray-300">Quantity: <span className="text-white font-medium">{item.quantity}</span></p>
            <p className="text-gray-300">Status: <span className="text-red-400">{item.status}</span></p>
            {type === 'inbound' && (
              <>
                <p className="text-gray-300">Supplier: <span className="text-amber-400">{item.supplier}</span></p>
                <p className="text-gray-300">ETA: <span className="text-yellow-400">{item.eta}</span></p>
              </>
            )}
            {type === 'dispatch' && (
              <>
                <p className="text-gray-300">Destination: <span className="text-amber-400">{item.destination}</span></p>
                <p className="text-gray-300">Priority: <span className={
                  item.priority === 'High' ? 'text-red-400' :
                  item.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                }>{item.priority}</span></p>
              </>
            )}
            {type === 'returns' && (
              <>
                <p className="text-gray-300">Reason: <span className="text-orange-400">{item.reason}</span></p>
                <p className="text-gray-300">Return Date: <span className="text-yellow-400">{item.returnDate}</span></p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function DelhiWarehousePage() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredItemType, setHoveredItemType] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeOpTab, setActiveOpTab] = useState('returns');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleItemHover = (item, type, event) => {
    setHoveredItem(item);
    setHoveredItemType(type);
    if (event) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
    setHoveredItemType(null);
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All' 
    ? warehouseProducts 
    : warehouseProducts.filter(product => product.category === selectedCategory);

  // Group filtered products into rows
  const productRows = [];
  for (let i = 0; i < filteredProducts.length; i += 5) {
    productRows.push(filteredProducts.slice(i, i + 5));
  }

  // Available categories
  const categories = ['All', 'Electronics', 'Household', 'Fashion', 'Accessories'];

  // Overall free space calculation
  const totalCapacity = warehouseProducts.reduce((sum, p) => sum + p.maxCapacity, 0);
  const totalUsed = warehouseProducts.reduce((sum, p) => sum + Math.min(p.quantity, p.maxCapacity), 0);
  const freePercent = totalCapacity > 0 ? ((totalCapacity - totalUsed) / totalCapacity) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto">


        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Delhi Warehouse Management System
          </h1>
          <p className="text-gray-300 text-lg">🏛️ National Capital Region Hub - Premium Products Storage</p>
        </div>

        {/* Warehouse Layout */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3 flex items-center">
              <span className="w-3 h-3 bg-cyan-500 rounded-full mr-3 animate-pulse"></span>
              Live Delhi Warehouse Storage System
            </h2>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <span className="text-xl mr-2">🏷️</span>
                Filter by Category
              </h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:border-white/40'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>
                        {category === 'All' ? '🏪' :
                         category === 'Electronics' ? '📱' :
                         category === 'Household' ? '🏠' :
                         category === 'Fashion' ? '👕' :
                         category === 'Accessories' ? '⌚' : '📦'}
                      </span>
                      {category}
                      <span className="text-xs bg-black/30 px-1.5 py-0.5 rounded-full">
                        {category === 'All' ? warehouseProducts.length : warehouseProducts.filter(p => p.category === category).length}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm text-gray-400">
                Showing <span className="text-cyan-400 font-semibold">{filteredProducts.length}</span> products
                {selectedCategory !== 'All' && (
                  <span> in <span className="text-white font-semibold">{selectedCategory}</span> category</span>
                )}
              </div>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🏭</span>
                <h3 className="text-cyan-300 font-semibold">Warehouse Storage Overview</h3>
              </div>
              <p className="text-gray-300 text-sm mb-2">
                Each card below represents a <strong className="text-white">physical storage rack</strong> in our Delhi warehouse facility. 
                The numbered compartments show individual storage sections within each rack.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">📦</span>
                  <span><strong>Compartments:</strong> Individual storage sections numbered 1-8</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">📊</span>
                  <span><strong>Fill Level:</strong> Shows current stock vs maximum capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">🏷️</span>
                  <span><strong>Rack ID:</strong> Unique identifier for each storage rack</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">📋</span>
                  <span><strong>Real-time Data:</strong> Live inventory levels and availability</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Warehouse Areas Layout */}
          <div className="space-y-8">
            {/* Top Row - Product Storage Areas (as racks) + Free Space Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Racks grid (span 3) */}
              <div className="lg:col-span-3 space-y-6">
                {productRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex flex-wrap justify-center gap-4">
                    {row.map((product) => (
                      <RackProductCard
                        key={product.id}
                        product={product}
                        bins={product.id % 2 === 0 ? 8 : 6}
                        onHover={(p, e) => handleItemHover(p, 'product', e)}
                        onLeave={handleItemLeave}
                      />
                    ))}
                  </div>
                ))}


              </div>

              {/* Gauge panel */}
              <div>
                <CircularGauge percent={Math.max(0, Math.min(100, freePercent))} title="Delhi Hub Free Space" />
                <div className="mt-4 text-center text-sm text-gray-300">
                  <div>Total Racks: <span className="text-white font-medium">{totalCapacity}</span></div>
                  <div>Used Racks: <span className="text-red-300 font-medium">{totalUsed}</span></div>
                  <div>Free Racks: <span className="text-amber-400 font-medium">{Math.max(0, totalCapacity - totalUsed)}</span></div>
                </div>
              </div>
            </div>

            {/* Bottom Row - Operational Areas */}
            <div className="mt-12 flex flex-col lg:flex-row gap-6">
              {/* Side Nav */}
              <div className="lg:w-60">
                <div className="sticky top-8 space-y-3">
                  <button
                    type="button"
                    aria-pressed={activeOpTab === 'returns'}
                    onClick={() => setActiveOpTab('returns')}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition shadow-sm backdrop-blur-sm 
                                ${activeOpTab === 'returns' 
                                  ? 'bg-purple-600/30 border-purple-400/50 ring-2 ring-purple-400/60 text-white' 
                                  : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">↩️</span>
                      <div>
                        <div className="font-semibold">Returns & Reprocessing</div>
                        <div className="text-xs text-gray-300">{returnsItems.length} records</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    aria-pressed={activeOpTab === 'inbound'}
                    onClick={() => setActiveOpTab('inbound')}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition shadow-sm backdrop-blur-sm 
                                ${activeOpTab === 'inbound' 
                                  ? 'bg-cyan-600/30 border-cyan-400/50 ring-2 ring-cyan-400/60 text-white' 
                                  : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🚚</span>
                      <div>
                        <div className="font-semibold">Inbound</div>
                        <div className="text-xs text-gray-300">{inboundItems.length} shipments</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    aria-pressed={activeOpTab === 'dispatch'}
                    onClick={() => setActiveOpTab('dispatch')}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition shadow-sm backdrop-blur-sm 
                                ${activeOpTab === 'dispatch' 
                                  ? 'bg-emerald-600/30 border-emerald-400/50 ring-2 ring-emerald-400/60 text-white' 
                                  : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🚛</span>
                      <div>
                        <div className="font-semibold">Dispatch</div>
                        <div className="text-xs text-gray-300">{dispatchItems.length} orders</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Content area */}
              <div className="flex-1">
                {activeOpTab === 'returns' && (
                  <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 backdrop-blur-sm rounded-xl border border-purple-400/30 p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg mr-3 flex items-center justify-center">
                        <span className="text-white text-lg">↩️</span>
                      </div>
                      <h3 className="text-purple-400 font-semibold text-lg">Returns & Reprocessing</h3>
                    </div>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {returnsItems.map((item) => (
                        <div key={item.id} onMouseMove={(e) => handleItemHover(item, 'returns', e)} onMouseLeave={handleItemLeave}>
                          <OperationalItemCard item={item} type="returns" onHover={(item) => setHoveredItem(item)} onLeave={handleItemLeave} />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Pending Returns</span>
                        <span className="text-purple-400 font-medium">{returnsItems.filter(item => item.status === 'Pending Review').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Processing Queue</span>
                        <span className="text-yellow-400 font-medium">{returnsItems.filter(item => item.status === 'Processing').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Total Items</span>
                        <span className="text-green-400 font-medium">{returnsItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                      <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full" style={{width: '72%'}}></div>
                      </div>
                      <p className="text-xs text-gray-400">72% processing efficiency</p>
                    </div>
                  </div>
                )}

                {activeOpTab === 'inbound' && (
                  <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-cyan-500 rounded-lg mr-3 flex items-center justify-center">
                        <span className="text-white text-lg">🚚</span>
                      </div>
                      <h3 className="text-cyan-400 font-semibold text-lg">Inbound</h3>
                    </div>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {inboundItems.map((item) => (
                        <div key={item.id} onMouseMove={(e) => handleItemHover(item, 'inbound', e)} onMouseLeave={handleItemLeave}>
                          <OperationalItemCard item={item} type="inbound" onHover={(item) => setHoveredItem(item)} onLeave={handleItemLeave} />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Scheduled Arrivals</span>
                        <span className="text-cyan-400 font-medium">{inboundItems.filter(item => item.status === 'Scheduled').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Being Processed</span>
                        <span className="text-yellow-400 font-medium">{inboundItems.filter(item => item.status === 'Processing').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Total Quantity</span>
                        <span className="text-green-400 font-medium">{inboundItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                      <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">85% processing rate</p>
                    </div>
                  </div>
                )}

                {activeOpTab === 'dispatch' && (
                  <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-sm rounded-xl border border-emerald-400/30 p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg mr-3 flex items-center justify-center">
                        <span className="text-white text-lg">🚛</span>
                      </div>
                      <h3 className="text-emerald-400 font-semibold text-lg">Dispatch</h3>
                    </div>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {dispatchItems.map((item) => (
                        <div key={item.id} onMouseMove={(e) => handleItemHover(item, 'dispatch', e)} onMouseLeave={handleItemLeave}>
                          <OperationalItemCard item={item} type="dispatch" onHover={(item) => setHoveredItem(item)} onLeave={handleItemLeave} />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Ready to Ship</span>
                        <span className="text-emerald-400 font-medium">{dispatchItems.filter(item => item.status === 'Ready to Ship').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">In Transit</span>
                        <span className="text-blue-400 font-medium">{dispatchItems.filter(item => item.status === 'In Transit').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Total Quantity</span>
                        <span className="text-teal-400 font-medium">{dispatchItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                      <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{width: '88%'}}></div>
                      </div>
                      <p className="text-xs text-gray-400">88% on-time delivery</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-12 flex justify-center">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4 text-center">Stock Level Indicators</h3>
              <div className="flex space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
                  <span className="text-gray-300 text-sm">High Stock (70%+)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                  <span className="text-gray-300 text-sm">Medium Stock (40-70%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
                  <span className="text-gray-300 text-sm">Low Stock (&lt;40%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2 animate-pulse">📦</span>
              <h3 className="text-cyan-400 font-semibold">
                {selectedCategory === 'All' ? 'Total Products' : `${selectedCategory} Products`}
              </h3>
            </div>
            <p className="text-2xl font-bold text-white">{filteredProducts.length}</p>
            <p className="text-xs text-gray-400 mt-1">
              {selectedCategory === 'All' ? 'Active SKUs' : `${selectedCategory} SKUs`}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2 animate-bounce">✅</span>
              <h3 className="text-green-400 font-semibold">In Stock</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              {filteredProducts.filter(p => (p.quantity / p.maxCapacity) >= 0.7).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Well stocked items</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2 animate-pulse" style={{animationDelay: '0.5s'}}>⚠️</span>
              <h3 className="text-yellow-400 font-semibold">Low Stock</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              {filteredProducts.filter(p => {
                const ratio = p.quantity / p.maxCapacity;
                return ratio >= 0.4 && ratio < 0.7;
              }).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Needs restocking</p>
          </div>
          <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2 animate-bounce" style={{animationDelay: '1s'}}>🚨</span>
              <h3 className="text-pink-400 font-semibold">Critical</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              {filteredProducts.filter(p => (p.quantity / p.maxCapacity) < 0.4).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Urgent attention</p>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2 animate-bounce">🚚</span>
              <h3 className="text-purple-400 font-semibold">Inbound Operations</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm"><span className="animate-pulse">📦</span> Daily Receipts</span>
                <span className="text-purple-400 font-medium">32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm"><span className="animate-bounce" style={{animationDelay: '0.3s'}}>⚡</span> Processing Rate</span>
                <span className="text-green-400 font-medium">85%</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2 animate-pulse">🚛</span>
              <h3 className="text-emerald-400 font-semibold">Dispatch Operations</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm"><span className="animate-bounce">📤</span> Daily Shipments</span>
                <span className="text-emerald-400 font-medium">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm"><span className="animate-pulse" style={{animationDelay: '0.4s'}}>⏰</span> On-time Delivery</span>
                <span className="text-green-400 font-medium">88%</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2 animate-bounce" style={{animationDelay: '0.7s'}}>↩️</span>
              <h3 className="text-indigo-400 font-semibold">Returns & Processing</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm"><span className="animate-pulse">📋</span> Returns Today</span>
                <span className="text-indigo-400 font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm"><span className="animate-bounce" style={{animationDelay: '0.6s'}}>🔄</span> Processing Efficiency</span>
                <span className="text-yellow-400 font-medium">72%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <TooltipCard item={hoveredItem} position={mousePosition} type={hoveredItemType} />
    </div>
  );
}
