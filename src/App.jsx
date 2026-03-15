// src/App.jsx
import { useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { generateGraph } from './layoutEngine';
const { initialNodes, initialEdges } = generateGraph();

import CustomNode from './CustomNode';
import { X, Moon, Sun } from 'lucide-react';

const nodeTypes = { custom: CustomNode };

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  
  // We now track either a selected node OR a selected edge
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  
  // When a node is clicked, select it and clear any edge selection
  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  };

  // When an edge is clicked, select it and clear any node selection
  const onEdgeClick = (event, edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  };

  // Helper function to close the panel entirely
  const closePanel = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  // Helper function to translate a raw node ID (like "ramayana-yuddha") into its readable label for the edge panel
  const getNodeLabel = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.data.label : nodeId;
  };

  return (
    <div className={`w-screen h-screen flex overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-stone-950' : 'bg-[#fffbf0]'}`}>
      
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white/80 dark:bg-stone-800/80 text-amber-600 dark:text-amber-400 shadow border border-amber-200 dark:border-stone-700 hover:scale-105 transition-transform"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* THE CANVAS */}
      <div className="flex-grow h-full relative flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center z-0 overflow-hidden">
          <span className="text-[30rem] md:text-[50rem] text-amber-500/10 dark:text-amber-600/15 font-serif transition-colors duration-700">
            🕉
          </span>
        </div>

        <div className="absolute inset-0 z-10">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick} // NEW: Listen for edge clicks
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 1.5, maxZoom: 1 }}
            colorMode={isDarkMode ? 'dark' : 'light'}
            defaultEdgeOptions={{
              style: { stroke: isDarkMode ? '#ea580c' : '#f59e0b', strokeWidth: 1.5, opacity: 0.20 },
            }}
          >
            <Background color={isDarkMode ? '#444' : '#fde68a'} gap={30} size={2} className="opacity-40" />
            <Controls className="dark:bg-stone-800 dark:border-stone-700 dark:fill-stone-300" />
          </ReactFlow>
        </div>
      </div>

      {/* THE SIDE PANEL - Dynamically renders Node details OR Edge details */}
      {(selectedNode || selectedEdge) && (
        <div className="w-80 h-full bg-[#fffcf5] dark:bg-stone-900 border-l border-red-200 dark:border-red-900/50 shadow-2xl p-6 flex flex-col relative z-30 transition-colors">
          <button onClick={closePanel} className="absolute top-4 right-4 text-red-400 dark:text-red-500 hover:text-red-600">
            <X size={20} />
          </button>
          
          {/* VIEW A: NODE SELECTED */}
          {selectedNode && (
            <>
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-500 mb-1">{selectedNode.data.label}</h2>
              <p className="text-xl text-amber-600 dark:text-amber-500 font-serif mb-4">{selectedNode.data.sanskritName}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(selectedNode.data.tags || []).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs rounded-full border border-amber-300 dark:border-amber-700/50">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-stone-700 dark:text-stone-400 text-sm leading-relaxed">
                {selectedNode.data.description}
              </p>
            </>
          )}

          {/* VIEW B: EDGE SELECTED */}
          {selectedEdge && (
            <>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">Relationship</p>
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-500 mb-6 capitalize">
                {/* Replaces hyphens with spaces for readability, defaults if empty */}
                {selectedEdge.data?.relation?.replace(/-/g, ' ') || 'Is Part Of'}
              </h2>
              
              <div className="bg-white/50 dark:bg-stone-800/50 rounded-lg p-4 border border-stone-200 dark:border-stone-700 shadow-sm">
                <div className="mb-4">
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">Source Text</p>
                  <p className="font-semibold text-stone-800 dark:text-stone-200">{getNodeLabel(selectedEdge.source)}</p>
                </div>
                
                {/* Visual arrow indicator */}
                <div className="flex justify-center my-2 text-stone-400 dark:text-stone-600">
                  ↓
                </div>
                
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">Target Text</p>
                  <p className="font-semibold text-stone-800 dark:text-stone-200">{getNodeLabel(selectedEdge.target)}</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}