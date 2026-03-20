import React from 'react';
import { Handle, Position } from 'reactflow';

export default function CustomNode({ data, selected }) {
  const bgColors = {
    navy: 'bg-[#002855] text-white border-[#003b7a]',
    green: 'bg-[#10B981] text-white border-[#047857]',
    red: 'bg-[#EF4444] text-white border-[#B91C1C]',
    gray: 'bg-[#374151] text-white border-[#1F2937]'
  };

  const bgColor = bgColors[data.color] || bgColors.gray;
  
  // Outer glow if it's an alert or selected
  const glow = data.isAlert ? 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 
               selected ? 'shadow-[0_0_15px_rgba(59,130,246,0.6)] ring-2 ring-blue-400' : 'shadow-md';

  return (
    <div className={`px-5 py-3 rounded-lg border-2 ${bgColor} ${glow} flex flex-col items-center justify-center min-w-[160px] transition-all duration-300 hover:scale-105 cursor-pointer`}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-gray-400 border-none" />
      
      {data.image && (
        <div className="w-12 h-12 mb-2 bg-white rounded-full p-2 flex items-center justify-center shadow-inner">
          <img src={data.image} alt="icon" className="w-full h-full object-contain" />
        </div>
      )}
      
      <div className="font-bold text-[13px] text-center leading-tight whitespace-pre-wrap">{data.label}</div>
      {data.sublabel && (
        <div className="text-[11px] opacity-80 mt-1 font-medium">{data.sublabel}</div>
      )}

      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-gray-400 border-none" />
    </div>
  );
}
