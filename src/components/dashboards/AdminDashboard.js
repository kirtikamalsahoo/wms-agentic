'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedAgent, setSelectedAgent] = useState(null); // 'financial' or 'operational'
  const [activeAgentTab, setActiveAgentTab] = useState('overview');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isBot: true, timestamp: new Date() }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  // Mock data for admin dashboard
  const systemMetrics = [
    { title: 'Total Users', value: '1,247', change: '+8%', icon: '👥', color: 'blue' },
    { title: 'System Uptime', value: '99.9%', change: '+0.1%', icon: '⚡', color: 'green' },
    { title: 'Storage Used', value: '67%', change: '+3%', icon: '💾', color: 'yellow' },
    { title: 'Active Sessions', value: '89', change: '+15%', icon: '🔄', color: 'purple' },
  ];

  const userActivity = [
    { user: 'manager_john', action: 'Updated inventory', time: '2 min ago', status: 'success' },
    { user: 'user_sarah', action: 'Searched products', time: '5 min ago', status: 'info' },
    { user: 'manager_mike', action: 'Generated report', time: '8 min ago', status: 'success' },
    { user: 'user_david', action: 'Login attempt failed', time: '12 min ago', status: 'warning' },
  ];

  const systemAlerts = [
    { type: 'warning', message: 'High CPU usage detected', time: '5 min ago' },
    { type: 'info', message: 'Backup completed successfully', time: '1 hour ago' },
    { type: 'error', message: 'Database connection timeout', time: '2 hours ago' },
    { type: 'success', message: 'Security scan completed', time: '4 hours ago' },
  ];

  // Financial Agent Data
  const financialData = {
    totalRevenue: '₹12,45,000',
    monthlyGrowth: '+18.5%',
    pendingPayments: '₹2,34,000',
    completedTransactions: '1,847',
    recentTransactions: [
      { id: 'TXN-001', amount: '₹15,000', type: 'Credit', status: 'Completed', time: '2 min ago' },
      { id: 'TXN-002', amount: '₹8,500', type: 'Debit', status: 'Pending', time: '5 min ago' },
      { id: 'TXN-003', amount: '₹25,000', type: 'Credit', status: 'Completed', time: '12 min ago' },
    ]
  };

  // Operational Agent Data
  const operationalData = {
    activeOrders: '234',
    completedOrders: '1,456',
    inventoryLevel: '78%',
    warehouseCapacity: '67%',
    avgProcessingTime: '2.3 hrs',
    onTimeDelivery: '94.2%',
    recentOperations: [
      { action: 'Inventory Update', item: 'Electronics', status: 'Completed', time: '3 min ago' },
      { action: 'Order Processing', item: 'ORD-12345', status: 'In Progress', time: '8 min ago' },
      { action: 'Warehouse Sync', item: 'Zone A-C', status: 'Completed', time: '15 min ago' },
    ]
  };

  // Additional data for agents
  const recentTransactions = [
    { id: 'TXN-001', amount: '₹15,000', type: 'Credit', status: 'Completed', time: '2 min ago', customer: 'ABC Corp' },
    { id: 'TXN-002', amount: '₹8,500', type: 'Debit', status: 'Pending', time: '5 min ago', customer: 'Supplier XYZ' },
    { id: 'TXN-003', amount: '₹25,000', type: 'Credit', status: 'Completed', time: '12 min ago', customer: 'DEF Ltd' },
    { id: 'TXN-004', amount: '₹12,300', type: 'Credit', status: 'Completed', time: '18 min ago', customer: 'GHI Industries' },
  ];

  const recentOrders = [
    { id: 'ORD-12345', customer: 'ABC Corp', items: 5, value: '₹15,000', status: 'Processing', priority: 'High', time: '2 min ago' },
    { id: 'ORD-12346', customer: 'XYZ Ltd', items: 3, value: '₹8,500', status: 'Shipped', priority: 'Medium', time: '5 min ago' },
    { id: 'ORD-12347', customer: 'DEF Industries', items: 8, value: '₹25,000', status: 'Completed', priority: 'Low', time: '12 min ago' },
    { id: 'ORD-12348', customer: 'GHI Corp', items: 2, value: '₹12,300', status: 'Processing', priority: 'High', time: '18 min ago' },
  ];

  // Chatbot functionality
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: currentMessage,
      isBot: false,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsTyping(true);
    
    try {
      // Call the API through our Next.js API route to avoid CORS issues
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_prompt: messageToSend
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botResponse = {
        id: Date.now() + 1,
        text: data.reply || data.response || data.message || data.answer || 'I received your message but couldn\'t process it properly.',
        isBot: true,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: 'Sorry, I\'m having trouble connecting to the server. Please try again later.',
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const getBotResponse = (message) => {
    // This function is now deprecated as we're using the API
    const responses = {
      'revenue': 'Current revenue is ₹12,45,000 with a growth of +18.5% this month. Financial performance is excellent!',
      'orders': 'We have 234 active orders and 1,456 completed orders. Operations are running smoothly.',
      'inventory': 'Inventory level is at 78% with warehouse capacity at 67%. Good stock levels maintained.',
      'help': 'I can help you with financial reports, operational metrics, system status, and general inquiries. What would you like to know?',
      'default': 'I understand you want information about our warehouse management system. Could you be more specific about what you\'d like to know?'
    };
    
    const key = Object.keys(responses).find(k => 
      message.toLowerCase().includes(k) || 
      (k === 'help' && (message.toLowerCase().includes('help') || message.includes('?')))
    );
    
    return responses[key] || responses.default;
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-600/20 to-blue-800/20 border-blue-500/30',
      green: 'from-green-600/20 to-green-800/20 border-green-500/30',
      yellow: 'from-yellow-600/20 to-yellow-800/20 border-yellow-500/30',
      purple: 'from-purple-600/20 to-purple-800/20 border-purple-500/30',
    };
    return colors[color] || colors.blue;
  };

  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-green-400',
      warning: 'bg-yellow-400',
      error: 'bg-red-400',
      info: 'bg-blue-400',
      'Completed': 'bg-green-400',
      'Pending': 'bg-yellow-400',
      'Failed': 'bg-red-400',
      'Processing': 'bg-blue-400',
      'Shipped': 'bg-purple-400',
      'In Progress': 'bg-blue-400',
    };
    return colors[status] || colors.info;
  };

  const getTypeColor = (type) => {
    return type === 'Credit' ? 'text-green-400' : 'text-orange-400';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'text-red-400',
      'Medium': 'text-yellow-400',
      'Low': 'text-green-400',
    };
    return colors[priority] || 'text-gray-400';
  };

  const formatBotMessage = (text) => {
    // Split the text into sections
    const sections = text.split(/###\s+/);
    
    return sections.map((section, index) => {
      if (index === 0 && !section.trim().startsWith('Products in') && !section.trim().startsWith('**')) {
        // First section without header
        return (
          <div key={index} className="mb-2">
            <p className={`text-white/90 ${isChatExpanded ? 'text-sm' : 'text-sm'}`}>{section.trim()}</p>
          </div>
        );
      }
      
      // Process sections with headers
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length === 0) return null;
      
      const header = lines[0];
      const content = lines.slice(1);
      
      return (
        <div key={index} className="mb-3">
          {/* Section Header */}
          <div className="mb-2">
            <h4 className={`text-purple-300 font-semibold ${isChatExpanded ? 'text-base' : 'text-sm'}`}>
              {header.replace(/\*\*/g, '')}
            </h4>
          </div>
          
          {/* Section Content */}
          <div className="space-y-1 pl-2 border-l-2 border-purple-500/30">
            {content.map((line, lineIndex) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return null;
              
              // Handle bullet points
              if (trimmedLine.startsWith('-')) {
                return (
                  <div key={lineIndex} className="flex items-start space-x-2">
                    <span className={`text-purple-400 mt-1 ${isChatExpanded ? 'text-sm' : 'text-xs'}`}>•</span>
                    <span className={`text-white/80 leading-relaxed ${isChatExpanded ? 'text-sm' : 'text-xs'}`}>
                      {trimmedLine.substring(1).trim()}
                    </span>
                  </div>
                );
              }
              
              // Handle special markers like "*(and more)*"
              if (trimmedLine.includes('*(') && trimmedLine.includes(')*')) {
                return (
                  <div key={lineIndex} className={`text-purple-200/70 italic pl-4 ${isChatExpanded ? 'text-sm' : 'text-xs'}`}>
                    {trimmedLine}
                  </div>
                );
              }
              
              // Regular lines
              return (
                <div key={lineIndex} className={`text-white/80 leading-relaxed ${isChatExpanded ? 'text-sm' : 'text-xs'}`}>
                  {trimmedLine}
                </div>
              );
            })}
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-xl">👑</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">System Administrator - {user}</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <Link
                href="/products"
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-all duration-300"
              >
                Warehouse View
              </Link>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={onLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-all duration-300"
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* System Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {systemMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className={`backdrop-blur-xl bg-gradient-to-br ${getColorClasses(metric.color)} rounded-xl border p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{metric.icon}</div>
                <div className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
              <p className="text-gray-300 text-sm">{metric.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Agents Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <span>🤖</span>
            <span>AI Agents</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Financial Agent Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedAgent('financial')}
              className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl border border-green-500/20 p-8 cursor-pointer hover:border-green-500/40 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">💰</span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-1">Financial Agent</h4>
                  <p className="text-green-300 text-sm">AI-powered financial insights & analytics</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4 border border-green-500/20 group-hover:bg-white/10 transition-colors duration-300">
                  <div className="text-green-400 text-sm font-medium">Total Revenue</div>
                  <div className="text-white font-bold text-xl">{financialData.totalRevenue}</div>
                  <div className="text-green-300 text-xs">{financialData.monthlyGrowth} this month</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-green-500/20 group-hover:bg-white/10 transition-colors duration-300">
                  <div className="text-green-400 text-sm font-medium">Transactions</div>
                  <div className="text-white font-bold text-xl">{financialData.completedTransactions}</div>
                  <div className="text-green-300 text-xs">Completed orders</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-white/80 text-sm">
                  Track revenue, expenses, and financial KPIs
                </div>
                <div className="flex items-center space-x-2 text-green-400 group-hover:text-green-300 transition-colors">
                  <span className="text-sm font-medium">Open Agent</span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </motion.div>

            {/* Operational Agent Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedAgent('operational')}
              className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl border border-blue-500/20 p-8 cursor-pointer hover:border-blue-500/40 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">⚙️</span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-1">Operational Agent</h4>
                  <p className="text-blue-300 text-sm">Smart operations & warehouse management</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4 border border-blue-500/20 group-hover:bg-white/10 transition-colors duration-300">
                  <div className="text-blue-400 text-sm font-medium">Active Orders</div>
                  <div className="text-white font-bold text-xl">{operationalData.activeOrders}</div>
                  <div className="text-blue-300 text-xs">Currently processing</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-blue-500/20 group-hover:bg-white/10 transition-colors duration-300">
                  <div className="text-blue-400 text-sm font-medium">Inventory Level</div>
                  <div className="text-white font-bold text-xl">{operationalData.inventoryLevel}</div>
                  <div className="text-blue-300 text-xs">Optimal stock level</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-white/80 text-sm">
                  Manage inventory, orders, and warehouse operations
                </div>
                <div className="flex items-center space-x-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">Open Agent</span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Agent Details Section */}
        <AnimatePresence>
          {selectedAgent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              {/* Agent Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${
                    selectedAgent === 'financial' 
                      ? 'from-green-500 to-emerald-600' 
                      : 'from-blue-500 to-purple-600'
                  } rounded-full flex items-center justify-center`}>
                    <span className="text-2xl">{selectedAgent === 'financial' ? '💰' : '⚙️'}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {selectedAgent === 'financial' ? 'Financial Agent' : 'Operational Agent'}
                    </h3>
                    <p className="text-gray-400">
                      {selectedAgent === 'financial' 
                        ? 'AI-powered financial insights & analytics' 
                        : 'Smart operations & warehouse management'
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg text-gray-300 transition-all duration-300"
                >
                  ← Back to Overview
                </button>
              </div>

              {/* Agent Tabs */}
              <div className="mb-6">
                <div className="flex space-x-4 border-b border-white/10">
                  {[
                    { id: 'overview', label: 'Overview', icon: '📊' },
                    { id: 'details', label: selectedAgent === 'financial' ? 'Transactions' : 'Orders', icon: selectedAgent === 'financial' ? '💳' : '📦' },
                    { id: 'analytics', label: 'Analytics', icon: '📈' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveAgentTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-300 border-b-2 ${
                        activeAgentTab === tab.id
                          ? `${selectedAgent === 'financial' ? 'text-green-400 border-green-400' : 'text-blue-400 border-blue-400'}`
                          : 'text-gray-400 border-transparent hover:text-white hover:border-white/30'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Agent Content */}
              {selectedAgent === 'financial' && (
                <>
                  {activeAgentTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Financial Metrics */}
                      <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
                        <h4 className="text-xl font-semibold text-white mb-6">Financial Summary</h4>
                        <div className="space-y-4">
                          {[
                            { label: 'Total Revenue', value: financialData.totalRevenue, color: 'green' },
                            { label: 'Monthly Growth', value: financialData.monthlyGrowth, color: 'blue' },
                            { label: 'Pending Payments', value: financialData.pendingPayments, color: 'yellow' },
                            { label: 'Completed Transactions', value: financialData.completedTransactions, color: 'purple' },
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <span className="text-white font-medium">{item.label}</span>
                              <span className={`font-bold text-${item.color}-400`}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
                        <h4 className="text-xl font-semibold text-white mb-6">Recent Transactions</h4>
                        <div className="space-y-3">
                          {financialData.recentTransactions.map((transaction, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-green-500/10">
                              <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${transaction.status === 'Completed' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                                <span className="text-white text-sm">{transaction.id}</span>
                              </div>
                              <span className={`text-sm font-medium ${transaction.type === 'Credit' ? 'text-green-400' : 'text-orange-400'}`}>
                                {transaction.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeAgentTab === 'details' && (
                    <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-semibold text-white">Transaction Details</h4>
                        <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-all duration-300">
                          Export Data
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Transaction ID</th>
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentTransactions.map((transaction, index) => (
                              <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-3 px-4 text-white font-mono text-sm">{transaction.id}</td>
                                <td className="py-3 px-4 text-white">{transaction.customer}</td>
                                <td className="py-3 px-4 text-white font-bold">{transaction.amount}</td>
                                <td className="py-3 px-4">
                                  <span className={`${getTypeColor(transaction.type)} font-medium`}>
                                    {transaction.type}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(transaction.status)}`}></div>
                                    <span className="text-white text-sm">{transaction.status}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-400 text-sm">{transaction.time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeAgentTab === 'analytics' && (
                    <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
                      <h4 className="text-xl font-semibold text-white mb-6">Financial Analytics</h4>
                      <div className="h-64 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-4">📈</div>
                          <p className="text-white/60">Financial analytics dashboard</p>
                          <p className="text-sm text-gray-400 mt-2">Revenue trends, profit analysis, and forecasting</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedAgent === 'operational' && (
                <>
                  {activeAgentTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Operational Metrics */}
                      <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
                        <h4 className="text-xl font-semibold text-white mb-6">Operations Summary</h4>
                        <div className="space-y-4">
                          {[
                            { label: 'Active Orders', value: operationalData.activeOrders, color: 'blue' },
                            { label: 'Completed Orders', value: operationalData.completedOrders, color: 'green' },
                            { label: 'Inventory Level', value: operationalData.inventoryLevel, color: 'purple' },
                            { label: 'Warehouse Capacity', value: operationalData.warehouseCapacity, color: 'yellow' },
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <span className="text-white font-medium">{item.label}</span>
                              <span className={`font-bold text-${item.color}-400`}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Operations */}
                      <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
                        <h4 className="text-xl font-semibold text-white mb-6">Recent Operations</h4>
                        <div className="space-y-3">
                          {operationalData.recentOperations.map((operation, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-blue-500/10">
                              <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${operation.status === 'Completed' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                                <span className="text-white text-sm">{operation.action}</span>
                              </div>
                              <span className="text-blue-300 text-xs">{operation.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeAgentTab === 'details' && (
                    <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-semibold text-white">Order Management</h4>
                        <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-all duration-300">
                          Create Order
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Order ID</th>
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Items</th>
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Value</th>
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Priority</th>
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                              <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentOrders.map((order, index) => (
                              <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-3 px-4 text-white font-mono text-sm">{order.id}</td>
                                <td className="py-3 px-4 text-white">{order.customer}</td>
                                <td className="py-3 px-4 text-white">{order.items} items</td>
                                <td className="py-3 px-4 text-white font-bold">{order.value}</td>
                                <td className="py-3 px-4">
                                  <span className={`${getPriorityColor(order.priority)} font-medium`}>
                                    {order.priority}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></div>
                                    <span className="text-white text-sm">{order.status}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-400 text-sm">{order.time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeAgentTab === 'analytics' && (
                    <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
                      <h4 className="text-xl font-semibold text-white mb-6">Operational Analytics</h4>
                      <div className="h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-4">📊</div>
                          <p className="text-white/60">Operations analytics dashboard</p>
                          <p className="text-sm text-gray-400 mt-2">Order processing trends, inventory analysis, and efficiency metrics</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Recent User Activity</h3>
              <div className="space-y-4">
                {userActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{activity.user}</p>
                      <p className="text-gray-400 text-xs">{activity.action}</p>
                    </div>
                    <span className="text-gray-400 text-xs">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* System Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-6">System Alerts</h3>
              <div className="space-y-4">
                {systemAlerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start space-x-4 p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(alert.type)}`}></div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{alert.message}</p>
                      <span className="text-gray-400 text-xs">{alert.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Admin Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Admin Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: 'User Management', icon: '👥', color: 'blue' },
                { label: 'System Settings', icon: '⚙️', color: 'gray' },
                { label: 'Database', icon: '🗄️', color: 'green' },
                { label: 'Security', icon: '🔒', color: 'red' },
                { label: 'Backup', icon: '💾', color: 'purple' },
                { label: 'Logs', icon: '📋', color: 'yellow' },
              ].map((tool, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 bg-gradient-to-br ${getColorClasses(tool.color)} rounded-xl border hover:border-white/20 transition-all duration-300`}
                >
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <div className="text-white font-medium text-sm">{tool.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'CPU Usage', value: 45, color: 'green' },
                { label: 'Memory Usage', value: 67, color: 'yellow' },
                { label: 'Disk Usage', value: 34, color: 'blue' },
              ].map((health, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{health.label}</span>
                    <span className="text-gray-400 text-sm">{health.value}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${health.value}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className={`h-2 rounded-full ${
                        health.value > 80 ? 'bg-red-500' :
                        health.value > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className={`mb-4 bg-gradient-to-br from-slate-900/95 to-gray-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden transition-all duration-300 ${
                isChatExpanded ? 'w-[50vw] h-[80vh] fixed right-4 bottom-20' : 'w-80 h-96'
              }`}
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">AI Assistant</h4>
                    <p className="text-purple-200 text-xs">Online - Connected to WMS DB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsChatExpanded(!isChatExpanded)}
                    className="text-white/80 hover:text-white transition-colors p-1"
                    title={isChatExpanded ? "Minimize" : "Expand"}
                  >
                    {isChatExpanded ? '🗗' : '🗖'}
                  </button>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className={`flex-1 p-4 space-y-3 overflow-y-auto ${isChatExpanded ? 'h-[calc(80vh-180px)]' : 'h-52'} scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent`}>
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`${isChatExpanded ? 'max-w-[90%]' : 'max-w-xs'} p-3 rounded-2xl ${
                      message.isBot 
                        ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                        : 'bg-blue-500/20 text-white border border-blue-500/30'
                    }`}>
                      {message.isBot ? (
                        <div className="text-sm space-y-2">
                          {formatBotMessage(message.text)}
                        </div>
                      ) : (
                        <p className="text-sm">{message.text}</p>
                      )}
                      <p className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-purple-500/20 text-white border border-purple-500/30 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <div className="sticky bottom-0 backdrop-blur-xl bg-gradient-to-r from-slate-900/90 via-gray-900/90 to-slate-900/90 border-t border-white/20 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                      placeholder="Ask about warehouse operations, inventory, orders..."
                      disabled={isTyping}
                      className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-sm disabled:opacity-50 shadow-lg transition-all duration-300 hover:bg-white/15"
                    />
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 pointer-events-none"></div>
                  </div>
                  
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isTyping}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 backdrop-blur-md bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-all duration-300 shadow-lg border border-purple-500/30 hover:border-purple-400/50"
                  >
                    <span className="text-sm font-medium">{isTyping ? '⏳' : '📤'}</span>
                  </motion.button>
                </div>
                
                {/* Suggestion chips for better UX */}
                {!isTyping && chatMessages.length <= 1 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      'Show all products',
                      'Warehouse inventory',
                      'Order status',
                      'System analytics'
                    ].map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setCurrentMessage(suggestion)}
                        className="px-3 py-1.5 text-xs backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 rounded-full text-gray-300 hover:text-white transition-all duration-300"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 relative"
        >
          <motion.div
            animate={{ rotate: isChatOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isChatOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">🤖</span>
            )}
          </motion.div>
          
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping"></div>
        </motion.button>
      </div>
    </div>
  );
};

export default AdminDashboard;
