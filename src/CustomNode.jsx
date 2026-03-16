// src/CustomNode.jsx
import { Handle, Position, useStore } from '@xyflow/react';

export default function CustomNode({ data }) {
  const zoom = useStore((s) => s.transform[2]);

  let sizeClasses = "w-32 h-32"; 
  let labelClasses = "text-lg";
  let isNodeVisible = true;
  let showDetails = true;

  if (data.level === 2) {
    sizeClasses = zoom > 0.6 ? "w-28 h-28" : "w-20 h-20";
    labelClasses = zoom > 0.6 ? "text-base" : "text-sm";
    isNodeVisible = zoom > 0.3; 
    showDetails = zoom > 0.7;   
  } else if (data.level >= 3) {
    sizeClasses = zoom > 0.8 ? "w-20 h-20" : "w-12 h-12";
    labelClasses = zoom > 0.8 ? "text-xs" : "text-[10px]";
    isNodeVisible = zoom > 0.5;
    showDetails = zoom > 1.0;
  }

  // --- NEW: AESTHETIC POLISH LOGIC ---
  // Default to the classic solid circle
  let shapeClasses = "rounded-full"; 
  let colorClasses = "bg-[#fffdf7] dark:bg-stone-900 border-2 border-red-600 dark:border-red-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] dark:shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]";

  const tags = data.tags || [];

  if (tags.includes('Root')) {
    // Heavy, foundational glowing squares
    shapeClasses = "rounded-2xl"; 
    colorClasses = "bg-red-50 dark:bg-red-950/30 border-2 border-red-700 dark:border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]";
  } else if (tags.includes('Chapter')) {
    // Lighter, dashed circles for sub-components
    shapeClasses = "rounded-full";
    colorClasses = "bg-white/80 dark:bg-stone-900/80 border-2 border-dashed border-amber-500 dark:border-amber-600 shadow-sm hover:border-amber-600 hover:shadow-md";
  } else if (tags.includes('Stotra') || tags.includes('Darshana')) {
    // Rectangular "book/scroll" shapes with a saffron tint
    shapeClasses = "rounded-md"; 
    colorClasses = "bg-amber-50/90 dark:bg-amber-900/20 border-2 border-amber-600 dark:border-amber-500 shadow-md hover:shadow-lg";
  }
  // -----------------------------------

  if (!isNodeVisible) {
    return (
      <div className={`w-4 h-4 ${shapeClasses} bg-amber-500/80 dark:bg-red-500/80 shadow-sm transition-all`} title={data.label}>
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <Handle type="target" position={Position.Bottom} className="opacity-0" />
        <Handle type="target" position={Position.Left} className="opacity-0" />
        <Handle type="target" position={Position.Right} className="opacity-0" />
        <Handle type="source" position={Position.Top} className="opacity-0" />
        <Handle type="source" position={Position.Bottom} className="opacity-0" />
        <Handle type="source" position={Position.Left} className="opacity-0" />
        <Handle type="source" position={Position.Right} className="opacity-0" />
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses} ${shapeClasses} ${colorClasses} flex flex-col items-center justify-center transition-all duration-300 cursor-pointer text-center p-2`}
      title={data.description}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="target" position={Position.Bottom} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="target" position={Position.Right} className="opacity-0" />
      
      <span className={`font-bold text-red-700 dark:text-red-400 ${labelClasses} transition-opacity duration-300 ${showDetails ? 'opacity-100' : 'opacity-0 hidden'}`}>
        {data.label}
      </span>
      
      {showDetails && (
        <span className="text-xs text-amber-600 dark:text-amber-500 mt-1 font-serif transition-opacity duration-300">
          {data.sanskritName}
        </span>
      )}

      <Handle type="source" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}