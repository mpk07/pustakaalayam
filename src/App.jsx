// src/App.jsx
import { useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // CRITICAL: This makes the canvas actually work

import { initialNodes, initialEdges } from './data';
import CustomNode from './CustomNode';
import { X } from 'lucide-react';

const nodeTypes = {
  custom: CustomNode,
};

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  return (
    <div className="w-screen h-screen flex bg-stone-50 overflow-hidden font-sans">
      
      {/* THE CANVAS */}
      <div className="flex-grow h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView // Automatically centers the camera on Shruti/Smriti
          defaultEdgeOptions={{
            style: { stroke: '#cbd5e1', strokeWidth: 1.5, opacity: 0.6 }, // Subtle gray edges
          }}
        >
          <Background color="#e2e8f0" gap={24} size={2} />
          <Controls />
        </ReactFlow>
      </div>

      {/* THE SIDE PANEL */}
      {selectedNode && (
        <div className="w-80 h-full bg-white border-l border-stone-200 shadow-2xl p-6 flex flex-col relative z-10 transition-transform">
          <button 
            onClick={() => setSelectedNode(null)}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-800"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl font-bold text-stone-800 mb-1">{selectedNode.data.label}</h2>
          <p className="text-xl text-amber-700 font-serif mb-4">{selectedNode.data.sanskritName}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedNode.data.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-full border border-stone-200">
                {tag}
              </span>
            ))}
          </div>
          
          <h3 className="font-semibold text-stone-800 mb-2 border-b border-stone-100 pb-1">Description</h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            {selectedNode.data.description}
          </p>
        </div>
      )}
    </div>
  );
}
