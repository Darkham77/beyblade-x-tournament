/**
 * Beyblade X Tournament Manager & Engine
 */
export const BEYBLADE_X_VERSION = '1.0.0';

export interface Player {
  id: string;
  name: string;
  emoji: string;
}

export type FinishType = 'spin' | 'over' | 'burst' | 'xtreme';

export const FINISH_POINTS: Record<FinishType, number> = {
  spin: 1,
  over: 2,
  burst: 2,
  xtreme: 3
};
