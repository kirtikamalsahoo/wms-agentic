'use client';

import { useState } from 'react';
import FinancialAgent from '../../components/agents/FinancialAgent';

export default function FinancialAgentPage() {
  const [isAgentRunning, setIsAgentRunning] = useState(false);

  const runAgent = (agentType) => {
    setIsAgentRunning(true);
    setTimeout(() => {
      setIsAgentRunning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <FinancialAgent 
          isAgentRunning={isAgentRunning}
          onRunAgent={runAgent}
        />
      </div>
    </div>
  );
}