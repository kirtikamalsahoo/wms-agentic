'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, BarChart, PieChart } from '@mui/x-charts';
import { Box } from '@mui/material';
import { ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { warehouses, getProductsByWarehouse, getWarehouseById } from '../../utils/data';
import warehouseProducts from '../../data/WareHouseProduct.js';
import InboundAgent from '../agents/InboundAgent';
import ProcurementAgent from '../agents/ProcurementAgent';
import OrderFulfillmentAgent from '../agents/OrderFulfillmentAgent';
import ReturnAgent from '../agents/ReturnAgent';
import FinancialAgent from '../agents/FinancialAgent';
import OperationalAgent from '../agents/OperationalAgent';

// Typewriter Text Component with Infinite Loop
const TypewriterText = ({ text, delay = 0, speed = 50, eraseSpeed = 30, eraseDelay = 2000 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout;

    const startTyping = () => {
      if (!isErasing && currentIndex < text.length) {
        // Typing forward
        timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, speed);
      } else if (!isErasing && currentIndex === text.length) {
        // Finished typing, wait before erasing
        timeout = setTimeout(() => {
          setIsErasing(true);
        }, eraseDelay);
      } else if (isErasing && currentIndex > 0) {
        // Erasing backward
        timeout = setTimeout(() => {
          setCurrentIndex(currentIndex - 1);
          setDisplayedText(text.slice(0, currentIndex - 1));
        }, eraseSpeed);
      } else if (isErasing && currentIndex === 0) {
        // Finished erasing, start over
        setIsErasing(false);
        timeout = setTimeout(() => {
          setCurrentIndex(0);
        }, 300);
      }
    };

    // Start after initial delay only on first run
    if (currentIndex === 0 && !isErasing && displayedText === '') {
      timeout = setTimeout(startTyping, delay);
    } else {
      startTyping();
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, isErasing, text, delay, speed, eraseSpeed, eraseDelay, displayedText]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span>
      {displayedText}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        className="text-purple-400"
      >
        |
      </motion.span>
    </span>
  );
};

