import React, { useState } from 'react';
import TimelineNav from './components/TimelineNav';
import FlowGraph from './components/FlowGraph';
import DetailsPanel from './components/DetailsPanel';

export default function App() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden font-sans">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-[#002855] to-[#004b9e] text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-lg relative z-20">
        <div className="flex items-center space-x-6">
          {/* Logo prominently larger */}
          <div className="bg-white px-4 py-2 rounded flex items-center justify-center shadow-md">
            <img src="/Logo.png" alt="Medline Logo" className="h-10 object-contain" />
          </div>
          <div className="border-l-2 border-white/20 pl-6">
            <h1 className="text-2xl font-bold tracking-tight">Predictive Supply Chain Intelligence</h1>
            <p className="text-sm text-blue-100 font-medium tracking-wide">Strategic Competitor Analysis Platform</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="px-6 py-2.5 bg-emerald-500/20 rounded-full border-2 border-emerald-400/40 text-sm font-medium shadow-inner">
            Addressable Pipeline: <span className="font-bold text-white text-base ml-1">$10.5B</span>
          </div>
        </div>
      </header>

      {/* Interactive Timeline */}
      <div className="relative z-10 shadow-md">
        <TimelineNav selectedId={selectedId} onClick={setSelectedId} />
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 relative overflow-hidden bg-[url('/Background.png')] bg-cover bg-center">
        {/* Semi-transparent overlay so the Flow graph pops */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[6px]"></div>
        
        <div className="absolute inset-3">
          <FlowGraph onNodeClick={setSelectedId} />
        </div>
      </div>

      {/* Slide-out Details Panel */}
      <DetailsPanel 
        selectedId={selectedId} 
        onClose={() => setSelectedId(null)} 
      />
    </div>
  );
}
