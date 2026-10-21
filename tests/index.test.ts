import { describe, expect, it } from 'vite-plus/test';

import {
  advanceBracketWinner,
  BEYBLADE_X_VERSION,
  buildBracketRounds,
  buildRoundRobinRounds,
  buildSwissOpeningRound,
  calculateLeagueStandings,
  calculateSwissStandings,
  checkRoundRobinProgression,
  FINISH_POINTS,
  generateNextSwissRound,
  getBracketSeeds,
  migrateState,
  normalizeState,
  type AppState,
  type FinishType,
  type Match,
  type Player,
  type Tournament
} from '../src/index.ts';

/**
 * Domain & Engine Test Suite: Beyblade X Point System, Tournament Engines, and Invariants
 */
describe('Beyblade X Domain & Scoring Invariants', () => {
  it('has consistent version string', () => {
    expect(BEYBLADE_X_VERSION).toBe('1.0.0');
  });

  it('matches official Takara Tomy / Hasbro finish points', () => {
    // Spin Finish: 1 point (opponent stops spinning first)
    expect(FINISH_POINTS.spin).toBe(1);
    // Over Finish: 2 points (opponent knocked into Over Zone pocket)
    expect(FINISH_POINTS.over).toBe(2);
    // Burst Finish: 2 points (opponent beyblade separates)
    expect(FINISH_POINTS.burst).toBe(2);
    // Xtreme Finish: 3 points (opponent propelled into Xtreme Zone via X-Line)
    expect(FINISH_POINTS.xtreme).toBe(3);
  });

  it('verifies player record integrity', () => {
    const dummyPlayer: Player = {
      id: 'blader_1',
      name: 'Kurosu Ex',
      emoji: '🌪️'
    };

    expect(dummyPlayer.id).toBe('blader_1');
    expect(dummyPlayer.name).toBe('Kurosu Ex');
    expect(dummyPlayer.emoji).toBe('🌪️');
  });

  it('calculates match score target progression correctly for standard match', () => {
    const standardTarget = 4;
    const matchPoints = [FINISH_POINTS.xtreme, FINISH_POINTS.spin];
    const total = matchPoints.reduce((acc, curr) => acc + curr, 0);

    expect(total).toBe(standardTarget);
  });

  it('calculates championship match score target progression correctly', () => {
    const championshipTarget = 7;
    const matchPoints = [FINISH_POINTS.xtreme, FINISH_POINTS.burst, FINISH_POINTS.over];
    const total = matchPoints.reduce((acc, curr) => acc + curr, 0);

    expect(total).toBe(championshipTarget);
  });

  it('contains valid points for all finish types', () => {
    const validTypes: FinishType[] = ['spin', 'over', 'burst', 'xtreme'];
    for (const t of validTypes) {
      expect(typeof FINISH_POINTS[t]).toBe('number');
      expect(FINISH_POINTS[t]).toBeGreaterThan(0);
    }
  });

  it('verifies point accumulation with penalties and over finishes', () => {
    let score = 0;
    score += FINISH_POINTS.over;
    expect(score).toBe(2);

    score += FINISH_POINTS.spin;
    expect(score).toBe(3);

    const penaltyPoint = 1;
    score += penaltyPoint;
    expect(score).toBe(4);
  });

  it('handles burst finish followed by xtreme finish for a comeback', () => {
    let player1Score = 0;
    let player2Score = 0;

    player1Score += FINISH_POINTS.burst;
    expect(player1Score).toBe(2);

    player1Score += FINISH_POINTS.spin;
    expect(player1Score).toBe(3);

    player2Score += FINISH_POINTS.xtreme;
    expect(player2Score).toBe(3);

    player2Score += FINISH_POINTS.over;
    expect(player2Score).toBe(5);
    expect(player2Score).toBeGreaterThanOrEqual(4);
  });
});

