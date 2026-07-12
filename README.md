# Memory Matrix

A focused, modern memory-matching game designed for mouse, touch, and keyboard.

**[Play Memory Matrix →](https://sanjays2402.github.io/memory-matrix/)**

![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff69b4?style=flat-square)

---

## ✨ Features

🃏 **Classic Memory Gameplay** — Flip two cards, find matching pairs, clear the board

🎚️ **Three Difficulty Levels**
- 🟢 Easy (4×4 grid, 8 pairs)
- 🟡 Medium (6×6 grid, 18 pairs)
- 🔴 Hard (8×8 grid, 32 pairs)

🎨 **Four Card Themes**
- 😀 Emoji — colorful emoji icons
- 💻 Programming — language abbreviations with signature colors
- 🪐 Space — planets, stars, and cosmic objects
- 🦊 Animals — wildlife from foxes to flamingos

🔥 **Combo System** — Match pairs consecutively to build combos with visual + audio feedback

⭐ **Star Rating** — 3-star rating based on move efficiency (fewer moves = more stars)

🏆 **Best Scores** — Per-difficulty, per-theme leaderboard saved in localStorage

💡 **Hint System** — Peek at all cards for 1 second (one-time use per game)

🎵 **Sound Effects** — Web Audio API synth sounds for flips, matches, combos, and victory

🎬 **Smooth Animations**
- 3D CSS card flip with perspective transform
- Pulse glow on match + fade to semi-transparent
- Shake animation on mismatch
- Spring-animated victory overlay with confetti

## 🎨 Design

A gameplay-first dark interface:

- Near-black surfaces with a restrained acid-lime interaction accent
- Clear setup flow with live deck preview and personal-best context
- Compact in-game HUD with progress, moves, time, rating, hint, and sound controls
- Tactile 3D card flips, match feedback, and focused victory states
- Responsive 4×4, 6×6, and 8×8 boards with 44px mobile controls
- Reduced-motion support, semantic controls, and visible keyboard focus

## 🛠 Tech Stack

| Tech | Version | Purpose |
|------|---------|---------|
| React | 19 | UI framework |
| Vite | 8 | Build tool |
| Tailwind CSS | v4 | Utility-first styling |
| Framer Motion | 12 | Victory animations |
| Web Audio API | — | Sound effects |

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/Sanjays2402/memory-matrix.git
cd memory-matrix

# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

## 📁 Project Structure

```
src/
├── App.jsx              # Main app with screen routing
├── main.jsx             # Entry point
├── index.css            # Global styles + animations
├── gameLogic.js         # Cards, scoring, shuffle, storage
├── useGame.js           # Game state hook
├── sounds.js            # Web Audio synth effects
└── components/
    ├── BackgroundOrbs.jsx   # Ambient grid and glow canvas
    ├── Icons.jsx            # Shared inline SVG icon set
    ├── Card.jsx             # Single card with 3D flip
    ├── GameBoard.jsx        # Grid layout
    ├── Header.jsx           # Stats, combo, hint, sound toggle
    ├── Menu.jsx             # Difficulty + theme selection
    └── VictoryOverlay.jsx   # Results + confetti
```

## 📄 License

MIT

---

Built with 🥔 energy
