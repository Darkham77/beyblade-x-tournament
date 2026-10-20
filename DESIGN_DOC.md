# Beyblade X Tournament & League Manager - System Design Document

**Status:** APPROVED  
**Date:** 2026-09-30  
**Target Delivery:** Single Portable Autonomous HTML File (`index.html`)  
**Workspace Path:** `d:\Documentos\GitHub\beyblade-x-tournament\`

---

## 1. Executive Summary & Purpose

The **Beyblade X Tournament & League Manager** is an offline-first, zero-dependency, ultra-portable web application packed into a single self-contained `index.html` file. Designed specifically for mobile phone screens and physical Beyblade X family gatherings or club tournaments, it enables a single admin to manage bladers, coordinate multiple concurrent arena matches, score bouts using official Takara Tomy/Hasbro finish mechanics, advance brackets automatically, and resolve rules disputes instantly via a built-in pocket judge guide.

---

## 2. Constraints & Architectural Principles

1. **Zero External Dependencies:** No CDNs, no remote npm packages, no fonts or icons fetched over the internet. Everything (CSS, SVG icons, JavaScript engine) is 100% inlined and embedded within `index.html`.
2. **True Portability:** Runs immediately when opened in mobile Safari (iOS) or Chrome/Brave (Android), transferred via messaging apps (WhatsApp, Telegram) or local storage, and 100% compatible with static hosting (GitHub Pages, Netlify) with zero build configuration.
3. **Data Safety & Persistence:**
   - Real-time atomic saves to `localStorage` on every point change.
   - One-tap `.json` backup file export and import/restore to prevent data loss across devices or cache clears.
4. **Mobile Touch First:** Minimum 48px touch targets, high contrast dark theme ("X-Stadium" aesthetic with neon cyan, lime green, and energetic orange/red accents), optimized for one-hand and two-thumb operation next to the stadium.

---

## 3. Core Systems & Technical Architecture

### 3.1 State Schema (`AppState`)

```typescript
interface AppState {
  version: 1;
  activeTournamentId: string | null;
  players: Record<string, Player>;
  tournaments: Record<string, Tournament>;
  activeArenaMatchIds: string[]; // Match IDs currently being tracked in parallel
}

interface Player {
  id: string;
  name: string;
  avatarColor: string;
  avatarEmoji: string;
  createdAt: number;
  stats: PlayerStats;
}

interface PlayerStats {
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  pointsScored: number;
  pointsConceded: number;
  finishes: {
    spin: number;
    over: number;
    burst: number;
    xtreme: number;
    penalty: number;
  };
  currentStreak: number;
  bestStreak: number;
}

interface Tournament {
  id: string;
  name: string;
  format: 'brackets' | 'round_robin' | 'swiss' | 'groups_playoffs' | 'king_of_the_hill';
  status: 'draft' | 'in_progress' | 'paused' | 'completed';
  rules: TournamentRules;
  playerIds: string[];
  matches: Record<string, Match>;
  rounds: Round[];
  standings?: StandingEntry[];
  createdAt: number;
  updatedAt: number;
}

interface TournamentRules {
  presetName: 'official_standard_4' | 'official_championship_7' | 'custom_house_rules';
  targetPoints: number; // e.g., 4, 7, or custom
  finishPoints: {
    spin: number;   // default 1
    over: number;   // default 2
    burst: number;  // default 2
    xtreme: number; // default 3
    penalty: number;// default 1 awarded to opponent or subtracted
  };
  allowCustomPenalties: boolean;
}

interface Match {
  id: string;
  roundIndex: number;
  matchIndex: number;
  player1Id: string | null;
  player2Id: string | null;
  score1: number;
  score2: number;
  targetPoints: number;
  status: 'pending' | 'in_progress' | 'completed';
  winnerId: string | null;
  loserId: string | null;
  history: PointEvent[];
  nextMatchId?: string; // Bracket progression link
  nextMatchSlot?: 1 | 2;
}

