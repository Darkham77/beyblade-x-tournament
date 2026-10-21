/**
 * Swiss System Tournament Engine
 */

import type { Match, Round, StandingsEntry, SwissState } from './types.ts';

interface SwissRecord {
  // domain-ok: Open dynamic text or non-domain string payload
  id: string;
  wins: number;
  points: number;
  buchholz: number;
  diff: number;
  playedAgainst: Set<string>;
}

/**
 * Builds opening round (Round 1) for a Swiss tournament.
 */
export function buildSwissOpeningRound(
  playerIds: string[],
  targetPoints: number
): { matches: Record<string, Match>; rounds: Round[]; swiss: SwissState } {
  const numPlayers = playerIds.length;
  const totalRounds = Math.max(3, Math.ceil(Math.log2(numPlayers)));
  const swiss: SwissState = {
    currentRound: 0,
    totalRounds,
    completedRounds: 0
  };

  const matches: Record<string, Match> = {};
  const round0: Round = {
    roundIndex: 0,
    name: `Ronda 1 de ${totalRounds}`,
    matchIds: []
  };

  const numMatches = Math.floor(numPlayers / 2);

  for (let m = 0; m < numMatches; m++) {
    const matchId = `swiss_0_${m}`;
    const p1 = playerIds[m * 2]!;
    const p2 = playerIds[m * 2 + 1]!;
    const match: Match = {
      id: matchId,
      roundIndex: 0,
      matchIndex: m,
      player1Id: p1,
      player2Id: p2,
      score1: 0,
      score2: 0,
      targetPoints,
      status: 'pending',
      winnerId: null,
      loserId: null,
      pairingReason: 'Ronda 1: Sorteo de apertura',
      history: []
    };
    matches[matchId] = match;
    round0.matchIds.push(matchId);
  }

  // Handle odd number of players with a Round 1 BYE
  if (numPlayers % 2 !== 0) {
    const byePlayerId = playerIds[numPlayers - 1]!;
    const byeMatchId = 'swiss_0_bye';
    const byeMatch: Match = {
      id: byeMatchId,
      roundIndex: 0,
      matchIndex: numMatches,
      player1Id: byePlayerId,
      player2Id: null,
      score1: targetPoints,
      score2: 0,
      targetPoints,
      status: 'completed',
      winnerId: byePlayerId,
      loserId: null,
      isBye: true,
      pairingReason: 'Pase Libre por número impar (+3 pts)',
      history: []
    };
    matches[byeMatchId] = byeMatch;
    round0.matchIds.push(byeMatchId);
  }

  return { matches, rounds: [round0], swiss };
}

/**
 * Calculates current Swiss standings with Buchholz score tiebreakers.
 */
