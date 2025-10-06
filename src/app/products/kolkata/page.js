'use client';

import { useState } from 'react';
import Link from 'next/link';

// Kolkata warehouse products data
const warehouseProducts = [
  // Row 1 - Food Items
  { id: 1, name: 'Gobindobhog Rice', quantity: 265, category: 'Food', maxCapacity: 350 },
  { id: 2, name: 'Panch Phoron', quantity: 175, category: 'Food', maxCapacity: 230 },
  { id: 3, name: 'Khesari Dal', quantity: 145, category: 'Food', maxCapacity: 190 },
  { id: 4, name: 'Mustard Oil', quantity: 120, category: 'Food', maxCapacity: 160 },
  { id: 5, name: 'Patali Gur', quantity: 195, category: 'Food', maxCapacity: 260 },
  
  // Row 2 - Personal Care
  { id: 6, name: 'Ayurvedic Diapers', quantity: 155, category: 'Baby Care', maxCapacity: 180 },
  { id: 7, name: 'Hibiscus Shampoo', quantity: 115, category: 'Personal Care', maxCapacity: 150 },
  { id: 8, name: 'Clove Toothpaste', quantity: 195, category: 'Personal Care', maxCapacity: 250 },
  { id: 9, name: 'Neem Soap', quantity: 135, category: 'Personal Care', maxCapacity: 170 },
  { id: 10, name: 'Turmeric Face Wash', quantity: 108, category: 'Personal Care', maxCapacity: 140 },
  
  // Row 3 - Household
  { id: 11, name: 'Natural Detergent', quantity: 165, category: 'Household', maxCapacity: 210 },
  { id: 12, name: 'Jute Paper Towels', quantity: 95, category: 'Household', maxCapacity: 130 },
  { id: 13, name: 'Handloom Towels', quantity: 125, category: 'Household', maxCapacity: 160 },
  { id: 14, name: 'Herbal Dishwash', quantity: 105, category: 'Household', maxCapacity: 140 },
  { id: 15, name: 'Neem Floor Cleaner', quantity: 88, category: 'Household', maxCapacity: 115 },
  
  // Row 4 - Beverages
  { id: 16, name: 'Darjeeling Tea', quantity: 230, category: 'Beverages', maxCapacity: 290 },
  { id: 17, name: 'Bengali Filter Coffee', quantity: 165, category: 'Beverages', maxCapacity: 210 },
  { id: 18, name: 'Amla Juice', quantity: 135, category: 'Beverages', maxCapacity: 170 },
  { id: 19, name: 'Lemon Honey Water', quantity: 158, category: 'Beverages', maxCapacity: 200 },
  { id: 20, name: 'Bel Sharbat', quantity: 175, category: 'Beverages', maxCapacity: 220 }
];

// Inbound items data
const inboundItems = [
  { id: 'inb1', name: 'Sundarbans Honey', quantity: 160, status: 'Arriving Today', supplier: 'Bengal Naturals Co-op', eta: '9:45 AM' },
  { id: 'inb2', name: 'Himalayan Tea', quantity: 140, status: 'Processing', supplier: 'Eastern Tea Gardens', eta: 'Processing' },
  { id: 'inb3', name: 'Herbal Medicine', quantity: 85, status: 'Scheduled', supplier: 'Kolkata Ayurveda Ltd', eta: '12:30 PM' },
  { id: 'inb4', name: 'Traditional Sweets', quantity: 120, status: 'Unloading', supplier: 'Sweet Bengal Foods', eta: 'In Progress' },
  { id: 'inb5', name: 'Antiseptic Solutions', quantity: 200, status: 'Quality Check', supplier: 'Bengal Health Care', eta: 'Quality Check' }
];

