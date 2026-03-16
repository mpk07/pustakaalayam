# 🕉️ Pustakaalayam

Pustakaalayam (The Library) is an interactive, mathematics-driven knowledge graph mapping the vast landscape of ancient Indian scriptures, philosophies, and texts. 

Built as a visual learning tool, it allows users to explore the structural relationships between Shruti and Smriti, from the root Vedas down to specific chapters (Parvas/Kandas) and individual Stotras.

## Features
* **Infinite Semantic Canvas:** Explore the hierarchy of texts. As you zoom out, chapters collapse into structural dots to prevent visual clutter.
* **Algorithmic Layouts:** Sub-texts (like the 18 Parvas of the Mahabharata or the 10 Principal Upanishads) are mapped dynamically using trigonometry to form perfect orbital clusters.
* **Fuzzy Search:** Instantly fly the camera to any text, chapter, or philosophy using the built-in search engine.
* **Ontological Edges:** Relationships between texts are strictly defined (e.g., `is-part-of`, `contains-teaching`, `contains-stotra`) allowing for future data-mining.

## Tech Stack
* **Frontend:** React, Tailwind CSS
* **Graph Engine:** React Flow (`@xyflow/react`)
* **Search:** Fuse.js
* **Build Tool:** Vite

## Running Locally

1. Clone the repository:
   ```bash
   git clone [https://github.com/mpk07/pustakaalayam.git](https://github.com/YOUR_USERNAME/pustakaalayam.git)
   ```
2. Navigate to the project directory:
   ```bash
   cd pustakaalayam
   ```
3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```