export function calculateSwissStandings(
  playerIds: string[],
  matches: Record<string, Match>
): StandingsEntry[] {
  interface LocalSwissEntry extends StandingsEntry {
    opponents: string[];
  }

  const records: Record<string, LocalSwissEntry> = {};
  for (const pId of playerIds) {
    records[pId] = {
      id: pId,
      pj: 0,
      pg: 0,
      pp: 0,
      pf: 0,
      pc: 0,
      pts: 0,
      buchholz: 0,
      opponents: []
    };
  }

  for (const m of Object.values(matches)) {
    if (m.status !== 'completed' || !m.player1Id) continue;
    const rec1 = records[m.player1Id];
    if (rec1) {
      rec1.pj += 1;
      rec1.pf += m.score1;
      rec1.pc += m.score2;
    }

    if (!m.player2Id) {
      if (m.isBye && rec1) {
        rec1.pg += 1;
        rec1.pts += 3;
      }
      continue;
    }

    const rec2 = records[m.player2Id];
    if (rec2) {
      rec2.pj += 1;
      rec2.pf += m.score2;
      rec2.pc += m.score1;
    }
    if (rec1 && rec2) {
      rec1.opponents.push(m.player2Id);
      rec2.opponents.push(m.player1Id);
      if (m.winnerId === m.player1Id) {
        rec1.pg += 1;
        rec1.pts += 3;
        rec2.pp += 1;
      } else if (m.winnerId === m.player2Id) {
        rec2.pg += 1;
        rec2.pts += 3;
        rec1.pp += 1;
      }
    }
  }

  for (const r of Object.values(records)) {
    let b = 0;
    for (const oppId of r.opponents) {
      const opp = records[oppId];
      if (opp) {
        b += opp.pg;
      }
    }
    r.buchholz = b;
  }

  return Object.values(records).sort((a, b) => {
    if (b.pts !== a.pts) {
      return b.pts - a.pts;
    }
    if ((b.buchholz ?? 0) !== (a.buchholz ?? 0)) {
      return (b.buchholz ?? 0) - (a.buchholz ?? 0);
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
 * Generates next round pairings for a Swiss tournament.
 */
export function generateNextSwissRound(
  playerIds: string[],
  matches: Record<string, Match>,
  targetPoints: number,
  swiss: SwissState
): { newRound: Round; newMatches: Record<string, Match> } | null {
  const nextR = swiss.currentRound + 1;
  if (nextR >= swiss.totalRounds) {
    return null;
  }

  const records: Record<string, SwissRecord> = {};
  for (const pId of playerIds) {
    records[pId] = {
      id: pId,
      wins: 0,
      points: 0,
      buchholz: 0,
      diff: 0,
      playedAgainst: new Set<string>()
    };
  }

  for (const m of Object.values(matches)) {
    if (m.status !== 'completed' || !m.player1Id) continue;
    const r1 = records[m.player1Id];
    if (!m.player2Id) {
      if (m.isBye && r1) {
        r1.wins += 1;
        r1.points += 3;
      }
      continue;
    }

    const r2 = records[m.player2Id];
    if (r1 && r2) {
      r1.playedAgainst.add(m.player2Id);
      r2.playedAgainst.add(m.player1Id);
      r1.diff += m.score1 - m.score2;
      r2.diff += m.score2 - m.score1;
      if (m.winnerId === m.player1Id) {
        r1.wins += 1;
        r1.points += 3;
      } else {
        r2.wins += 1;
        r2.points += 3;
      }
    }
  }

  for (const r of Object.values(records)) {
    let b = 0;
    for (const oppId of r.playedAgainst) {
      const opp = records[oppId];
      if (opp) {
        b += opp.wins;
      }
    }
    r.buchholz = b;
  }

  const sorted = Object.values(records).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.buchholz !== a.buchholz) return b.buchholz - a.buchholz;
    return b.diff - a.diff;
  });

  const unmatched = [...sorted];
  const newRound: Round = {
    roundIndex: nextR,
    name: `Ronda ${nextR + 1} de ${swiss.totalRounds}`,
    matchIds: []
  };
  const newMatches: Record<string, Match> = {};
  let matchIdx = 0;

  while (unmatched.length > 1) {
    const p1 = unmatched.shift()!;
    let oppIdx = unmatched.findIndex((opp) => !p1.playedAgainst.has(opp.id));
    if (oppIdx === -1) {
      oppIdx = 0;
    }

    const p2 = unmatched.splice(oppIdx, 1)[0]!;
    const mId = `swiss_${nextR}_${matchIdx}`;
    const reason =
      p1.points === p2.points
        ? `Ambos con ${p1.wins}V-${nextR - p1.wins}D (${p1.points} pts)`
        : `Récords cercanos: ${p1.wins}V vs ${p2.wins}V`;

    const match: Match = {
      id: mId,
      roundIndex: nextR,
      matchIndex: matchIdx++,
      player1Id: p1.id,
      player2Id: p2.id,
      score1: 0,
      score2: 0,
      targetPoints,
      status: 'pending',
      winnerId: null,
      loserId: null,
      pairingReason: reason,
      history: []
    };
    newMatches[mId] = match;
    newRound.matchIds.push(mId);
  }

  if (unmatched.length === 1) {
    const p1 = unmatched.shift()!;
    const mId = `swiss_${nextR}_bye`;
    const match: Match = {
      id: mId,
      roundIndex: nextR,
      matchIndex: matchIdx,
      player1Id: p1.id,
      player2Id: null,
      score1: targetPoints,
      score2: 0,
      targetPoints,
      status: 'completed',
      winnerId: p1.id,
      loserId: null,
      isBye: true,
      pairingReason: 'Pase Libre por número impar (+3 pts)',
      history: []
    };
    newMatches[mId] = match;
    newRound.matchIds.push(mId);
  }

  return { newRound, newMatches };
}
