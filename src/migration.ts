/**
 * Schema Migration Pipeline for Beyblade X Tournament Backups
 */

import { normalizeState } from './normalize.ts';
import type { AppState } from './types.ts';

export const CURRENT_SCHEMA_VERSION = 1;

/**
 * Migrates any raw state object or historical backup to the current schema.
 */
export function migrateState(raw: unknown): AppState {
  if (!raw || typeof raw !== 'object') {
    return normalizeState(null);
  }

  const candidate = raw as Record<string, unknown>;
  const version = typeof candidate['version'] === 'number' ? candidate['version'] : 0;

  let current = candidate;

  // Migration step from legacy unversioned (v0) to v1
  if (version < 1) {
    current = {
      ...current,
      version: 1,
      activeArenaMatchIds: Array.isArray(current['activeArenaMatchIds'])
        ? current['activeArenaMatchIds']
        : []
    };
  }

  return normalizeState(current);
}
