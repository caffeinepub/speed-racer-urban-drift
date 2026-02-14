# Specification

## Summary
**Goal:** Build a 2D racing/drifting game titled “Speed Racer: Urban Drift” with core gameplay, 6-level progression, power-ups, garage upgrades, saved progress, and leaderboards in a consistent black/neon/metallic UI theme.

**Planned changes:**
- Create the main menu with title/tagline and navigation to Start Game, Continue, Leaderboard, Settings, How to Play, and Exit/Back.
- Implement the core gameplay loop: left/right car control (keyboard + touch controls), obstacles/traffic, coin collection, nitro/boost with cooldown/charge, timer-based win/lose conditions, and Game Over.
- Add in-game HUD and controls (score/speed-or-timer/coins top bar, boost on right, pause/restart and pause-settings).
- Implement Pause/Resume/Restart behavior that freezes/unfreezes simulation and resets level state.
- Add 6-level progression with distinct parameters per level, unlocking next level and recording a car/power-up unlock on completion, plus Level Complete UI.
- Add pop-ups: Level Complete (summary + next), Power-Up alerts, and Game Over (restart + main menu).
- Implement power-ups (Nitro pickup/charge, Shield, Magnet) with spawning, durations/rules, and HUD indicators.
- Add a Garage/Store UI with coin currency, car categories (Sports/Muscle/Drift/Supercars), purchasing/unlocking, and selecting an active car.
- Implement saved progress (unlocked/last played level, coin balance, unlocked cars/upgrades, settings) and Continue behavior (or message if no save).
- Implement leaderboards with score submission on completion and viewing Global and Personal lists.
- Create Settings (music/effects toggles, graphics Low/Medium/High, controls scheme, language with English default + placeholder option) and persist/apply them.
- Create a How to Play screen describing controls, objectives, coins, obstacles, and power-ups.
- Add a backend Motoko canister for persistent player progress and leaderboard storage/querying keyed by Internet Identity principal when available, with anonymous client fallback.
- Apply a consistent black/neon/metallic UI theme across menus, HUD, and dialogs, avoiding blue/purple as dominant colors.
- Add and use generated static image assets under `frontend/public/assets/generated` for backgrounds, sprites, collectibles, obstacles, and simple FX textures.

**User-visible outcome:** Users can start or continue a neon street drifting race, control the car on desktop or touch, collect coins and power-ups, pause/restart, complete and unlock levels/cars, spend coins in a garage, view global/personal leaderboards, and adjust settings and read how-to-play instructions with progress saved.
