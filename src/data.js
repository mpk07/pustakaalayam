// src/data.js

// HELPER: Generates a perfect ring of child nodes around a parent node
function generateRadialCluster(parentId, centerX, centerY, radius, items, level) {
  const nodes = [];
  const edges = [];
  const angleStep = (2 * Math.PI) / items.length;

  items.forEach((item, index) => {
    const angle = index * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const nodeId = `${parentId}-${item.label.toLowerCase()}`;

    nodes.push({
      id: nodeId,
      type: 'custom',
      position: { x, y },
      data: {
        label: item.label,
        sanskritName: item.sanskrit,
        description: `Part of ${parentId}.`,
        tags: [parentId, 'Chapter'],
        level: level
      }
    });

    edges.push({
      id: `e-${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
    });
  });

  return { nodes, edges };
}

// 1. MANUAL ROOT NODES
const manualNodes = [
  { id: 'shruti', type: 'custom', position: { x: -300, y: 0 }, data: { label: 'Shruti', sanskritName: 'श्रुति', description: 'Primary revelation.', tags: ['Root'], level: 1 } },
  { id: 'smriti', type: 'custom', position: { x: 300, y: 0 }, data: { label: 'Smriti', sanskritName: 'स्मृति', description: 'Tradition authored by humans.', tags: ['Root'], level: 1 } },
  
  // THE VEDAS (Left side)
  { id: 'rig', type: 'custom', position: { x: -600, y: -300 }, data: { label: 'Rigveda', sanskritName: 'ऋग्वेद', description: 'Verses and hymns.', tags: ['Shruti', 'Veda'], level: 2 } },
  { id: 'yajur', type: 'custom', position: { x: -700, y: -100 }, data: { label: 'Yajurveda', sanskritName: 'यजुर्वेद', description: 'Prose mantras for rituals.', tags: ['Shruti', 'Veda'], level: 2 } },
  { id: 'sama', type: 'custom', position: { x: -700, y: 100 }, data: { label: 'Samaveda', sanskritName: 'सामवेद', description: 'Melodies and chants.', tags: ['Shruti', 'Veda'], level: 2 } },
  { id: 'atharva', type: 'custom', position: { x: -600, y: 300 }, data: { label: 'Atharvaveda', sanskritName: 'अथर्ववेद', description: 'Everyday life procedures.', tags: ['Shruti', 'Veda'], level: 2 } },

  // THE ITIHASAS (Right side)
  { id: 'ramayana', type: 'custom', position: { x: 700, y: -300 }, data: { label: 'Ramayana', sanskritName: 'रामायण', description: 'The journey of Rama.', tags: ['Smriti', 'Itihasa'], level: 2 } },
  { id: 'mahabharata', type: 'custom', position: { x: 700, y: 400 }, data: { label: 'Mahabharata', sanskritName: 'महाभारत', description: 'The great epic of the Bharata dynasty.', tags: ['Smriti', 'Itihasa'], level: 2 } },
];

const manualEdges = [
  { id: 'e-shruti-rig', source: 'shruti', target: 'rig' },
  { id: 'e-shruti-yajur', source: 'shruti', target: 'yajur' },
  { id: 'e-shruti-sama', source: 'shruti', target: 'sama' },
  { id: 'e-shruti-atharva', source: 'shruti', target: 'atharva' },
  { id: 'e-smriti-ramayana', source: 'smriti', target: 'ramayana' },
  { id: 'e-smriti-mahabharata', source: 'smriti', target: 'mahabharata' },
];

// 2. GENERATE RAMAYANA KANDAS (7 nodes in a 250px ring)
const kandas = [
  { label: 'Bala', sanskrit: 'बाल' }, { label: 'Ayodhya', sanskrit: 'अयोध्या' }, 
  { label: 'Aranya', sanskrit: 'अरण्य' }, { label: 'Kishkindha', sanskrit: 'किष्किन्धा' }, 
  { label: 'Sundara', sanskrit: 'सुन्दर' }, { label: 'Yuddha', sanskrit: 'युद्ध' }, 
  { label: 'Uttara', sanskrit: 'उत्तर' }
];
const ramayanaCluster = generateRadialCluster('ramayana', 700, -300, 250, kandas, 3);

// 3. GENERATE MAHABHARATA PARVAS (18 nodes in a larger 350px ring)
const parvas = [
  { label: 'Adi', sanskrit: 'आदि' }, { label: 'Sabha', sanskrit: 'सभा' }, { label: 'Vana', sanskrit: 'वन' },
  { label: 'Virata', sanskrit: 'विराट' }, { label: 'Udyoga', sanskrit: 'उद्योग' }, { label: 'Bhishma', sanskrit: 'भीष्म' },
  { label: 'Drona', sanskrit: 'द्रोण' }, { label: 'Karna', sanskrit: 'कर्ण' }, { label: 'Shalya', sanskrit: 'शल्य' },
  { label: 'Sauptika', sanskrit: 'सौप्तिक' }, { label: 'Stri', sanskrit: 'स्त्री' }, { label: 'Shanti', sanskrit: 'शान्ति' },
  { label: 'Anushasana', sanskrit: 'अनुशासन' }, { label: 'Ashvamedhika', sanskrit: 'आश्वमेधिक' }, { label: 'Ashramavasika', sanskrit: 'आश्रमवासिक' },
  { label: 'Mausala', sanskrit: 'मौसल' }, { label: 'Mahaprasthanika', sanskrit: 'महाप्रस्थानिक' }, { label: 'Svargarohana', sanskrit: 'स्वर्गारोहण' }
];
const mahabharataCluster = generateRadialCluster('mahabharata', 700, 400, 350, parvas, 3);

// 4. THE DEEP BRANCHES (Gita & Aditya Hrudayam)
const deepNodes = [
  { id: 'aditya-hrudayam', type: 'custom', position: { x: 1100, y: -300 }, data: { label: 'Aditya Hrudayam', sanskritName: 'आदित्यहृदयम्', description: 'Hymn to the Sun God.', tags: ['Stotra'], level: 4 } },
  { id: 'bhagavad-gita', type: 'custom', position: { x: 1250, y: 400 }, data: { label: 'Bhagavad Gita', sanskritName: 'भगवद्गीता', description: 'The song of God.', tags: ['Yoga', 'Darshana'], level: 4 } }
];
const deepEdges = [
  { id: 'e-yuddha-aditya', source: 'ramayana-yuddha', target: 'aditya-hrudayam' },
  { id: 'e-bhishma-gita', source: 'mahabharata-bhishma', target: 'bhagavad-gita' }
];

// EXPORT EVERYTHING TOGETHER
export const initialNodes = [...manualNodes, ...ramayanaCluster.nodes, ...mahabharataCluster.nodes, ...deepNodes];
export const initialEdges = [...manualEdges, ...ramayanaCluster.edges, ...mahabharataCluster.edges, ...deepEdges];