// Dispatch items data
const dispatchItems = [
  { id: 'disp1', name: 'Gobindobhog Rice', quantity: 48, status: 'Ready to Ship', destination: 'Howrah Store', priority: 'High' },
  { id: 'disp2', name: 'Ayurvedic Diapers', quantity: 32, status: 'In Transit', destination: 'Siliguri Hub', priority: 'Medium' },
  { id: 'disp3', name: 'Mustard Oil', quantity: 26, status: 'Loading', destination: 'Durgapur Branch', priority: 'High' },
  { id: 'disp4', name: 'Hibiscus Shampoo', quantity: 38, status: 'Delivered', destination: 'Asansol Store', priority: 'Low' },
  { id: 'disp5', name: 'Darjeeling Tea', quantity: 58, status: 'Packed', destination: 'Malda Branch', priority: 'Medium' }
];

// Returns items data
const returnsItems = [
  { id: 'ret1', name: 'Damaged Gur Blocks', quantity: 13, status: 'Pending Review', reason: 'Heat Damage', returnDate: 'Today' },
  { id: 'ret2', name: 'Expired Juice', quantity: 9, status: 'Processing', reason: 'Shelf Life Issue', returnDate: 'Yesterday' },
  { id: 'ret3', name: 'Leaking Bottles', quantity: 16, status: 'Reprocessing', reason: 'Container Defect', returnDate: '2 days ago' },
  { id: 'ret4', name: 'Wrong Language Labels', quantity: 21, status: 'Relabeling', reason: 'Localization Error', returnDate: 'Today' },
  { id: 'ret5', name: 'Broken Sachets', quantity: 11, status: 'Disposal', reason: 'Transport Damage', returnDate: 'Yesterday' }
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

  // Kolkata theme - Green and Gold gradients
  const getGradientColor = () => {
    const gradients = [
      'from-[#064e3b] to-[#065f46]', // Dark green
      'from-[#b45309] to-[#d97706]', // Golden
      'from-[#14532d] via-[#16a34a] to-[#22c55e]', // Forest green
      'from-[#92400e] to-[#b45309]', // Golden brown
      'from-[#047857] to-[#059669]', // Emerald
      'from-[#ca8a04] to-[#eab308]'  // Yellow-gold
    ];
    return gradients[product.id % gradients.length];
  };

  // Get product-specific icon
  const getProductIcon = () => {
    const productName = product.name.toLowerCase();
    if (productName.includes('gobindobhog') || productName.includes('rice')) return '🍚';
    if (productName.includes('panch') || productName.includes('phoron')) return '🌟';
    if (productName.includes('khesari') || productName.includes('dal')) return '🟡';
    if (productName.includes('mustard') || productName.includes('oil')) return '🌻';
    if (productName.includes('patali') || productName.includes('gur')) return '🍯';
    if (productName.includes('ayurvedic') && productName.includes('diaper')) return '👶';
    if (productName.includes('hibiscus') || productName.includes('shampoo')) return '🌺';
    if (productName.includes('clove') || productName.includes('toothpaste')) return '🦷';
    if (productName.includes('neem') && productName.includes('soap')) return '🌿';
    if (productName.includes('turmeric') || productName.includes('face wash')) return '💛';
    if (productName.includes('natural') && productName.includes('detergent')) return '🧽';
    if (productName.includes('jute') || productName.includes('paper')) return '🌾';
    if (productName.includes('handloom') || productName.includes('towel')) return '🧵';
    if (productName.includes('herbal') && productName.includes('dishwash')) return '🌿';
    if (productName.includes('neem') && productName.includes('floor')) return '🍃';
    if (productName.includes('darjeeling') || productName.includes('tea')) return '🍃';
    if (productName.includes('bengali') && productName.includes('coffee')) return '☕';
    if (productName.includes('amla') || productName.includes('juice')) return '🍈';
    if (productName.includes('lemon') && productName.includes('honey')) return '🍯';
    if (productName.includes('bel') || productName.includes('sharbat')) return '🍹';
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

// Rack-style card with Kolkata green theme
const RackProductCard = ({ product, bins = 8, onHover, onLeave }) => {
  const pct = Math.max(0, Math.min(100, (product.quantity / product.maxCapacity) * 100));
  const filled = Math.round((pct / 100) * bins);
  const cols = bins === 6 ? 3 : 4; // 2 rows always

  const handleMouseEnter = (e) => onHover(product, e);

  return (
    <div
      className="group relative w-56 rounded-xl border-2 border-green-400/40 bg-gray-900/60 backdrop-blur-md shadow-lg hover:shadow-green-500/30 transition-all"
      onMouseMove={handleMouseEnter}
      onMouseLeave={onLeave}
    >
      <div className="px-3 pt-2 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/90 text-sm font-semibold truncate pr-2">{product.name}</span>
          <span className="text-xs text-gray-300 bg-black/30 rounded px-1 py-0.5">{Math.round(pct)}%</span>
        </div>
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: bins }).map((_, i) => (
            <div
              key={i}
              className={`h-5 w-full rounded-[4px] border border-green-200/40 ${
                i < filled ? 'bg-green-400/90 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-300">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-[3px] bg-green-400/90 border border-green-300" />
            <span>Loaded</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-[3px] bg-white/20 border border-green-200/40" />
            <span>Free</span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-green-400/0 group-hover:ring-green-400/40 transition" />
    </div>
  );
};

// Circular gauge with Kolkata theme
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
            background: `conic-gradient(#16a34a ${clamped}%, rgba(255,255,255,0.12) ${clamped}% 100%)`
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
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-400 inline-block" /> Free</div>
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

  // Kolkata theme gradients
  const getTypeGradient = () => {
    switch (type) {
      case 'inbound':
        return 'from-green-600/80 to-emerald-600/80';
      case 'dispatch':
        return 'from-yellow-600/80 to-amber-600/80';
      case 'returns':
        return 'from-lime-600/80 to-green-600/80';
      default:
        return 'from-gray-600/80 to-gray-700/80';
    }
  };

  // Get item-specific icon
  const getItemIcon = () => {
    const itemName = item.name.toLowerCase();
    
    // Product-specific icons
    if (itemName.includes('sundarbans') || itemName.includes('honey')) return '🍯';
    if (itemName.includes('himalayan') || itemName.includes('tea')) return '🏔️';
    if (itemName.includes('herbal') || itemName.includes('medicine')) return '💊';
    if (itemName.includes('traditional') || itemName.includes('sweets')) return '🍬';
    if (itemName.includes('antiseptic') || itemName.includes('solutions')) return '🧴';
    if (itemName.includes('gobindobhog') || itemName.includes('rice')) return '🍚';
    if (itemName.includes('ayurvedic') && itemName.includes('diaper')) return '👶';
    if (itemName.includes('mustard') || itemName.includes('oil')) return '🌻';
    if (itemName.includes('hibiscus') || itemName.includes('shampoo')) return '🌺';
    if (itemName.includes('darjeeling') || itemName.includes('tea')) return '🍃';
    if (itemName.includes('bottles')) return '🍾';
    if (itemName.includes('sachets')) return '📦';
    if (itemName.includes('language') || itemName.includes('labels')) return '🏷️';
    if (itemName.includes('gur') || itemName.includes('damaged')) return '🍯';
    
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
  const stockPercentage = isProduct ? (item.quantity / item.maxCapacity) * 100 : null;
  
  const getStockStatus = () => {
    if (!isProduct) return null;
    if (stockPercentage >= 70) return { text: 'In Stock', color: 'text-green-400' };
    if (stockPercentage >= 40) return { text: 'Low Stock', color: 'text-yellow-400' };
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
      <h3 className="text-white font-semibold text-lg mb-2">{item.name}</h3>
      <div className="space-y-1 text-sm">
        {isProduct ? (
          // Product tooltip content
          <>
            <p className="text-gray-300">Category: <span className="text-green-400">{item.category}</span></p>
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
        ) : (
          // Operational item tooltip content
          <>
            <p className="text-gray-300">Quantity: <span className="text-white font-medium">{item.quantity}</span></p>
            <p className="text-gray-300">Status: <span className="text-green-400">{item.status}</span></p>
            {type === 'inbound' && (
              <>
                <p className="text-gray-300">Supplier: <span className="text-yellow-400">{item.supplier}</span></p>
                <p className="text-gray-300">ETA: <span className="text-amber-400">{item.eta}</span></p>
              </>
            )}
            {type === 'dispatch' && (
              <>
                <p className="text-gray-300">Destination: <span className="text-yellow-400">{item.destination}</span></p>
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

export default function KolkataWarehousePage() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredItemType, setHoveredItemType] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeOpTab, setActiveOpTab] = useState('returns');

  const handleItemHover = (item, type, event) => {
    setHoveredItem(item);
    setHoveredItemType(type);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
    setHoveredItemType(null);
  };

  // Group products into rows
  const productRows = [];
  for (let i = 0; i < warehouseProducts.length; i += 5) {
    productRows.push(warehouseProducts.slice(i, i + 5));
  }

  // Overall free space calculation
  const totalCapacity = warehouseProducts.reduce((sum, p) => sum + p.maxCapacity, 0);
  const totalUsed = warehouseProducts.reduce((sum, p) => sum + Math.min(p.quantity, p.maxCapacity), 0);
  const freePercent = totalCapacity > 0 ? ((totalCapacity - totalUsed) / totalCapacity) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 
                       text-white hover:bg-white/20 transition-all duration-300 group"
          >
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-yellow-600 bg-clip-text text-transparent">
            Kolkata Warehouse Management System
          </h1>
          <p className="text-gray-300 text-lg">🌿 Eastern Heritage Hub - Traditional Bengali Products Storage</p>
        </div>

        {/* Warehouse Layout */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
            Live Kolkata Warehouse View
          </h2>
          
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

                {/* Legend for rack cells */}
                <div className="flex items-center gap-8 justify-center pt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="inline-block h-3.5 w-3.5 rounded-[3px] bg-green-400/90 border border-green-300" />
                    Loaded place
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="inline-block h-3.5 w-3.5 rounded-[3px] bg-white/20 border border-green-200/40" />
                    Free place
                  </div>
                </div>
              </div>

              {/* Gauge panel */}
              <div>
                <CircularGauge percent={Math.max(0, Math.min(100, freePercent))} title="Kolkata Hub Free Space" />
                <div className="mt-4 text-center text-sm text-gray-300">
                  <div>Total Capacity: <span className="text-white font-medium">{totalCapacity}</span></div>
                  <div>Used: <span className="text-green-300 font-medium">{totalUsed}</span></div>
                  <div>Free: <span className="text-yellow-400 font-medium">{Math.max(0, totalCapacity - totalUsed)}</span></div>
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
                                  ? 'bg-lime-600/30 border-lime-400/50 ring-2 ring-lime-400/60 text-white' 
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
                                  ? 'bg-green-600/30 border-green-400/50 ring-2 ring-green-400/60 text-white' 
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
                                  ? 'bg-yellow-600/30 border-yellow-400/50 ring-2 ring-yellow-400/60 text-white' 
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
                  <div className="bg-gradient-to-br from-lime-600/20 to-green-600/20 backdrop-blur-sm rounded-xl border border-lime-400/30 p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-lime-500 rounded-lg mr-3 flex items-center justify-center">
                        <span className="text-white text-lg">↩️</span>
                      </div>
                      <h3 className="text-lime-400 font-semibold text-lg">Returns & Reprocessing</h3>
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
                        <span className="text-lime-400 font-medium">{returnsItems.filter(item => item.status === 'Pending Review').length}</span>
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
                        <div className="h-full bg-gradient-to-r from-lime-500 to-green-500 rounded-full" style={{width: '68%'}}></div>
                      </div>
                      <p className="text-xs text-gray-400">68% processing efficiency</p>
                    </div>
                  </div>
                )}

                {activeOpTab === 'inbound' && (
                  <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl border border-green-400/30 p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-lg mr-3 flex items-center justify-center">
                        <span className="text-white text-lg">🚚</span>
                      </div>
                      <h3 className="text-green-400 font-semibold text-lg">Inbound</h3>
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
                        <span className="text-green-400 font-medium">{inboundItems.filter(item => item.status === 'Scheduled').length}</span>
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
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{width: '79%'}}></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">79% processing rate</p>
                    </div>
                  </div>
                )}

                {activeOpTab === 'dispatch' && (
                  <div className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 backdrop-blur-sm rounded-xl border border-yellow-400/30 p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-lg mr-3 flex items-center justify-center">
                        <span className="text-white text-lg">🚛</span>
                      </div>
                      <h3 className="text-yellow-400 font-semibold text-lg">Dispatch</h3>
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
                        <span className="text-yellow-400 font-medium">{dispatchItems.filter(item => item.status === 'Ready to Ship').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">In Transit</span>
                        <span className="text-blue-400 font-medium">{dispatchItems.filter(item => item.status === 'In Transit').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Total Quantity</span>
                        <span className="text-amber-400 font-medium">{dispatchItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                      <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full" style={{width: '86%'}}></div>
                      </div>
                      <p className="text-xs text-gray-400">86% on-time delivery</p>
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
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2 animate-pulse">📦</span>
              <h3 className="text-green-400 font-semibold">Total Products</h3>
            </div>
            <p className="text-2xl font-bold text-white">{warehouseProducts.length}</p>
            <p className="text-xs text-gray-400 mt-1">Active SKUs</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2 animate-bounce">✅</span>
              <h3 className="text-emerald-400 font-semibold">In Stock</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              {warehouseProducts.filter(p => (p.quantity / p.maxCapacity) >= 0.7).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Well stocked items</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2 animate-pulse" style={{animationDelay: '0.5s'}}>⚠️</span>
              <h3 className="text-yellow-400 font-semibold">Low Stock</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              {warehouseProducts.filter(p => {
                const ratio = p.quantity / p.maxCapacity;
                return ratio >= 0.4 && ratio < 0.7;
              }).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Needs restocking</p>
          </div>
          <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2 animate-bounce" style={{animationDelay: '1s'}}>🚨</span>
              <h3 className="text-red-400 font-semibold">Critical</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              {warehouseProducts.filter(p => (p.quantity / p.maxCapacity) < 0.4).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Urgent attention</p>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2 animate-bounce">🚚</span>
              <h3 className="text-green-400 font-semibold">Inbound Operations</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm"><span className="animate-pulse">📦</span> Daily Receipts</span>
                <span className="text-green-400 font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm"><span className="animate-bounce" style={{animationDelay: '0.3s'}}>⚡</span> Processing Rate</span>
                <span className="text-green-400 font-medium">79%</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-amber-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2 animate-pulse">🚛</span>
              <h3 className="text-yellow-400 font-semibold">Dispatch Operations</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm"><span className="animate-bounce">📤</span> Daily Shipments</span>
                <span className="text-yellow-400 font-medium">67</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm"><span className="animate-pulse" style={{animationDelay: '0.4s'}}>⏰</span> On-time Delivery</span>
                <span className="text-green-400 font-medium">86%</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-lime-600/20 to-green-800/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2 animate-bounce" style={{animationDelay: '0.7s'}}>↩️</span>
              <h3 className="text-lime-400 font-semibold">Returns & Processing</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm"><span className="animate-pulse">📋</span> Returns Today</span>
                <span className="text-lime-400 font-medium">17</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm"><span className="animate-bounce" style={{animationDelay: '0.6s'}}>🔄</span> Processing Efficiency</span>
                <span className="text-yellow-400 font-medium">68%</span>
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
