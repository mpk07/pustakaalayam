// src/data.js

export const initialNodes = [
  // THE CORE DICHOTOMY (Centered)
  {
    id: 'shruti',
    type: 'custom',
    position: { x: -150, y: 0 },
    data: {
      label: 'Shruti',
      sanskritName: 'श्रुति',
      description: 'That which is heard; the primary revelation.',
      tags: ['Root', 'Revelation']
    }
  },
  {
    id: 'smriti',
    type: 'custom',
    position: { x: 150, y: 0 },
    data: {
      label: 'Smriti',
      sanskritName: 'स्मृति',
      description: 'That which is remembered; tradition and texts authored by humans.',
      tags: ['Root', 'Tradition']
    }
  },
  // SHRUTI BRANCH (Radiating Left/Up)
  {
    id: 'vedas',
    type: 'custom',
    position: { x: -350, y: -100 },
    data: {
      label: 'Vedas',
      sanskritName: 'वेद',
      description: 'The four most ancient and fundamental Hindu scriptures.',
      tags: ['Shruti', 'Core']
    }
  },
  // SMRITI BRANCH (Radiating Right/Down)
  {
    id: 'itihasas',
    type: 'custom',
    position: { x: 350, y: 100 },
    data: {
      label: 'Itihasas',
      sanskritName: 'इतिहास',
      description: 'Epics or histories, primarily the Ramayana and Mahabharata.',
      tags: ['Smriti', 'Epic']
    }
  }
];

export const initialEdges = [
  { id: 'e-shruti-vedas', source: 'shruti', target: 'vedas', type: 'smoothstep' },
  { id: 'e-smriti-itihasas', source: 'smriti', target: 'itihasas', type: 'smoothstep' }
];