const ManagerDashboard = ({ user, onLogout }) => {
  const router = useRouter();
  const [activeAgent, setActiveAgent] = useState('analytics');
  const [showTaskPlannerModal, setShowTaskPlannerModal] = useState(false);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [forecastFilter, setForecastFilter] = useState('monthly');
  const [agentResults, setAgentResults] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Function to get display name based on username
  const getDisplayName = (username) => {
    const userDisplayNames = {
      'manager': 'Sudhanshu',
      'chinmay': 'Chinmay'
    };
    return userDisplayNames[username.toLowerCase()] || username;
  };
  
  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isBot: true, timestamp: new Date() }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [returnData, setReturnData] = useState({
    totalReturns: 156,
    pendingInspection: 23,
    processedReturns: 133,
    thisMonth: 45
  });
  const [returnsData, setReturnsData] = useState([]);
  const [isLoadingReturns, setIsLoadingReturns] = useState(false);
  
  // Forecast form state
  const [forecastForm, setForecastForm] = useState({
    timeInterval: '',
    warehouse: '',
    category: '',
    subcategory: ''
  });
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiWarehouses, setApiWarehouses] = useState([]);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
  const [forecastResults, setForecastResults] = useState(null);
  const [forecastError, setForecastError] = useState(null);

  // Category hierarchy data
  const categoryHierarchy = {
    'Electronics': {
      icon: '📱',
      subcategories: {
        'Phones': ['iPhone 15 Pro', 'Samsung Galaxy S24', 'OnePlus 12', 'Google Pixel 8', 'Xiaomi 14'],
        'Laptops': ['MacBook Pro', 'Dell XPS 13', 'HP Spectre', 'Gaming Laptop', 'ThinkPad X1']
      }
    },
    'Household': {
      icon: '🏠',
      subcategories: {
        'Grocery': ['Organic Honey', 'Premium Coffee', 'Imported Tea', 'Olive Oil', 'Quinoa'],
        'Daily Needs': ['Detergent', 'Shampoo', 'Toothpaste', 'Soap', 'Tissue Paper']
      }
    },
    'Fashion': {
      icon: '👕',
      subcategories: {
        'Mens': ['Premium Shirts', 'Casual T-Shirts', 'Formal Pants', 'Jeans', 'Polo Shirts'],
        'Womens': ['Designer Dresses', 'Blouses', 'Skirts', 'Tops', 'Palazzo Pants'],
        'Shoes': ['Running Shoes', 'Formal Shoes', 'Sneakers', 'Sandals', 'Boots']
      }
    },
    'Accessories': {
      icon: '🔌',
      subcategories: {
        'Phone': ['Phone Cases', 'Screen Protectors', 'Chargers', 'Power Banks', 'Earphones'],
        'Laptop': ['Laptop Bags', 'Mouse', 'Keyboards', 'Webcams', 'USB Hubs']
      }
    }
  };
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  // Function to generate default forecast chart data
  const getDefaultForecastData = () => {
    return {
      monthly: [
        { month: 'Jan', predicted: 2400, actual: 2200, variance: -8.3 },
        { month: 'Feb', predicted: 2600, actual: 2450, variance: -5.8 },
        { month: 'Mar', predicted: 2800, actual: 2700, variance: -3.6 },
        { month: 'Apr', predicted: 3000, actual: 2900, variance: -3.3 },
        { month: 'May', predicted: 3200, actual: 3100, variance: -3.1 },
        { month: 'Jun', predicted: 3400, actual: 3350, variance: -1.5 },
      ],
      weekly: [
        { week: 'W1', predicted: 600, actual: 580, variance: -3.3 },
        { week: 'W2', predicted: 650, actual: 620, variance: -4.6 },
        { week: 'W3', predicted: 700, actual: 690, variance: -1.4 },
        { week: 'W4', predicted: 750, actual: 720, variance: -4.0 },
      ]
    };
  };

  // Function to generate dynamic forecast chart data from API results
  const generateForecastChartData = () => {
    if (!forecastResults || !forecastResults.result) {
      // Default data when no forecast results
      return getDefaultForecastData();
    }

    try {
      // Use the same robust parsing logic
      const parseChartAPIResponse = (resultString) => {
        try {
          // Remove common prefixes/suffixes
          resultString = resultString.replace(/^TERMINATE\s*/, '');
          resultString = resultString.replace(/\s*TERMINATE$/, '');
          
          // Handle markdown-formatted JSON (```json ... ```)
          const jsonCodeBlockMatch = resultString.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          if (jsonCodeBlockMatch) {
            resultString = jsonCodeBlockMatch[1];
          }
          
          // Handle cases where the response might have extra text before/after JSON
          const jsonMatch = resultString.match(/(\{[\s\S]*\})/);
          if (jsonMatch) {
            resultString = jsonMatch[1];
          }
          
          return JSON.parse(resultString);
          
        } catch (error) {
          console.error('Chart JSON parsing failed:', error);
          throw error;
        }
      };

      // Parse the forecast results from API
      const parsedResult = parseChartAPIResponse(forecastResults.result);
      
      // Use aggregated_forecast for chart data if available, otherwise use individual forecast
      const apiforecastData = parsedResult.aggregated_forecast || parsedResult.forecast || [];
      
      // If no data, return default but don't set error state here (causes infinite re-renders)
      if (apiforecastData.length === 0) {
        return getDefaultForecastData();
      }

      // Convert API data to chart format (already filtered for positive values)
      const chartData = apiforecastData.map((item, index) => {
          const originalPredicted = parseFloat(item.predicted_quantity) || 0;
          const predicted = Math.round(originalPredicted);
          // Generate simulated actual data (85-95% of predicted for realistic variance)
          const actual = Math.round(predicted * (0.85 + Math.random() * 0.1));
          const variance = predicted !== 0 ? ((actual - predicted) / predicted * 100).toFixed(1) : 0;
          
          // Format the date from week_of field
          const weekOf = item.week_of || `Week ${index + 1}`;
          const formattedDate = new Date(weekOf).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          
          // Extract product information
          const productName = item.product_name || item.product || forecastForm.subcategory || 'Product';
          
          return {
            period: formattedDate || `Week ${index + 1}`,
            predicted: predicted,
            actual: actual,
            variance: parseFloat(variance),
            date: weekOf,
            isOverstock: false, // Only positive items now
            originalValue: originalPredicted,
            productName: productName,
            overstockUnits: 0 // No overstock units in filtered data
          };
        });

      return {
        weekly: chartData,
        monthly: chartData // Use same data for both views for now
      };
    } catch (error) {
      console.error('Error parsing forecast data for chart:', error);
      console.log('Raw forecast result for chart:', forecastResults.result);
      // Don't set error state here (causes infinite re-renders)
      return getDefaultForecastData(); // Return default on error
    }
  };

  // Dynamic forecast data based on API results
  const forecastData = generateForecastChartData();

  // Data moved to individual agent components for better organization

  const kpiData = {
    totalRevenue: { value: 1450000, change: 12.5, trend: 'up' }, // ₹14.5L
    totalOrders: { value: 287, change: -5.2, trend: 'down' },
    activeSuppliers: { value: 23, change: 8.7, trend: 'up' },
    fulfillmentRate: { value: 94.2, change: 2.1, trend: 'up' }
  };

  const runAgent = (agentType) => {
    setIsAgentRunning(true);
    setTimeout(() => {
      setIsAgentRunning(false);
      setAgentResults({
        type: agentType,
        timestamp: new Date().toLocaleTimeString(),
        status: 'success'
      });
    }, 3000);
  };

  // Fetch return data from API - using useCallback to prevent recreating function
  const fetchReturnData = useCallback(async () => {
    try {
      const response = await fetch('/api/returns');
      if (response.ok) {
        const data = await response.json();
        setReturnData({
          totalReturns: data.totalReturns || 156,
          pendingInspection: data.pendingInspection || 23,
          processedReturns: data.processedReturns || 133,
          thisMonth: data.thisMonth || 45
        });
      } else {
        console.error('Failed to fetch return data');
      }
    } catch (error) {
      console.error('Error fetching return data:', error);
    }
  }, []);

  // Fetch detailed returns data for the ReturnAgent
  const fetchReturnsData = useCallback(async () => {
    setIsLoadingReturns(true);
    try {
      const response = await fetch('/api/returns');
      if (response.ok) {
        const data = await response.json();
        setReturnsData(data);
        console.log('Returns data fetched:', data);
        
        // Also update the summary stats
        setReturnData({
          totalReturns: data.totalReturns || data.length || 156,
          pendingInspection: data.pendingInspection || data.filter(r => r.status === 'pending inspection').length || 23,
          processedReturns: data.processedReturns || data.filter(r => r.status === 'completed').length || 133,
          thisMonth: data.thisMonth || 45
        });
      } else {
        console.error('Failed to fetch returns data');
      }
    } catch (error) {
      console.error('Error fetching returns:', error);
    } finally {
      setIsLoadingReturns(false);
    }
  }, []);

  // Manual refresh function - no automatic fetch on mount
  // fetchReturnData will only be called when manually triggered

  // Forecast form handlers
  const handleForecastSubmit = async (e) => {
    e.preventDefault();
    if (!forecastForm.timeInterval || !forecastForm.warehouse || !forecastForm.category || !forecastForm.subcategory) {
      alert('Please fill in all required fields: Time Interval, Warehouse, Category, and Subcategory.');
      return;
    }
    
    setIsLoadingForecast(true);
    setShowLoadingOverlay(true);
    setForecastError(null); // Clear any previous errors
    
    try {
      // Map time interval to periods (weeks)
      const periodsMapping = {
        'daily': 2,
        'weekly': 4,
        'monthly': 6,
        'quarterly': 8
      };
      
      const periods = periodsMapping[forecastForm.timeInterval] || 0;
      const warehouse_id = parseInt(forecastForm.warehouse);
      
      // Capitalize first letter of category and subcategory
      const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
      
      // Prepare API payload
      const apiPayload = {
        dbname: "Warehouse_DB",
        user: "wms_user",
        password: "Wams-2025",
        host: "wmsdb.postgres.database.azure.com",
        port: 5432,
        periods: periods,
        warehouse_id: warehouse_id,
        category: capitalizeFirstLetter(forecastForm.category),
        sub_category: capitalizeFirstLetter(forecastForm.subcategory)
      };
      
      console.log('🚀 Calling Forecast API with payload:', apiPayload);
      
      // Using Next.js API proxy to call the new forecast endpoint
      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(apiPayload)
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        // Success - show the forecast results
        const selectedWarehouse = apiWarehouses.find(w => w.warehouse_id === warehouse_id) || 
                                 getWarehouseById(warehouse_id);
        
        console.log('✅ Forecast API Response:', responseData);
        
        // Enhanced parsing function to handle different response formats
        const parseAPIResponse = (responseData) => {
          try {
            let resultString = responseData.result || '';
            
            // Remove common prefixes/suffixes that might interfere with JSON parsing
            resultString = resultString.replace(/^TERMINATE\s*/, '');
            resultString = resultString.replace(/\s*TERMINATE$/, '');
            
            // Handle markdown-formatted JSON (```json ... ```)
            const jsonCodeBlockMatch = resultString.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
            if (jsonCodeBlockMatch) {
              resultString = jsonCodeBlockMatch[1];
            }
            
            // Handle cases where the response might have extra text before/after JSON
            const jsonMatch = resultString.match(/(\{[\s\S]*\})/);
            if (jsonMatch) {
              resultString = jsonMatch[1];
            }
            
            // Try to parse the cleaned string
            return JSON.parse(resultString);
            
          } catch (error) {
            console.error('JSON parsing failed:', error);
            console.log('Raw result string:', responseData.result);
            
            // If JSON parsing fails, try to extract data using regex patterns
            const resultString = responseData.result || '';
            
            // Try to extract forecast data using regex patterns as fallback
            const forecastPattern = /"(?:aggregated_)?forecast"\s*:\s*\[([\s\S]*?)\]/;
            const narrativePattern = /"narrative"\s*:\s*"([^"]*?)"/;
            
            const forecastMatch = resultString.match(forecastPattern);
            const narrativeMatch = resultString.match(narrativePattern);
            
            // Return a basic structure if patterns are found
            if (forecastMatch || narrativeMatch) {
              const fallbackResult = {};
              
              if (narrativeMatch) {
                fallbackResult.narrative = narrativeMatch[1];
              }
              
              if (forecastMatch) {
                // Try to parse individual forecast items
                try {
                  fallbackResult.forecast = JSON.parse('[' + forecastMatch[1] + ']');
                } catch {
                  // If parsing individual items fails, create empty array
                  fallbackResult.forecast = [];
                }
              }
              
              return fallbackResult;
            }
            
            // If all parsing attempts fail, throw the original error
            throw error;
          }
        };
        
        // Check for no data scenarios in the response
        try {
          const parsedResult = parseAPIResponse(responseData);
          
          console.log('✅ Parsed Forecast Result:', parsedResult);
          
          // Check if there's a narrative indicating no data
          if (parsedResult.narrative && parsedResult.narrative.includes('No forecast data is available')) {
            setForecastError({
              type: 'no_data',
              message: parsedResult.narrative,
              suggestion: 'Try selecting a different category, subcategory, or warehouse that has historical data.'
            });
            setForecastResults(null); // Clear any previous results
          } else {
            // Check if forecast arrays are empty
            const apiforecastData = parsedResult.aggregated_forecast || parsedResult.forecast || [];
            
            // Filter out products with negative forecast values
            let filteredIndividualForecasts = [];
            let filteredAggregatedForecasts = [];

            // Filter individual forecasts (by product)
            if (parsedResult.forecast && parsedResult.forecast.length > 0) {
              filteredIndividualForecasts = parsedResult.forecast.filter(item => {
                const forecastValue = parseFloat(item.predicted_quantity || item.demand_forecast || item.forecast || item.demand || 0);
                return forecastValue > 0;
              });
            }

            // Filter aggregated forecasts (by time period)
            if (parsedResult.aggregated_forecast && parsedResult.aggregated_forecast.length > 0) {
              filteredAggregatedForecasts = parsedResult.aggregated_forecast.filter(item => {
                const forecastValue = parseFloat(item.predicted_quantity || item.demand_forecast || item.forecast || item.demand || 0);
                return forecastValue > 0;
              });
            }

            // Check if we have any positive data
            const hasPositiveData = filteredIndividualForecasts.length > 0 || filteredAggregatedForecasts.length > 0;
            
            if (!hasPositiveData) {
              setForecastError({
                type: 'empty_data',
                message: 'No positive forecast data found for the selected criteria.',
                suggestion: 'All forecasts were negative or zero. Try selecting a different category, subcategory, or warehouse.'
              });
              setForecastResults(null); // Clear any previous results
            } else {
              // Create filtered parsedResult with only positive forecasts
              const filteredParsedResult = {
                ...parsedResult,
                aggregated_forecast: filteredAggregatedForecasts.length > 0 ? filteredAggregatedForecasts : undefined,
                forecast: filteredIndividualForecasts.length > 0 ? filteredIndividualForecasts : undefined
              };
              
              // Create a properly formatted response object with filtered data
              const formattedResponse = {
                ...responseData,
                result: JSON.stringify(filteredParsedResult)
              };
              
              // Store the forecast results for display
              setForecastResults(formattedResponse);
              setForecastError(null); // Clear any previous errors
              
              console.log('✅ Forecast data successfully processed:', {
                originalIndividualCount: parsedResult.forecast ? parsedResult.forecast.length : 0,
                filteredIndividualCount: filteredIndividualForecasts.length,
                originalAggregatedCount: parsedResult.aggregated_forecast ? parsedResult.aggregated_forecast.length : 0,
                filteredAggregatedCount: filteredAggregatedForecasts.length,
                hasNarrative: !!parsedResult.narrative
              });
            }
          }
        } catch (parseError) {
          console.error('Error parsing forecast response:', parseError);
          console.log('Full response object:', responseData);
          
          setForecastError({
            type: 'parse_error',
            message: `Unable to parse forecast data: ${parseError.message}`,
            suggestion: 'The API response format is unexpected. Please try again or contact support if the issue persists.'
          });
          setForecastResults(null);
        }
        
        // Hide loading overlay after a brief delay to show completion
        setTimeout(() => {
          setIsLoadingForecast(false);
          setShowLoadingOverlay(false);
        }, 1000);
        
      } else {
        // API returned an error
        console.error('❌ Forecast API Error:', responseData);
        setForecastError({
          type: 'api_error',
          message: responseData.message || responseData.error || 'The forecast API returned an error.',
          suggestion: 'Please check your database connection and ensure the warehouse has sufficient historical data.'
        });
        setIsLoadingForecast(false);
        setShowLoadingOverlay(false);
      }
      
    } catch (error) {
      console.error('❌ Network/Request Error:', error);
      setForecastError({
        type: 'network_error',
        message: `Network error: ${error.message}`,
        suggestion: 'Please check your internet connection and try again. If the problem persists, contact support.'
      });
      setIsLoadingForecast(false);
      setShowLoadingOverlay(false);
    }
  };

  // Local warehouse data for testing (API commented out)
  const localWarehouses = [
    { warehouse_id: 1, warehouse_name: 'WH-Bhubaneswar', location: 'Bhubaneswar' },
    { warehouse_id: 2, warehouse_name: 'WH-Pune', location: 'Pune' },
    { warehouse_id: 3, warehouse_name: 'WH-Delhi', location: 'Delhi' },
    { warehouse_id: 4, warehouse_name: 'WH-Kolkata', location: 'Kolkata' }
  ];

  // Fetch warehouses from API (currently using local data)
  const fetchWarehouses = async () => {
    setIsLoadingWarehouses(true);
    console.log('🔄 Loading local warehouse data...');
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setApiWarehouses(localWarehouses);
      console.log(`🏢 Successfully loaded ${localWarehouses.length} warehouses:`, localWarehouses);
      setIsLoadingWarehouses(false);
    }, 500);

    /* API CALL COMMENTED OUT FOR TESTING WITH LOCAL DATA
    try {
      // Use our Next.js API proxy to avoid CORS issues
      const response = await fetch('/api/warehouses', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('📡 API Response Status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const warehouseData = await response.json();
      console.log('🏭 Raw API Warehouse Data:', warehouseData);
      
      // Handle different API response formats
      let processedData = warehouseData;
      if (Array.isArray(warehouseData)) {
        processedData = warehouseData;
      } else if (warehouseData.data && Array.isArray(warehouseData.data)) {
        processedData = warehouseData.data;
      } else {
        throw new Error('Unexpected API response format');
      }
      
      // Extract unique warehouses from the API response
      const uniqueWarehouses = [];
      const seenWarehouseIds = new Set();
      
      processedData.forEach(item => {
        if (item.warehouse_id && !seenWarehouseIds.has(item.warehouse_id)) {
          seenWarehouseIds.add(item.warehouse_id);
          uniqueWarehouses.push({
            warehouse_id: item.warehouse_id,
            warehouse_name: item.warehouse_name || `WH_${item.warehouse_id}`,
            location: item.location || `Location ${item.warehouse_id}`
          });
        }
      });
      
      if (uniqueWarehouses.length === 0) {
        throw new Error('No valid warehouses found in API response');
      }
      
      setApiWarehouses(uniqueWarehouses);
      console.log(`🏢 Successfully loaded ${uniqueWarehouses.length} warehouses:`, uniqueWarehouses);
      
    } catch (error) {
      console.error('❌ Warehouse API Error Details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Determine error type for better user feedback
      let errorMessage = 'Unknown error occurred';
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network connection failed - CORS or connectivity issue';
      } else if (error.message.includes('HTTP')) {
        errorMessage = `Server responded with: ${error.message}`;
      } else {
        errorMessage = error.message;
      }
      
      console.log('🔄 Using fallback warehouse data due to API error');
      setApiWarehouses(warehouses);
      
      // Show user-friendly error without blocking the UI
      console.warn(`⚠️ API Fallback: ${errorMessage}`);
      
    } finally {
      setIsLoadingWarehouses(false);
    }
    */
  };



  const handleForecastInputChange = async (field, value) => {
    setForecastForm(prev => ({
      ...prev,
      [field]: value,
      // Reset dependent fields when parent changes
      ...(field === 'timeInterval' ? { warehouse: '', category: '', subcategory: '' } : {}),
      ...(field === 'warehouse' ? { category: '', subcategory: '' } : {}),
      ...(field === 'category' ? { subcategory: '' } : {})
    }));

    // Step 1: When time interval is selected, fetch warehouses
    if (field === 'timeInterval' && value) {
      console.log(`⏰ Time interval selected: ${value}`);
      console.log('🏭 Now fetching warehouses from API...');
      await fetchWarehouses();
    }

    // Step 2: When warehouse is selected, log the selection (no product fetching needed)
    if (field === 'warehouse' && value) {
      console.log(`🏢 Warehouse selected: ${value}`);
    }
  };

  // Helper functions for forecast category hierarchy
  const getAvailableCategories = () => {
    return Object.keys(categoryHierarchy);
  };

  const getAvailableSubcategories = (category) => {
    return category && categoryHierarchy[category] ? Object.keys(categoryHierarchy[category].subcategories) : [];
  };

  // Helper function to get product information by ID or name
  const getProductInfo = (productIdentifier) => {
    console.log('Looking up product:', productIdentifier, 'Type:', typeof productIdentifier);
    console.log('Available products:', warehouseProducts.slice(0, 5).map(p => ({ id: p.product_id, name: p.product_name })));
    
    if (!productIdentifier || productIdentifier === 'undefined' || productIdentifier === 'Unknown Product') {
      console.log('Invalid product identifier, using fallback');
      return {
        name: 'Unknown Product',
        brand: forecastForm.category || 'Unknown',
        category: forecastForm.category || 'Unknown',
        sub_category: forecastForm.subcategory || 'Unknown',
        price: 0
      };
    }

    // Convert to number if it's a string number
    const numericId = parseInt(productIdentifier);
    console.log('Numeric ID:', numericId);

    // Try to find by product_id first
    const productById = warehouseProducts.find(p => p.product_id === numericId);
    console.log('Found product by ID:', productById);
    
    if (productById) {
      return {
        name: productById.product_name,
        brand: productById.brand,
        category: productById.category,
        sub_category: productById.sub_category,
        price: productById.price
      };
    }

    // Try to find by exact product_id as string comparison
    const productByStringId = warehouseProducts.find(p => String(p.product_id) === String(productIdentifier));
    console.log('Found product by string ID:', productByStringId);
    
    if (productByStringId) {
      return {
        name: productByStringId.product_name,
        brand: productByStringId.brand,
        category: productByStringId.category,
        sub_category: productByStringId.sub_category,
        price: productByStringId.price
      };
    }

    // Try to find by product name
    const productByName = warehouseProducts.find(p => 
      p.product_name && p.product_name.toLowerCase().includes(String(productIdentifier).toLowerCase())
    );
    console.log('Found product by name:', productByName);
    
    if (productByName) {
      return {
        name: productByName.product_name,
        brand: productByName.brand,
        category: productByName.category,
        sub_category: productByName.sub_category,
        price: productByName.price
      };
    }

    console.log('No product found, using fallback for:', productIdentifier);
    // Fallback with form context
    return {
      name: `Product #${productIdentifier}`,
      brand: forecastForm.category || 'Unknown',
      category: forecastForm.category || 'Unknown',
      sub_category: forecastForm.subcategory || 'Unknown',
      price: 0
    };
  };

  const getAvailableProductsBySubcategory = (category, subcategory) => {
    return category && subcategory && categoryHierarchy[category]?.subcategories[subcategory] || [];
  };

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

  const formatBotMessage = (text) => {
    // Split the text into sections
    const sections = text.split(/###\s+/);
    
    return sections.map((section, index) => {
      if (index === 0 && sections.length > 1) {
        // First section is usually the main content
        return <p key={index} className="text-white mb-2">{section.trim()}</p>;
      } else if (section.trim()) {
        // Other sections are headers with content
        const lines = section.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
          const header = lines[0];
          const content = lines.slice(1).join(' ').trim();
          
          return (
            <div key={index} className="mb-3">
              <h5 className="text-purple-300 font-medium text-sm mb-1">{header}</h5>
              {content && <p className="text-gray-300 text-xs leading-relaxed">{content}</p>}
            </div>
          );
        }
      }
      return null;
    }).filter(Boolean);
  };

  // Modern Chart Components with MUI X Charts and Glass Theme
  const GlassLineChart = ({ data, title }) => {
    // Handle both old format (month/week) and new format (period)
    const xAxisData = data.map(d => d.period || d.month || d.week || `Period ${data.indexOf(d) + 1}`);
    const hasActualData = data.some(d => d.actual !== undefined);
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <span>📈</span>
            <span>{title}</span>
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-white/70">
              {forecastResults ? 'Live Forecast Data' : 'Sample Data'}
            </div>
            {forecastResults && (
              <div className="px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs text-green-200">
                ✅ API Connected
              </div>
            )}
          </div>
        </div>
        
        <Box sx={{ width: '100%', height: 600 }}>
          <LineChart
            series={[
              {
                data: data.map(d => d.predicted || 0),
                label: 'Predicted Demand',
                color: '#8B5CF6',
                curve: 'natural'
              },
              ...(hasActualData ? [{
                data: data.map(d => d.actual || 0),
                label: 'Simulated Actual', 
                color: '#EC4899',
                curve: 'natural'
              }] : [])
            ]}
            xAxis={[{ 
              data: xAxisData,
              scaleType: 'point',
              tickLabelStyle: { fill: 'rgba(255,255,255,0.8)', fontSize: 12 }
            }]}
            tooltip={{
              formatter: (value, name, props) => {
                const dataIndex = props.dataIndex;
                const dataPoint = data[dataIndex];
                

                return [Math.round(value), name];
              },
              labelStyle: { color: '#fff' },
              contentStyle: { 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff'
              }
            }}
            yAxis={[{
              tickLabelStyle: { fill: 'rgba(255,255,255,0.8)', fontSize: 11 },
              label: 'Quantity',
              labelStyle: { fill: 'rgba(255,255,255,0.7)' },
              min: (() => {
                // Calculate minimum value from all data with smart padding
                const allValues = [
                  ...data.map(d => d.predicted || 0),
                  ...data.map(d => d.actual || 0)
                ];
                const minValue = Math.min(...allValues);
                const maxValue = Math.max(...allValues);
                const range = maxValue - minValue;
                
                // Dynamic padding based on data range
                const padding = Math.max(range * 0.2, 10); // At least 20% padding or 10 units
                
                if (minValue <= 0) {
                  return Math.floor(minValue - padding);
                } else {
                  return Math.max(0, Math.floor(minValue - padding));
                }
              })(),
              max: (() => {
                // Calculate maximum value from all data with smart padding
                const allValues = [
                  ...data.map(d => d.predicted || 0),
                  ...data.map(d => d.actual || 0)
                ];
                const minValue = Math.min(...allValues);
                const maxValue = Math.max(...allValues);
                const range = maxValue - minValue;
                
                // Dynamic padding based on data range
                const padding = Math.max(range * 0.2, 10); // At least 20% padding or 10 units
                
                return Math.ceil(maxValue + padding);
              })()
            }]}
            margin={{ left: 80, right: 40, top: 80, bottom: 60 }}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'top', horizontal: 'middle' }
              }
            }}
            sx={{
              '& .MuiChartsAxis-line': { stroke: 'rgba(255,255,255,0.3)' },
              '& .MuiChartsAxis-tick': { stroke: 'rgba(255,255,255,0.3)' },
              '& .MuiChartsGrid-line': { stroke: 'rgba(255,255,255,0.1)' },
              '& .MuiChartsLegend-series text': { fill: 'white !important', color: 'white !important' },
              '& .MuiChartsLegend-label': { fill: 'white !important', color: 'white !important' },
              '& .MuiChartsLegend-root text': { fill: 'white !important', color: 'white !important' },
              '& .MuiChartsLegend-root': { color: 'white !important' },
              '& .MuiChartsLegend-series': { fill: 'white !important', color: 'white !important' },
              '& .MuiChartsLegend-mark text': { fill: 'white !important', color: 'white !important' },
              '& .MuiChartsLegend-labelText': { fill: 'white !important', color: 'white !important' },
              '& text[data-testid="legend-label"]': { fill: 'white !important', color: 'white !important' },
              '& .css-1h9z7r5-MuiChartsLegend-labelText': { fill: 'white !important', color: 'white !important' },
              '& text': { fill: 'white !important', color: 'white !important' },
              '& .recharts-legend-item-text': { fill: 'white !important', color: 'white !important' },
              '& .recharts-text': { fill: 'white !important', color: 'white !important' },
              '& g text': { fill: 'white !important', color: 'white !important' },
              '& svg text': { fill: 'white !important', color: 'white !important' },
              '& .MuiChartsTooltip-root': { 
                backgroundColor: 'rgba(0,0,0,0.8) !important',
                color: 'white !important'
              }
            }}
          />
        </Box>
        

        
        {/* Chart Statistics */}
        <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-sm text-white/70">Max Forecast</div>
            <div className="text-lg font-bold text-purple-400">
              {Math.round(Math.max(...data.map(d => d.predicted || 0)))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-white/70">Avg Forecast</div>
            <div className="text-lg font-bold text-blue-400">
              {Math.round(data.reduce((sum, d) => sum + (d.predicted || 0), 0) / data.length)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-white/70">Data Points</div>
            <div className="text-lg font-bold text-cyan-400">
              {data.length}
            </div>
          </div>
          {/* <div className="text-center">
            <div className="text-sm text-white/70">Positive Forecasts</div>
            <div className="text-lg font-bold text-green-400">
              {data.length}
            </div>
          </div> */}
        </div>
      </motion.div>
    );
  };

  const GlassBarChart = ({ data, title, color = "#8B5CF6" }) => (
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
  );

  const GlassPieChart = ({ percentage, title, color = "#8B5CF6" }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 text-center"
    >
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      <Box sx={{ width: '100%', height: 200 }}>
        <PieChart
          series={[{
            data: [
              { id: 0, value: percentage, color: color },
              { id: 1, value: 100 - percentage, color: 'rgba(255,255,255,0.1)' }
            ],
            innerRadius: 40,
            outerRadius: 80,
            paddingAngle: 2,
            cornerRadius: 5
          }]}
          margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
          sx={{
            '& .MuiChartsLegend-root': { display: 'none' }
          }}
        />
      </Box>
      <div className="text-3xl font-bold text-white">{percentage}%</div>
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

  // SupplierProductChart component moved to ProcurementAgent.js

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

  const Calendar = () => {
    const currentDate = new Date();
    const currentMonth = selectedMonth;
    const currentYear = selectedYear;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Sample data for deliveries and arrivals
    const calendarEvents = {
      3: { 
        deliveries: ['📦 LED Bulbs - WH-Delhi', '📦 Sensors - WH-Kolkata'], 
        arrivals: ['🚛 Raw Materials from Supplier A'],
        type: 'delivery'
      },
      7: { 
        deliveries: ['📦 Smart Switches - WH-Pune'], 
        arrivals: ['🚛 Electronics from Supplier B', '🚛 Packaging Materials'],
        type: 'both'
      },
      12: { 
        deliveries: [], 
        arrivals: ['🚛 Components from Supplier C'],
        type: 'arrival'
      },
      18: { 
        deliveries: ['📦 Power Banks - WH-Bhubaneswar', '📦 Cables - WH-Kolkata'], 
        arrivals: [],
        type: 'delivery'
      },
      22: { 
        deliveries: ['📦 Adapters - WH-Delhi'], 
        arrivals: ['🚛 Inventory Restock - Multiple Items'],
        type: 'both'
      },
      25: { 
        deliveries: ['📦 Emergency Stock - All Warehouses'], 
        arrivals: [],
        type: 'delivery'
      },
      28: { 
        deliveries: [], 
        arrivals: ['🚛 Monthly Bulk Order - Supplier D'],
        type: 'arrival'
      }
    };
    
    const [hoveredDay, setHoveredDay] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear();
      const eventData = calendarEvents[day];
      const hasEvents = eventData && (eventData.deliveries.length > 0 || eventData.arrivals.length > 0);
      
      let dayStyle = 'text-white/80 hover:bg-white/10 backdrop-blur-sm';
      let indicator = null;
      
      if (isToday) {
        dayStyle = 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg';
      } else if (hasEvents) {
        if (eventData.type === 'delivery') {
          dayStyle = 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-200 font-medium backdrop-blur-sm border border-blue-400/30';
          indicator = <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></div>;
        } else if (eventData.type === 'arrival') {
          dayStyle = 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-200 font-medium backdrop-blur-sm border border-green-400/30';
          indicator = <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>;
        } else if (eventData.type === 'both') {
          dayStyle = 'bg-gradient-to-r from-orange-500/30 to-yellow-500/30 text-orange-200 font-medium backdrop-blur-sm border border-orange-400/30';
          indicator = <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"></div>;
        }
      }
      
      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`relative h-8 flex items-center justify-center text-sm cursor-pointer rounded-full transition-all duration-300 ${dayStyle}`}
          onMouseEnter={(e) => {
            if (hasEvents || isToday) {
              setHoveredDay(day);
              const rect = e.target.getBoundingClientRect();
              const tooltipWidth = 250; // Estimated tooltip width
              const viewportWidth = window.innerWidth;
              
              // Calculate optimal x position to prevent overflow
              let x = rect.left + rect.width / 2;
              if (x + tooltipWidth / 2 > viewportWidth - 20) {
                // Too far right, position from right edge
                x = viewportWidth - tooltipWidth / 2 - 20;
              } else if (x - tooltipWidth / 2 < 20) {
                // Too far left, position from left edge
                x = tooltipWidth / 2 + 20;
              }
              
              setTooltipPosition({
                x: x,
                y: rect.top - 10
              });
            }
          }}
          onMouseLeave={() => setHoveredDay(null)}
        >
          {day}
          {indicator}
        </motion.div>
      );
    }

    const handlePrevMonth = () => {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    };

    const handleNextMonth = () => {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    };

    return (
      <div className="relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{monthNames[currentMonth]} {currentYear}</h3>
            <div className="flex space-x-2">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevMonth}
                className="p-2 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                ←
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextMonth}
                className="p-2 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                →
              </motion.button>
            </div>
          </div>
          
          {/* Calendar Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <span className="text-white/70">Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-full border border-blue-400/30"></div>
              <span className="text-white/70">Deliveries</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-full border border-green-400/30"></div>
              <span className="text-white/70">Arrivals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-500/50 to-yellow-500/50 rounded-full border border-orange-400/30"></div>
              <span className="text-white/70">Both</span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="h-8 flex items-center justify-center text-xs font-medium text-white/60">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>
        </motion.div>
        
        {/* Tooltip */}
        <AnimatePresence>
          {hoveredDay && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 pointer-events-none"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                transform: 'translate(-50%, -100%)',
                maxWidth: '300px',
                minWidth: '250px'
              }}
            >
              <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl min-w-[250px] max-w-[300px]">
                <div className="text-white font-semibold mb-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>
                    {hoveredDay === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear() 
                      ? `Today - ${monthNames[currentMonth]} ${hoveredDay}, ${currentYear}`
                      : `${monthNames[currentMonth]} ${hoveredDay}, ${currentYear}`
                    }
                  </span>
                </div>
                
                {calendarEvents[hoveredDay] && (
                  <div className="space-y-3">
                    {calendarEvents[hoveredDay].deliveries.length > 0 && (
                      <div>
                        <div className="text-blue-300 font-medium text-sm mb-2 flex items-center space-x-2">
                          <span>📦</span>
                          <span>Upcoming Deliveries</span>
                        </div>
                        <div className="space-y-1">
                          {calendarEvents[hoveredDay].deliveries.map((delivery, index) => (
                            <div key={index} className="text-white/80 text-xs bg-blue-500/10 rounded-lg px-2 py-1">
                              {delivery}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {calendarEvents[hoveredDay].arrivals.length > 0 && (
                      <div>
                        <div className="text-green-300 font-medium text-sm mb-2 flex items-center space-x-2">
                          <span>🚛</span>
                          <span>Expected Arrivals</span>
                        </div>
                        <div className="space-y-1">
                          {calendarEvents[hoveredDay].arrivals.map((arrival, index) => (
                            <div key={index} className="text-white/80 text-xs bg-green-500/10 rounded-lg px-2 py-1">
                              {arrival}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {hoveredDay === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear() && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="text-purple-300 font-medium text-sm mb-2 flex items-center space-x-2">
                      <span>📅</span>
                      <span>Today&apos;s Status</span>
                    </div>
                    <div className="text-white/80 text-xs bg-purple-500/10 rounded-lg px-2 py-1">
                      Current time: {currentDate.toLocaleTimeString()}
                    </div>
                  </div>
                )}
                
                {!calendarEvents[hoveredDay] && hoveredDay !== currentDate.getDate() && (
                  <div className="text-white/60 text-xs">
                    No scheduled events for this date
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Small chart components for sidebar stats
  const MiniChart = ({ data, color, type = 'line' }) => (
    <div className="h-12 w-full">
      <svg className="w-full h-full" viewBox="0 0 80 24">
        {type === 'line' ? (
          <path
            d="M 2,20 Q 20,15 40,12 T 78,8"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        ) : (
          data.map((value, i) => (
            <rect
              key={i}
              x={i * 12 + 2}
              y={24 - (value / 100) * 20}
              width="8"
              height={(value / 100) * 20}
              fill={color}
              opacity="0.7"
            />
          ))
        )}
      </svg>
    </div>
  );

  // Task Planner Modal Component
  const TaskPlannerModal = () => (
    <AnimatePresence>
      {showTaskPlannerModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowTaskPlannerModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/30 to-yellow-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Task Planner Report</h2>
                  <p className="text-white/60">Warehouse management action items</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowTaskPlannerModal(false)}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300"
              >
                <span className="text-white text-xl">×</span>
              </motion.button>
            </div>

            {/* Task Items */}
            <div className="space-y-6">
              {/* 1. Products Below Reorder Level */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm rounded-2xl border border-red-400/30 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">📦</span>
                  <h3 className="text-xl font-semibold text-white">Products Below Reorder Level</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">LED Bulb 12W – WH-Delhi</span>
                      <span className="px-2 py-1 bg-red-500/20 text-red-200 rounded-full text-xs">❌ Below threshold</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-white/70">
                      <span>Stock: <span className="text-red-300 font-medium">46</span></span>
                      <span>Reorder Level: <span className="text-white">50</span></span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">LED Bulb 12W – WH-Bhubaneswar</span>
                      <span className="px-2 py-1 bg-red-500/20 text-red-200 rounded-full text-xs">❌ Below threshold</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-white/70">
                      <span>Stock: <span className="text-red-300 font-medium">41</span></span>
                      <span>Reorder Level: <span className="text-white">50</span></span>
                    </div>
                  </div>
                  <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-400/20">
                    <p className="text-orange-200 text-sm">
                      <span className="font-medium">Action Item:</span> Place purchase orders for additional stock at both warehouses.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 2. Pending Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl border border-yellow-400/30 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">📋</span>
                  <h3 className="text-xl font-semibold text-white">Pending Orders</h3>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl">⚠️</span>
                    <span className="text-yellow-200 font-medium">Error encountered</span>
                  </div>
                  <p className="text-white/80 mb-3">Query referenced a non-existent column dates in the orders table.</p>
                  <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-400/20">
                    <p className="text-blue-200 text-sm">
                      <span className="font-medium">Next Step:</span> Review the database schema and correct/remove the invalid column reference.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 3. Pending Product Returns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl border border-green-400/30 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">🔄</span>
                  <h3 className="text-xl font-semibold text-white">Pending Product Returns</h3>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">✅</span>
                    <span className="text-green-200 font-medium">No pending returns found</span>
                  </div>
                  <p className="text-white/70 text-sm">All product returns are either resolved or not logged as pending.</p>
                </div>
              </motion.div>

              {/* 4. Pending Shipments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-green-600/20 to-teal-600/20 backdrop-blur-sm rounded-2xl border border-green-400/30 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">🚚</span>
                  <h3 className="text-xl font-semibold text-white">Pending Shipments</h3>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl">✅</span>
                    <span className="text-green-200 font-medium">No pending shipments identified</span>
                  </div>
                  <div className="text-white/70 text-sm space-y-1">
                    <p><span className="font-medium">Possibilities:</span></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>No shipments waiting for processing</li>
                      <li>Or a data logging issue</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* 5. Budget Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl border border-purple-400/30 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">💰</span>
                  <h3 className="text-xl font-semibold text-white">Budget Insights for Warehouses</h3>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl">⚠️</span>
                    <span className="text-yellow-200 font-medium">Data for allocation / used / remaining budget returned empty</span>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-400/20">
                    <p className="text-blue-200 text-sm">
                      <span className="font-medium">Next Step:</span> Verify how budget data is stored and whether queries are pointing to the correct tables/columns.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">
                  Last updated: {new Date().toLocaleString()}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTaskPlannerModal(false)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500/50 to-purple-500/50 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:from-blue-500/70 hover:to-purple-500/70 transition-all duration-300"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl"
        />
      </div>
      {/* Enhanced Glass Sidebar */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed left-0 top-0 h-full w-24 bg-gradient-to-b from-purple-600/15 via-blue-600/10 to-gray-800/25 backdrop-blur-xl border-r-2 border-white/20 flex flex-col items-center py-8 z-50 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.12) 35%, rgba(16, 185, 129, 0.08) 65%, rgba(31, 41, 55, 0.25) 100%)'
        }}
      >

        {[
          { icon: '👤', id: 'analytics', label: 'Analytics', active: activeAgent === 'analytics', color: 'from-pink-500 to-rose-500' },
          { icon: '📊', id: 'forecast', label: 'Forecast', active: activeAgent === 'forecast', color: 'from-blue-500 to-cyan-500' },
          { icon: '🛒', id: 'procurement', label: 'Procurement', active: activeAgent === 'procurement', color: 'from-purple-500 to-violet-500' },
          { icon: '🚚', id: 'inbound', label: 'Inbound', active: activeAgent === 'inbound', color: 'from-green-500 to-emerald-500' },
          { icon: '📦', id: 'fulfillment', label: 'Fulfillment', active: activeAgent === 'fulfillment', color: 'from-orange-500 to-red-500' },
          { icon: '↩️', id: 'returns', label: 'Returns', active: activeAgent === 'returns', color: 'from-indigo-500 to-purple-500' },
          { icon: '💰', id: 'financial', label: 'Financial', active: activeAgent === 'financial', color: 'from-green-500 to-emerald-500' },
          // { icon: '⚙️', id: 'operational', label: 'Operational', active: activeAgent === 'operational', color: 'from-purple-500 to-pink-500' },
        ].map((item, index) => (
          <div key={item.id} className="relative group">
            <motion.button
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.15, 
                boxShadow: "0 0 30px rgba(255, 255, 255, 0.4)",
                rotate: [0, -5, 5, 0]
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveAgent(item.id)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 backdrop-blur-sm border-2 relative overflow-hidden ${
                item.active 
                  ? `bg-gradient-to-r ${item.color} text-white border-white/40 shadow-2xl` 
                  : 'bg-white/10 text-white/70 hover:text-white border-white/20 hover:border-white/40 hover:bg-white/20'
              }`}
            >
              {/* Animated Background Glow */}
              {item.active && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 blur-xl`}
                />
              )}
              
              {/* Icon with Animation */}
              <motion.span 
                className="text-2xl relative z-10"
                animate={item.active ? { 
                  y: [0, -2, 0],
                  transition: { duration: 2, repeat: Infinity }
                } : {}}
              >
                {item.icon}
              </motion.span>
              
              {/* Active Indicator */}
              {item.active && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-gray-800"
                />
              )}
            </motion.button>
            
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute left-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
            >
              <div className="bg-gray-800/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium border border-white/20 shadow-xl">
                {item.label}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45 border-l border-b border-white/20"></div>
              </div>
            </motion.div>
          </div>
        ))}
        
        {/* Decorative Bottom Section */}
        <div className="mt-auto space-y-4">
          {/* Animated Status Indicator */}
          {/* <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center space-y-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full flex items-center justify-center border border-green-400/40">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 bg-green-400 rounded-full"
              />
            </div>
            <span className="text-xs text-green-400 font-medium">ONLINE</span>
          </motion.div> */}
          
          {/* Decorative Separator */}
          <motion.div
            animate={{
              scaleX: [0.3, 1, 0.3],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full mx-auto"
          />
        </div>
        
        {/* Enhanced Logout Button */}
        <div className="relative group mt-4">
          <motion.button
            whileHover={{ 
              scale: 1.15, 
              boxShadow: "0 0 30px rgba(239, 68, 68, 0.6)",
              rotate: [0, -3, 3, 0]
            }}
            whileTap={{ scale: 0.9 }}
            onClick={onLogout}
            className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm bg-white/10 border-2 border-white/20 text-white/70 hover:text-white hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-500 relative overflow-hidden"
          >
            {/* Hover Glow Effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-red-500/20 blur-xl"
            />
            
            <motion.div 
              className="relative z-10"
              whileHover={{ 
                rotate: [0, 10, -10, 0],
                transition: { duration: 0.5 }
              }}
            >
              {/* Logout SVG Icon */}
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white drop-shadow-lg"
              >
                <path 
                  d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7Z" 
                  fill="currentColor"
                />
                <path 
                  d="M2 2H12C13.1 2 14 2.9 14 4V6H12V4H4V20H12V18H14V20C14 21.1 13.1 22 12 22H2C0.9 22 0 21.1 0 20V4C0 2.9 0.9 2 2 2Z" 
                  fill="currentColor"
                />
              </svg>
            </motion.div>
          </motion.button>
          
          {/* Logout Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute left-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
          >
            <div className="bg-red-800/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium border border-red-400/30 shadow-xl">
              Logout
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-red-800 rotate-45 border-l border-b border-red-400/30"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated Loading Overlay */}
      <AnimatePresence>
        {showLoadingOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur-xl rounded-3xl border-2 border-white/30 p-16 shadow-[0_0_80px_rgba(139,92,246,0.6)] text-center max-w-2xl"
            >
              {/* Animated Agent Image - DOMINATING SIZE */}
              <motion.div
                animate={{ 
                  y: [-15, 15, -15],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-48 h-48 mx-auto mb-10 bg-gradient-to-br from-purple-500/40 to-blue-500/40 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30 overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.8)] relative"
              >
                <motion.img 
                  src="/assets/forca.png" 
                  alt="Forecast Agent" 
                  className="w-40 h-40 object-contain filter drop-shadow-2xl"
                  animate={{ 
                    scale: [1, 1.05, 1, 1.08, 1],
                    rotate: [0, 5, 0, -3, 0],
                    y: [0, -5, 0, -3, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  animate={{ 
                    scale: [1, 1.1, 1, 1.06, 1],
                    rotate: [0, -2, 0, 3, 0],
                    opacity: [0.3, 0.5, 0.3, 0.4, 0.3]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <img 
                    src="/assets/forca.png" 
                    alt="" 
                    className="w-40 h-40 object-contain filter brightness-125"
                  />
                </motion.div>
              </motion.div>
              
              {/* Loading Text */}
              <motion.h3
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl font-bold text-white mb-4"
              >
                AI Forecast Agent Running
              </motion.h3>
              
              <div className="space-y-3 text-white/80">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm"
                >
                  🧠 Analyzing historical data patterns
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-sm"
                >
                  📊 Generating demand predictions
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="text-sm"
                >
                  ⚡ Processing forecast results
                </motion.p>
              </div>
              
              {/* Loading Progress Bar */}
              <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="ml-24 p-6 relative z-10">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <motion.div
                  animate={{ 
                    rotate: [0, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-500/40 to-blue-500/40 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30"
                >
                  <span className="text-3xl">🧑‍💼</span>
                </motion.div>
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl font-bold text-white mb-2"
                  >
                    <TypewriterText 
                      text={`Welcome back ${getDisplayName(user)} !`} 
                      delay={800}
                      speed={60}
                      eraseSpeed={40}
                      eraseDelay={3000}
                    />
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-white/70 text-lg"
                  >
                  Manage your warehouse operations with AI-powered agents.
                  </motion.p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Task Planner - Only show on analytics page */}
                {/* {activeAgent === 'analytics' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="relative"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowTaskPlannerModal(true)}
                      className="relative w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                    >
                      <ClipboardList className="w-5 h-5 text-white" />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center font-bold"
                      >
                        5
                      </motion.div>
                    </motion.button>
                  </motion.div>
                )} */}

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-white">Live</div>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                    />
                    <span className="text-sm text-white/70">All Systems Online</span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-white">{new Date().toLocaleTimeString()}</div>
                  <div className="text-sm text-white/70">{new Date().toLocaleDateString()}</div>
                </motion.div>
              </div>
            </div>
            
            {/* Quick Navigation Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-6 pt-6 border-t border-white/20"
            >
              <div className="flex items-center space-x-4">
                <span className="text-white/60">Active Module:</span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-sm border border-white/30 rounded-xl"
                >
                  <span className="text-white font-semibold capitalize">
                    {activeAgent === 'forecast' ? '📈 Forecast Agent' :
                     activeAgent === 'inbound' ? '📦 Inbound Agent' :
                     activeAgent === 'procurement' ? '🛒 Procurement Agent' :
                     activeAgent === 'fulfillment' ? '🚚 Order Fulfillment' :
                     activeAgent === 'returns' ? '🔄 Returns Agent' :
                     activeAgent === 'financial' ? '💰 Financial Agent' :
                    //  activeAgent === 'operational' ? '⚙️ Operational Agent' :
                     activeAgent === 'analytics' ? '📊 Analytics Overview' : 'Dashboard'}
                  </span>
                </motion.div>
                <div className="flex space-x-2">
                  {['analytics', 'forecast', 'inbound', 'procurement', 'fulfillment', 'returns', 'financial'].map((agent) => (
                    <motion.button
                      key={agent}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveAgent(agent)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeAgent === agent 
                          ? 'bg-white shadow-lg shadow-white/50' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Forecast Agent Dashboard */}
          {activeAgent === 'forecast' && (
            <motion.div
              key="forecast"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Revenue card with glass theme and animations */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-emerald-600/20 to-green-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Floating background elements */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-green-400/15 to-emerald-400/15 rounded-full blur-lg"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0.7)", "0 0 0 8px rgba(16, 185, 129, 0)", "0 0 0 0 rgba(16, 185, 129, 0)"]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-12 h-12 bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"
                        >
                          <span className="text-2xl">💰</span>
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Total Revenue</h3>
                          <p className="text-xs text-white/60">Financial overview</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <motion.div
                              animate={{ rotate: [0, 15, -15, 0] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="text-emerald-400 text-xl"
                            >
                              ↗
                            </motion.div>
                            <span className="text-2xl font-bold text-emerald-400">₹14.5L</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"
                          ></motion.div>
                          <span className="text-sm font-medium text-emerald-300">+12.5%</span>
                          <span className="text-xs text-white/60">from last month</span>
                        </div>
                        
                        <div className="w-full bg-emerald-400/20 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Orders card with glass theme and animations */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-orange-600/20 to-red-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Floating background elements */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-red-400/15 to-orange-400/15 rounded-full blur-lg"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ 
                            rotate: [0, -10, 10, 0],
                            boxShadow: ["0 0 0 0 rgba(249, 115, 22, 0.7)", "0 0 0 8px rgba(249, 115, 22, 0)", "0 0 0 0 rgba(249, 115, 22, 0)"]
                          }}
                          transition={{ 
                            rotate: { duration: 4, repeat: Infinity },
                            boxShadow: { duration: 2, repeat: Infinity, delay: 0.3 }
                          }}
                          className="w-12 h-12 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"
                        >
                          <span className="text-2xl">📦</span>
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Orders</h3>
                          <p className="text-xs text-white/60">Order management</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <motion.div
                              animate={{ rotate: [0, -15, 15, 0] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="text-orange-400 text-xl"
                            >
                              ↘
                            </motion.div>
                            <span className="text-2xl font-bold text-orange-400">287</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              backgroundColor: ["rgba(249, 115, 22, 0.8)", "rgba(239, 68, 68, 0.8)", "rgba(249, 115, 22, 0.8)"]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                            className="w-3 h-3 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50"
                          ></motion.div>
                          <span className="text-sm font-medium text-orange-300">-5.2%</span>
                          <span className="text-xs text-white/60">from last month</span>
                        </div>
                        
                        <div className="w-full bg-orange-400/20 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "45%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Inventory Status widget with glass theme */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-green-600/20 to-emerald-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Floating background elements */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-emerald-400/15 to-green-400/15 rounded-full blur-lg"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ 
                            boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.7)", "0 0 0 8px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0)"]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-10 h-10 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"
                        >
                          <span className="text-xl">📦</span>
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Inventory Status</h3>
                          <p className="text-xs text-white/60">Live stock monitoring</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-4 h-4 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                            ></motion.div>
                            <span className="text-sm font-medium text-white">In Stock</span>
                          </div>
                          <span className="text-lg font-bold text-green-400">85%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                            <span className="text-xs text-white/80">Low Stock</span>
                          </div>
                          <span className="text-sm font-bold text-yellow-400">12%</span>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-3 h-3 bg-red-400 rounded-full shadow-lg shadow-red-400/50"></div>
                            <span className="text-xs text-white/80">Out of Stock</span>
                          </div>
                          <span className="text-sm font-bold text-red-400">3%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Warehouse Activity card with glass theme */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-purple-600/20 to-blue-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Floating background elements */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-lg"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, -10, 0],
                            boxShadow: ["0 0 0 0 rgba(147, 51, 234, 0.7)", "0 0 0 8px rgba(147, 51, 234, 0)", "0 0 0 0 rgba(147, 51, 234, 0)"]
                          }}
                          transition={{ 
                            rotate: { duration: 4, repeat: Infinity },
                            boxShadow: { duration: 2, repeat: Infinity, delay: 0.5 }
                          }}
                          className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"
                        >
                          <span className="text-xl">🚛</span>
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Warehouse Activity</h3>
                          <p className="text-xs text-white/60">Real-time operations</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Activity Legend */}
                      <div className="flex items-center justify-center space-x-6 mb-3">
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"
                          ></motion.div>
                          <span className="text-xs font-medium text-blue-300">Inbound</span>
                        </div>
                        <motion.div
                          animate={{ x: [0, 15, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="text-white/60"
                        >
                          ↔️
                        </motion.div>
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            className="w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"
                          ></motion.div>
                          <span className="text-xs font-medium text-purple-300">Outbound</span>
                        </div>
                      </div>
                      
                      {/* Activity Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm rounded-xl p-3 border border-blue-400/20 text-center"
                        >
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <span className="text-2xl">📥</span>
                            <div className="text-right">
                              <div className="text-xl font-bold text-blue-400">142</div>
                              <div className="text-xs text-blue-300">Items</div>
                            </div>
                          </div>
                          <div className="text-xs text-white/70">Received Today</div>
                          <div className="w-full bg-blue-400/20 rounded-full h-1 mt-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "60%" }}
                              transition={{ duration: 1.5, delay: 0.8 }}
                              className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            />
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm rounded-xl p-3 border border-purple-400/20 text-center"
                        >
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <span className="text-2xl">📤</span>
                            <div className="text-right">
                              <div className="text-xl font-bold text-purple-400">287</div>
                              <div className="text-xs text-purple-300">Items</div>
                            </div>
                          </div>
                          <div className="text-xs text-white/70">Shipped Today</div>
                          <div className="w-full bg-purple-400/20 rounded-full h-1 mt-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "85%" }}
                              transition={{ duration: 1.5, delay: 1 }}
                              className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Two Column Layout: Warehouse Map + Forecast Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Warehouse Distribution Network */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:border-white/30 transition-all duration-500"
                >
                  <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-white">Warehouse Distribution Network</h2>
                    <p className="text-white/70 text-sm mt-2">4 Active Distribution Centers</p>
                  </div>
                
                  {/* Map and Warehouse Layout */}
                  <div className="grid grid-cols-3 gap-6 h-[500px]">
                    {/* Left: India Map */}
                    <div className="col-span-2 relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden p-4">
                      <motion.img
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2 }}
                        src="/assets/indiamap.png"
                        alt="India Map"
                        className="w-full h-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-500 filter drop-shadow-lg"
                      />
                    </div>
                    
                    {/* Right: Warehouse Levels - Vertical Layout */}
                    <div className="col-span-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 flex flex-col justify-end">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-white mb-2">Distribution Levels</h3>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                      </div>
                      
                      <div className="space-y-4 relative">
                        {[
                          { name: 'WH-Delhi', color: 'from-red-500 to-orange-500', capacity: '87%', orders: '234', level: '1', route: '/products/delhi' },
                          { name: 'WH-Bhubaneswar', color: 'from-blue-500 to-cyan-500', capacity: '92%', orders: '189', level: '2', route: '/products/bbsr' },
                          { name: 'WH-Pune', color: 'from-green-500 to-emerald-500', capacity: '76%', orders: '156', level: '3', route: '/products/pune' },
                          { name: 'WH-Kolkata', color: 'from-purple-500 to-violet-500', capacity: '81%', orders: '203', level: '4', route: '/products/kolkata' }
                        ].map((warehouse, index) => (
                          <motion.div
                            key={warehouse.name}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 1.5 + index * 0.2 }}
                            className="group cursor-pointer flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 relative"
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.open(warehouse.route, '_blank')}
                          >
                            {/* Level Badge */}
                            <motion.div
                              animate={{ 
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                  "0 0 10px rgba(255, 255, 255, 0.3)",
                                  "0 0 20px rgba(255, 255, 255, 0.5)",
                                  "0 0 10px rgba(255, 255, 255, 0.3)"
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                              className={`w-8 h-8 bg-gradient-to-r ${warehouse.color} rounded-full border-2 border-white/60 shadow-lg flex items-center justify-center relative flex-shrink-0`}
                            >
                              <span className="text-white text-sm font-bold">{warehouse.level}</span>
                              
                              {/* Pulse Effect */}
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.5, 1],
                                  opacity: [0.6, 0, 0.6]
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                className={`absolute inset-0 bg-gradient-to-r ${warehouse.color} rounded-full`}
                              />
                            </motion.div>
                            
                            {/* Warehouse Info */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="text-white font-bold text-sm">{warehouse.name}</div>
                                <span className="text-blue-400 text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                                  🔗
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 text-xs">
                                <div className="flex items-center space-x-1">
                                  <span className="text-white/70">Capacity:</span>
                                  <span className="text-green-400 font-bold">{warehouse.capacity}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-white/70">Orders:</span>
                                  <span className="text-blue-400 font-bold">{warehouse.orders}</span>
                                </div>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: warehouse.capacity }}
                                  transition={{ duration: 1.5, delay: 1.8 + index * 0.2 }}
                                  className={`h-1 rounded-full bg-gradient-to-r ${warehouse.color}`}
                                />
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                                <div className="text-xs text-blue-300 text-center">💻 Click to view →</div>
                              </div>
                            </div>
                            
                            {/* Connection Line to Next Level (except for last item) */}
                            {index < 3 && (
                              <motion.div
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.6, delay: 2.2 + index * 0.2 }}
                                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-px h-4 bg-gradient-to-b from-white/40 to-transparent"
                              />
                            )}
                          </motion.div>
                        ))}
                        

                      </div>
                    </div>
                  </div>
                </motion.div>


                {/* Right Column: Modern Forecast Form */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  {/* Glassmorphism Form Container */}
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl hover:border-white/20 transition-all duration-500">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-3xl" />
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl" />
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl" />
                    
                    {/* Form Content */}
                    <div className="relative z-10">
                      {/* Form Header */}
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center mb-8"
                      >
                        <motion.div
                          animate={{ 
                            y: [-5, 5, -5],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          className="inline-block mb-4 relative"
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 overflow-hidden">
                            <motion.img 
                              src="/assets/forca.png" 
                              alt="Forecast Agent" 
                              className="w-18 h-18 object-contain"
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
                                src="/assets/forca.png" 
                                alt="" 
                                className="w-18 h-18 object-contain filter brightness-120"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-2">Order Forecast Analysis</h2>
                        <p className="text-white/70 text-sm">Generate AI-powered demand predictions</p>
                      </motion.div>

                      {/* Modern Glass Form */}
                      <form onSubmit={handleForecastSubmit} className="space-y-6">
                        {/* Form Fields Grid */}
                        <div className="space-y-4">
                          {/* Time Interval Field */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="group"
                          >
                            <label className="block text-sm font-semibold text-white/90 mb-2">
                              <span className="flex items-center space-x-2">
                                <span>📅</span>
                                <span>Time Interval</span>
                              </span>
                            </label>
                            <div className="relative">
                              <select 
                                value={forecastForm.timeInterval}
                                onChange={(e) => handleForecastInputChange('timeInterval', e.target.value)}
                                className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300 hover:bg-white/15 hover:border-white/30"
                              >
                                <option value="" className="bg-gray-800 text-white">Select Interval In Weeks</option>
                                <option value="daily" className="bg-gray-800 text-white">2</option>
                                <option value="weekly" className="bg-gray-800 text-white">4</option>
                                <option value="monthly" className="bg-gray-800 text-white">6</option>
                                <option value="quarterly" className="bg-gray-800 text-white">8</option>
                              </select>
                              <motion.div
                                animate={{ y: [0, -2, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute right-4 top-4 text-white/60 pointer-events-none"
                              >
                                ⏱️
                              </motion.div>
                            </div>
                          </motion.div>

                          {/* Warehouse Selection Field */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="group"
                          >
                            <label className="block text-sm font-semibold text-white/90 mb-2">
                              <span className="flex items-center space-x-2">
                                <span>🏭</span>
                                <span>Warehouse Location</span>
                              </span>
                              {!forecastForm.timeInterval && (
                                <span className="ml-2 text-xs text-orange-400">(Select time interval first)</span>
                              )}
                            </label>
                            <div className="relative">
                              <select 
                                value={forecastForm.warehouse}
                                onChange={(e) => handleForecastInputChange('warehouse', e.target.value)}
                                disabled={!forecastForm.timeInterval || isLoadingWarehouses}
                                className={`w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300 hover:bg-white/15 hover:border-white/30 ${
                                  (!forecastForm.timeInterval || isLoadingWarehouses) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                <option value="" className="bg-gray-800 text-white">
                                  {!forecastForm.timeInterval ? 'Select Time Interval First' : 
                                   isLoadingWarehouses ? 'Loading Warehouses...' : 'Choose Warehouse'}
                                </option>
                                {apiWarehouses.map((warehouse) => {
                                  const warehouseIcon = 
                                    warehouse.warehouse_id === 1 ? '🏙️' : 
                                    warehouse.warehouse_id === 2 ? '🌆' : 
                                    warehouse.warehouse_id === 3 ? '🏘️' : 
                                    warehouse.warehouse_id === 4 ? '🌃' : '🏢';
                                  
                                  return (
                                    <option 
                                      key={warehouse.warehouse_id} 
                                      value={warehouse.warehouse_id} 
                                      className="bg-gray-800 text-white"
                                    >
                                      {warehouseIcon} {warehouse.warehouse_name} - {warehouse.location}
                                    </option>
                                  );
                                })}
                              </select>
                              <motion.div
                                animate={isLoadingWarehouses ? { rotate: 360 } : { scale: [1, 1.1, 1] }}
                                transition={isLoadingWarehouses ? 
                                  { duration: 1, repeat: Infinity, ease: "linear" } : 
                                  { duration: 2, repeat: Infinity }
                                }
                                className="absolute right-4 top-4 text-white/60 pointer-events-none"
                              >
                                {isLoadingWarehouses ? '🔄' : '📍'}
                              </motion.div>
                            </div>
                            
                            {/* Status Messages */}
                            {!isLoadingWarehouses && apiWarehouses.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 px-3 py-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl text-xs text-green-200"
                              >
                                � Warehouses loaded
                              </motion.div>
                            )}
                            {!forecastForm.timeInterval && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 px-3 py-2 bg-gray-500/20 backdrop-blur-sm border border-gray-400/30 rounded-xl text-xs text-gray-300"
                              >
                                ⏳ Step 1: Select time interval to load warehouses
                              </motion.div>
                            )}
                            {isLoadingWarehouses && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 px-3 py-2 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-xl text-xs text-orange-200 flex items-center space-x-2"
                              >
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-3 h-3 border border-orange-400 border-t-transparent rounded-full"
                                />
                                <span>🔄 Step 2: Loading warehouses...</span>
                              </motion.div>
                            )}

                          </motion.div>

                          {/* Category Selection Field */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="group"
                          >
                            <label className="block text-sm font-semibold text-white/90 mb-2">
                              <span className="flex items-center space-x-2">
                                <span>🏷️</span>
                                <span>Category</span>
                              </span>
                              {!forecastForm.warehouse && (
                                <span className="ml-2 text-xs text-orange-400">(Select warehouse first)</span>
                              )}
                            </label>
                            <div className="relative">
                              <select 
                                value={forecastForm.category}
                                onChange={(e) => handleForecastInputChange('category', e.target.value)}
                                disabled={!forecastForm.warehouse}
                                className={`w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300 hover:bg-white/15 hover:border-white/30 ${
                                  !forecastForm.warehouse ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                <option value="" className="bg-gray-800 text-white">
                                  {!forecastForm.warehouse ? 'Select Warehouse First' : 'Select Category'}
                                </option>
                                {getAvailableCategories().map((category) => (
                                  <option 
                                    key={category} 
                                    value={category} 
                                    className="bg-gray-800 text-white"
                                  >
                                    {categoryHierarchy[category].icon} {category}
                                  </option>
                                ))}
                              </select>
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute right-4 top-4 text-white/60 pointer-events-none"
                              >
                                🎯
                              </motion.div>
                            </div>
                          </motion.div>

                          {/* Subcategory Selection Field */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="group"
                          >
                            <label className="block text-sm font-semibold text-white/90 mb-2">
                              <span className="flex items-center space-x-2">
                                <span>🏷️</span>
                                <span>Subcategory</span>
                              </span>
                              {!forecastForm.category && (
                                <span className="ml-2 text-xs text-orange-400">(Select category first)</span>
                              )}
                            </label>
                            <div className="relative">
                              <select 
                                value={forecastForm.subcategory}
                                onChange={(e) => handleForecastInputChange('subcategory', e.target.value)}
                                disabled={!forecastForm.category}
                                className={`w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300 hover:bg-white/15 hover:border-white/30 ${
                                  !forecastForm.category ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                <option value="" className="bg-gray-800 text-white">
                                  {!forecastForm.category ? 'Select Category First' : 'Select Subcategory'}
                                </option>
                                {getAvailableSubcategories(forecastForm.category).map((subcategory) => (
                                  <option 
                                    key={subcategory} 
                                    value={subcategory} 
                                    className="bg-gray-800 text-white"
                                  >
                                    📂 {subcategory}
                                  </option>
                                ))}
                              </select>
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute right-4 top-4 text-white/60 pointer-events-none"
                              >
                                📂
                              </motion.div>
                            </div>
                          </motion.div>



                          {/* Submit Button */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="pt-4"
                          >
                            <motion.button
                              type="submit"
                              disabled={isLoadingForecast}
                              whileHover={{ 
                                scale: isLoadingForecast ? 1 : 1.02, 
                                boxShadow: isLoadingForecast ? "none" : "0 0 40px rgba(139, 92, 246, 0.4)",
                              }}
                              whileTap={{ scale: isLoadingForecast ? 1 : 0.98 }}
                              className={`w-full px-6 py-4 bg-gradient-to-r from-purple-500/80 via-blue-500/80 to-purple-500/80 backdrop-blur-sm border border-white/20 text-white font-bold rounded-2xl transition-all duration-500 ${
                                isLoadingForecast ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-600/90 hover:via-blue-600/90 hover:to-purple-600/90 hover:border-white/30'
                              }`}
                            >
                              <div className="flex items-center justify-center space-x-3">
                                {isLoadingForecast ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                  />
                                ) : (
                                  <motion.span
                                    animate={{ 
                                      scale: [1, 1.2, 1],
                                      rotate: [0, 360]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="text-xl"
                                  >
                                    🔮
                                  </motion.span>
                                )}
                                <span className="text-lg">{isLoadingForecast ? 'Generating Forecast...' : 'Run AI Forecast'}</span>
                              </div>
                            </motion.button>
                          </motion.div>
                        </div>
                      </form>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Forecast Error Display */}
              {forecastError && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl border border-red-400/30 p-6 hover:border-red-400/50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-10 h-10 bg-red-500/30 rounded-full flex items-center justify-center"
                    >
                      <span className="text-red-200 text-lg">⚠️</span>
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-red-200 mb-1">No Forecast Data Available</h3>
                      <div className="px-3 py-1 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-full text-xs text-red-200 inline-block">
                        {forecastError.type === 'no_data' ? 'No Historical Data' : 'Empty Response'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl border border-red-400/20 p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-red-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-200 text-xs">!</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-red-200 font-semibold text-sm mb-2">Issue Details:</h4>
                          <p className="text-red-100/90 text-sm leading-relaxed mb-3">
                            {forecastError.message}
                          </p>
                          <h4 className="text-orange-200 font-semibold text-sm mb-2">💡 Suggestion:</h4>
                          <p className="text-orange-100/90 text-sm leading-relaxed">
                            {forecastError.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-red-400/20">
                      <div className="text-xs text-red-200/70">
                        This message indicates the selected criteria returned no forecast data
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setForecastError(null)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500/30 to-orange-500/30 backdrop-blur-sm border border-red-400/30 text-red-200 rounded-lg hover:border-red-400/50 transition-all duration-300 text-xs"
                      >
                        Dismiss
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Forecast API Response Display */}
              {forecastResults && !forecastError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-sm">🔮</span>
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">Forecast API Response</h3>
                    <div className="px-3 py-1 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full text-xs text-purple-200">
                      ✅ Connected to Backend API
                    </div>
                  </div>
                
                  
                  
                  {/* Forecast Table */}
                  {(() => {
                    try {
                      // Parse the forecast data from the API response
                      let forecastData = [];
                      let narrative = '';
                      
                      if (forecastResults.result) {
                        // Parse the JSON string inside the result field
                        const parsedResult = JSON.parse(forecastResults.result.replace('TERMINATE', ''));
                        // Use aggregated_forecast for the table, fallback to individual forecast
                        forecastData = parsedResult.aggregated_forecast || parsedResult.forecast || [];
                        narrative = parsedResult.narrative || '';
                      }
                      
                      return (
                        <div className="space-y-6">
                          {/* Individual Product Forecasts */}
                          {(() => {
                            try {
                              // Use the same robust parsing logic
                              const parseProductAPIResponse = (resultString) => {
                                try {
                                  // Remove common prefixes/suffixes
                                  resultString = resultString.replace(/^TERMINATE\s*/, '');
                                  resultString = resultString.replace(/\s*TERMINATE$/, '');
                                  
                                  // Handle markdown-formatted JSON
                                  const jsonCodeBlockMatch = resultString.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
                                  if (jsonCodeBlockMatch) {
                                    resultString = jsonCodeBlockMatch[1];
                                  }
                                  
                                  // Handle cases with extra text
                                  const jsonMatch = resultString.match(/(\{[\s\S]*\})/);
                                  if (jsonMatch) {
                                    resultString = jsonMatch[1];
                                  }
                                  
                                  return JSON.parse(resultString);
                                } catch (error) {
                                  console.error('Product parsing failed:', error);
                                  throw error;
                                }
                              };

                              const parsedResult = parseProductAPIResponse(forecastResults.result);
                              const individualForecasts = parsedResult.forecast || [];
                              
                              if (individualForecasts.length > 0) {
                                // Group forecasts by product identifier (try multiple field names)
                                const productGroups = individualForecasts.reduce((groups, item) => {
                                  console.log('Processing forecast item:', item);
                                  const productId = item.product_id || item.product_name || item.product || item.name || 'Unknown Product';
                                  const groupKey = String(productId); // Ensure it's a string for grouping
                                  console.log('Product ID:', productId, 'Group Key:', groupKey);
                                  if (!groups[groupKey]) {
                                    groups[groupKey] = [];
                                  }
                                  groups[groupKey].push(item);
                                  return groups;
                                }, {});
                                
                                console.log('Product Groups:', productGroups);

                                return (
                                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                      <span>📦</span>
                                      <span>Product-wise Forecast</span>
                                    </h4>
                                    
                                    <div className="space-y-4">
                                      {Object.entries(productGroups).map(([productId, forecasts]) => {
                                        const productInfo = getProductInfo(productId);
                                        const totalDemand = forecasts.reduce((sum, f) => sum + parseFloat(f.predicted_quantity), 0);
                                        
                                        return (
                                          <motion.div
                                            key={productId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
                                          >
                                            <div className="flex items-center justify-between mb-3">
                                              <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center border border-white/20">
                                                  <span className="text-white text-sm font-bold">#{productId}</span>
                                                </div>
                                                <div>
                                                  <div className="text-white font-semibold">{productInfo.name || 'Unknown Product'}</div>
                                                  <div className="text-white/60 text-sm">{(productInfo.brand || 'Unknown')} • {(productInfo.category || 'Unknown')}</div>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <div className="text-purple-400 font-bold text-lg">
                                                  {`${Math.round(totalDemand)} units`}
                                                </div>
                                                <div className="text-white/60 text-sm">Total Forecast</div>
                                              </div>
                                            </div>
                                            
                                            {/* Individual forecasts for this product */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                              {forecasts.map((forecast, index) => (
                                                <div key={index} className="bg-white/5 rounded-lg p-3">
                                                  <div className="text-white/70 text-xs mb-1">
                                                    {new Date(forecast.week_of).toLocaleDateString('en-US', { 
                                                      month: 'short', 
                                                      day: 'numeric' 
                                                    })}
                                                  </div>
                                                  <div className="text-white font-semibold">
                                                    {`${Math.round(parseFloat(forecast.predicted_quantity))} units`}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </motion.div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              }
                              
                              // Fallback: If no individual forecasts, create product view from aggregated data
                              console.log('No individual forecasts found, checking aggregated forecast');
                              console.log('Aggregated forecast:', parsedResult.aggregated_forecast);
                              if (parsedResult.aggregated_forecast && parsedResult.aggregated_forecast.length > 0) {
                                return (
                                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                      <span>📦</span>
                                      <span>Product-wise Forecast</span>
                                    </h4>
                                    
                                    <div className="space-y-4">
                                      <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
                                      >
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center border border-white/20">
                                              <span className="text-white text-sm font-bold">📦</span>
                                            </div>
                                            <div>
                                              <div className="text-white font-semibold">{forecastForm.subcategory || 'Selected Products'}</div>
                                              <div className="text-white/60 text-sm">{forecastForm.category || 'Category'} • {forecastForm.warehouse || 'Warehouse'}</div>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <div className="text-purple-400 font-bold text-lg">
                                              {Math.round(parsedResult.aggregated_forecast.reduce((sum, item) => sum + parseFloat(item.predicted_quantity || 0), 0))} units
                                            </div>
                                            <div className="text-white/60 text-sm">Total Forecast</div>
                                          </div>
                                        </div>
                                        
                                        {/* Individual forecasts for aggregated data */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                          {parsedResult.aggregated_forecast.map((forecast, index) => (
                                            <div key={index} className="bg-white/5 rounded-lg p-3">
                                              <div className="text-white/70 text-xs mb-1">
                                                {new Date(forecast.week_of).toLocaleDateString('en-US', { 
                                                  month: 'short', 
                                                  day: 'numeric' 
                                                })}
                                              </div>
                                              <div className="text-white font-semibold">
                                                {`${Math.round(parseFloat(forecast.predicted_quantity || 0))} units`}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </motion.div>
                                    </div>
                                  </div>
                                );
                              }
                              
                              return null;
                            } catch (error) {
                              console.error('Error parsing individual forecasts:', error);
                              
                              // Final fallback: Show basic product info from form
                              return (
                                <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                    <span>📦</span>
                                    <span>Product-wise Forecast</span>
                                  </h4>
                                  <div className="text-center py-4">
                                    <div className="text-white/60 text-sm">
                                      Forecast available for: <span className="text-white font-medium">{forecastForm.subcategory || 'Selected products'}</span>
                                    </div>
                                    <div className="text-white/40 text-xs mt-1">
                                      Category: {forecastForm.category || 'Unknown'} • Warehouse: {forecastForm.warehouse || 'Unknown'}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          })()}

                          {/* Aggregated Forecast Table */}
                          {forecastData.length > 0 && (
                            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                                  <span>📊</span>
                                  <span>Weekly Aggregated Forecast</span>
                                </h4>
                                
                                {/* Color Legend */}
                                <div className="flex items-center space-x-3 text-xs flex-wrap">
                                  <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-400 rounded"></div>
                                    <span className="text-white/70">Low (≤3)</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-400 rounded"></div>
                                    <span className="text-white/70">Medium (4-6)</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded"></div>
                                    <span className="text-white/70">Good (7-8)</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded"></div>
                                    <span className="text-white/70">High ({'>'}8)</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b-2 border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                                      <th className="text-left py-4 px-4 text-white font-bold text-sm uppercase tracking-wider">
                                        📅 Week Of
                                      </th>
                                      <th className="text-right py-4 px-4 text-white font-bold text-sm uppercase tracking-wider">
                                        📊 Predicted Quantity
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {forecastData.map((item, index) => (
                                      <motion.tr 
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="border-b border-white/10 hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5 transition-all duration-300 group"
                                      >
                                        <td className="py-4 px-4">
                                          <div className="flex items-center space-x-3">
                                            {/* Week Number Badge */}
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-colors">
                                              <span className="text-white text-xs font-bold">{index + 1}</span>
                                            </div>
                                            
                                            {/* Formatted Date */}
                                            <div>
                                              <div className="text-white font-medium">
                                                {new Date(item.week_of).toLocaleDateString('en-US', { 
                                                  month: 'short', 
                                                  day: 'numeric' 
                                                })}
                                              </div>
                                              <div className="text-white/60 text-xs">
                                                {new Date(item.week_of).getFullYear()}
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                          <div className="flex items-center justify-end space-x-3">
                                            {/* Quantity Value */}
                                            <div className="text-right">
                                              <div className="flex items-center justify-end space-x-1">
                                                <span className="font-bold text-lg text-purple-400">
                                                  {Math.round(parseFloat(item.predicted_quantity))}
                                                </span>
                                                <span className="text-white/60 text-sm ml-1">units</span>
                                              </div>
                                            </div>
                                            
                                            {/* Visual Progress Bar */}
                                            <div className="w-20 h-6 bg-white/10 rounded-full overflow-hidden border border-white/20">
                                              <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ 
                                                  width: `${Math.min((parseFloat(item.predicted_quantity) / 10) * 100, 100)}%`
                                                }}
                                                transition={{ duration: 1, delay: index * 0.2 }}
                                                className={`h-full rounded-full ${
                                                  parseFloat(item.predicted_quantity) <= 3 
                                                    ? 'bg-gradient-to-r from-red-500 to-red-400' 
                                                    : parseFloat(item.predicted_quantity) <= 6 
                                                      ? 'bg-gradient-to-r from-yellow-500 to-orange-400' 
                                                      : parseFloat(item.predicted_quantity) <= 8 
                                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400' 
                                                        : 'bg-gradient-to-r from-green-500 to-emerald-400'
                                                }`}
                                              />
                                            </div>
                                            
                                            {/* Trend Indicator */}
                                            <div className="w-8 flex justify-center">
                                              {index > 0 && (
                                                <span className={`text-sm ${
                                                  parseFloat(item.predicted_quantity) > parseFloat(forecastData[index-1].predicted_quantity) 
                                                    ? 'text-green-400' : 
                                                  parseFloat(item.predicted_quantity) < parseFloat(forecastData[index-1].predicted_quantity)
                                                    ? 'text-red-400' : 'text-gray-400'
                                                }`}>
                                                  {parseFloat(item.predicted_quantity) > parseFloat(forecastData[index-1].predicted_quantity) ? '↗️' :
                                                   parseFloat(item.predicted_quantity) < parseFloat(forecastData[index-1].predicted_quantity) ? '📉' : '➡️'}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </td>
                                      </motion.tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              {/* Summary Stats */}
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white/5 rounded-lg p-3">
                                  <div className="text-sm text-white/70">Total Periods</div>
                                  <div className="text-xl font-bold text-green-400">{forecastData.length}</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                  <div className="text-sm text-white/70">Avg. Quantity</div>
                                  <div className="text-xl font-bold text-blue-400">
                                    {Math.round(forecastData.reduce((sum, item) => sum + parseFloat(item.predicted_quantity), 0) / forecastData.length)}
                                  </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                  <div className="text-sm text-white/70">Total Demand</div>
                                  <div className="text-xl font-bold text-purple-400">
                                    {Math.round(forecastData.reduce((sum, item) => sum + parseFloat(item.predicted_quantity), 0))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Narrative Section */}
                          {narrative && (
                            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                              <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                                <span>📝</span>
                                <span>Forecast Analysis</span>
                              </h4>
                              <p className="text-white/80 leading-relaxed text-sm">
                                {narrative}
                              </p>
                            </div>
                          )}
                          
                          {/* Raw Response (Collapsible) */}
                          <details className="bg-black/20 rounded-lg">
                            <summary className="p-4 cursor-pointer text-white/70 text-sm hover:text-white/90 transition-colors">
                              🔍 View Raw API Response
                            </summary>
                            <div className="px-4 pb-4">
                              <pre className="text-xs text-purple-300 whitespace-pre-wrap overflow-x-auto">
                                {JSON.stringify(forecastResults, null, 2)}
                              </pre>
                            </div>
                          </details>
                        </div>
                      );
                    } catch (error) {
                      return (
                        <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                          <div className="text-red-400 font-semibold mb-2">Error parsing forecast data</div>
                          <div className="text-red-300/80 text-sm mb-3">{error.message}</div>
                          <details>
                            <summary className="text-red-300/60 text-xs cursor-pointer">View raw response</summary>
                            <pre className="text-xs text-red-300/60 mt-2 whitespace-pre-wrap">
                              {JSON.stringify(forecastResults, null, 2)}
                            </pre>
                          </details>
                        </div>
                      );
                    }
                  })()}
                </motion.div>
              )}

              {/* API Response Display */}
              {apiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-sm">🌐</span>
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">Live API Response</h3>
                    <div className="px-3 py-1 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full text-xs text-green-200">
                      ✅ Connected to Azure Backend
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white/70">Total Records</div>
                      <div className="text-2xl font-bold text-green-400">{apiResponse.length}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white/70">API Warehouses</div>
                      <div className="text-2xl font-bold text-purple-400">{apiWarehouses.length}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white/70">Unique Products</div>
                      <div className="text-2xl font-bold text-blue-400">
                        {[...new Set(apiResponse.map(item => item.product_id))].length}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white/70">Forecast Active</div>
                      <div className="text-2xl font-bold text-cyan-400">✓</div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="text-sm text-white/70 mb-2">Sample API Data:</div>
                    <pre className="text-xs text-green-300 whitespace-pre-wrap">
                      {JSON.stringify(apiResponse.slice(0, 3), null, 2)}
                      {apiResponse.length > 3 && '\n... and ' + (apiResponse.length - 3) + ' more records'}
                    </pre>
                  </div>
                </motion.div>
              )}

              {/* Forecast Results Display */}

              {/* Main Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <GlassLineChart data={forecastData[forecastFilter]} title="Forecast Analytics" />
                </div>
                <Calendar />
              </div>


            </motion.div>
          )}

          

          {/* Procurement Agent */}
          {activeAgent === 'procurement' && (
            <ProcurementAgent 
              isAgentRunning={isAgentRunning}
              onRunAgent={runAgent}
            />
          )}

          {/* Inbound Agent */}
          {activeAgent === 'inbound' && (
            <InboundAgent 
              isAgentRunning={isAgentRunning}
              onRunAgent={runAgent}
            />
          )}

          {/* Order Fulfillment Agent */}
          {activeAgent === 'fulfillment' && (
            <OrderFulfillmentAgent 
              isAgentRunning={isAgentRunning}
              onRunAgent={runAgent}
            />
          )}

          {/* Return Agent */}
          {activeAgent === 'returns' && (
            <ReturnAgent 
              isAgentRunning={isAgentRunning}
              onRunAgent={runAgent}
              onRefreshData={fetchReturnsData}
              returnsData={returnsData}
              isLoadingReturns={isLoadingReturns}
              returnStats={returnData}
            />
          )}

          {/* Financial Agent */}
          {activeAgent === 'financial' && (
            <FinancialAgent 
              isAgentRunning={isAgentRunning}
              onRunAgent={runAgent}
            />
          )}

          {/* Operational Agent
          {activeAgent === 'operational' && (
            <OperationalAgent 
              isAgentRunning={isAgentRunning}
              onRunAgent={runAgent}
            />
          )} */}

          {/* Analytics Overview */}
          {activeAgent === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <span className="text-4xl">📊</span>
                  </div>
                </motion.div>
                <h1 className="text-4xl font-bold text-white mb-4">Analytics Overview</h1>
                <p className="text-white/70 text-lg mb-6">Comprehensive insights across all warehouse operations</p>
                
                {/* View Live Warehouse Button */}
                <motion.a
                  href="/products"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  <span className="text-lg">🏭</span>
                  <span className="font-semibold">View Live Warehouse</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>
              </motion.div>

              {/* Overall KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard
                  title="Total Revenue"
                  value="₹14.5L"
                  change={12.5}
                  trend="up"
                  icon="💰"
                />
                <KPICard
                  title="Active Orders"
                  value="24"
                  change={9.1}
                  trend="up"
                  icon="📦"
                />
                <KPICard
                  title="Order Processing Time"
                  value="2.4hrs"
                  change={-15.2}
                  trend="up"
                  icon="⏱️"
                />
                <KPICard
                  title="Customer Satisfaction"
                  value="4.8/5"
                  change={2.4}
                  trend="up"
                  icon="⭐"
                />
              </div>

              {/* Agent Performance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { 
                    name: 'Forecast Agent', 
                    icon: '/assets/forca.png', 
                    status: 'Active', 
                    accuracy: '96.8%', 
                    color: 'from-blue-500 to-cyan-500',
                    lastRun: '2 hours ago',
                    predictions: '147'
                  },
                  { 
                    name: 'Procurement Agent', 
                    icon: '/assets/procurement.png', 
                    status: 'Active', 
                    accuracy: '94.5%', 
                    color: 'from-purple-500 to-violet-500',
                    lastRun: '1 hour ago',
                    predictions: '203'
                  },
                  { 
                    name: 'Inbound Agent', 
                    icon: '/assets/inbound.png', 
                    status: 'Active', 
                    accuracy: '98.2%', 
                    color: 'from-green-500 to-emerald-500',
                    lastRun: '30 mins ago',
                    predictions: '89'
                  },
                  { 
                    name: 'Fulfillment Agent', 
                    icon: '/assets/fulfillment.png', 
                    status: 'Active', 
                    accuracy: '97.1%', 
                    color: 'from-orange-500 to-red-500',
                    lastRun: '45 mins ago',
                    predictions: '156'
                  }
                ].map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -8 }}
                    className={`bg-gradient-to-br ${agent.color}/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 cursor-pointer`}
                    onClick={() => setActiveAgent(agent.name.toLowerCase().split(' ')[0])}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <motion.div 
                        className="flex items-center justify-center relative"
                        whileHover={{ 
                          scale: 1.15, 
                          rotate: [0, -8, 8, -5, 5, 0],
                          y: -5
                        }}
                        transition={{ 
                          duration: 0.6,
                          ease: "easeInOut"
                        }}
                      >
                        <motion.img 
                          src={agent.icon} 
                          alt={agent.name} 
                          className="w-32 h-32 object-contain drop-shadow-2xl filter brightness-105"
                          animate={{
                            ...(index === 0 ? {
                              // Forecast Agent - Top-Down Dancing
                              scale: [1, 1.05, 1],
                              rotate: [0, 3, 0, -3, 0],
                              y: [0, -8, 0, -4, 0]
                            } : index === 1 ? {
                              // Procurement Agent - Left-Right Glide
                              scale: [1, 1.04, 1],
                              rotate: [0, -2, 0, 2, 0],
                              x: [0, -6, 0, 6, 0]
                            } : index === 2 ? {
                              // Inbound Agent - Circular Motion
                              scale: [1, 1.06, 1],
                              rotate: [0, 10, 20, 30, 0],
                              x: [0, 4, 0, -4, 0],
                              y: [0, -4, 0, 4, 0]
                            } : {
                              // Fulfillment Agent - Diagonal Bounce
                              scale: [1, 1.08, 1],
                              rotate: [0, -8, 8, 0],
                              x: [0, -3, 3, 0],
                              y: [0, -5, 5, 0]
                            })
                          }}
                          transition={{ 
                            duration: index === 0 ? 3 : index === 1 ? 3.5 : index === 2 ? 4.5 : 3.2,
                            delay: index * 0.3,
                            ease: "easeInOut",
                            repeat: Infinity
                          }}
                          whileHover={{ 
                            scale: 1.25,
                            rotate: [0, 15, -15, 10, -10, 0],
                            transition: { duration: 0.6 }
                          }}
                        />
                      </motion.div>
                      <div className="px-2 py-1 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full text-xs text-green-200">
                        {agent.status}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{agent.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">Accuracy</span>
                        <span className="text-sm font-bold text-white">{agent.accuracy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">Last Run</span>
                        <span className="text-sm text-white/80">{agent.lastRun}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">Predictions</span>
                        <span className="text-sm text-purple-400 font-bold">{agent.predictions}</span>
                      </div>
                    </div>
                    <div className="mt-4 w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: agent.accuracy }}
                        transition={{ duration: 2, delay: index * 0.2 }}
                        className={`h-2 rounded-full bg-gradient-to-r ${agent.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Additional Agent Cards and Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { 
                    name: 'Return Agent', 
                    icon: '/assets/return.png', 
                    status: 'Active', 
                    accuracy: '95.3%', 
                    color: 'from-pink-500 to-rose-500',
                    lastRun: '1.5 hours ago',
                    predictions: '92'
                  },
                  { 
                    name: 'Financial Agent', 
                    icon: '/assets/financial.png', 
                    status: 'Active', 
                    accuracy: '99.1%', 
                    color: 'from-yellow-500 to-amber-500',
                    lastRun: '20 mins ago',
                    predictions: '78'
                  }
                ].map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -8 }}
                    className={`bg-gradient-to-br ${agent.color}/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 cursor-pointer`}
                    onClick={() => setActiveAgent(agent.name === 'Return Agent' ? 'returns' : agent.name.toLowerCase().split(' ')[0])}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <motion.div 
                        className="flex items-center justify-center relative"
                        whileHover={{ 
                          scale: 1.15, 
                          rotate: [0, -8, 8, -5, 5, 0],
                          y: -5
                        }}
                        transition={{ 
                          duration: 0.6,
                          ease: "easeInOut"
                        }}
                      >
                        <motion.img 
                          src={agent.icon} 
                          alt={agent.name} 
                          className="w-32 h-32 object-contain drop-shadow-2xl filter brightness-105"
                          animate={{
                            ...(index === 0 ? {
                              // Return Agent - Wobble Motion
                              scale: [1, 1.07, 1],
                              rotate: [0, 5, -5, 5, 0],
                              x: [0, -2, 2, -2, 0],
                              y: [0, -3, 3, 0]
                            } : {
                              // Financial Agent - Pulse Motion
                              scale: [1, 1.09, 1],
                              rotate: [0, 2, -2, 0],
                              y: [0, -6, 0, -3, 0]
                            })
                          }}
                          transition={{ 
                            duration: index === 0 ? 3.8 : 2.8,
                            delay: index * 0.3,
                            ease: "easeInOut",
                            repeat: Infinity
                          }}
                          whileHover={{ 
                            scale: 1.25,
                            rotate: [0, 15, -15, 10, -10, 0],
                            transition: { duration: 0.6 }
                          }}
                        />
                      </motion.div>
                      <div className="px-2 py-1 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full text-xs text-green-200">
                        {agent.status}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{agent.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">Accuracy</span>
                        <span className="text-sm font-bold text-white">{agent.accuracy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">Last Run</span>
                        <span className="text-sm text-white/80">{agent.lastRun}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">Predictions</span>
                        <span className="text-sm text-purple-400 font-bold">{agent.predictions}</span>
                      </div>
                    </div>
                    <div className="mt-4 w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: agent.accuracy }}
                        transition={{ duration: 2, delay: index * 0.2 }}
                        className={`h-2 rounded-full bg-gradient-to-r ${agent.color}`}
                      />
                    </div>
                  </motion.div>
                ))}

                {/* Real-time Analytics Dashboard */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 flex flex-col lg:col-span-2"
                >
                  <div className="relative w-full flex-1 bg-black/20 rounded-xl overflow-hidden border border-white/10">
                    <video 
                      className="w-full h-full object-cover rounded-xl"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src="/assets/analytics.mp4" type="video/mp4" />
                      <div className="flex items-center justify-center h-full text-white/70">
                        Video not supported
                      </div>
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-white/90 font-medium">Real-time Analytics Dashboard</div>
                        <div className="px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs text-green-200">
                          ● Live
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Warehouse Status Grid */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { name: 'WH-Delhi', utilization: 87, orders: 234, status: 'Optimal', route: '/products/delhi' },
                  { name: 'WH-Bhubaneswar', utilization: 92, orders: 189, status: 'High', route: '/products/bbsr' },
                  { name: 'WH-Pune', utilization: 76, orders: 156, status: 'Normal', route: '/products/pune' },
                  { name: 'WH-Kolkata', utilization: 81, orders: 203, status: 'Normal', route: '/products/kolkata' }
                ].map((warehouse, index) => (
                  <motion.div
                    key={warehouse.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(warehouse.route, '_blank')}
                    className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-white">{warehouse.name}</h3>
                        <span className="text-blue-400 text-sm opacity-70 hover:opacity-100 transition-opacity">
                          🔗
                        </span>
                      </div>
                      <div className={`px-2 py-1 backdrop-blur-sm border rounded-full text-xs ${
                        warehouse.status === 'Optimal' ? 'bg-green-500/20 border-green-400/30 text-green-200' :
                        warehouse.status === 'High' ? 'bg-orange-500/20 border-orange-400/30 text-orange-200' :
                        'bg-blue-500/20 border-blue-400/30 text-blue-200'
                      }`}>
                        {warehouse.status}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-white/70">Utilization</span>
                          <span className="text-sm font-bold text-white">{warehouse.utilization}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${warehouse.utilization}%` }}
                            transition={{ duration: 2, delay: index * 0.2 }}
                            className={`h-2 rounded-full ${
                              warehouse.utilization > 90 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                              warehouse.utilization > 80 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              'bg-gradient-to-r from-green-500 to-emerald-500'
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">Active Orders</span>
                        <span className="text-sm font-bold text-purple-400">{warehouse.orders}</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="text-center text-xs text-blue-400 opacity-70 hover:opacity-100 transition-opacity">
                          💻 Click to view warehouse →
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div> */}

              

              {/* Quick Actions */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: '📈', label: 'Run All Forecasts', action: () => setActiveAgent('forecast') },
                    { icon: '🔄', label: 'Sync Inventory', action: () => setActiveAgent('inbound') },
                    { icon: '📊', label: 'Generate Reports', action: () => console.log('Generate Reports') },
                    { icon: '⚙️', label: 'System Settings', action: () => console.log('Settings') }
                  ].map((item, index) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={item.action}
                      className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-center"
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="text-sm font-medium">{item.label}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div> */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task Planner Modal */}
        <TaskPlannerModal />

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
    </div>
  );
};

export default ManagerDashboard;
