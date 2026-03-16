// src/App.jsx
import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Fuse from 'fuse.js';

import { generateGraph } from './layoutEngine';
import CustomNode from './CustomNode';
import { X, Moon, Sun, Search } from 'lucide-react';

const nodeTypes = { custom: CustomNode };
const { initialNodes, initialEdges, searchableData } = generateGraph();

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Grab the React Flow camera controls
  const { setCenter } = useReactFlow();

  // Initialize Fuse.js for fuzzy searching the raw data
  const fuse = useMemo(() => new Fuse(searchableData, {
    keys: ['label', 'sanskritName', 'tags'],
    threshold: 0.3, // Allows slight typos
  }), []);

  // Handle typing in the search bar
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      const results = fuse.search(query).map(result => result.item);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // When a search result is clicked
  const onSearchResultClick = (nodeData) => {
    setSearchQuery('');
    setSearchResults([]);
    
    // Find the exact math coordinates of this node in our active graph
    const targetNode = nodes.find(n => n.id === nodeData.id);
    if (targetNode) {
      // Select the node so the side panel opens
      setSelectedNode(targetNode);
      setSelectedEdge(null);
      // Smoothly fly the camera to this node's exact X/Y coordinates and zoom in
      setCenter(targetNode.position.x, targetNode.position.y, { zoom: 1.2, duration: 800 });
    }
  };

  // Standard graph event handlers
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onNodeClick = (event, node) => { setSelectedNode(node); setSelectedEdge(null); };
  const onEdgeClick = (event, edge) => { setSelectedEdge(edge); setSelectedNode(null); };
  const closePanel = () => { setSelectedNode(null); setSelectedEdge(null); };
  const getNodeLabel = (nodeId) => nodes.find(n => n.id === nodeId)?.data?.label || nodeId;

  return (
    <div className={`w-screen h-screen flex overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-stone-950' : 'bg-[#fffbf0]'}`}>
      
      {/* Top Left Controls */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white/80 dark:bg-stone-800/80 text-amber-600 dark:text-amber-400 shadow border border-amber-200 dark:border-stone-700 hover:scale-105 transition-transform"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* THE SEARCH BAR (Top Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white/90 dark:bg-stone-800/90 border border-amber-200 dark:border-stone-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 dark:text-stone-200 placeholder-stone-400 backdrop-blur-sm transition-all"
            placeholder="Search scriptures, tags, or Sanskrit..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-amber-100 dark:border-stone-700 overflow-hidden max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => onSearchResultClick(result)}
                className="w-full text-left px-4 py-3 hover:bg-amber-50 dark:hover:bg-stone-700 border-b border-stone-100 dark:border-stone-700/50 last:border-0 transition-colors"
              >
                <div className="font-bold text-red-700 dark:text-red-400">{result.label}</div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {result.sanskritName} • {result.tags?.join(', ')}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* THE CANVAS */}
      <div className="flex-grow h-full relative flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center z-0 overflow-hidden">
          <span className="text-[30rem] md:text-[50rem] text-amber-500/10 dark:text-amber-600/15 font-serif transition-colors duration-700">🕉</span>
        </div>

        <div className="absolute inset-0 z-10">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
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

      {/* THE SIDE PANEL */}
      {(selectedNode || selectedEdge) && (
        <div className="w-80 h-full bg-[#fffcf5] dark:bg-stone-900 border-l border-red-200 dark:border-red-900/50 shadow-2xl p-6 flex flex-col relative z-30 transition-colors">
          <button onClick={closePanel} className="absolute top-4 right-4 text-red-400 dark:text-red-500 hover:text-red-600"><X size={20} /></button>
          
          {selectedNode && (
            <>
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-500 mb-1">{selectedNode.data.label}</h2>
              <p className="text-xl text-amber-600 dark:text-amber-500 font-serif mb-4">{selectedNode.data.sanskritName}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(selectedNode.data.tags || []).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs rounded-full border border-amber-300 dark:border-amber-700/50">{tag}</span>
                ))}
              </div>
              <p className="text-stone-700 dark:text-stone-400 text-sm leading-relaxed">{selectedNode.data.description}</p>
            </>
          )}

          {selectedEdge && (
            <>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">Relationship</p>
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-500 mb-6 capitalize">{selectedEdge.data?.relation?.replace(/-/g, ' ') || 'Is Part Of'}</h2>
              <div className="bg-white/50 dark:bg-stone-800/50 rounded-lg p-4 border border-stone-200 dark:border-stone-700 shadow-sm">
                <div className="mb-4">
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">Source Text</p>
                  <p className="font-semibold text-stone-800 dark:text-stone-200">{getNodeLabel(selectedEdge.source)}</p>
                </div>
                <div className="flex justify-center my-2 text-stone-400 dark:text-stone-600">↓</div>
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