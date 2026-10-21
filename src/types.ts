/**
 * Beyblade X Domain Types and Contracts
 */

export type FinishType = 'spin' | 'over' | 'burst' | 'xtreme';

export const FINISH_POINTS: Record<FinishType, number> = {
  spin: 1,
  over: 2,
  burst: 2,
  xtreme: 3
};

export type TournamentFormat =
  | 'brackets'
  | 'double_elimination'
  | 'round_robin'
  | 'swiss'
  | 'groups_playoffs'
  | 'king_of_the_hill';

export type TournamentStatus = 'draft' | 'in_progress' | 'paused' | 'completed';

export interface PlayerStats {
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  pointsScored: number;
  pointsConceded: number;
  currentStreak: number;
  bestStreak: number;
}

export interface Player {
  // domain-ok: Open dynamic text or non-domain string payload
  id: string;
  // domain-ok: Open dynamic text or non-domain string payload
  name: string;
  // domain-ok: Open dynamic text or non-domain string payload
  emoji: string;
  // domain-ok: Open dynamic text or non-domain string payload
  avatarColor?: string;
  createdAt?: number;
  stats?: PlayerStats;
}

export interface FinishRuleConfig {
  spin: number;
  over: number;
  burst: number;
  xtreme: number;
  penalty: number;
}

export interface TournamentRules {
  // domain-ok: Open dynamic text or non-domain string payload
  presetName?: string;
  targetPoints: number;
  finishPoints: FinishRuleConfig;
  allowCustomPenalties?: boolean;
}

export type MatchStatus = 'pending' | 'in_progress' | 'completed';

export interface MatchHistoryEntry {
  // domain-ok: Open dynamic text or non-domain string payload
  scorerId: string;
  finishType: FinishType | 'penalty';
  points: number;
  score1After: number;
  score2After: number;
  timestamp: number;
}

export interface Match {
  // domain-ok: Open dynamic text or non-domain string payload
  id: string;
  roundIndex: number;
  matchIndex: number;
  // domain-ok: Open dynamic text or non-domain string payload
  player1Id: string | null;
  // domain-ok: Open dynamic text or non-domain string payload
  player2Id: string | null;
  score1: number;
  score2: number;
  targetPoints: number;
  status: MatchStatus;
  // domain-ok: Open dynamic text or non-domain string payload
  winnerId: string | null;
  // domain-ok: Open dynamic text or non-domain string payload
  loserId: string | null;
  isBye?: boolean;
  // domain-ok: Open dynamic text or non-domain string payload
  pairingReason?: string;
  history: MatchHistoryEntry[];
  // domain-ok: Open dynamic text or non-domain string payload
  nextMatchId?: string | null;
  nextMatchSlot?: 1 | 2;
}

export interface Round {
  roundIndex: number;
  // domain-ok: Open dynamic text or non-domain string payload
  name: string;
  // domain-ok: Open dynamic text or non-domain string payload
  matchIds: string[];
}

export interface SwissState {
  currentRound: number;
  totalRounds: number;
  completedRounds: number;
}

export interface GroupsState {
  // domain-ok: Open dynamic text or non-domain string payload
  groupA: string[];
  // domain-ok: Open dynamic text or non-domain string payload
  groupB: string[];
  playoffsGenerated: boolean;
}

export interface KothState {
  // domain-ok: Open dynamic text or non-domain string payload
  kingId: string | null;
  // domain-ok: Open dynamic text or non-domain string payload
  queue: string[];
  currentStreak: number;
  targetStreak: number;
  matchesCount: number;
}

export interface Tournament {
  // domain-ok: Open dynamic text or non-domain string payload
  id: string;
  // domain-ok: Open dynamic text or non-domain string payload
  name: string;
  format: TournamentFormat;
  rules: TournamentRules;
  // domain-ok: Open dynamic text or non-domain string payload
  playerIds: string[];
  status: TournamentStatus;
  // domain-ok: Open dynamic dictionary payload
  matches: Record<string, Match>;
  rounds: Round[];
  // domain-ok: Open dynamic text or non-domain string payload
  winnerId?: string | null;
  swiss?: SwissState;
  groups?: GroupsState;
  koth?: KothState;
  createdAt: number;
  updatedAt: number;
}

export interface StandingsEntry {
  // domain-ok: Open dynamic text or non-domain string payload
  id: string;
  pj: number;
  pg: number;
  pp: number;
  pf: number;
  pc: number;
  pts: number;
  buchholz?: number;
}

export interface AppState {
  version: number;
  // domain-ok: Open dynamic text or non-domain string payload
  activeTournamentId: string | null;
  // domain-ok: Open dynamic text or non-domain string payload
  activeMatchId: string | null;
  // domain-ok: Open dynamic text or non-domain string payload
  activeArenaMatchIds: string[];
  // domain-ok: Open dynamic dictionary payload
  players: Record<string, Player>;
  // domain-ok: Open dynamic dictionary payload
  tournaments: Record<string, Tournament>;
}