describe('Single Elimination Bracket Engine', () => {
  it('generates standard bracket seeding order for size 4 and 8', () => {
    expect(getBracketSeeds(4)).toEqual([1, 4, 2, 3]);
    expect(getBracketSeeds(8)).toEqual([1, 8, 4, 5, 2, 7, 3, 6]);
  });

  it('builds bracket tree for 4 players with correct round naming and match slots', () => {
    const players = ['blader_a', 'blader_b', 'blader_c', 'blader_d'];
    const { matches, rounds } = buildBracketRounds(players, 4);

    expect(rounds.length).toBe(2);
    expect(rounds[0]!.name).toBe('Semifinales');
    expect(rounds[1]!.name).toBe('Gran Final');

    expect(rounds[0]!.matchIds.length).toBe(2);
    expect(rounds[1]!.matchIds.length).toBe(1);

    const semi1 = matches['m_0_0']!;
    const semi2 = matches['m_0_1']!;
    const finalMatch = matches['m_1_0']!;

    expect(semi1.nextMatchId).toBe('m_1_0');
    expect(semi1.nextMatchSlot).toBe(1);
    expect(semi2.nextMatchId).toBe('m_1_0');
    expect(semi2.nextMatchSlot).toBe(2);
    expect(finalMatch.nextMatchId).toBeNull();
  });

  it('allocates BYEs cleanly for odd/non-power-of-2 number of players', () => {
    const players = ['blader_1', 'blader_2', 'blader_3'];
    const { matches, rounds } = buildBracketRounds(players, 4);

    expect(rounds.length).toBe(2);
    const completedByes = Object.values(matches).filter((m) => m.isBye && m.status === 'completed');
    expect(completedByes.length).toBe(1);

    // The top seed advances automatically to the final
    const finalMatch = matches['m_1_0']!;
    expect(finalMatch.player1Id).toBe('blader_1');
  });

  it('advances winners through the bracket up to Grand Final completion', () => {
    const players = ['blader_a', 'blader_b', 'blader_c', 'blader_d'];
    const { matches } = buildBracketRounds(players, 4);

    // Semi 1: A beats B
    const semi1 = matches['m_0_0']!;
    semi1.score1 = 4;
    semi1.score2 = 1;
    semi1.winnerId = semi1.player1Id;
    semi1.status = 'completed';
    const adv1 = advanceBracketWinner(matches, semi1);
    expect(adv1.tournamentCompleted).toBe(false);

    // Semi 2: D beats C
    const semi2 = matches['m_0_1']!;
    semi2.score1 = 2;
    semi2.score2 = 4;
    semi2.winnerId = semi2.player2Id;
    semi2.status = 'completed';
    const adv2 = advanceBracketWinner(matches, semi2);
    expect(adv2.tournamentCompleted).toBe(false);

    // Verify Final match contestants
    const finalMatch = matches['m_1_0']!;
    expect(finalMatch.player1Id).toBe(semi1.winnerId);
    expect(finalMatch.player2Id).toBe(semi2.winnerId);

    // Final: Winner takes all
    finalMatch.score1 = 4;
    finalMatch.score2 = 2;
    finalMatch.winnerId = finalMatch.player1Id;
    finalMatch.status = 'completed';
    const finalAdv = advanceBracketWinner(matches, finalMatch);
    expect(finalAdv.tournamentCompleted).toBe(true);
    expect(finalAdv.tournamentWinnerId).toBe(finalMatch.winnerId);
  });
});

describe('Round Robin (League) Engine', () => {
  it('generates correct number of rounds and matches for even player count', () => {
    const players = ['p1', 'p2', 'p3', 'p4'];
    const { matches, rounds } = buildRoundRobinRounds(players, 4);

    // 4 players: (4 - 1) = 3 rounds, 2 matches per round = 6 total matches
    expect(rounds.length).toBe(3);
    expect(Object.keys(matches).length).toBe(6);
  });

  it('generates correct number of rounds and matches for odd player count with byes', () => {
    const players = ['p1', 'p2', 'p3'];
    const { matches, rounds } = buildRoundRobinRounds(players, 4);

    // 3 players: 3 rounds, 1 match per round (1 player on bye each round) = 3 matches
    expect(rounds.length).toBe(3);
    expect(Object.keys(matches).length).toBe(3);
  });

  it('computes standings correctly based on wins, points, and goal differential', () => {
    const players = ['p1', 'p2', 'p3'];
    const { matches } = buildRoundRobinRounds(players, 4);

    // Match 1: p1 beats p2 (4 - 1)
    const m1: Match = {
      id: 'rr_0_0',
      roundIndex: 0,
      matchIndex: 0,
      player1Id: 'p1',
      player2Id: 'p2',
      score1: 4,
      score2: 1,
      targetPoints: 4,
      status: 'completed',
      winnerId: 'p1',
      loserId: 'p2',
      history: []
    };

    // Match 2: p1 beats p3 (4 - 2)
    const m2: Match = {
      id: 'rr_1_0',
      roundIndex: 1,
      matchIndex: 0,
      player1Id: 'p1',
      player2Id: 'p3',
      score1: 4,
      score2: 2,
      targetPoints: 4,
      status: 'completed',
      winnerId: 'p1',
      loserId: 'p3',
      history: []
    };

    // Match 3: p2 beats p3 (4 - 3)
    const m3: Match = {
      id: 'rr_2_0',
      roundIndex: 2,
      matchIndex: 0,
      player1Id: 'p2',
      player2Id: 'p3',
      score1: 4,
      score2: 3,
      targetPoints: 4,
      status: 'completed',
      winnerId: 'p2',
      loserId: 'p3',
      history: []
    };

    const leagueMatches = { [m1.id]: m1, [m2.id]: m2, [m3.id]: m3 };
    const standings = calculateLeagueStandings(players, leagueMatches);

    expect(standings[0]!.id).toBe('p1');
    expect(standings[0]!.pts).toBe(6);
    expect(standings[0]!.pg).toBe(2);

    expect(standings[1]!.id).toBe('p2');
    expect(standings[1]!.pts).toBe(3);
    expect(standings[1]!.pg).toBe(1);

    expect(standings[2]!.id).toBe('p3');
    expect(standings[2]!.pts).toBe(0);
    expect(standings[2]!.pp).toBe(2);

    const progression = checkRoundRobinProgression(players, leagueMatches);
    expect(progression.completed).toBe(true);
    expect(progression.winnerId).toBe('p1');
  });
});

