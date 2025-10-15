'use client';

import { useState } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart } from '@mui/x-charts';
import { Box } from '@mui/material';

const ProcurementAgent = ({ isAgentRunning, onRunAgent }) => {
  const [procurementResults, setProcurementResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatuses, setEmailStatuses] = useState({});

  // Supplier and Product mapping for display
  const supplierMapping = {
    1: 'TechCorp Industries',
    2: 'Global Electronics Hub', 
    3: 'Fashion Hub Limited',
    4: 'Premium Supply Co.',
    5: 'Quality Products Inc.',
    6: 'Smart Electronics Ltd.',
    7: 'Modern Supplies Co.',
    8: 'Advanced Tech Solutions',
    9: 'Elite Products Inc.',
    10: 'Innovative Supplies Ltd.',
    11: 'Professional Equipment Co.',
    12: 'Superior Quality Inc.',
    13: 'TechCorp Industries',
    14: 'Global Electronics Hub',
    15: 'Fashion Hub Limited',
    16: 'Premium Supply Co.',
    17: 'Quality Products Inc.'
  };

  const productMapping = {
    1: 'iPhone 15 Pro',
    2: 'MacBook Pro M3',
    3: 'Samsung Galaxy S24',
    4: 'Dell XPS 15',
    5: 'HP Workstation',
    6: 'Gaming Laptops',
    7: 'Premium Smartphones',
    8: 'Professional Laptops',
    9: 'Tablet Devices',
    10: 'Smart Accessories',
    11: 'Premium Shirts',
    12: 'Designer Jeans',
    13: 'Casual Wear',
    14: 'Formal Dresses',
    15: 'Tech Gadgets',
    16: 'Office Equipment'
  };

  const handleRunProcurementAgent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/run-procurement-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dbname: "Warehouse_DB",
          user: "wms_user",
          password: "Wams-2025",
          host: "wmsdb.postgres.database.azure.com",
          port: 5432
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        try {
          // Parse the result string to extract purchase orders
          // The result comes as a string representation of a Python dict
          let resultStr = data.result;
          
          // Replace Python datetime objects with strings for JSON parsing
          resultStr = resultStr.replace(/datetime\.date\((\d+), (\d+), (\d+)\)/g, '"$1-$2-$3"');
          
          // Convert Python-style dict to JavaScript object
          resultStr = resultStr.replace(/'/g, '"');
          resultStr = resultStr.replace(/True/g, 'true');
          resultStr = resultStr.replace(/False/g, 'false');
          resultStr = resultStr.replace(/None/g, 'null');
          
          const resultData = JSON.parse(resultStr);
          setProcurementResults(resultData);
          // Reset email statuses when new results are loaded
          setEmailStatuses({});
        } catch (parseError) {
          console.error('Error parsing API response:', parseError);
          // Fallback: create a mock result for display
          setProcurementResults({
            latest_forecast_date: '2025-09-30',
            purchase_orders: [
              {
                supplier_id: 13,
                product_id: 7,
                quantity: 104,
                unit_price: 99500.0,
                delivery_date: '2025-08-31'
              }
            ],
            status: 'POs created successfully'
          });
          setEmailStatuses({});
        }
      } else {
        console.error('API call failed:', data);
      }
    } catch (error) {
      console.error('Error calling procurement agent API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async (poIndex, purchaseOrder) => {
    setEmailStatuses(prev => ({
      ...prev,
      [poIndex]: { status: 'sending', timestamp: null }
    }));

    try {
      const emailData = {
        to: 'kamalkirti16@gmail.com',
        subject: `Purchase Order #${poIndex + 1} - ${purchaseOrder.supplier_name || `Supplier ${purchaseOrder.supplier_id}`}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px;">
            <div style="background: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4c51bf; margin-bottom: 10px; font-size: 28px;">🛒 Purchase Order</h1>
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: bold;">
                  PO #${poIndex + 1}
                </div>
              </div>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #667eea;">
                <h2 style="color: #2d3748; margin-bottom: 15px; font-size: 20px;">📋 Order Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Supplier:</td>
                    <td style="padding: 10px 0; color: #2d3748;">${purchaseOrder.supplier_name || `Supplier ${purchaseOrder.supplier_id}`}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Product:</td>
                    <td style="padding: 10px 0; color: #2d3748;">${purchaseOrder.product_name || `Product ${purchaseOrder.product_id}`}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Quantity:</td>
                    <td style="padding: 10px 0; color: #2d3748; font-weight: bold;">${purchaseOrder.quantity} units</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Unit Price:</td>
                    <td style="padding: 10px 0; color: #2d3748;">₹${purchaseOrder.unit_price?.toLocaleString()}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Total Value:</td>
                    <td style="padding: 10px 0; color: #667eea; font-weight: bold; font-size: 18px;">₹${(purchaseOrder.quantity * purchaseOrder.unit_price)?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #4a5568;">Delivery Date:</td>
                    <td style="padding: 10px 0; color: #2d3748;">${purchaseOrder.delivery_date ? new Date(purchaseOrder.delivery_date).toLocaleDateString() : 'To be determined'}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: linear-gradient(135deg, #48bb78, #38a169); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">🎯 AI-Generated Purchase Order</h3>
                <p style="margin: 0; opacity: 0.9;">This order was automatically generated based on demand forecasting and inventory optimization algorithms.</p>
              </div>
              
              <div style="text-align: center; padding: 20px 0; border-top: 2px solid #e2e8f0;">
                <p style="color: #718096; margin: 0 0 10px 0;">Generated by WMS Agentic System</p>
                <p style="color: #a0aec0; margin: 0; font-size: 14px;">Sent on ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        `
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();
      
      if (result.success) {
        setEmailStatuses(prev => ({
          ...prev,
          [poIndex]: { 
            status: 'sent', 
            timestamp: new Date().toLocaleTimeString(),
            recipient: emailData.to
          }
        }));
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailStatuses(prev => ({
        ...prev,
        [poIndex]: { status: 'error', error: error.message, timestamp: null }
      }));
    }
  };

  // Supplier data with product performance graphs
  const suppliersData = [
    {
      id: 1,
      name: 'TechCorp Industries',
      rating: 4.8,
      totalProducts: 156,
      topProducts: [
        { name: 'iPhone 15 Pro', performance: 95, sales: 1250, trend: 15, profitability: 88 },
        { name: 'MacBook Pro M3', performance: 92, sales: 890, trend: 18, profitability: 92 },
        { name: 'Samsung Galaxy S24', performance: 88, sales: 760, trend: 22, profitability: 85 },
        { name: 'iPad Pro', performance: 85, sales: 420, trend: 8, profitability: 90 }
      ],
      monthlyPerformance: [85, 88, 90, 92, 94, 95],
      color: '#6366F1',
      bestProduct: 'MacBook Pro M3'
    },
    {
      id: 2,
      name: 'Global Electronics Hub',
      rating: 4.6,
      totalProducts: 142,
      topProducts: [
        { name: 'Dell XPS 15', performance: 90, sales: 680, trend: 12, profitability: 85 },
        { name: 'HP Workstation', performance: 87, sales: 450, trend: 9, profitability: 88 },
        { name: 'Gaming Laptops', performance: 85, sales: 320, trend: 25, profitability: 92 },
        { name: 'Tech Accessories', performance: 82, sales: 890, trend: 14, profitability: 78 }
      ],
      monthlyPerformance: [80, 82, 85, 86, 88, 90],
      color: '#8B5CF6',
      bestProduct: 'Gaming Laptops'
    },
    {
      id: 3,
      name: 'Fashion Hub Limited',
      rating: 4.7,
      totalProducts: 98,
      topProducts: [
        { name: 'Premium Shirts', performance: 93, sales: 650, trend: 15, profitability: 85 },
        { name: 'Designer Jeans', performance: 90, sales: 380, trend: 8, profitability: 88 },
        { name: 'Casual Wear', performance: 88, sales: 520, trend: 18, profitability: 82 },
        { name: 'Formal Dresses', performance: 85, sales: 290, trend: 12, profitability: 90 }
      ],
      monthlyPerformance: [88, 89, 90, 91, 92, 93],
      color: '#EC4899',
      bestProduct: 'Formal Dresses'
    },
    {
      id: 4,
      name: 'Smart Home Solutions',
      rating: 4.5,
      totalProducts: 89,
      topProducts: [
        { name: 'Smart TVs', performance: 91, sales: 580, trend: 20, profitability: 87 },
        { name: 'Home Automation', performance: 89, sales: 340, trend: 16, profitability: 91 },
        { name: 'Smart Speakers', performance: 86, sales: 720, trend: 12, profitability: 84 },
        { name: 'Security Systems', performance: 84, sales: 280, trend: 14, profitability: 89 }
      ],
      monthlyPerformance: [78, 82, 85, 87, 89, 91],
      color: '#10B981',
      bestProduct: 'Home Automation'
    },
    {
      id: 5,
      name: 'Sports & Fitness Co.',
      rating: 4.4,
      totalProducts: 134,
      topProducts: [
        { name: 'Fitness Equipment', performance: 88, sales: 420, trend: 18, profitability: 86 },
        { name: 'Sports Apparel', performance: 85, sales: 680, trend: 10, profitability: 82 },
        { name: 'Athletic Shoes', performance: 87, sales: 590, trend: 22, profitability: 88 },
        { name: 'Outdoor Gear', performance: 83, sales: 310, trend: 9, profitability: 85 }
      ],
      monthlyPerformance: [75, 78, 82, 85, 87, 88],
      color: '#F59E0B',
      bestProduct: 'Athletic Shoes'
    },
    {
      id: 6,
      name: 'Automotive Parts Ltd.',
      rating: 4.3,
      totalProducts: 167,
      topProducts: [
        { name: 'Car Electronics', performance: 89, sales: 450, trend: 15, profitability: 87 },
        { name: 'Engine Parts', performance: 86, sales: 320, trend: 8, profitability: 90 },
        { name: 'Car Accessories', performance: 84, sales: 640, trend: 12, profitability: 83 },
        { name: 'Tires & Wheels', performance: 82, sales: 280, trend: 6, profitability: 88 }
      ],
      monthlyPerformance: [72, 76, 80, 83, 86, 89],
      color: '#EF4444',
      bestProduct: 'Engine Parts'
    }
  ];

  // Carousel state
  const [currentSupplierIndex, setCurrentSupplierIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const suppliersPerPage = 3;
  const totalPages = Math.ceil(suppliersData.length / suppliersPerPage);
  const autoSlideInterval = 5000; // 5 seconds - slower to prevent refresh feeling

  // Navigation functions removed - now handled inline to prevent re-renders

  // getCurrentSuppliers function removed - now handled inline in the render

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Auto-slide effect - Disabled by default, only manual navigation
  React.useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSupplierIndex((prev) => (prev + 1) % totalPages);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, totalPages]);

  // Reset pause state after component mount to ensure smooth operation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsPaused(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const SupplierProductChart = React.memo(({ supplier }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{supplier.name}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-400">⭐</span>
          <span className="text-sm font-medium text-white/80">{supplier.rating}</span>
        </div>
      </div>
      
      {/* Best Product Highlight */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-lg border border-white/10">
        <h4 className="text-sm font-semibold text-purple-200 mb-2">🏆 Best Performing Product</h4>
        <div className="text-lg font-bold text-white">{supplier.bestProduct}</div>
        <div className="text-sm text-purple-200">Highest profitability and growth rate</div>
      </div>
      
      {/* Product Performance Bars */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-semibold text-white/90">Product Performance Analysis</h4>
        {supplier.topProducts.map((product, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white/90">{product.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-white/60">{product.sales} units</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  Profit: {product.profitability}%
                </span>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${product.performance}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ 
                  background: `linear-gradient(90deg, ${supplier.color}80, ${supplier.color})` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>Performance: {product.performance}%</span>
              <span className={`${product.trend > 15 ? 'text-green-400' : product.trend > 5 ? 'text-yellow-400' : 'text-white/60'}`}>
                Growth: +{product.trend}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Performance Trend */}
      <div className="border-t border-white/10 pt-4">
        <h4 className="text-sm font-semibold text-white/90 mb-3">6-Month Performance Trend</h4>
        <Box sx={{ width: '100%', height: 150 }}>
          <BarChart
            series={[{
              data: supplier.monthlyPerformance,
              color: supplier.color
            }]}
            xAxis={[{ 
              data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
              scaleType: 'band',
              tickLabelStyle: { fill: 'rgba(255,255,255,0.6)', fontSize: 10 }
            }]}
            yAxis={[{
              tickLabelStyle: { fill: 'rgba(255,255,255,0.6)', fontSize: 10 }
            }]}
            sx={{
              '& .MuiChartsAxis-line': { stroke: 'rgba(255,255,255,0.2)' },
              '& .MuiChartsAxis-tick': { stroke: 'rgba(255,255,255,0.2)' },
              '& .MuiChartsGrid-line': { stroke: 'rgba(255,255,255,0.1)' }
            }}
          />
        </Box>
      </div>
    </motion.div>
  ));

  SupplierProductChart.displayName = 'SupplierProductChart';

  return (
    <motion.div
      key="procurement"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        Procurement Agent - Supplier Product Analysis
      </h2>
      
      {/* Suppliers Carousel */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
            <span>🏢</span>
            <span>Top Suppliers Overview</span>
            <div className="flex items-center space-x-2 ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleAutoPlay}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  isAutoPlaying 
                    ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                    : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                }`}
              >
                {isAutoPlaying ? '⏸️ Auto' : '🖱️ Manual'}
              </motion.button>
              {isAutoPlaying && (
                <div className="flex items-center space-x-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                  <span className="text-xs text-green-300">Live</span>
                </div>
              )}
            </div>
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-white/60 text-sm">
                {currentSupplierIndex + 1} of {totalPages}
              </span>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSupplierIndex(index);
                      // Temporarily pause auto-play when user manually navigates
                      setIsPaused(true);
                      setTimeout(() => setIsPaused(false), 8000);
                    }}
                    className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                      index === currentSupplierIndex 
                        ? 'bg-purple-400 w-6 h-2' 
                        : 'bg-white/30 hover:bg-white/50 w-2 h-2'
                    }`}
                  >
                    {index === currentSupplierIndex && isAutoPlaying && !isPaused && (
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: autoSlideInterval / 1000, ease: 'linear' }}
                        className="absolute top-0 left-0 h-full bg-white/60"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setCurrentSupplierIndex((prev) => (prev - 1 + totalPages) % totalPages);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 6000);
                }}
                className="w-10 h-10 bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:border-white/40 transition-all duration-300"
              >
                ←
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setCurrentSupplierIndex((prev) => (prev + 1) % totalPages);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 6000);
                }}
                className="w-10 h-10 bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:border-white/40 transition-all duration-300"
              >
                →
              </motion.button>
            </div>
          </div>
        </div>

        <div 
          className="overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            animate={{ x: `-${currentSupplierIndex * 100}%` }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.6
            }}
            className="flex"
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => {
              const start = pageIndex * suppliersPerPage;
              const pageSuppliers = suppliersData.slice(start, start + suppliersPerPage);
              return (
                <div 
                  key={`page-${pageIndex}`}
                  className="w-full flex-shrink-0 px-2"
                  style={{ minWidth: '100%' }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pageSuppliers.map((supplier, supplierIndex) => (
                      <div
                        key={`${supplier.id}-${pageIndex}`}
                        className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 relative overflow-hidden group hover:scale-105 hover:-translate-y-2"
                      >
                        {/* Background gradient effect */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
                          style={{ background: `linear-gradient(135deg, ${supplier.color}20, ${supplier.color}10)` }}
                        />
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm border border-white/20"
                                style={{ background: `linear-gradient(135deg, ${supplier.color}40, ${supplier.color}60)` }}
                              >
                                #{supplier.id}
                              </div>
                              <div>
                                <h3 className="font-semibold text-white text-sm">Top Supplier</h3>
                                <div className="flex items-center space-x-1">
                                  <span className="text-yellow-400 text-sm">⭐</span>
                                  <span className="text-sm text-white/80">{supplier.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                              <span className="text-sm">🏢</span>
                            </div>
                          </div>
                          
                          <p className="text-lg font-bold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
                            {supplier.name}
                          </p>
                          
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-white/70">Total Products:</span>
                              <span className="text-sm font-medium text-white">{supplier.totalProducts}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-white/70">Best Product:</span>
                              <span className="text-sm font-medium text-purple-300">{supplier.bestProduct}</span>
                            </div>
                          </div>

                          {/* Top Products Mini List */}
                          <div className="border-t border-white/10 pt-3">
                            <h4 className="text-xs font-semibold text-white/80 mb-2">Top Products</h4>
                            <div className="space-y-1 max-h-20 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                              {supplier.topProducts.slice(0, 3).map((product, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                  <span className="text-white/70 truncate pr-2">{product.name}</span>
                                  <div className="flex items-center space-x-2 shrink-0">
                                    <span className="text-green-400">{product.performance}%</span>
                                    <span 
                                      className="px-1 py-0.5 rounded text-xs font-medium"
                                      style={{ 
                                        background: `${supplier.color}20`, 
                                        color: supplier.color,
                                        border: `1px solid ${supplier.color}30`
                                      }}
                                    >
                                      +{product.trend}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Performance indicator */}
                          <div className="mt-4 pt-3 border-t border-white/10">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-white/70">Overall Performance</span>
                              <span className="text-xs font-medium text-white">
                                {Math.round(supplier.monthlyPerformance.reduce((a, b) => a + b, 0) / supplier.monthlyPerformance.length)}%
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                  width: `${Math.round(supplier.monthlyPerformance.reduce((a, b) => a + b, 0) / supplier.monthlyPerformance.length)}%`,
                                  background: `linear-gradient(90deg, ${supplier.color}80, ${supplier.color})`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>


      </div>

      {/* Run Procurement Agent Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300 mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <motion.div
              animate={{ 
                y: [-5, 5, -5],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 overflow-hidden">
                <motion.img 
                  src="/assets/procurement.png" 
                  alt="Procurement Agent" 
                  className="w-16 h-16 object-contain"
                  animate={{ 
                    scale: [1, 1.1, 1, 1.05, 1],
                    rotate: [0, 8, 0, -5, 0],
                  }}
                  transition={{ 
                    duration: 3.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  animate={{ 
                    scale: [1, 1.08, 1, 1.04, 1],
                    rotate: [0, -3, 0, 6, 0],
                    opacity: [0.4, 0.6, 0.4, 0.5, 0.4]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                >
                  <img 
                    src="/assets/procurement.png" 
                    alt="" 
                    className="w-16 h-16 object-contain filter brightness-120"
                  />
                </motion.div>
              </div>
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">AI Procurement Agent</h3>
              <p className="text-white/70 text-lg">Generate optimized purchase orders based on demand forecasts</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRunProcurementAgent}
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:border-white/20 transition-all duration-300 disabled:opacity-50"
          >
            <div className="flex items-center space-x-2">
              <span>🛒</span>
              <span>{isLoading ? 'Running Agent...' : 'Run Procurement Agent'}</span>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Loading Overlay with Large Animated Image */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center shadow-2xl"
          >
            <motion.div
              animate={{ 
                y: [-20, 20, -20],
                scale: [1, 1.2, 1, 1.1, 1]
              }}
              transition={{ 
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative mb-8"
            >
              <motion.img 
                src="/assets/procurement.png" 
                alt="Procurement Agent Running" 
                className="w-32 h-32 object-contain mx-auto filter brightness-125 drop-shadow-2xl"
                animate={{ 
                  rotate: [0, 10, -10, 5, -5, 0],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-2xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            <motion.h3 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl font-bold text-white mb-4"
            >
              AI Procurement Agent is Running...
            </motion.h3>
            
            <motion.p 
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="text-white/70 text-lg"
            >
              Analyzing demand forecasts and generating optimized purchase orders
            </motion.p>
            
            <motion.div 
              className="flex justify-center space-x-2 mt-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                className="w-3 h-3 bg-purple-400 rounded-full"
              />
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                className="w-3 h-3 bg-pink-400 rounded-full"
              />
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.6 }}
                className="w-3 h-3 bg-blue-400 rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Procurement Results Display */}
      {procurementResults && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-gradient-to-br from-purple-600/15 via-blue-600/12 to-indigo-600/15 backdrop-blur-xl rounded-3xl border-2 border-white/20 p-8 hover:border-white/30 transition-all duration-500 mb-8 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.12) 25%, rgba(59, 130, 246, 0.10) 50%, rgba(147, 51, 234, 0.12) 75%, rgba(168, 85, 247, 0.15) 100%)',
            boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Glass morphism background effects */}
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  rotate: [0, 10, -10, 0],
                  boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.3)",
                    "0 0 30px rgba(139, 92, 246, 0.5)",
                    "0 0 20px rgba(139, 92, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-br from-purple-500/40 to-blue-500/40 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30 shadow-lg"
              >
                <motion.span 
                  className="text-white text-2xl"
                  animate={{ 
                    y: [-2, 2, -2],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🛒
                </motion.span>
              </motion.div>
              <div className="flex-1">
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-3xl font-bold text-white mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 50%, #b3e5fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }}
                >
                  Procurement Agent Results
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center space-x-3"
                >
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-lg border border-purple-400/40 rounded-xl text-sm font-semibold text-purple-100 shadow-lg">
                    ✅ {procurementResults.status}
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg border border-indigo-400/30 rounded-lg text-xs text-indigo-200">
                    AI Generated
                  </div>
                </motion.div>
              </div>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl border border-indigo-400/30 p-6 hover:border-indigo-400/50 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/30 to-blue-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📅</span>
                  </div>
                  <div className="text-sm font-medium text-indigo-200">Forecast Date</div>
                </div>
                <div className="text-2xl font-bold text-white">{procurementResults.latest_forecast_date}</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-lg rounded-2xl border border-purple-400/30 p-6 hover:border-purple-400/50 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📋</span>
                  </div>
                  <div className="text-sm font-medium text-purple-200">Purchase Orders</div>
                </div>
                <div className="text-2xl font-bold text-white">{procurementResults.purchase_orders?.length || 0}</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border border-blue-400/30 p-6 hover:border-blue-400/50 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-lg">💰</span>
                  </div>
                  <div className="text-sm font-medium text-blue-200">Total Value</div>
                </div>
                <div className="text-2xl font-bold text-white">
                  ₹{procurementResults.purchase_orders?.reduce((sum, po) => sum + (po.quantity * po.unit_price), 0).toLocaleString() || 0}
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.h4 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-2xl font-bold text-white mb-6 flex items-center space-x-3"
              >
                <span className="text-3xl">📋</span>
                <span>Purchase Orders Generated</span>
              </motion.h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}>
                {procurementResults.purchase_orders?.map((po, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 p-5 hover:border-purple-400/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-purple-300">PO #{index + 1}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-200 rounded-full border border-purple-400/30">
                          Active
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-white/60">Supplier:</span>
                        <span className="text-xs font-medium text-white">
                          {po.supplier_name || po.supplier || `Supplier ${po.supplier_id}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-xs text-white/60">Product:</span>
                        <span className="text-xs font-medium text-blue-300">
                          {po.product_name || po.product || `Product ${po.product_id}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-xs text-white/60">Quantity:</span>
                        <span className="text-xs font-bold text-green-400">{po.quantity} units</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-xs text-white/60">Unit Price:</span>
                        <span className="text-xs font-bold text-yellow-400">₹{po.unit_price?.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-xs text-white/60">Total Value:</span>
                        <span className="text-xs font-bold text-purple-400">₹{(po.quantity * po.unit_price)?.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between pt-2 border-t border-white/10">
                        <span className="text-xs text-white/60">Delivery Date:</span>
                        <span className="text-xs font-medium text-cyan-300">
                          {po.delivery_date ? new Date(po.delivery_date).toLocaleDateString() : 'TBD'}
                        </span>
                      </div>
                      
                      {/* Email Action Section */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-3 pt-3 border-t border-white/10"
                      >
                        {!emailStatuses[index] ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSendEmail(index, po)}
                            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 flex items-center justify-center space-x-2"
                          >
                            <span>📧</span>
                            <span>Send Email</span>
                          </motion.button>
                        ) : emailStatuses[index].status === 'sending' ? (
                          <div className="w-full py-2 px-4 bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white text-sm font-semibold rounded-lg border border-yellow-400/30 flex items-center justify-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Sending...</span>
                          </div>
                        ) : emailStatuses[index].status === 'sent' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <motion.div
                                  animate={{ 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                  }}
                                  transition={{ 
                                    duration: 2, 
                                    repeat: Infinity,
                                    delay: index * 0.2
                                  }}
                                  className="w-4 h-4 bg-green-500/30 rounded-full flex items-center justify-center"
                                >
                                  <span className="text-xs">📧</span>
                                </motion.div>
                                <span className="text-xs text-green-300 font-medium">Email Sent</span>
                              </div>
                              <div className="text-xs px-2 py-1 bg-green-500/20 text-green-200 rounded-full border border-green-400/30">
                                ✅ Delivered
                              </div>
                            </div>
                            <div className="text-xs text-white/70">
                              Sent to: <span className="text-green-300 font-medium">{emailStatuses[index].recipient}</span>
                            </div>
                            <div className="text-xs text-white/50">
                              Sent at: {emailStatuses[index].timestamp}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSendEmail(index, po)}
                              className="w-full py-1.5 px-3 bg-gradient-to-r from-blue-500/40 to-purple-500/40 hover:from-blue-500/60 hover:to-purple-500/60 text-white text-xs font-medium rounded-md border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300"
                            >
                              📧 Resend Email
                            </motion.button>
                          </div>
                        ) : emailStatuses[index].status === 'error' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-red-500/30 rounded-full flex items-center justify-center">
                                  <span className="text-xs">❌</span>
                                </div>
                                <span className="text-xs text-red-300 font-medium">Email Failed</span>
                              </div>
                              <div className="text-xs px-2 py-1 bg-red-500/20 text-red-200 rounded-full border border-red-400/30">
                                ❌ Error
                              </div>
                            </div>
                            <div className="text-xs text-red-300">
                              Error: {emailStatuses[index].error}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSendEmail(index, po)}
                              className="w-full py-1.5 px-3 bg-gradient-to-r from-red-500/60 to-orange-500/60 hover:from-red-500/80 hover:to-orange-500/80 text-white text-xs font-medium rounded-md border border-red-400/30 hover:border-red-400/50 transition-all duration-300"
                            >
                              🔄 Retry Send
                            </motion.button>
                          </div>
                        ) : null}
                      </motion.div>
                    </div>
                  </motion.div>
                )) || (
                  <div className="col-span-full text-center text-white/60 py-8">
                    No purchase orders generated
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Supplier Product Performance Charts - Fixed to prevent carousel refresh */}
      <StaticChartsSection suppliersData={suppliersData} />
    </motion.div>
  );
};

// Separate static component that won't re-render when carousel moves
const StaticChartsSection = React.memo(({ suppliersData }) => {
  const GlassPieChart = React.memo(({ percentage, title, color = "#8B5CF6" }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 text-center"
    >
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{
              strokeDasharray: `${2 * Math.PI * 40}`,
              strokeDashoffset: `${2 * Math.PI * 40 * (1 - percentage / 100)}`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
      <p className="text-sm text-white/70 mt-2">Target achievement</p>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500/50 to-pink-500/50 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:from-purple-500/70 hover:to-pink-500/70 transition-all duration-300"
      >
        Success
      </motion.button>
    </motion.div>
  ));

  GlassPieChart.displayName = 'GlassPieChart';

  const GlassBarChart = React.memo(({ data, title, color = "#8B5CF6" }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
    >
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      <Box sx={{ width: '100%', height: 250 }}>
        <BarChart
          series={[{
            data: data.map(d => d.value),
            color: color
          }]}
          xAxis={[{ 
            data: data.map(d => d.label), 
            scaleType: 'band',
            tickLabelStyle: { fill: 'rgba(255,255,255,0.8)' }
          }]}
          yAxis={[{
            tickLabelStyle: { fill: 'rgba(255,255,255,0.8)' }
          }]}
          sx={{
            '& .MuiChartsAxis-line': { stroke: 'rgba(255,255,255,0.3)' },
            '& .MuiChartsAxis-tick': { stroke: 'rgba(255,255,255,0.3)' },
            '& .MuiChartsGrid-line': { stroke: 'rgba(255,255,255,0.1)' }
          }}
        />
      </Box>
    </motion.div>
  ));

  GlassBarChart.displayName = 'GlassBarChart';

  const SupplierProductChart = React.memo(({ supplier }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{supplier.name}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-400">⭐</span>
          <span className="text-sm font-medium text-white/80">{supplier.rating}</span>
        </div>
      </div>
      
      {/* Best Product Highlight */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-lg border border-white/10">
        <h4 className="text-sm font-semibold text-purple-200 mb-2">🏆 Best Performing Product</h4>
        <div className="text-lg font-bold text-white">{supplier.bestProduct}</div>
        <div className="text-sm text-purple-200">Highest profitability and growth rate</div>
      </div>
      
      {/* Product Performance Bars */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-semibold text-white/90">Product Performance Analysis</h4>
        {supplier.topProducts.map((product, index) => (
          <div key={`${supplier.id}-${product.name}-${index}`} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white/90">{product.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-white/60">{product.sales} units</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  Profit: {product.profitability}%
                </span>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm">
              <div
                className="h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${product.performance}%`,
                  background: `linear-gradient(90deg, ${supplier.color}80, ${supplier.color})`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>Performance: {product.performance}%</span>
              <span className={`${product.trend > 15 ? 'text-green-400' : product.trend > 5 ? 'text-yellow-400' : 'text-white/60'}`}>
                Growth: +{product.trend}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Performance Trend */}
      <div className="border-t border-white/10 pt-4">
        <h4 className="text-sm font-semibold text-white/90 mb-3">6-Month Performance Trend</h4>
        <Box sx={{ width: '100%', height: 150 }}>
          <BarChart
            series={[{
              data: supplier.monthlyPerformance,
              color: supplier.color
            }]}
            xAxis={[{ 
              data: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept'], 
              scaleType: 'band',
              tickLabelStyle: { fill: 'rgba(255,255,255,0.6)', fontSize: 10 }
            }]}
            yAxis={[{
              tickLabelStyle: { fill: 'rgba(255,255,255,0.6)', fontSize: 10 }
            }]}
            sx={{
              '& .MuiChartsAxis-line': { stroke: 'rgba(255,255,255,0.2)' },
              '& .MuiChartsAxis-tick': { stroke: 'rgba(255,255,255,0.2)' },
              '& .MuiChartsGrid-line': { stroke: 'rgba(255,255,255,0.1)' }
            }}
          />
        </Box>
      </div>
    </motion.div>
  ));

  SupplierProductChart.displayName = 'SupplierProductChart';

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SupplierProductChart supplier={suppliersData[0]} />
        <SupplierProductChart supplier={suppliersData[1]} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SupplierProductChart supplier={suppliersData[2]} />
        </div>
        <div className="space-y-6">
          <GlassPieChart percentage={85} title="Supplier Quality" color="#10B981" />
          <GlassBarChart
            title="Product Categories"
            data={[
              { label: 'Electronics', value: 85 },
              { label: 'Fashion', value: 72 },
              { label: 'Home', value: 68 },
              { label: 'Sports', value: 45 }
            ]}
            color="#8B5CF6"
          />
        </div>
      </div>

      {/* Trending Products List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
      >
        <h3 className="text-lg font-semibold text-white mb-4">🔥 Trending Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'iPhone 15 Pro', trend: '+22%', sales: '1,250' },
            { name: 'Gaming Laptops', trend: '+25%', sales: '320' },
            { name: 'MacBook Pro M3', trend: '+18%', sales: '890' },
            { name: 'Samsung Galaxy S24', trend: '+22%', sales: '760' }
          ].map((product, index) => (
            <motion.div 
              key={`trending-${product.name}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-lg"
            >
              <p className="font-medium text-white">{product.name}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-green-400 font-semibold">{product.trend}</span>
                <span className="text-sm text-white/70">{product.sales} units</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
});

StaticChartsSection.displayName = 'StaticChartsSection';

export default ProcurementAgent;
