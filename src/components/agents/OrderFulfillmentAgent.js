'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const OrderFulfillmentAgent = ({ isAgentRunning, onRunAgent }) => {
  const [fulfillmentResults, setFulfillmentResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineData, setPipelineData] = useState({
    'Order Received': 0,
    'Processing': 0,
    'Picking': 0,
    'Packing': 0,
    'Shipped': 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshPipelineData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const orders = await response.json();
      
      // Check if response contains an error
      if (orders.error) {
        throw new Error(orders.error);
      }
      
      console.log('Fetched orders:', orders); // Debug log
      
      // Process orders data to get pipeline statistics
      const stats = {
        'Order Received': orders.length, // Total orders
        'Processing': orders.filter(order => 
          order.status === 'Processing' || 
          (order.status === 'Ready to Dispatch' && !order.actual_dispatch_date)
        ).length,
        'Picking': orders.filter(order => 
          order.status === 'Ready to Dispatch' && 
          order.actual_dispatch_date && 
          !order.is_delivered
        ).length,
        'Packing': orders.filter(order => 
          order.status === 'Repacking'
        ).length,
        'Shipped': orders.filter(order => 
          order.is_delivered === true
        ).length
      };
      
      console.log('Processed pipeline stats:', stats); // Debug log
      setPipelineData(stats);
      console.log('Pipeline data updated successfully:', stats); // Debug log
      
    } catch (error) {
      console.error('Error fetching orders data:', error);
      // Keep existing data on error, but show an error message
      // Only show error notification, don't change the pipeline data
      alert('Failed to refresh pipeline data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load pipeline data on component mount
  useEffect(() => {
    console.log('Component mounted, loading initial pipeline data...'); // Debug log
    refreshPipelineData();
  }, []);

  const handleRunFulfillmentAgentFunc = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/run-order-fulfillment-agent', {
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
      console.log('Full API Response:', data); // Debug log
      
      // Check if response has results directly
      if (data.results && Array.isArray(data.results)) {
        console.log('Found direct results:', data.results);
        const processedResults = {
          status: 'completed',
          results: data.results
        };
        setFulfillmentResults(processedResults);
        return;
      }
      
      if (data.messages && data.messages.length > 0) {
        console.log('Available messages:', data.messages.map(msg => ({ 
          type: msg.type, 
          source: msg.source, 
          hasContent: !!msg.content,
          contentType: typeof msg.content,
          contentPreview: typeof msg.content === 'string' ? msg.content.substring(0, 50) : 'object'
        })));
        
        // Find the OrderResponseAgent message with the final results
        const resultMessage = data.messages.find(msg => 
          msg.source === 'OrderResponseAgent' && 
          msg.type === 'TextMessage' && 
          msg.content && 
          typeof msg.content === 'string'
        );
        
        if (resultMessage) {
          try {
            console.log('Found result message:', resultMessage); // Debug log
            let content = resultMessage.content;
            
            // Handle different content formats
            if (typeof content === 'string') {
              // Remove TERMINATE if present and extract JSON
              content = content.replace(/\s*TERMINATE\s*$/, '').trim();
              console.log('Content after cleanup:', content); // Debug log
              console.log('Content length:', content.length); // Debug log
              console.log('First 200 chars:', content.substring(0, 200)); // Debug log
              
              // Check if content is empty or invalid
              if (!content || content.length === 0) {
                throw new Error('Content is empty after cleanup');
              }
              
              // Try to parse as JSON
              try {
                const results = JSON.parse(content);
                console.log('Parsed results:', results); // Debug log
                
                // Handle both success and error responses from the API
                if (results && typeof results === 'object') {
                  console.log('Final processed results:', results);
                  
                  // Check if this is an error response from the API
                  if (results.status === 'error') {
                    setFulfillmentResults({
                      status: 'error',
                      error: results.message || 'API returned an error',
                      results: []
                    });
                    return;
                  }
                  
                  // Handle success responses
                  if (!results.status) {
                    results.status = 'completed';
                  }
                  
                  // Ensure results array exists
                  if (!results.results && Array.isArray(results)) {
                    results = { status: 'completed', results: results };
                  }
                  
                  setFulfillmentResults(results);
                } else {
                  throw new Error('Results is not a valid object');
                }
              } catch (jsonError) {
                console.error('JSON parse error:', jsonError);
                console.log('Raw content that failed JSON parse:', content);
                // Try to extract JSON from the content if it's embedded
                const jsonMatch = content.match(/\{.*\}/s);
                if (jsonMatch) {
                  console.log('Found JSON match:', jsonMatch[0]);
                  try {
                    const results = JSON.parse(jsonMatch[0]);
                    console.log('Successfully parsed extracted JSON:', results);
                    setFulfillmentResults(results);
                  } catch (extractError) {
                    console.error('Failed to parse extracted JSON:', extractError);
                    throw new Error('Failed to parse JSON content');
                  }
                } else {
                  throw new Error('No valid JSON found in content');
                }
              }
            } else if (typeof content === 'object') {
              // Content is already an object
              setFulfillmentResults(content);
            }
          } catch (parseError) {
            console.error('Error parsing results:', parseError);
            console.log('Raw content that failed to parse:', resultMessage.content);
            
            // Try alternative parsing approaches
            try {
              // Look for ToolCallExecutionEvent with results as fallback
              const toolCallEvent = data.messages.find(msg => 
                msg.type === 'ToolCallExecutionEvent' && 
                msg.content && 
                Array.isArray(msg.content) && 
                msg.content[0] && 
                msg.content[0].content
              );
              
              // Also try ToolCallSummaryMessage as another fallback
              const summaryMessage = data.messages.find(msg => 
                msg.type === 'ToolCallSummaryMessage' && msg.content
              );
              
              let alternativeContent = null;
              
              if (toolCallEvent) {
                console.log('Found tool call event as fallback:', toolCallEvent); // Debug log
                alternativeContent = toolCallEvent.content[0].content;
              } else if (summaryMessage) {
                console.log('Found summary message as fallback:', summaryMessage); // Debug log
                alternativeContent = summaryMessage.content;
              }
              
              if (alternativeContent) {
                // Parse Python-style string representation
                if (typeof alternativeContent === 'string') {
                  // Replace Python syntax with JavaScript
                  alternativeContent = alternativeContent.replace(/'/g, '"')
                                                       .replace(/None/g, 'null')
                                                       .replace(/True/g, 'true')
                                                       .replace(/False/g, 'false')
                                                       .replace(/\s*TERMINATE\s*$/, '').trim();
                  
                  const parsedResults = JSON.parse(alternativeContent);
                  console.log('Successfully parsed from fallback:', parsedResults); // Debug log
                  
                  // Ensure proper structure
                  if (parsedResults && typeof parsedResults === 'object') {
                    // Check if this is an error response from the fallback
                    if (parsedResults.status === 'error') {
                      setFulfillmentResults({
                        status: 'error',
                        error: parsedResults.message || 'API returned an error from fallback parsing',
                        results: []
                      });
                      return;
                    }
                    
                    if (!parsedResults.status) {
                      parsedResults.status = 'completed';
                    }
                    if (!parsedResults.results && Array.isArray(parsedResults)) {
                      parsedResults = { status: 'completed', results: parsedResults };
                    }
                    setFulfillmentResults(parsedResults);
                  } else {
                    throw new Error('Fallback results is not a valid object');
                  }
                } else {
                  setFulfillmentResults(alternativeContent);
                }
              } else {
                throw new Error('No valid results found in any message');
              }
            } catch (secondParseError) {
              console.error('Secondary parsing also failed:', secondParseError);
              // Show error state instead of fallback data
              setFulfillmentResults({
                status: 'error',
                error: 'Failed to parse API response',
                results: []
              });
            }
          }
        } else {
          console.error('No result message found in API response');
          setFulfillmentResults({
            status: 'error',
            error: 'No results found in API response',
            results: []
          });
        }
      } else {
        console.error('Invalid API response structure');
        setFulfillmentResults({
          status: 'error',
          error: 'Invalid API response structure',
          results: []
        });
      }
    } catch (error) {
      console.error('Error calling order fulfillment agent API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const KPICard = ({ title, value, change, trend, icon }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/70 mb-1">{title}</p>
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-white">{value}</span>
            <div className={`flex items-center space-x-1 ${
              trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              <span className="text-xl">{trend === 'up' ? '↗' : '↘'}</span>
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          </div>
          <p className="text-xs text-white/60 mt-1">
            {trend === 'up' ? 'Increase' : 'Decrease'} from last month
          </p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </motion.div>
  );

  const GlassPieChart = ({ percentage, title, color = "#8B5CF6" }) => (
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
  );

  const GlassBarChart = ({ data, title, color = "#8B5CF6" }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
    >
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white/90">{item.label}</span>
              <span className="text-sm text-white/70">{item.value}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className="h-3 rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${color}80, ${color})` 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      key="fulfillment"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Order Fulfillment Agent</h2>
      
      {/* Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Ready to Dispatch" value="145" change={8.2} trend="up" icon="📦" />
        <KPICard title="Repacking" value="23" change={-15.3} trend="down" icon="🔧" />
        <KPICard title="Delivered" value="890" change={12.5} trend="up" icon="✅" />
        <KPICard title="Returned" value="12" change={-8.7} trend="down" icon="↩️" />
      </div>

      {/* Run Agent Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
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
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 overflow-hidden">
                <motion.img 
                  src="/assets/fulfillment.png" 
                  alt="Order Fulfillment Agent" 
                  className="w-16 h-16 object-contain drop-shadow-2xl"
                  animate={{ 
                    scale: [1, 1.1, 1, 1.05, 1],
                    rotate: [0, 3, 0, -3, 0],
                  }}
                  transition={{ 
                    duration: 3.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Order Fulfillment Agent</h3>
              <p className="text-white/70">Process orders, quality checks, and dispatch management</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRunFulfillmentAgentFunc}
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:border-white/20 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Running Agent...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>🚚</span>
                <span>Run Order Fulfillment Agent</span>
              </div>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* API Results Section - Shows after running the agent */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">� Order Fulfillment Agent Results</h3>
        </div>
        {fulfillmentResults ? (
          fulfillmentResults.status === 'error' ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Agent Processing Error</h3>
              <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 mb-4 max-w-2xl mx-auto">
                <p className="text-red-200/90 text-sm font-mono break-words">
                  {fulfillmentResults.error || 'An unknown error occurred'}
                </p>
              </div>
              <p className="text-red-200/60 text-sm mb-4">
                This appears to be a backend processing error. Please check the agent configuration or try again.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRunFulfillmentAgentFunc}
                className="px-6 py-2 bg-red-500/20 border border-red-400/30 text-red-200 rounded-lg hover:bg-red-500/30 transition-all duration-300"
              >
                🔄 Retry Agent
              </motion.button>
            </div>
          ) : (
            <>
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/70">Total Orders</div>
                <div className="text-2xl font-bold text-blue-400">{fulfillmentResults.results?.length || 0}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/70">Ready to Dispatch</div>
                <div className="text-2xl font-bold text-green-400">
                  {fulfillmentResults.results?.filter(r => r.status === 'Ready to Dispatch' || r.status === 'success').length || 0}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/70">Failed/Repacking</div>
                <div className="text-2xl font-bold text-red-400">
                  {fulfillmentResults.results?.filter(r => r.status === 'failed').length || 0}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-white/70">Success Rate</div>
                <div className="text-2xl font-bold text-purple-400">
                  {fulfillmentResults.results ? 
                    Math.round((fulfillmentResults.results.filter(r => r.status === 'Ready to Dispatch' || r.status === 'success').length / fulfillmentResults.results.length) * 100) : 0}%
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Packing Material</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {fulfillmentResults.results?.map((result, index) => (
                    <motion.tr 
                      key={`${result.order_id}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="hover:bg-white/5 transition-all duration-300"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-white">#{result.order_id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${
                          result.status === 'Ready to Dispatch' || result.status === 'success' 
                            ? 'bg-green-500/20 text-green-200 border-green-400/30' 
                            : 'bg-red-500/20 text-red-200 border-red-400/30'
                        }`}>
                          {result.status === 'success' ? '✅ Success' : 
                           result.status === 'Ready to Dispatch' ? '📦 Ready' : 
                           '❌ Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">{result.message}</td>
                      <td className="px-6 py-4 text-sm text-white">
                        {result.packing_material_used ? (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded-lg text-xs">
                            {result.packing_material_used} units
                          </span>
                        ) : (
                          <span className="text-white/40">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {result.packing_material_size ? (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded-lg text-xs">
                            Size {result.packing_material_size}
                          </span>
                        ) : (
                          <span className="text-white/40">N/A</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
          )
        ) : (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold text-white mb-2">Order Fulfillment Agent Results</h3>
            <p className="text-white/60">Run the agent above to see processing results and order status updates</p>
          </div>
        )}
      </motion.div>

      {/* Fulfillment Pipeline Visualization */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">🔄 Fulfillment Pipeline</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshPipelineData}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 rounded-lg hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
          >
            {isRefreshing ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-blue-200/30 border-t-blue-200 rounded-full"
                />
                <span className="text-sm">Refreshing...</span>
              </>
            ) : (
              <>
                <span className="text-sm">🔄</span>
                <span className="text-sm">Refresh Data</span>
              </>
            )}    
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { stage: 'Order Received', count: pipelineData['Order Received'], color: 'from-blue-500 to-cyan-500', icon: '📝' },
            { stage: 'Processing', count: pipelineData['Processing'], color: 'from-yellow-500 to-orange-500', icon: '⚙️' },
            { stage: 'Picking', count: pipelineData['Picking'], color: 'from-purple-500 to-pink-500', icon: '📦' },
            { stage: 'Packing', count: pipelineData['Packing'], color: 'from-green-500 to-emerald-500', icon: '📮' },
            { stage: 'Shipped', count: pipelineData['Shipped'], color: 'from-indigo-500 to-blue-500', icon: '🚚' }
          ].map((stage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${stage.color} bg-opacity-20 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center hover:border-white/20 transition-all duration-300 ${isRefreshing ? 'opacity-60' : ''}`}
            >
              <div className="text-2xl mb-2">{stage.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">
                {isRefreshing ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mx-auto"
                  />
                ) : (
                  stage.count
                )}
              </div>
              <div className="text-sm text-white/80">{stage.stage}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPieChart percentage={84} title="Order Success Rate" color="#10B981" />
        <GlassPieChart percentage={92} title="On-Time Delivery" color="#6366F1" />
        <GlassBarChart
          title="Fulfillment Metrics"
          data={[
            { label: 'Accuracy', value: 96 },
            { label: 'Speed', value: 88 },
            { label: 'Quality', value: 94 },
            { label: 'Satisfaction', value: 91 }
          ]}
          color="#EC4899"
        />
      </div>

      {/* Recent Activity Feed */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
      >
        <h3 className="text-lg font-semibold text-white mb-6">📈 Recent Activity</h3>
        <div className="space-y-4">
          {[
            { time: '2 mins ago', action: 'Order ORD-456 shipped to customer', status: 'success', icon: '✅' },
            { time: '5 mins ago', action: 'Packaging completed for ORD-789', status: 'info', icon: '📦' },
            { time: '8 mins ago', action: 'Quality check passed for ORD-123', status: 'success', icon: '🔍' },
            { time: '12 mins ago', action: 'Order ORD-234 requires repacking', status: 'warning', icon: '⚠️' },
            { time: '15 mins ago', action: 'New order ORD-567 received', status: 'info', icon: '📝' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.status === 'success' ? 'bg-green-500/20 text-green-400' :
                activity.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm text-white">{activity.action}</div>
                <div className="text-xs text-white/60">{activity.time}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>


    </motion.div>
  );
};

export default OrderFulfillmentAgent;
