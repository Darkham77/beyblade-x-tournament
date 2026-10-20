# 🌪️ Beyblade X - Tournament & League Manager

A 100% portable, zero-dependency, offline-first mobile web application to manage players, run multi-format tournaments (Brackets, Round-Robin Leagues, Swiss, Groups, King of the Hill), score bouts with official Beyblade X rules, coordinate concurrent stadiums, and resolve rules disputes on the fly.

Everything is packed into a single standalone file: **`index.html`**.

---

## 📱 How to Use on Your Phone

### Option A: Local Offline File (WhatsApp / Drive / Files)

1. Send or copy `index.html` to your phone (via WhatsApp, Telegram, Google Drive, AirDrop, or USB cable).
2. Open the file on your phone using your favorite browser:
   - **Android:** Tap the file or open it in Google Chrome / Brave.
   - **iOS:** Save to the "Files" app and open with Safari or a local HTML viewer.
3. Add to your phone's Home Screen for quick 1-tap access:
   - **Chrome (Android):** Tap the 3 dots menu `⋮` ➜ **"Add to Home screen"** or **"Install app"**.
   - **Safari (iOS):** Tap the Share button `⎋` ➜ **"Add to Home Screen"**.

### Option B: Free 1-Click Online Link (GitHub Pages)

1. Push this repository to GitHub under your account.
2. In your GitHub repository, go to **Settings ➜ Pages**.
3. Under **Branch**, select `main` and root `/`, then click **Save**.
4. In ~60 seconds, GitHub gives you a free HTTPS link (e.g., `https://yourusername.github.io/beyblade-x-tournament`).
5. Open that link on any family member's phone. It works **100% offline** once loaded and auto-saves to their device!

---

## ⚡ Core Features

- **🏆 Multi-Format Tournament Engine:**
  - **Eliminación Directa (Brackets):** Interactive bracket tree with SVG connecting lines, automatic winner advancement, and loser strikethroughs.
  - **Liga Todos contra Todos (Round-Robin):** Real-time standings table calculating Matches Played, Wins, Losses, Points Scored, Points Conceded, and Point Differential.
  - **Sistema Suizo (Swiss System):** Balanced pairings by record across rounds without player elimination.
  - **Fase de Grupos + Playoffs:** Group stage followed by single elimination finals.
  - **Rey de la Pista (King of the Hill):** Continuous queue where winners defend against challengers.
- **⚔️ Official Beyblade X Touch Scoreboard:**
  - 🟢 **+1 Spin Finish:** Opponent bey stops spinning first.
  - 🟠 **+2 Over Finish:** Opponent bey is knocked into the Over Zone pocket.
  - 🔴 **+2 Burst Finish:** Opponent bey bursts/separates into pieces.
  - 🔵 **+3 Xtreme Finish:** Opponent bey is propelled into the Xtreme Zone via the X-Line rail.
  - 🛑 **-1 / Falta:** Quick penalty adjustment for fouls or illegal launches.
  - **Instant Victory Trigger:** Automatically ends match at target score (4 or 7 pts), triggers a celebration alert, and updates tournament standings/brackets.
- **🏟️ Multi-Arena Concurrent Scoring:**
  - Manage multiple physical stadiums running matches side-by-side.
  - Seamlessly switch between active bouts with live score badges without losing any data.
- **⚙️ Custom Rules & Presets (House Rules):**
  - Takara Tomy / Hasbro Standard (4 Points).
  - Championship / Finals (7 Points).
  - 100% Custom House Rules: Define target victory points and points per finish.
- **📖 Pocket Judge (Reglamento Oficial Integrado):**
  - Offline searchable rulebook and FAQ covering mislaunches, stadium out-of-bounds, simultaneous stops, and 3on3 deck rotation.
- **💾 Safe Auto-Save & JSON Backups:**
  - Real-time `localStorage` persistence on every touch.
  - One-tap **"Exportar Respaldo (.json)"** and **"Importar Datos"** to transfer tournament history across devices.

---

## 📜 Official Beyblade X Rules Quick Reference

| Finish Type       |  Points   | Condition                                                               |
| ----------------- | :-------: | ----------------------------------------------------------------------- |
| **Spin Finish**   | **1 pt**  | Opponent Beyblade stops spinning while your Beyblade is still rotating. |
| **Over Finish**   | **2 pts** | Opponent Beyblade is knocked into the Over Zone (pocket).               |
| **Burst Finish**  | **2 pts** | Opponent Beyblade bursts (the Blade, Ratchet, and Bit separate).        |
| **Xtreme Finish** | **3 pts** | Opponent Beyblade is knocked into the Xtreme Zone.                      |

### Common Disputes & Judge Rulings

- **Mislaunch (Lanzamiento nulo):** If a bey does not touch the stadium or is launched directly outside without touching anything, it is considered a mislaunch. First occurrence is a warning; repeat mislaunch in the same round awards an Over Finish (2 pts) to the opponent.
- **Simultaneous Spin Out:** If both beys stop rotating at the exact same moment, 0 points are awarded, and the round is replayed.
- **Double Out of Bounds:** If both beys leave the stadium, the first bey to leave loses the round.

---

## 🛠️ Tech Stack & Philosophy

- Zero external build tools.
- Pure HTML5, Modern CSS3 (CSS Grid, Flexbox, SVG lines, CSS Variables), and Vanilla ES6.
- 100% self-contained inside `index.html`.
