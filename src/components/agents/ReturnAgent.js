'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart } from '@mui/x-charts';
import { Box } from '@mui/material';

const ReturnAgent = ({ isAgentRunning, onRunAgent, onRefreshData, returnsData = [], isLoadingReturns = false, returnStats }) => {
  const [inspectionNote, setInspectionNote] = useState('');
  const [returnId, setReturnId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const [agentResults, setAgentResults] = useState(null);
  const [submittedNotes, setSubmittedNotes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success'); // 'success' or 'error'
  // Return stats now come from props
  const stats = returnStats || {
    totalReturns: 156,
    pendingInspection: 23,
    processed: 133,
    thisMonth: 45
  };

  const showPopupMessage = useCallback((message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
  }, []);

  // Data fetching is now handled by parent component

  // Manual refresh only - no automatic fetching to prevent infinite loops
  // fetchReturnsData will only be called when refresh button is clicked

  // Get status styling based on return status
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border border-green-400/30';
      case 'pending inspection':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-300 border border-blue-400/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border border-red-400/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-400/30';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate pipeline statistics from returns data - memoized to prevent re-renders
  const pipelineStats = useMemo(() => {
    if (returnsData.length === 0) {
      return {
        returnRequest: 0,
        inspection: 0,
        classification: 0,
        processing: 0,
        completed: 0
      };
    }

    const stats = {
      returnRequest: 0,
      inspection: 0,
      classification: 0,
      processing: 0,
      completed: 0
    };

    returnsData.forEach(returnItem => {
      const status = returnItem.return_status?.toLowerCase();
      const hasClassification = returnItem.classification && returnItem.classification !== null;
      
      // Count based on status and classification
      if (status === 'completed') {
        stats.completed++;
      } else if (status === 'processing') {
        stats.processing++;
      } else if (status === 'pending inspection') {
        stats.inspection++;
      } else {
        // Default to return request for other statuses
        stats.returnRequest++;
      }

      // If item has classification but isn't completed, count it in classification stage
      if (hasClassification && status !== 'completed') {
        stats.classification++;
      }
    });

    return stats;
  }, [returnsData]);

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    if (!inspectionNote.trim() || !returnId.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Prepare the API payload
      const payload = {
        return_id: parseInt(returnId, 10),
        inspection_notes: inspectionNote.trim()
      };

      console.log('Submitting inspection note:', payload);

      // Call the inspection notes API through our Next.js API route to avoid CORS issues
      const response = await fetch('/api/inspection-notes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Inspection note submitted successfully:', responseData);
        
        const newNote = {
          id: Date.now(),
          returnId: returnId,
          note: inspectionNote,
          timestamp: new Date().toLocaleString(),
          status: 'submitted'
        };
        
        setSubmittedNotes(prev => [newNote, ...prev]);
        setInspectionNote('');
        setReturnId('');
        
        // Show success message
        showPopupMessage(`Inspection note submitted successfully for Return ID: ${returnId}`, 'success');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to submit inspection note:', errorData);
        showPopupMessage(`Failed to submit inspection note. Please try again later. Error: ${errorData.error || errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error submitting inspection note:', error);
      showPopupMessage('Failed to submit inspection note due to network error. Please check your connection and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunAgent = async () => {
    setIsRunningAgent(true);
    
    try {
      const response = await fetch('/api/returns-classification-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Returns classification agent response:', responseData);
        
        // Parse the output from the API response
        let parsedOutput = {};
        let updatedCount = 0;
        let updates = [];
        
        if (responseData.status === 'success' && responseData.output) {
          try {
            // Extract JSON from the output string (remove "TERMINATE" and parse)
            const jsonStr = responseData.output.replace(/\nTERMINATE$/, '');
            parsedOutput = JSON.parse(jsonStr);
            updatedCount = parsedOutput.updated_count || 0;
            updates = parsedOutput.updates || [];
            
            console.log('Parsed output:', parsedOutput);
          } catch (parseError) {
            console.error('Error parsing output:', parseError);
          }
        }

        // Count classifications
        const classificationCounts = {
          restock: 0,
          refurbished: 0,
          discard: 0,
          totalProcessed: updatedCount
        };

        // Count each classification type
        updates.forEach(update => {
          const classification = update.classification?.toLowerCase();
          if (classification === 'restock') {
            classificationCounts.restock++;
          } else if (classification === 'refurbished') {
            classificationCounts.refurbished++;
          } else if (classification === 'discard') {
            classificationCounts.discard++;
          }
        });

        const results = {
          ...classificationCounts,
          processingTime: '1.2 minutes',
          rawOutput: responseData.output,
          updates: updates
        };
        
        setAgentResults(results);
        
        // Refresh the returns data to show updated classifications
        onRefreshData();
        
        showPopupMessage(`Returns classification completed! Updated ${updatedCount} returns.`, 'success');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to run returns classification agent:', errorData);
        showPopupMessage(`Failed to run returns classification agent. Error: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error running returns classification agent:', error);
      showPopupMessage('Failed to run returns classification agent due to network error.', 'error');
    } finally {
      setIsRunningAgent(false);
    }
  };

  const KPICard = useCallback(({ title, value, icon, color, description }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`bg-gradient-to-br ${color} backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/70 mb-1">{title}</p>
          <div className="text-3xl font-bold text-white mb-2">{value}</div>
          <p className="text-xs text-white/60">{description}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </motion.div>
  ), []);

  const ReturnPieChart = useMemo(() => {
    if (!agentResults) return null;

    // Filter out zero values for cleaner pie chart
    const chartData = [
      { id: 0, value: agentResults.refurbished, label: 'Refurbished', color: '#10B981' },
      { id: 1, value: agentResults.restock, label: 'Restock', color: '#3B82F6' },
      { id: 2, value: agentResults.discard, label: 'Discard', color: '#EF4444' }
    ].filter(item => item.value > 0);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <span>📊</span>
            <span>Classification Results</span>
          </h3>
          <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs text-green-200">
            ✅ Updated {agentResults.totalProcessed} returns in {agentResults.processingTime}
          </div>
        </div>

        {chartData.length > 0 ? (
          <>
            <Box sx={{ width: '100%', height: 300 }}>
              <PieChart
                series={[{
                  data: chartData,
                  innerRadius: 60,
                  outerRadius: 120,
                  paddingAngle: 3,
                  cornerRadius: 8,
                  highlightScope: { faded: 'global', highlighted: 'item' }
                }]}
                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                slotProps={{
                  legend: {
                    direction: 'column',
                    position: { vertical: 'middle', horizontal: 'right' },
                    padding: 0
                  }
                }}
                sx={{
                  '& .MuiChartsLegend-series text': { fill: 'white !important' },
                  '& .MuiChartsLegend-label': { fill: 'white !important' },
                  '& .MuiChartsLegend-root text': { fill: 'white !important' },
                  '& text': { fill: 'white !important' }
                }}
              />
            </Box>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{agentResults.refurbished}</div>
                <div className="text-xs text-white/70">Refurbished</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{agentResults.restock}</div>
                <div className="text-xs text-white/70">Restock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{agentResults.discard}</div>
                <div className="text-xs text-white/70">Discard</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-2">📊</div>
            <div className="text-white/80">No classifications to display</div>
            <div className="text-white/60 text-sm mt-1">Run the agent to see classification results</div>
          </div>
        )}

        {/* Updated Returns Details */}
        {agentResults.updates && agentResults.updates.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <h4 className="text-sm font-medium text-white/80 mb-3 flex items-center space-x-2">
              <span>🔄</span>
              <span>Recently Updated Returns</span>
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {agentResults.updates.slice(0, 5).map((update, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between text-sm bg-white/5 rounded-lg p-2"
                >
                  <span className="text-white/90">Return #{update.return_id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    update.classification?.toLowerCase() === 'restock' ? 'bg-blue-500/20 text-blue-300' :
                    update.classification?.toLowerCase() === 'refurbished' ? 'bg-green-500/20 text-green-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {update.classification}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }, [agentResults]);

  return (
    <motion.div
      key="returns"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Return Management Agent</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (onRefreshData) onRefreshData();
          }}
          disabled={isLoadingReturns}
          className={`px-4 py-2 bg-gradient-to-r from-blue-500/50 to-purple-500/50 backdrop-blur-sm border border-white/20 text-white rounded-lg transition-all duration-300 flex items-center space-x-2 ${
            isLoadingReturns ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-500/70 hover:to-purple-500/70 hover:border-white/30'
          }`}
        >
          <motion.div
            animate={isLoadingReturns ? { rotate: 360 } : {}}
            transition={isLoadingReturns ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            🔄
          </motion.div>
          <span>{isLoadingReturns ? 'Refreshing...' : 'Refresh Data'}</span>
        </motion.button>
      </div>
      
      {/* Return Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Return Requests" 
          value={stats.totalReturns} 
          icon="📦" 
          color="from-blue-600/20 to-blue-800/20"
          description="All time returns"
        />
        <KPICard 
          title="Pending Inspection" 
          value={stats.pendingInspection} 
          icon="🔍" 
          color="from-yellow-600/20 to-orange-600/20"
          description="Awaiting review"
        />
        <KPICard 
          title="Processed Returns" 
          value={stats.processedReturns || stats.processed} 
          icon="✅" 
          color="from-green-600/20 to-emerald-600/20"
          description="Completed processing"
        />
        <KPICard 
          title="This Month" 
          value={stats.thisMonth} 
          icon="📅" 
          color="from-purple-600/20 to-indigo-600/20"
          description="Current month returns"
        />
      </div>

      {/* Inspection Note Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
            <span className="text-2xl">📝</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Inspection Note</h3>
            <p className="text-white/60">Add notes for return inspection</p>
          </div>
        </div>

        <form onSubmit={handleSubmitNote} className="space-y-6">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="space-y-3"
          >
            <label className="block text-white/80 text-sm font-medium">Return ID</label>
            <input
              key="return-id-input"
              type="number"
              value={returnId}
              onChange={(e) => setReturnId(e.target.value)}
              placeholder="Enter Return ID"
              className="w-full h-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 text-white placeholder-white/50 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
              required
            />
          </motion.div>
          
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="space-y-3"
          >
            <label className="block text-white/80 text-sm font-medium">Inspection Notes</label>
            <textarea
              key="inspection-note-textarea"
              value={inspectionNote}
              onChange={(e) => setInspectionNote(e.target.value)}
              placeholder="Enter inspection details, condition assessment, recommended actions..."
              className="w-full h-32 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-white/50 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-400/20 resize-none transition-all duration-300"
              required
            />
          </motion.div>
          
          <div className="pt-4 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting || !inspectionNote.trim() || !returnId.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500/80 to-cyan-500/80 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:border-white/40 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>📝</span>
                <span>Submit Inspection Note</span>
              </div>
            )}
            </motion.button>
          </div>
        </form>

        {/* Recent Notes */}
        {submittedNotes.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-sm font-medium text-white/80 mb-4 flex items-center space-x-2">
              <span>📋</span>
              <span>Recent Inspection Notes</span>
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {submittedNotes.slice(0, 3).map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm text-white/90 flex-1 pr-3 leading-relaxed">{note.note}</div>
                    {note.returnId && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium shrink-0">
                        ID: {note.returnId}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/50">{note.timestamp}</div>
                    <div className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                      ✅ Submitted
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Run Agent Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
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
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 overflow-hidden">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1, 1.05, 1],
                    rotate: [0, 3, 0, -3, 0],
                  }}
                  transition={{ 
                    duration: 3.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-4xl"
                >
                  🔄
                </motion.div>
              </div>
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Return Processing Agent</h3>
              <p className="text-white/70">Analyze returns and categorize for next actions</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRunAgent}
            disabled={isRunningAgent}
            className="px-8 py-4 bg-gradient-to-r from-purple-500/80 to-indigo-500/80 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:border-white/40 transition-all duration-300 disabled:opacity-50"
          >
            {isRunningAgent ? (
              <div className="flex items-center space-x-2">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Processing Returns...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>🤖</span>
                <span>Run Return Agent</span>
              </div>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Agent Results - Pie Chart */}
      {agentResults && ReturnPieChart}

      {/* Return Processing Pipeline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <span>🔄</span>
            <span>Return Processing Pipeline</span>
          </h3>
          <div className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs text-blue-200">
            📊 Live Data from {returnsData.length} Returns
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {(() => {
            return [
              { 
                stage: 'Return Request', 
                count: pipelineStats.returnRequest, 
                color: 'from-blue-500 to-cyan-500', 
                icon: '📝',
                description: 'New requests'
              },
              { 
                stage: 'Inspection', 
                count: pipelineStats.inspection, 
                color: 'from-yellow-500 to-orange-500', 
                icon: '🔍',
                description: 'Pending inspection'
              },
              { 
                stage: 'Classification', 
                count: pipelineStats.classification, 
                color: 'from-purple-500 to-pink-500', 
                icon: '📊',
                description: 'Being classified'
              },
              { 
                stage: 'Processing', 
                count: pipelineStats.processing, 
                color: 'from-green-500 to-emerald-500', 
                icon: '⚙️',
                description: 'In processing'
              },
              { 
                stage: 'Completed', 
                count: pipelineStats.completed, 
                color: 'from-indigo-500 to-blue-500', 
                icon: '✅',
                description: 'Fully processed'
              }
            ];
          })().map((stage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${stage.color} bg-opacity-20 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center hover:border-white/20 transition-all duration-300 group cursor-pointer`}
              title={`${stage.description}: ${stage.count} returns`}
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {stage.icon}
              </div>
              <motion.div 
                key={stage.count}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-white mb-1"
              >
                {stage.count}
              </motion.div>
              <div className="text-sm text-white/80 mb-1">{stage.stage}</div>
              <div className="text-xs text-white/60">{stage.description}</div>
            </motion.div>
          ))}
        </div>
        
        {/* Pipeline Summary */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/70">
              Total Returns: <span className="text-white font-medium">{returnsData.length}</span>
            </div>
            <div className="text-white/70">
              Completion Rate: <span className="text-green-400 font-medium">
                {returnsData.length > 0 
                  ? `${Math.round((pipelineStats.completed / returnsData.length) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
            <div className="text-white/70">
              Last Updated: <span className="text-blue-400 font-medium">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Returns Data Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <span>📋</span>
            <span>Returns Data</span>
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefreshData}
            disabled={isLoadingReturns}
            className="px-4 py-2 bg-gradient-to-r from-blue-500/80 to-cyan-500/80 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:border-white/40 transition-all duration-300 disabled:opacity-50"
          >
            {isLoadingReturns ? (
              <div className="flex items-center space-x-2">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>🔄</span>
                <span>Refresh</span>
              </div>
            )}
          </motion.button>
        </div>

        {isLoadingReturns ? (
          <div className="flex items-center justify-center py-12">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
            />
          </div>
        ) : returnsData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/80 font-medium py-3 px-2 text-sm">Return ID</th>
                  <th className="text-left text-white/80 font-medium py-3 px-2 text-sm">Order ID</th>
                  <th className="text-left text-white/80 font-medium py-3 px-2 text-sm">Product</th>
                  <th className="text-left text-white/80 font-medium py-3 px-2 text-sm">Cusomer Reason</th>
                  <th className="text-left text-white/80 font-medium py-3 px-2 text-sm">Inspection Note</th>
                  <th className="text-left text-white/80 font-medium py-3 px-2 text-sm">Status</th>
                  <th className="text-left text-white/80 font-medium py-3 px-2 text-sm">Classification</th>
                  <th className="text-left text-white/80 font-medium py-3 px-2 text-sm">Quantity</th>
                  <th className="text-left text-white/80 font-medium py-3 px-2 text-sm">Requested At</th>
                </tr>
              </thead>
              <tbody>
                {returnsData.map((returnItem, index) => (
                  <motion.tr
                    key={returnItem.return_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-all duration-300"
                  >
                    <td className="py-4 px-2">
                      <div className="text-white font-medium">#{returnItem.return_id}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-white/90">#{returnItem.order_id}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-white/90 max-w-32 truncate" title={returnItem.product_name}>
                        {returnItem.product_name}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-white/80 text-sm max-w-40 truncate" title={returnItem.reason_for_return}>
                        {returnItem.reason_for_return}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-white/80 text-sm max-w-40 truncate" title={returnItem.inspection_notes}>
                        {returnItem.inspection_notes}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(returnItem.return_status)}`}>
                        {returnItem.return_status}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-white/80 text-sm">
                        {returnItem.classification || 'Pending'}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-white/90 text-center">{returnItem.return_quantity}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-white/70 text-xs">
                        {formatDate(returnItem.requested_at)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-2">📦</div>
            <div className="text-white/80">No returns data available</div>
            <div className="text-white/60 text-sm mt-1">Click refresh to load data</div>
          </div>
        )}
      </motion.div>

      {/* Popup Modal */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPopup(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border ${
              popupType === 'success' 
                ? 'border-green-500/20' 
                : 'border-red-500/20'
            } w-full max-w-md shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 border-b ${
              popupType === 'success' 
                ? 'border-green-500/20' 
                : 'border-red-500/20'
            }`}>
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  popupType === 'success' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  <span className="text-2xl">
                    {popupType === 'success' ? '✅' : '❌'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {popupType === 'success' ? 'Success!' : 'Error'}
                  </h3>
                  <p className={`text-sm ${
                    popupType === 'success' 
                      ? 'text-green-300' 
                      : 'text-red-300'
                  }`}>
                    Inspection Note Submission
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-white/90 text-sm leading-relaxed mb-6">
                {popupMessage}
              </p>

              {/* Action Button */}
              <button
                onClick={() => setShowPopup(false)}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                  popupType === 'success'
                    ? 'bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-400'
                    : 'bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-400'
                }`}
              >
                {popupType === 'success' ? 'Great!' : 'Try Again'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default React.memo(ReturnAgent);