interface PointEvent {
  roundPointId: string;
  playerScored: 1 | 2;
  finishType: 'spin' | 'over' | 'burst' | 'xtreme' | 'penalty';
  points: number;
  timestamp: number;
}
```

---

### 3.2 Modular Component Breakdown (Inlined Vanilla JS Architecture)

1. **`StorageEngine`:**
   - Manages atomic read/writes to `localStorage` under `BEYBLADE_X_APP_V1`.
   - Generates formatted JSON file download for backup.
   - Parses and validates uploaded JSON files for restoration.
2. **`TournamentEngine`:**
   - **Automated Random Seeding:** Performs an unbiased Fisher-Yates shuffle on `playerIds` upon tournament creation, ensuring unpredictable and fair matchups across all formats while assigning bye slots randomly.
   - **Brackets (Single Elimination):** Binary tree generator with automatic winner advancement to parent nodes, loser elimination lines (strikethroughs), and podium calculation (1st, 2nd, 3rd place).
   - **Round Robin:** Circle-algorithm fixture generator producing balanced rounds, computing table standings (Played, Won, Lost, Points For, Points Against, Point Diff, Table Points).
   - **Swiss System:** Dynamic round pairing based on current win-loss record without duplicate matchups.
   - **Groups + Playoffs:** Divides players into round-robin pools; top $N$ qualify into knockout brackets.
   - **King of the Hill:** Continuous queue where winner defends the arena against subsequent challengers.
3. **`ScoreboardEngine` (Multi-Arena & Touch Scorekeeper):**
   - High-contrast touch scoreboard with dedicated finish buttons (`+1 Spin`, `+2 Over`, `+2 Burst`, `+3 Xtreme`).
   - Dynamic victory detection: when either player hits `targetPoints`, alerts admin with sound/visual cue, commits winner/loser, and advances the bracket or updates the table.
   - Multi-Arena Tab Bar: Allows switching between multiple active matches in parallel without losing points or history.
   - Full Undo/Redo stack for errant taps during frantic battles.
4. **`RulebookEngine` (Pocket Judge):**
   - Instant search and category tabs for official WBO / Takara Tomy Beyblade X regulations.
   - Covers:
     - Official Finish definitions & point values.
     - Mislaunches, false starts, and launcher slips.
     - Out-of-bounds without stadium contact (opponent awarded Over Finish).
     - Simultaneous spin-down (Double Spin = 0 pts / rematch).
     - Extreme dash rail contact and premature stadium touching.
     - 3on3 Deck rules & blade rotation.
5. **`StatsEngine`:**
   - Aggregates blader career profiles, winrates, and badges ("Xtreme Master", "Iron Defense", "Undefeated Streak").

---

## 4. UI/UX Specifications

- **Views / Navigation:** Bottom or header tab bar with 5 primary views:
  1. 🏆 **Torneos (Tournaments):** Multi-tournament dashboard (Create, Edit, Pause, Resume, Delete).
  2. ⚔️ **Combate Activo (Scoreboard):** Real-time match scoring and multi-arena selector.
  3. 📊 **Clasificación & Llaves (Brackets / Standings):** Visual bracket tree with dynamic SVG connectors or standings table.
  4. 👤 **Bladers (Players):** Roster management and career statistics.
  5. 📖 **Reglamento (Pocket Judge):** Searchable official rules reference.
- **Visual Bracket Rendering:**
  - Challonge/Start.gg style nodes.
  - Winner slot highlighted; loser crossed out with strikethrough.
  - Smooth SVG orthogonal connecting lines indicating path to the final.

---

## 5. Decision Log

| ID | Decision | Alternatives Considered | Rationale |
|---|---|---|---|
| DEC-01 | Single-File Vanilla HTML5/CSS/JS (`index.html`) | Vite + Vue 3 Single-file compilation, Petite-Vue | Maximum portable zero-setup runtime; openable instantly on any phone, transferable via WhatsApp/Drive, zero build tooling. |
| DEC-02 | Multi-Tournament Architecture | Single active tournament | Enables pausing leagues, switching between casual family play and formal brackets, and preserving history. |
| DEC-03 | Multi-Arena Parallel Scoring | Single active match queue | Family tournaments often run 2-3 stadiums simultaneously; admin needs to switch between bouts without resetting score state. |
| DEC-04 | Hybrid Rules Engine (Official + House Rules) | Fixed official rules only | Provides Takara Tomy standard (4 pts) & championship (7 pts) presets while empowering users to customize target points and finish values. |
| DEC-05 | Integrated Pocket Judge Guide | External web links | Phone may be offline during outings or basements; judge rules must be instantly accessible offline. |
| DEC-06 | Automated Fisher-Yates Seeding on Tournament Creation | Deterministic registration order, sort(() => Math.random() - 0.5) | Eliminates repetitive matchups with mathematically unbiased O(N) shuffling across all formats with zero UI clutter. |

---

## 6. Verification & Quality Gates

1. **Deterministic State Tests:** Tournament bracket pairings and winner propagation tested against odd/even player counts (2, 3, 4, 8, 16 players).
2. **Offline Resilience:** Disconnect internet, perform multi-match scoring, refresh page, verify 100% state persistence from `localStorage`.
3. **Backup Export/Import:** Export `.json` backup, reset application data, restore backup, verify identical state.
4. **Mobile Responsive Check:** Viewport simulation across 360px (compact Android), 390px (iPhone 14/15/16), and tablet landscape.
