import React from 'react';
import { motion } from 'framer-motion';
import { TIMELINE_EVENTS } from '../data';
import clsx from 'clsx';

export default function TimelineNav({ selectedId, onClick }) {
  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between overflow-x-auto shadow-sm">
      <div className="flex items-center space-x-2 min-w-max">
        {TIMELINE_EVENTS.map((event, idx) => (
          <React.Fragment key={event.id}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onClick(event.id)}
              className={clsx(
                "relative flex flex-col items-center p-3 rounded-lg border-2 transition-colors cursor-pointer",
                selectedId === event.id 
                  ? "bg-blue-50 border-blue-500 shadow-md" 
                  : event.alert 
                    ? "bg-red-50 border-red-200 hover:border-red-400"
                    : "bg-white border-gray-200 hover:border-gray-300"
              )}
            >
              <span className={clsx(
                "text-xs font-bold mb-1", 
                event.alert ? "text-red-700" : "text-[#002855]"
              )}>
                {event.week}
              </span>
              <span className="text-[11px] font-medium text-gray-600 w-24 text-center leading-tight">
                {event.title}
              </span>
              {selectedId === event.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute -bottom-2 w-2 h-2 bg-blue-500 rounded-full"
                />
              )}
            </motion.button>
            
            {idx < TIMELINE_EVENTS.length - 1 && (
              <div className="w-8 h-[2px] bg-gray-300 rounded-full shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
