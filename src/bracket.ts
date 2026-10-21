/**
 * Single Elimination Bracket Tournament Engine
 */

import type { Match, Round } from './types.ts';

/**
 * Applies a first round bye and auto-advances the winner to the next bracket round.
 */
function applyOpeningRoundBye(
  match: Match,
  winnerId: string,
  score1: number,
  score2: number,
  matches: Record<string, Match>
): void {
  match.isBye = true;
  match.status = 'completed';
  match.winnerId = winnerId;
  match.score1 = score1;
  match.score2 = score2;
  if (!match.nextMatchId) return;

  const nextM = matches[match.nextMatchId];
  if (!nextM) return;

  if (match.nextMatchSlot === 1) {
    nextM.player1Id = winnerId;
  } else {
    nextM.player2Id = winnerId;
  }
}

/**
 * Computes standard tournament seeding array for a power-of-two bracket size.
 */
export function getBracketSeeds(size: number): number[] {
  let seeds = [1, 2];
  while (seeds.length < size) {
    const next: number[] = [];
    const sum = seeds.length * 2 + 1;
    for (const seed of seeds) {
      next.push(seed);
      next.push(sum - seed);
    }
    seeds = next;
  }
  return seeds;
}

/**
 * Builds standard single elimination bracket rounds and matches.
 */
export function buildBracketRounds(
  playerIds: string[],
  targetPoints: number
): { matches: Record<string, Match>; rounds: Round[] } {
  const numPlayers = playerIds.length;
  let size = 2;
  while (size < numPlayers) {
    size *= 2;
  }

  const totalRounds = Math.log2(size);
  const rounds: Round[] = [];
  const matchesByRound: Match[][] = [];
  const matches: Record<string, Match> = {};

  for (let r = 0; r < totalRounds; r++) {
    const roundName =
      r === totalRounds - 1
        ? 'Gran Final'
        : r === totalRounds - 2
          ? 'Semifinales'
          : r === totalRounds - 3
            ? 'Cuartos de Final'
            : `Ronda ${r + 1}`;
    rounds.push({ roundIndex: r, name: roundName, matchIds: [] });
    matchesByRound[r] = [];
  }

  for (let r = 0; r < totalRounds; r++) {
    const numMatches = size / 2 ** (r + 1);
    for (let m = 0; m < numMatches; m++) {
      const matchId = `m_${r}_${m}`;
      const nextMatchSlot: 1 | 2 = m % 2 === 0 ? 1 : 2;
      const match: Match = {
        id: matchId,
        roundIndex: r,
        matchIndex: m,
        player1Id: null,
        player2Id: null,
        score1: 0,
        score2: 0,
        targetPoints,
        status: 'pending',
        winnerId: null,
        loserId: null,
        isBye: false,
        history: [],
        nextMatchId: r < totalRounds - 1 ? `m_${r + 1}_${Math.floor(m / 2)}` : null,
        nextMatchSlot
      };
      matches[matchId] = match;
      rounds[r]!.matchIds.push(matchId);
      matchesByRound[r]!.push(match);
    }
  }

  // Distribute seeds and allocate BYEs to top seeds in round 0
  const seedOrder = getBracketSeeds(size);
  const round0Matches = matchesByRound[0] ?? [];
  for (let m = 0; m < round0Matches.length; m++) {
    const match = round0Matches[m]!;
    const s1 = seedOrder[m * 2]!;
    const s2 = seedOrder[m * 2 + 1]!;

    match.player1Id = s1 <= numPlayers ? (playerIds[s1 - 1] ?? null) : null;
    match.player2Id = s2 <= numPlayers ? (playerIds[s2 - 1] ?? null) : null;

    if (match.player1Id && !match.player2Id) {
      applyOpeningRoundBye(match, match.player1Id, targetPoints, 0, matches);
    } else if (!match.player1Id && match.player2Id) {
      applyOpeningRoundBye(match, match.player2Id, 0, targetPoints, matches);
    }
  }

  return { matches, rounds };
}

/**
 * Propagates match winner through the bracket tree.
 */
export function advanceBracketWinner(
  matches: Record<string, Match>,
  match: Match
): { tournamentCompleted: boolean; tournamentWinnerId: string | null } {
  if (!match.nextMatchId) {
    // Grand Final finished
    return {
      tournamentCompleted: true,
      tournamentWinnerId: match.winnerId
    };
  }

  const nextM = matches[match.nextMatchId];
  if (!nextM) {
    return { tournamentCompleted: false, tournamentWinnerId: null };
  }

  if (match.nextMatchSlot === 1) {
    nextM.player1Id = match.winnerId;
  } else {
    nextM.player2Id = match.winnerId;
  }

  // Auto-advance if next match opponent is an existing BYE
  if (nextM.player1Id && !nextM.player2Id && nextM.isBye) {
    nextM.winnerId = nextM.player1Id;
    nextM.status = 'completed';
    return advanceBracketWinner(matches, nextM);
  }
  if (!nextM.player1Id && nextM.player2Id && nextM.isBye) {
    nextM.winnerId = nextM.player2Id;
    nextM.status = 'completed';
    return advanceBracketWinner(matches, nextM);
  }

  return { tournamentCompleted: false, tournamentWinnerId: null };
}
