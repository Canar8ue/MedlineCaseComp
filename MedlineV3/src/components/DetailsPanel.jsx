import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CONTENT_DB } from '../data';
import { Activity, X, Info, Lightbulb } from 'lucide-react';

export default function DetailsPanel({ selectedId, onClose }) {
  const content = CONTENT_DB[selectedId];

  return (
    <AnimatePresence>
      {selectedId && content && (
        <motion.div
          initial={{ x: 450, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 450, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          className="fixed right-0 top-0 bottom-0 w-[440px] bg-white/95 backdrop-blur-xl border-l border-gray-200 shadow-2xl flex flex-col z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-[#002855]">{content.title || 'Details'}</h2>
              <p className="text-sm text-gray-500 mt-1">{content.desc}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Plain English "What This Means" Box */}
            {content.whatItMeans && (
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-[#002855] mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-2"/>What This Means
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{content.whatItMeans}</p>
              </div>
            )}

            {/* Core Stats Overview */}
            {content.stats && (
              <div className="grid grid-cols-2 gap-4">
                {content.stats.map((stat, i) => (
                  <div key={i} className={`p-4 rounded-xl border-l-4 shadow-sm bg-white ${
                    stat.color === 'red' ? 'border-red-500' : 
                    stat.color === 'green' ? 'border-emerald-500' : 'border-[#002855]'
                  }`}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${
                      stat.color === 'red' ? 'text-red-600' : 
                      stat.color === 'green' ? 'text-emerald-600' : 'text-[#002855]'
                    }`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Medline Action Strategy Box */}
            {content.medlineAction && (
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-sm">
                <h3 className="text-sm font-bold text-emerald-800 mb-2 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2"/>Medline's Opportunity
                </h3>
                <p className="text-sm text-gray-800 leading-relaxed font-semibold">{content.medlineAction}</p>
              </div>
            )}

            {/* Charts Data */}
            {content.chartData && (
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-[320px]">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-blue-500"/>
                  Hoarding vs Burn Rate
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={content.chartData} margin={{ top: 5, right: 0, left: -20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorPanic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}/>
                    <Area type="monotone" dataKey="PanicBuy" name="Panic Volume %" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorPanic)" />
                    <Area type="monotone" dataKey="BurnRate" name="Depletion %" stroke="#002855" strokeWidth={2} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {content.revenueData && (
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-[300px]">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-emerald-500"/>
                  Revenue Capture Framework (Billions)
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={content.revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} cursor={{fill: 'transparent'}}/>
                    <Bar dataKey="Value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
