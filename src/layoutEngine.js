// src/layoutEngine.js
import coreData from './data/core.json';
import itihasaData from './data/itihasas.json';
import customEdges from './data/edges.json';
import upanishadsData from './data/upanishads.json';
import puranasData from './data/puranas.json';
import darshanasData from './data/darshanas.json';

export function generateGraph() {
  const rawNodes = [...coreData, ...itihasaData, ...upanishadsData, ...puranasData, ...darshanasData];
  const nodes = [];
  const edges = [];
  const mathData = {}; 

  // 1. Process Fixed Nodes
  rawNodes.filter(n => n.position).forEach(n => {
    mathData[n.id] = { x: n.position.x, y: n.position.y, angle: 0 };
    nodes.push({ id: n.id, type: 'custom', position: n.position, data: { ...n } });
  });

  // 2. Process Radial Clusters
  const radialParents = [...new Set(rawNodes.filter(n => n.radialParent).map(n => n.radialParent))];
  
  radialParents.forEach(parentId => {
    const children = rawNodes.filter(n => n.radialParent === parentId);
    const parentMath = mathData[parentId];
    if (!parentMath) return;

    const angleStep = (2 * Math.PI) / children.length;
    children.forEach((child, index) => {
      const angle = index * angleStep;
      const x = parentMath.x + child.radius * Math.cos(angle);
      const y = parentMath.y + child.radius * Math.sin(angle);
      
      mathData[child.id] = { x, y, angle };
      nodes.push({ id: child.id, type: 'custom', position: { x, y }, data: { ...child } });

      edges.push({
        id: `e-${parentId}-${child.id}`,
        source: parentId,
        target: child.id,
        className: `edge-level-${child.level} transition-opacity duration-300`, // Tags the edge for CSS hiding
        data: { relation: 'is-part-of' }
      });
    });
  });

  // 3. Process Outward Branches (Now supports custom angles)
  rawNodes.filter(n => n.outwardParent).forEach(child => {
    const parentMath = mathData[child.outwardParent];
    if (!parentMath) return;

    // If a custom angle is defined in JSON, use it. Otherwise, use parent trajectory.
    const angle = child.customAngle !== undefined ? child.customAngle : parentMath.angle;
    
    const x = parentMath.x + child.distance * Math.cos(angle);
    const y = parentMath.y + child.distance * Math.sin(angle);

    mathData[child.id] = { x, y, angle };
    nodes.push({ id: child.id, type: 'custom', position: { x, y }, data: { ...child } });
  });

  // 4. Append Custom Relationships
  customEdges.forEach(e => {
    // Find the target node so we know what level this edge belongs to
    const targetNode = rawNodes.find(n => n.id === e.target);
    const targetLevel = targetNode ? targetNode.level : 2;

    edges.push({
      id: `e-${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      className: `edge-level-${targetLevel} transition-opacity duration-300`, // Tags custom edges too
      data: { relation: e.relation },
      animated: e.animated || false,
      style: {
        strokeDasharray: e.dash || 'none',
        strokeWidth: e.width || 1.5,
        opacity: e.opacity || 0.6
      }
    });
  });

  return { initialNodes: nodes, initialEdges: edges, searchableData: rawNodes };
}