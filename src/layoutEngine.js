// src/layoutEngine.js
import coreData from './data/core.json';
import itihasaData from './data/itihasas.json';
import customEdges from './data/edges.json';

export function generateGraph() {
  // Merge all chopped JSON files into one master array
  const rawNodes = [...coreData, ...itihasaData];
  const nodes = [];
  const edges = [];
  const mathData = {}; // Stores the exact {x, y, angle} for every node

  // 1. Process Fixed Nodes (Roots and main branches)
  rawNodes.filter(n => n.position).forEach(n => {
    mathData[n.id] = { x: n.position.x, y: n.position.y, angle: 0 };
    nodes.push({ id: n.id, type: 'custom', position: n.position, data: { ...n } });
  });

  // 2. Process Radial Clusters (Kandas and Parvas)
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

      // Automatically draw the structural connection so you don't have to type it in edges.json
      edges.push({
        id: `e-${parentId}-${child.id}`,
        source: parentId,
        target: child.id,
        data: { relation: 'is-part-of' }
      });
    });
  });

  // 3. Process Outward Branches (Gita and Aditya Hrudayam)
  rawNodes.filter(n => n.outwardParent).forEach(child => {
    const parentMath = mathData[child.outwardParent];
    if (!parentMath) return;

    // Push out along the exact same angle to prevent criss-crossing
    const x = parentMath.x + child.distance * Math.cos(parentMath.angle);
    const y = parentMath.y + child.distance * Math.sin(parentMath.angle);

    mathData[child.id] = { x, y, angle: parentMath.angle };
    nodes.push({ id: child.id, type: 'custom', position: { x, y }, data: { ...child } });
  });

  // 4. Append Custom Relationships
  customEdges.forEach(e => {
    edges.push({
      id: `e-${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      data: { relation: e.relation },
      animated: e.animated || false,
      style: {
        strokeDasharray: e.dash || 'none',
        strokeWidth: e.width || 1.5,
        opacity: e.opacity || 0.6
      }
    });
  });

  // Return exactly what React Flow needs, and the raw array for Fuse.js later
  return { initialNodes: nodes, initialEdges: edges, searchableData: rawNodes };
}