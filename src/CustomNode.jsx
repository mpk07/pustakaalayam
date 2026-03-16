// src/CustomNode.jsx
import { Handle, Position } from '@xyflow/react';

export default function CustomNode({ data }) {
  let sizeClasses = "w-44 h-44"; 
  let labelClasses = "text-3xl";
  let shapeClasses = "rounded-full"; 
  let colorClasses = "bg-[#fffdf7] dark:bg-stone-900 border-2 border-red-600 dark:border-red-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] dark:shadow-[0_0_15px_rgba(239,68,68,0.2)]";

  // --- NEW: MASSIVE HIERARCHY SCALE ---
  if (data.level === 1) {
    // Roots (Shruti/Smriti) become massive anchors
    sizeClasses = "w-48 h-48"; 
    labelClasses = "text-3xl";
  } else if (data.level === 2) {
    // Major Texts (Vedas, Epics) become large planets
    sizeClasses = "w-36 h-36"; 
    labelClasses = "text-xl";
  } else if (data.level >= 3) {
    // Chapters and Deep Texts stay as small orbital moons
    sizeClasses = "w-20 h-20"; 
    labelClasses = "text-sm";
  }

  // Aesthetics based on tags
  const tags = data.tags || [];
  if (tags.includes('Root')) {
    shapeClasses = "rounded-2xl"; 
    colorClasses = "bg-red-50 dark:bg-red-950/30 border-2 border-red-700 dark:border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]";
  } else if (tags.includes('Chapter')) {
    shapeClasses = "rounded-full";
    colorClasses = "bg-white/80 dark:bg-stone-900/80 border-2 border-dashed border-amber-500 dark:border-amber-600 shadow-sm hover:border-amber-600";
  } else if (tags.includes('Stotra') || tags.includes('Darshana')) {
    shapeClasses = "rounded-md"; 
    colorClasses = "bg-amber-50/90 dark:bg-amber-900/20 border-2 border-amber-600 dark:border-amber-500 shadow-md";
  }

  return (
    <div 
      className={`node-level-${data.level} ${sizeClasses} ${shapeClasses} ${colorClasses} flex flex-col items-center justify-center transition-all duration-300 cursor-pointer text-center p-2 relative`}
      title={data.description}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, pointerEvents: 'none' }} 
      />
      
      <span className={`font-bold text-red-700 dark:text-red-400 z-10 ${labelClasses}`}>
        {data.label}
      </span>
      
      <span className="node-sanskrit text-xs text-amber-800 dark:text-amber-500 mt-1 font-serif z-10">
        {data.sanskritName}
      </span>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, pointerEvents: 'none' }} 
      />
    </div>
  );
}