import { BEYBLADE_X_VERSION, FINISH_POINTS, type FinishType, type Player } from '../src/index.ts';

/**
 * Domain Test Suite: Beyblade X Point System and Tournament Invariants
 */
export function testVersionString(): boolean {
  if (BEYBLADE_X_VERSION !== '1.0.0') {
    throw new Error('Version mismatch');
  }
  return true;
}

export function testOfficialFinishPoints(): boolean {
  // Official Beyblade X rules:
  // Spin Finish: 1 point
  // Over Finish: 2 points
  // Burst Finish: 2 points
  // Xtreme Finish: 3 points
  if (FINISH_POINTS.spin !== 1) {
    throw new Error('Spin finish must award exactly 1 point');
  }
  if (FINISH_POINTS.over !== 2) {
    throw new Error('Over finish must award exactly 2 points');
  }
  if (FINISH_POINTS.burst !== 2) {
    throw new Error('Burst finish must award exactly 2 points');
  }
  if (FINISH_POINTS.xtreme !== 3) {
    throw new Error('Xtreme finish must award exactly 3 points');
  }
  return true;
}

export function testPlayerRecordIntegrity(): boolean {
  const dummyPlayer: Player = {
    id: 'blader_1',
    name: 'Kurosu Ex',
    emoji: '🌪️'
  };

  if (!dummyPlayer.id || !dummyPlayer.name || !dummyPlayer.emoji) {
    throw new Error('Player contract violated');
  }
  return true;
}

export function testMatchTargetPoints(): boolean {
  const standardTarget = 4;
  const matchPoints = [FINISH_POINTS.xtreme, FINISH_POINTS.spin];
  const total = matchPoints.reduce((acc, curr) => acc + curr, 0);

  if (total !== standardTarget) {
    throw new Error('Scoring accumulation failed');
  }
  return true;
}

export function testFinishTypeExhaustiveness(): boolean {
  const validTypes: FinishType[] = ['spin', 'over', 'burst', 'xtreme'];
  for (const t of validTypes) {
    if (typeof FINISH_POINTS[t] !== 'number' || FINISH_POINTS[t] <= 0) {
      throw new Error(`Invalid finish points for ${t}`);
    }
  }
  return true;
}

export function runAllUnitTests(): void {
  testVersionString();
  testOfficialFinishPoints();
  testPlayerRecordIntegrity();
  testMatchTargetPoints();
  testFinishTypeExhaustiveness();
}