describe('Swiss System Engine', () => {
  it('builds opening round with bye for odd player count', () => {
    const players = ['blader_1', 'blader_2', 'blader_3'];
    const { matches, rounds, swiss } = buildSwissOpeningRound(players, 4);

    expect(swiss.currentRound).toBe(0);
    expect(rounds.length).toBe(1);
    expect(rounds[0]!.matchIds.length).toBe(2);

    const byeMatch = matches['swiss_0_bye']!;
    expect(byeMatch.isBye).toBe(true);
    expect(byeMatch.winnerId).toBe('blader_3');
    expect(byeMatch.status).toBe('completed');
  });

  it('calculates Swiss standings and Buchholz tiebreaker scores', () => {
    const players = ['p1', 'p2', 'p3', 'p4'];
    const { matches, swiss } = buildSwissOpeningRound(players, 4);

    // Round 1: p1 beats p2, p3 beats p4
    const m0 = matches['swiss_0_0']!;
    m0.score1 = 4;
    m0.score2 = 0;
    m0.winnerId = 'p1';
    m0.loserId = 'p2';
    m0.status = 'completed';

    const m1 = matches['swiss_0_1']!;
    m1.score1 = 4;
    m1.score2 = 2;
    m1.winnerId = 'p3';
    m1.loserId = 'p4';
    m1.status = 'completed';

    const standings = calculateSwissStandings(players, matches);
    expect(standings[0]!.id).toBe('p1');
    expect(standings[0]!.pts).toBe(3);
    expect(standings[1]!.id).toBe('p3');
    expect(standings[1]!.pts).toBe(3);

    // Generate round 2: winners face winners (p1 vs p3), losers face losers (p2 vs p4)
    const nextRoundData = generateNextSwissRound(players, matches, 4, swiss);
    expect(nextRoundData).not.toBeNull();
    const round2Matches = Object.values(nextRoundData!.newMatches);
    expect(round2Matches.length).toBe(2);

    const topMatch = round2Matches.find(
      (m) =>
        (m.player1Id === 'p1' && m.player2Id === 'p3') ||
        (m.player1Id === 'p3' && m.player2Id === 'p1')
    );
    expect(topMatch).toBeDefined();
  });
});

describe('State Normalization & Migration Engine', () => {
  it('normalizes null or invalid state to a secure empty structure', () => {
    const state = normalizeState(null);
    expect(state.version).toBe(1);
    expect(state.players).toEqual({});
    expect(state.tournaments).toEqual({});
    expect(state.activeArenaMatchIds).toEqual([]);
  });

  it('auto-detects completed tournaments from legacy backups and computes winner', () => {
    const legacyTournament: Tournament = {
      id: 'tour_legacy_1',
      name: 'Torneo Antiguo',
      format: 'round_robin',
      status: 'in_progress', // Legacy state was marked in_progress despite all matches completed
      playerIds: ['rodrigo', 'franco'],
      rules: {
        targetPoints: 4,
        finishPoints: { spin: 1, over: 2, burst: 2, xtreme: 3, penalty: 1 }
      },
      rounds: [{ roundIndex: 0, name: 'Ronda 1', matchIds: ['m1'] }],
      matches: {
        m1: {
          id: 'm1',
          roundIndex: 0,
          matchIndex: 0,
          player1Id: 'rodrigo',
          player2Id: 'franco',
          score1: 4,
          score2: 1,
          targetPoints: 4,
          status: 'completed',
          winnerId: 'rodrigo',
          loserId: 'franco',
          history: []
        }
      },
      createdAt: 1000,
      updatedAt: 2000
    };

    const mockState: AppState = {
      version: 1,
      activeTournamentId: 'tour_legacy_1',
      activeMatchId: null,
      activeArenaMatchIds: [],
      players: {
        rodrigo: { id: 'rodrigo', name: 'Rodrigo', emoji: '🌪️' },
        franco: { id: 'franco', name: 'Franco', emoji: '🔥' }
      },
      tournaments: {
        tour_legacy_1: legacyTournament
      }
    };

    const normalized = normalizeState(mockState);
    const tournament = normalized.tournaments['tour_legacy_1']!;

    expect(tournament.status).toBe('completed');
    expect(tournament.winnerId).toBe('rodrigo');
  });

  it('migrates unversioned state to version 1 with all arrays and collections initialized', () => {
    const unversionedRaw = {
      players: {
        blader_1: { id: 'blader_1', name: 'Kurosu Ex', emoji: '🌪️' }
      },
      tournaments: {}
    };

    const migrated = migrateState(unversionedRaw);
    expect(migrated.version).toBe(1);
    expect(migrated.activeArenaMatchIds).toEqual([]);
    expect(migrated.players['blader_1']!.name).toBe('Kurosu Ex');
  });
});
