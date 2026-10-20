import { BEYBLADE_X_VERSION, FINISH_POINTS } from '../src/index.ts';

export function testFinishPoints(): boolean {
  return FINISH_POINTS.xtreme === 3 && FINISH_POINTS.burst === 2;
}
