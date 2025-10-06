'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity, Clock, Users, Truck, Package, AlertCircle, CheckCircle, TrendingUp, Settings, Zap } from 'lucide-react';

const OperationalAgent = ({ isAgentRunning, onRunAgent }) => {
  const [selectedView, setSelectedView] = useState('overview');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Operational data
  const operationalData = {
    efficiency: [
      { period: 'Jan 2024', warehouses: 92, fulfillment: 88, delivery: 85, overall: 88.3 },
      { period: 'Feb 2024', warehouses: 94, fulfillment: 90, delivery: 87, overall: 90.3 },
      { period: 'Mar 2024', warehouses: 91, fulfillment: 89, delivery: 89, overall: 89.7 },
      { period: 'Apr 2024', warehouses: 95, fulfillment: 92, delivery: 88, overall: 91.7 },
      { period: 'May 2024', warehouses: 96, fulfillment: 94, delivery: 91, overall: 93.7 },
      { period: 'Jun 2024', warehouses: 93, fulfillment: 91, delivery: 89, overall: 91.0 },
      { period: 'Jul 2024', warehouses: 97, fulfillment: 95, delivery: 92, overall: 94.7 },
      { period: 'Aug 2024', warehouses: 95, fulfillment: 93, delivery: 90, overall: 92.7 },
      { period: 'Sep 2024', warehouses: 98, fulfillment: 96, delivery: 94, overall: 96.0 },
    ],
    utilization: [
      { resource: 'Warehouse Space', current: 78, target: 85, status: 'good' },
      { resource: 'Staff Capacity', current: 92, target: 90, status: 'warning' },
      { resource: 'Vehicle Fleet', current: 88, target: 85, status: 'excellent' },
      { resource: 'Equipment', current: 84, target: 90, status: 'attention' },
      { resource: 'Technology', current: 95, target: 92, status: 'excellent' },
    ],
    incidents: [
      { type: 'Delay', count: 12, severity: 'medium', trend: -25 },
      { type: 'Quality Issues', count: 3, severity: 'low', trend: -60 },
      { type: 'Equipment Failure', count: 2, severity: 'high', trend: 0 },
      { type: 'Staff Shortage', count: 5, severity: 'medium', trend: -40 },
      { type: 'System Downtime', count: 1, severity: 'high', trend: -80 },
    ],
    productivity: [
      { department: 'Inbound', efficiency: 94, target: 90, improvement: '+4%' },
      { department: 'Storage', efficiency: 88, target: 85, improvement: '+3%' },
      { department: 'Picking', efficiency: 96, target: 92, improvement: '+4%' },
      { department: 'Packing', efficiency: 91, target: 88, improvement: '+3%' },
      { department: 'Shipping', efficiency: 89, target: 85, improvement: '+4%' },
    ]
  };

  const kpiMetrics = [
    {
      title: 'Overall Efficiency',
      value: '96.0%',
      change: '+3.3%',
      trend: 'up',
      icon: Activity,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Order Fulfillment',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: Package,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Staff Utilization',
      value: '92%',
      change: '+2%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Avg. Processing Time',
      value: '2.4h',
      change: '-15%',
      trend: 'up',
      icon: Clock,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const runOperationalOptimization = () => {
    setIsOptimizing(true);
    onRunAgent('operational');
    setTimeout(() => {
      setIsOptimizing(false);
    }, 3000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'attention': return 'text-red-400';
      default: return 'text-gray-400';
    }
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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            ⚙️ Operational Agent
          </h2>
          <p className="text-gray-400 mt-2">Monitor operational efficiency and resource utilization</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runOperationalOptimization}
          disabled={isOptimizing}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
        >
          {isOptimizing ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Zap className="w-5 h-5" />
          )}
          <span>{isOptimizing ? 'Optimizing...' : 'Run Optimization'}</span>
        </motion.button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color}`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">{metric.change}</span>
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">{metric.title}</h3>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* View Selector */}
      <div className="flex space-x-4">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'efficiency', label: 'Efficiency' },
          { id: 'resources', label: 'Resources' },
          { id: 'incidents', label: 'Incidents' }
        ].map((view) => (
          <motion.button
            key={view.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedView(view.id)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedView === view.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {view.label}
          </motion.button>
        ))}
      </div>

      {/* Operational Efficiency Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Operational Efficiency Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={operationalData.efficiency}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="period" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="warehouses" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              name="Warehouse Efficiency"
            />
            <Line 
              type="monotone" 
              dataKey="fulfillment" 
              stroke="#06B6D4" 
              strokeWidth={3}
              name="Fulfillment Rate"
            />
            <Line 
              type="monotone" 
              dataKey="delivery" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Delivery Performance"
            />
            <Line 
              type="monotone" 
              dataKey="overall" 
              stroke="#F59E0B" 
              strokeWidth={4}
              name="Overall Efficiency"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Utilization */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Resource Utilization</h3>
          <div className="space-y-4">
            {operationalData.utilization.map((resource, index) => (
              <div key={resource.resource} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{resource.resource}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getStatusColor(resource.status)}`}>
                      {resource.current}%
                    </span>
                    <span className="text-xs text-gray-500">/ {resource.target}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      resource.status === 'excellent' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                      resource.status === 'good' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                      resource.status === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                      'bg-gradient-to-r from-red-500 to-pink-600'
                    }`}
                    style={{ width: `${resource.current}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Department Productivity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Department Productivity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={operationalData.productivity} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="department" type="category" stroke="#9CA3AF" width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="efficiency" fill="#8B5CF6" name="Current Efficiency" />
              <Bar dataKey="target" fill="#374151" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Incidents and Issues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Operational Incidents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {operationalData.incidents.map((incident, index) => (
            <div 
              key={incident.type}
              className={`p-4 rounded-lg border ${getSeverityColor(incident.severity)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  incident.trend < 0 ? 'bg-green-500/20 text-green-400' :
                  incident.trend > 0 ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {incident.trend}%
                </span>
              </div>
              <h4 className="font-medium text-white mb-1">{incident.type}</h4>
              <p className="text-2xl font-bold mb-1">{incident.count}</p>
              <p className="text-xs opacity-75">This month</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Operational Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Operational Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">High Performance</span>
            </div>
            <p className="text-gray-300 text-sm">
              Warehouse efficiency is at 98%, exceeding targets. Consider expanding capacity to accommodate growth.
            </p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Optimization Needed</span>
            </div>
            <p className="text-gray-300 text-sm">
              Staff utilization is at 92%, above target. Consider workforce planning adjustments to prevent burnout.
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">System Health</span>
            </div>
            <p className="text-gray-300 text-sm">
              Technology systems running at 95% efficiency. Incident reduction of 40% shows improved reliability.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OperationalAgent;
