// src/App.jsx
import { useState, useCallback, useMemo, useRef } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges, useReactFlow, useOnViewportChange } from '@xyflow/react';
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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const { setCenter } = useReactFlow();

  // THE SAFE ZOOM TRACKER
  const flowWrapperRef = useRef(null);
  useOnViewportChange({
    onChange: (viewport) => {
      if (!flowWrapperRef.current) return;
      
      // Kept hidden until much closer (0.55)
      if (viewport.zoom < 0.55) {
        flowWrapperRef.current.className = "absolute inset-0 z-10 zoom-far";
      } else if (viewport.zoom < 0.85) {
        flowWrapperRef.current.className = "absolute inset-0 z-10 zoom-mid";
      } else {
        flowWrapperRef.current.className = "absolute inset-0 z-10 zoom-close";
      }
    }
  });

  const fuse = useMemo(() => new Fuse(searchableData, {
    keys: ['label', 'sanskritName', 'tags'],
    threshold: 0.3, 
  }), []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      setSearchResults(fuse.search(query).map(result => result.item));
    } else {
      setSearchResults([]);
    }
  };

  const onSearchResultClick = (nodeData) => {
    setSearchQuery('');
    setSearchResults([]);
    const targetNode = nodes.find(n => n.id === nodeData.id);
    if (targetNode) {
      setSelectedNode(targetNode);
      setSelectedEdge(null);
      setCenter(targetNode.position.x, targetNode.position.y, { zoom: 1.2, duration: 800 });
    }
  };

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onNodeClick = (event, node) => { setSelectedNode(node); setSelectedEdge(null); };
  const onEdgeClick = (event, edge) => { setSelectedEdge(edge); setSelectedNode(null); };
  const closePanel = () => { setSelectedNode(null); setSelectedEdge(null); };
  const getNodeLabel = (nodeId) => nodes.find(n => n.id === nodeId)?.data?.label || nodeId;

  return (
    <div className={`w-screen h-screen flex overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-stone-950' : 'bg-[#fffbf0]'}`}>
      
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white/40 dark:bg-stone-800/40 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-200/50 dark:border-stone-700/50 hover:bg-white/60 backdrop-blur-md transition-all"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* THE SEARCH BAR */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-500/70">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-white/40 dark:bg-stone-800/40 border border-amber-200/50 dark:border-stone-700/50 shadow-sm hover:shadow-md hover:bg-white/60 dark:hover:bg-stone-800/60 focus:bg-white/90 dark:focus:bg-stone-800/90 focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-stone-800 dark:text-stone-200 placeholder-stone-500/70 backdrop-blur-md transition-all duration-300"
            placeholder="Search scriptures..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white/95 dark:bg-stone-800/95 backdrop-blur-md rounded-xl shadow-xl border border-amber-100 dark:border-stone-700 overflow-hidden max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => onSearchResultClick(result)}
                className="w-full text-left px-4 py-2 hover:bg-amber-50 dark:hover:bg-stone-700 border-b border-stone-100 dark:border-stone-700/50 last:border-0 transition-colors"
              >
                <div className="font-bold text-sm text-red-700 dark:text-red-400">{result.label}</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
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

        <div ref={flowWrapperRef} className="absolute inset-0 z-10 zoom-far">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.4}
            fitViewOptions={{ padding: 0.5, maxZoom: 1 }}
            colorMode={isDarkMode ? 'dark' : 'light'}
            defaultEdgeOptions={{
              type: 'straight',
              style: { stroke: isDarkMode ? '#ea580c' : '#f59e0b', strokeWidth: 1.5 },
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
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-500 mb-1">{selectedNode.data.fullTitle || selectedNode.data.label}</h2>
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