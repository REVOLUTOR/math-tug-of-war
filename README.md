# Math Tug of War

A two-player competitive math game for Bright Schools, built by Brightino Tech Lab.

## Quick Start

```bash
npm install
npm run dev
```

Open your browser at **http://localhost:5173**

## How to Play

1. **Splash Screen** — click "Start Game"
2. **Settings** — set team names, input mode, difficulty, and timer
3. **Game** — both teams see the same addition question and race to answer first
   - Correct answer → rope moves toward your side
   - First team to pull the rope 5 steps wins instantly (Rope Win)
   - If timer expires first, the team with more correct answers wins (Timer Win)
4. **Result** — see winner and scores, then Play Again or go back to Main Menu

## Input Modes

### Dual Keyboard
- **Team A** (left): type answer with regular keyboard, press **Enter** to submit
- **Team B** (right): type with **numpad digits (0–9)**, press **Numpad Enter** to submit, **Numpad .** to clear

### Touchscreen
Both teams get large on-screen number pads — ideal for tablets or touchscreen monitors.

## Difficulty
| Level  | Number Range |
|--------|-------------|
| Easy   | 1 – 10      |
| Medium | 1 – 50      |
| Hard   | 1 – 100     |

## Tech Stack
- React 18 + Vite
- TypeScript
- Tailwind CSS
- Web Audio API (sounds, no external files)

## Build for Production

```bash
npm run build
npm run preview
```

---

Developed by **Brightino Tech Lab** for Bright Schools.
