# 🏙️ Cyber Mercenary

> A cyberpunk-themed persistent browser RPG with real-time multiplayer features.

![Status](https://img.shields.io/badge/Status-Beta-cyan) ![Version](https://img.shields.io/badge/Version-0.1.0-purple)

## 📖 Overview

**Cyber Mercenary** is an immersive idle/incremental RPG where you play as an operative in a dystopian neon future. Mine resources, forge equipment, complete contracts, and team up with other players in real-time to dominate the leaderboard.

### Key Features

*   **⛏️ Mining & Crafting:** Gather resources from various biomes and forge powerful gear.
*   **⚔️ Combat System:** Accept daily contracts, battle enemies, and gain XYZ.
*   **🛡️ Squad System:** Create parties (Squads) with friends. Real-time chat and invitations.
*   **🌐 The Nexus:** See who is online, filter by class, and recruit operatives.
*   **💾 Cloud Save:** Cross-device persistence powered by Supabase.
*   **🎨 Cyber-Aesthetics:** Glassmorphism UI, dynamic backgrounds, and neon visual effects.

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Vite
*   **Styling:** TailwindCSS 4, Framer Motion
*   **State Management:** Zustand
*   **Backend / DB:** Supabase (PostgreSQL, Realtime, Auth)
*   **Icons:** Emoji + Custom SVG

## 🚀 Getting Started

### Prerequisites

*   Node.js 18+
*   npm or bun

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/cyber-mercenary.git
    cd cyber-mercenary
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment:
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Run Development Server:
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```
src/
├── components/     # UI Components (Social, Mining, Forge, etc.)
├── data/           # Game Data (Items, Ores, Enemies, Classes)
├── hooks/          # Custom Hooks (useAutoSave, usePresence)
├── lib/            # Utilities (Supabase client)
├── store/          # Zustand Stores (gameStore, socialStore, uiStore)
└── types/          # TypeScript Definitions
```

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
