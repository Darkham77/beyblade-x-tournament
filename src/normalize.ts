/**
 * State Normalization and Data Integrity Engine
 */

import type { AppState, Match, Tournament } from './types.ts';

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
    if (!tournament.winnerId) {
      tournament.winnerId = computeTournamentWinner(tournament.playerIds, matchesList);
    }
  }
}
