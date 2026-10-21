/**
 * Round-Robin (League) Tournament Engine
 */

import type { Match, Round, StandingsEntry } from './types.ts';

/**
 * Builds round-robin league schedule using the circle rotation method.
 */
export function buildRoundRobinRounds(
  playerIds: string[],
  targetPoints: number
): { matches: Record<string, Match>; rounds: Round[] } {
  const players: (string | null)[] = [...playerIds];
  if (players.length % 2 !== 0) {
    players.push(null);
  }

  const n = players.length;
  const totalRounds = n - 1;
  const matchesPerRound = n / 2;
  const rounds: Round[] = [];
  const matches: Record<string, Match> = {};

  let currentPlayers = [...players];

  for (let r = 0; r < totalRounds; r++) {
    const roundName = `Jornada ${r + 1}`;
    // domain-ok: Open dynamic text or non-domain string payload
    const matchIds: string[] = [];

    for (let m = 0; m < matchesPerRound; m++) {
      const p1 = currentPlayers[m]!;
      const p2 = currentPlayers[n - 1 - m]!;

      if (p1 !== null && p2 !== null) {
        const matchId = `rr_${r}_${m}`;
        const match: Match = {
          id: matchId,
          roundIndex: r,
          matchIndex: m,
          player1Id: p1,
          player2Id: p2,
          score1: 0,
          score2: 0,
          targetPoints,
          status: 'pending',
          winnerId: null,
          loserId: null,
          history: []
        };
        matches[matchId] = match;
        matchIds.push(matchId);
      }
    }

    rounds.push({ roundIndex: r, name: roundName, matchIds });
    const fixed = currentPlayers[0]!;
    const rest = currentPlayers.slice(1);
    const popped = rest.pop();
    if (popped !== undefined) {
      rest.unshift(popped);
    }
    currentPlayers = [fixed, ...rest];
  }

  return { matches, rounds };
}

/**
 * Calculates league standings table sorted by Points, Point Difference, and Points For.
 */
export function calculateLeagueStandings(
  playerIds: string[],
  matches: Record<string, Match>
): StandingsEntry[] {
  const stats: Record<string, StandingsEntry> = {};

  for (const pId of playerIds) {
    stats[pId] = { id: pId, pj: 0, pg: 0, pp: 0, pf: 0, pc: 0, pts: 0 };
  }

  for (const m of Object.values(matches)) {
    if (m.status === 'completed' && m.player1Id && m.player2Id) {
      const s1 = stats[m.player1Id];
      const s2 = stats[m.player2Id];
      if (s1 && s2) {
        s1.pj += 1;
        s2.pj += 1;
        s1.pf += m.score1;
        s1.pc += m.score2;
        s2.pf += m.score2;
        s2.pc += m.score1;

        if (m.winnerId === m.player1Id) {
          s1.pg += 1;
          s1.pts += 3;
          s2.pp += 1;
        } else if (m.winnerId === m.player2Id) {
          s2.pg += 1;
          s2.pts += 3;
          s1.pp += 1;
        }
      }
    }
  }

  return Object.values(stats).sort((a, b) => {
    if (b.pts !== a.pts) {
      return b.pts - a.pts;
    }
    const diffA = a.pf - a.pc;
    const diffB = b.pf - b.pc;
    if (diffB !== diffA) {
      return diffB - diffA;
    }
    return b.pf - a.pf;
  });
}

/**
 * Checks if all round-robin matches are completed and computes tournament winner.
 */
export function checkRoundRobinProgression(
  playerIds: string[],
  matches: Record<string, Match>
): { completed: boolean; winnerId: string | null } {
  const matchesList = Object.values(matches);
  const allDone = matchesList.length > 0 && matchesList.every((m) => m.status === 'completed');

  if (allDone) {
    const standings = calculateLeagueStandings(playerIds, matches);
    const winnerId = standings[0]?.id ?? null;
    return { completed: true, winnerId };
  }

  return { completed: false, winnerId: null };
}
