// src/CustomNode.jsx
import { Handle, Position } from '@xyflow/react';

export default function CustomNode({ data }) {
  let sizeClasses = "w-32 h-32"; 
  let labelClasses = "text-lg";
  let shapeClasses = "rounded-full"; 
  let colorClasses = "bg-[#fffdf7] dark:bg-stone-900 border-2 border-red-600 dark:border-red-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] dark:shadow-[0_0_15px_rgba(239,68,68,0.2)]";

  // Sizing based on importance
  if (data.level === 1) {
    sizeClasses = "w-32 h-32";
  } else if (data.level === 2) {
    sizeClasses = "w-28 h-28";
    labelClasses = "text-base";
  } else if (data.level >= 3) {
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
      /* Notice the node-level class added here for the CSS to target */
      className={`node-level-${data.level} ${sizeClasses} ${shapeClasses} ${colorClasses} flex flex-col items-center justify-center transition-all duration-300 cursor-pointer text-center p-2`}
      title={data.description}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="target" position={Position.Bottom} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="target" position={Position.Right} className="opacity-0" />
      
      <span className={`font-bold text-red-700 dark:text-red-400 ${labelClasses}`}>
        {data.label}
      </span>
      
      {/* Notice the node-sanskrit class added here */}
      <span className="node-sanskrit text-xs text-amber-800 dark:text-amber-500 mt-1 font-serif">
        {data.sanskritName}
      </span>

      <Handle type="source" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}