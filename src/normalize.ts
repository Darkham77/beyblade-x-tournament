/**
 * State Normalization and Data Integrity Engine
 */

import type {
  AppState,
  Match,
  Player,
  Tournament,
  TournamentFilterStatus,
  TournamentSortOrder
} from './types.ts';

/**
 * Computes tournament winner from standings based on completed matches.
 */
function computeTournamentWinner(playerIds: string[], matches: Match[]): string | null {
  const scores: Record<string, { id: string; pts: number; diff: number; pf: number }> = {};
  for (const pId of playerIds) {
    scores[pId] = { id: pId, pts: 0, diff: 0, pf: 0 };
  }

  for (const m of matches) {
    if (!m.player1Id || !m.player2Id || !m.winnerId) continue;
    if (!scores[m.player1Id]) {
      scores[m.player1Id] = { id: m.player1Id, pts: 0, diff: 0, pf: 0 };
    }
    if (!scores[m.player2Id]) {
      scores[m.player2Id] = { id: m.player2Id, pts: 0, diff: 0, pf: 0 };
    }
    const s1 = scores[m.player1Id]!;
    const s2 = scores[m.player2Id]!;
    s1.pf += m.score1 || 0;
    s2.pf += m.score2 || 0;
    s1.diff += (m.score1 || 0) - (m.score2 || 0);
    s2.diff += (m.score2 || 0) - (m.score1 || 0);
    if (m.winnerId === m.player1Id) {
      s1.pts += 3;
    } else if (m.winnerId === m.player2Id) {
      s2.pts += 3;
    }
  }

  const sorted = Object.values(scores).sort(
    (a, b) => b.pts - a.pts || b.diff - a.diff || b.pf - a.pf
  );
  return sorted[0]?.id ?? null;
}

/**
 * Normalizes an application state ensuring all fields, collections, and statuses are valid.
 */
export function normalizeState(state: unknown): AppState {
  if (!state || typeof state !== 'object') {
    return {
      version: 1,
      activeTournamentId: null,
      activeMatchId: null,
      activeArenaMatchIds: [],
      players: {},
      tournaments: {}
    };
  }

  const s = state as Partial<AppState>;
  if (!s.players || typeof s.players !== 'object') {
    s.players = {};
  }
  if (!s.tournaments || typeof s.tournaments !== 'object') {
    s.tournaments = {};
  }
  if (!Array.isArray(s.activeArenaMatchIds)) {
    s.activeArenaMatchIds = [];
  }
  if (typeof s.version !== 'number') {
    s.version = 1;
  }

  for (const tournament of Object.values(s.tournaments)) {
    if (!tournament || typeof tournament !== 'object') continue;
    normalizeTournament(tournament);
  }

  return s as AppState;
}

/**
 * Normalizes a single tournament object.
 */
export function normalizeTournament(tournament: Tournament): void {
  if (!tournament.matches || typeof tournament.matches !== 'object') {
    tournament.matches = {};
  }
  if (!Array.isArray(tournament.playerIds)) {
    tournament.playerIds = [];
  }
  if (!Array.isArray(tournament.rounds)) {
    tournament.rounds = [];
  }
  if (typeof tournament.createdAt !== 'number') {
    tournament.createdAt = 0;
  }
  if (typeof tournament.updatedAt !== 'number') {
    tournament.updatedAt = tournament.createdAt;
  }
  if (!tournament.rules || typeof tournament.rules !== 'object') {
    tournament.rules = {
      targetPoints: 4,
      finishPoints: { spin: 1, over: 2, burst: 2, xtreme: 3, penalty: 1 }
    };
  } else if (!tournament.rules.finishPoints || typeof tournament.rules.finishPoints !== 'object') {
    tournament.rules.finishPoints = { spin: 1, over: 2, burst: 2, xtreme: 3, penalty: 1 };
  }

  for (const match of Object.values(tournament.matches)) {
    if (!match || typeof match !== 'object') continue;
    if (!Array.isArray(match.history)) {
      match.history = [];
    }
    if (typeof match.score1 !== 'number') {
      match.score1 = Number(match.score1) || 0;
    }
    if (typeof match.score2 !== 'number') {
      match.score2 = Number(match.score2) || 0;
    }
    if (!match.targetPoints) {
      match.targetPoints = tournament.rules.targetPoints || 4;
    }
  }

  // Auto-detect completed status for tournaments where all matches are finished
  const matchesList = Object.values(tournament.matches);
  const hasMatches = matchesList.length > 0;
  const allMatchesDone = hasMatches && matchesList.every((m) => m.status === 'completed');

  if (allMatchesDone && tournament.status !== 'completed') {
    tournament.status = 'completed';
    tournament.updatedAt = Math.max(tournament.updatedAt, tournament.createdAt);
    if (!tournament.winnerId) {
      tournament.winnerId = computeTournamentWinner(tournament.playerIds, matchesList);
    }
  }
}

