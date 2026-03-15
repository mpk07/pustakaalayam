// src/CustomNode.jsx
import { Handle, Position } from '@xyflow/react';

export default function CustomNode({ data }) {
  return (
    <div 
      className="w-28 h-28 rounded-full flex flex-col items-center justify-center bg-amber-50 border border-amber-600 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center p-2"
      title={data.description} // This provides the native HTML tooltip on hover
    >
      {/* Invisible targets for the lines to connect to */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="target" position={Position.Bottom} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="target" position={Position.Right} className="opacity-0" />
      
      <span className="font-bold text-amber-900 text-sm">{data.label}</span>
      <span className="text-xs text-amber-700/70 mt-1 font-serif">{data.sanskritName}</span>

      {/* Invisible sources for outgoing lines */}
      <Handle type="source" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}
