'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PieChart as PieChartIcon, BarChart3, Target, AlertTriangle } from 'lucide-react';

const FinancialAgent = ({ isAgentRunning, onRunAgent }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Financial data for different time periods (amounts in INR)
  const allFinancialData = {
    month: {
      revenue: [
        { period: 'Jan 2024', value: 750000, expenses: 550000, profit: 200000, growth: 12.5 },
        { period: 'Feb 2024', value: 820000, expenses: 610000, profit: 210000, growth: 8.2 },
        { period: 'Mar 2024', value: 950000, expenses: 680000, profit: 270000, growth: 19.6 },
        { period: 'Apr 2024', value: 850000, expenses: 640000, profit: 210000, growth: -13.6 },
        { period: 'May 2024', value: 980000, expenses: 750000, profit: 230000, growth: 26.3 },
        { period: 'Jun 2024', value: 1200000, expenses: 820000, profit: 380000, growth: 12.5 },
        { period: 'Jul 2024', value: 1050000, expenses: 780000, profit: 270000, growth: -12.6 },
        { period: 'Aug 2024', value: 1350000, expenses: 890000, profit: 460000, growth: 20.3 },
        { period: 'Sep 2024', value: 1450000, expenses: 950000, profit: 500000, growth: 7.0 },
      ],
      expenses: [
        { category: 'Operations', amount: 380000, percentage: 40.2, color: '#8B5CF6' },
        { category: 'Labor', amount: 320000, percentage: 33.5, color: '#06B6D4' },
        { category: 'Technology', amount: 110000, percentage: 11.5, color: '#10B981' },
        { category: 'Marketing', amount: 72000, percentage: 7.7, color: '#F59E0B' },
        { category: 'Maintenance', amount: 68000, percentage: 7.1, color: '#EF4444' },
      ],
      cashFlow: [
        { month: 'Jan', inflow: 750000, outflow: 550000, net: 200000 },
        { month: 'Feb', inflow: 820000, outflow: 610000, net: 210000 },
        { month: 'Mar', inflow: 950000, outflow: 680000, net: 270000 },
        { month: 'Apr', inflow: 850000, outflow: 640000, net: 210000 },
        { month: 'May', inflow: 980000, outflow: 750000, net: 230000 },
        { month: 'Jun', inflow: 1200000, outflow: 820000, net: 380000 },
        { month: 'Jul', inflow: 1050000, outflow: 780000, net: 270000 },
        { month: 'Aug', inflow: 1350000, outflow: 890000, net: 460000 },
        { month: 'Sep', inflow: 1450000, outflow: 950000, net: 500000 },
      ]
    },
    quarter: {
      revenue: [
        { period: 'Q1 2023', value: 2100000, expenses: 1550000, profit: 550000, growth: 8.5 },
        { period: 'Q2 2023', value: 2450000, expenses: 1800000, profit: 650000, growth: 18.8 },
        { period: 'Q3 2023', value: 2350000, expenses: 1750000, profit: 600000, growth: -7.0 },
        { period: 'Q4 2023', value: 2800000, expenses: 2050000, profit: 750000, growth: 20.8 },
        { period: 'Q1 2024', value: 2520000, expenses: 1840000, profit: 680000, growth: 19.6 },
        { period: 'Q2 2024', value: 3150000, expenses: 2290000, profit: 860000, growth: 22.8 },
        { period: 'Q3 2024', value: 3850000, expenses: 2710000, profit: 1140000, growth: 55.5 },
      ],
      expenses: [
        { category: 'Operations', amount: 1120000, percentage: 41.2, color: '#8B5CF6' },
        { category: 'Labor', amount: 920000, percentage: 33.7, color: '#06B6D4' },
        { category: 'Technology', amount: 300000, percentage: 11.0, color: '#10B981' },
        { category: 'Marketing', amount: 225000, percentage: 8.2, color: '#F59E0B' },
        { category: 'Maintenance', amount: 145000, percentage: 5.9, color: '#EF4444' },
      ],
      cashFlow: [
        { month: 'Q1', inflow: 2520000, outflow: 1840000, net: 680000 },
        { month: 'Q2', inflow: 3150000, outflow: 2290000, net: 860000 },
        { month: 'Q3', inflow: 3850000, outflow: 2710000, net: 1140000 },
      ]
    },
    year: {
      revenue: [
        { period: '2020', value: 7500000, expenses: 5500000, profit: 2000000, growth: 5.2 },
        { period: '2021', value: 8650000, expenses: 6300000, profit: 2350000, growth: 15.3 },
        { period: '2022', value: 9880000, expenses: 7100000, profit: 2780000, growth: 14.3 },
        { period: '2023', value: 11300000, expenses: 8050000, profit: 3250000, growth: 14.3 },
        { period: '2024', value: 13420000, expenses: 9290000, profit: 4130000, growth: 18.8 },
      ],
      expenses: [
        { category: 'Operations', amount: 3720000, percentage: 40.0, color: '#8B5CF6' },
        { category: 'Labor', amount: 3100000, percentage: 33.3, color: '#06B6D4' },
        { category: 'Technology', amount: 1060000, percentage: 11.4, color: '#10B981' },
        { category: 'Marketing', amount: 800000, percentage: 8.6, color: '#F59E0B' },
        { category: 'Maintenance', amount: 610000, percentage: 6.7, color: '#EF4444' },
      ],
      cashFlow: [
        { month: '2020', inflow: 7500000, outflow: 5500000, net: 2000000 },
        { month: '2021', inflow: 8650000, outflow: 6300000, net: 2350000 },
        { month: '2022', inflow: 9880000, outflow: 7100000, net: 2780000 },
        { month: '2023', inflow: 11300000, outflow: 8050000, net: 3250000 },
        { month: '2024', inflow: 13420000, outflow: 9290000, net: 4130000 },
      ]
    }
  };

  // Get current financial data based on selected timeframe
  const financialData = allFinancialData[selectedTimeframe];

  // Dynamic KPI metrics based on selected timeframe
  const getKpiMetrics = () => {
    const currentData = financialData.revenue;
    const latest = currentData[currentData.length - 1];
    const previous = currentData[currentData.length - 2] || currentData[currentData.length - 1];
    
    const revenueChange = ((latest.value - previous.value) / previous.value * 100).toFixed(1);
    const profitChange = ((latest.profit - previous.profit) / previous.profit * 100).toFixed(1);
    const expenseChange = ((latest.expenses - previous.expenses) / previous.expenses * 100).toFixed(1);
    const marginCurrent = (latest.profit / latest.value * 100).toFixed(1);
    const marginPrevious = (previous.profit / previous.value * 100).toFixed(1);
    const marginChange = (marginCurrent - marginPrevious).toFixed(1);

    const formatValue = (value) => {
      if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`;
      } else if (value >= 1000) {
        return `₹${(value / 1000).toFixed(0)}K`;
      } else {
        return `₹${value.toLocaleString('en-IN')}`;
      }
    };

    return [
      {
        title: 'Total Revenue',
        value: formatValue(latest.value),
        change: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`,
        trend: revenueChange >= 0 ? 'up' : 'down',
        icon: DollarSign,
        color: 'from-green-500 to-emerald-600'
      },
      {
        title: 'Net Profit',
        value: formatValue(latest.profit),
        change: `${profitChange >= 0 ? '+' : ''}${profitChange}%`,
        trend: profitChange >= 0 ? 'up' : 'down',
        icon: TrendingUp,
        color: 'from-blue-500 to-cyan-600'
      },
      {
        title: 'Operating Costs',
        value: formatValue(latest.expenses),
        change: `${expenseChange >= 0 ? '+' : ''}${expenseChange}%`,
        trend: expenseChange >= 0 ? 'up' : 'down',
        icon: CreditCard,
        color: 'from-orange-500 to-red-600'
      },
      {
        title: 'Profit Margin',
        value: `${marginCurrent}%`,
        change: `${marginChange >= 0 ? '+' : ''}${marginChange}%`,
        trend: marginChange >= 0 ? 'up' : 'down',
        icon: Target,
        color: 'from-purple-500 to-violet-600'
      }
    ];
  };

  const kpiMetrics = getKpiMetrics();

  const runFinancialAnalysis = () => {
    setIsAnalyzing(true);
    onRunAgent('financial');
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
            💰 Financial Agent
          </h2>
          <p className="text-gray-400 mt-2">Monitor financial performance and expense analysis</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runFinancialAnalysis}
          disabled={isAnalyzing}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <BarChart3 className="w-5 h-5" />
          )}
          <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
        </motion.button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => (
          <motion.div
            key={`${metric.title}-${selectedTimeframe}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color}`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 ${
                metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{metric.change}</span>
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">{metric.title}</h3>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Time Period Selector */}
      <div className="flex space-x-4">
        {[
          { id: 'month', label: 'Monthly' },
          { id: 'quarter', label: 'Quarterly' },
          { id: 'year', label: 'Yearly' }
        ].map((period) => (
          <motion.button
            key={period.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTimeframe(period.id)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedTimeframe === period.id
                ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {period.label}
          </motion.button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <motion.div
          key={`revenue-chart-${selectedTimeframe}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Revenue & Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={financialData.revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="period" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(value) => {
                if (value >= 100000) {
                  return `₹${(value / 100000).toFixed(1)}L`;
                } else if (value >= 1000) {
                  return `₹${(value / 1000).toFixed(0)}K`;
                } else {
                  return `₹${value}`;
                }
              }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value, name) => {
                  let formattedValue;
                  if (value >= 100000) {
                    formattedValue = `₹${(value / 100000).toFixed(2)}L`;
                  } else if (value >= 1000) {
                    formattedValue = `₹${(value / 1000).toFixed(0)}K`;
                  } else {
                    formattedValue = `₹${value.toLocaleString('en-IN')}`;
                  }
                  return [formattedValue, name];
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stackId="1"
                stroke="#10B981" 
                fill="url(#revenueGradient)" 
                name="Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stackId="2"
                stroke="#3B82F6" 
                fill="url(#profitGradient)" 
                name="Profit"
              />
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          key={`expense-chart-${selectedTimeframe}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={financialData.expenses}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="amount"
              >
                {financialData.expenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => {
                  let formattedValue;
                  if (value >= 100000) {
                    formattedValue = `₹${(value / 100000).toFixed(2)}L`;
                  } else if (value >= 1000) {
                    formattedValue = `₹${(value / 1000).toFixed(0)}K`;
                  } else {
                    formattedValue = `₹${value.toLocaleString('en-IN')}`;
                  }
                  return [formattedValue, 'Amount'];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {financialData.expenses.map((expense, index) => (
              <div key={expense.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: expense.color }}
                  ></div>
                  <span className="text-gray-300">{expense.category}</span>
                </div>
                <span className="text-white font-medium">
                  {expense.amount >= 100000 
                    ? `₹${(expense.amount / 100000).toFixed(1)}L`
                    : expense.amount >= 1000
                    ? `₹${(expense.amount / 1000).toFixed(0)}K`
                    : `₹${expense.amount.toLocaleString('en-IN')}`}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Cash Flow Chart */}
      <motion.div
        key={`cashflow-chart-${selectedTimeframe}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Cash Flow Analysis</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={financialData.cashFlow}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={(value) => {
              if (value >= 100000) {
                return `₹${(value / 100000).toFixed(1)}L`;
              } else if (value >= 1000) {
                return `₹${(value / 1000).toFixed(0)}K`;
              } else {
                return `₹${value}`;
              }
            }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name) => {
                let formattedValue;
                if (value >= 100000) {
                  formattedValue = `₹${(value / 100000).toFixed(2)}L`;
                } else if (value >= 1000) {
                  formattedValue = `₹${(value / 1000).toFixed(0)}K`;
                } else {
                  formattedValue = `₹${value.toLocaleString('en-IN')}`;
                }
                return [formattedValue, name];
              }}
            />
            <Bar dataKey="inflow" fill="#10B981" name="Cash Inflow" />
            <Bar dataKey="outflow" fill="#EF4444" name="Cash Outflow" />
            <Bar dataKey="net" fill="#3B82F6" name="Net Cash Flow" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Financial Insights */}
      <motion.div
        key={`insights-${selectedTimeframe}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Financial Insights - {selectedTimeframe === 'month' ? 'Monthly' : selectedTimeframe === 'quarter' ? 'Quarterly' : 'Yearly'} View</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedTimeframe === 'month' && (
            <>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Monthly Growth</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Revenue increased by 7% this month to ₹14.5L, driven by increased order volume and better pricing strategies.
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Cost Control</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Operating costs are well-controlled at 65% of revenue (₹9.5L), with opportunities to optimize technology expenses.
                </p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Seasonal Alert</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Monitor Q4 cash flow closely as seasonal variations may impact working capital requirements.
                </p>
              </div>
            </>
          )}
          {selectedTimeframe === 'quarter' && (
            <>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Quarterly Performance</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Q3 2024 shows exceptional growth of 55.5% (₹38.5L revenue), indicating strong market expansion in Indian operations.
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Profit Margins</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Quarterly profit margins improved to 29.6% (₹11.4L profit), reflecting better operational efficiency and cost management.
                </p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-medium">Investment Focus</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Strong quarterly performance allows for strategic investments in technology and market expansion.
                </p>
              </div>
            </>
          )}
          {selectedTimeframe === 'year' && (
            <>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Annual Growth</span>
                </div>
                <p className="text-gray-300 text-sm">
                  2024 revenue growth of 18.8% (₹1.34Cr) represents the strongest annual performance in company history.
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Long-term Trends</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Consistent year-over-year growth demonstrates sustainable business model and market positioning.
                </p>
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  <span className="text-indigo-400 font-medium">Strategic Planning</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Strong 5-year trajectory (₹75L to ₹1.34Cr) supports expansion plans and technology infrastructure investments.
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FinancialAgent;