/**
 * Normalizes text for accent-insensitive and case-insensitive comparison.
 */
export function normalizeSearchTerm(term: string): string {
  return term
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const FORMAT_LABELS_SEARCH: Record<string, string> = {
  brackets: 'llaves brackets eliminacion directa',
  double_elimination: 'doble eliminacion',
  round_robin: 'liga todos contra todos',
  swiss: 'sistema suizo',
  groups_playoffs: 'grupos playoffs',
  king_of_the_hill: 'rey de la pista koth'
};

export interface TournamentFilterOptions {
  query?: string;
  status?: TournamentFilterStatus;
  players?: Record<string, Player>;
  datesProvider?: (tournament: Tournament) => string[];
}

/**
 * Filters tournaments by search keyword and status filter.
 */
export function filterTournaments(
  tournaments: Tournament[],
  options: TournamentFilterOptions = {}
): Tournament[] {
  const { query = '', status = 'all', players = {}, datesProvider } = options;
  const cleanQuery = normalizeSearchTerm(query);

  return tournaments.filter((t) => {
    // 1. Status Filter
    if (status !== 'all') {
      if (status === 'in_progress' && t.status !== 'in_progress' && t.status !== 'draft') {
        return false;
      }
      if (status === 'completed' && t.status !== 'completed') {
        return false;
      }
      if (status === 'paused' && t.status !== 'paused') {
        return false;
      }
    }

    if (!cleanQuery) return true;

    // 2. Tournament Name
    const cleanName = normalizeSearchTerm(t.name);
    if (cleanName.includes(cleanQuery)) return true;

    // 3. Tournament Format
    const formatSearchStr = FORMAT_LABELS_SEARCH[t.format] ?? t.format;
    if (normalizeSearchTerm(formatSearchStr).includes(cleanQuery)) return true;

    // 4. Winner Name
    if (t.winnerId && players[t.winnerId]) {
      const winner = players[t.winnerId];
      if (winner?.name && normalizeSearchTerm(winner.name).includes(cleanQuery)) {
        return true;
      }
    }

    // 5. Participating Bladers
    const matchesPlayer = (t.playerIds || []).some((pId) => {
      const p = players[pId];
      if (!p?.name) return false;
      return normalizeSearchTerm(p.name).includes(cleanQuery);
    });
    if (matchesPlayer) return true;

    // 6. Dates
    if (datesProvider) {
      const dates = datesProvider(t);
      if (dates.some((dateStr) => normalizeSearchTerm(dateStr).includes(cleanQuery))) {
        return true;
      }
    }

    return false;
  });
}

/**
 * Sorts tournaments based on specified order.
 */
export function sortTournaments(
  tournaments: Tournament[],
  order: TournamentSortOrder = 'recent'
): Tournament[] {
  const list = [...tournaments];
  switch (order) {
    case 'oldest':
      return list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    case 'name_asc':
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':
      return list.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return list.sort((a, b) => {
        const timeA = Math.max(a.createdAt || 0, a.updatedAt || 0);
        const timeB = Math.max(b.createdAt || 0, b.updatedAt || 0);
        return timeB - timeA || (b.createdAt || 0) - (a.createdAt || 0);
      });
  }
}
