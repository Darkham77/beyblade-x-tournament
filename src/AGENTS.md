# Purpose

Core data structures, types, and domain constants for Beyblade X Tournament.

## Ownership

Beyblade X Tournament Architecture & Development Team.

## Local Contracts

- **Domain Integrity**: All finish types and tournament formats must strictly type-check.
- **Completed Tournament Winner Invariant**: All tournaments with status 'completed' must have their `winnerId` deterministically computed and persisted, ensuring podium banners and export summaries never encounter null champions.

## Key Files

- [`bracket.ts`](./bracket.ts): Single elimination bracket generator and winner advancement logic.
- [`index.ts`](./index.ts): Main exports and engine re-exports.
- [`migration.ts`](./migration.ts): Schema migration pipeline for legacy backups.
- [`normalize.ts`](./normalize.ts): State normalization, structural validation, auto-completion detection, and tournament query/filtering helpers.
- [`round-robin.ts`](./round-robin.ts): Round-robin league schedule generator and standings calculations.
- [`swiss.ts`](./swiss.ts): Swiss system pairings, progression, and Buchholz tiebreaker engine.
- [`types.ts`](./types.ts): Domain models, finish point rules, tournament sort and filter types, and state interfaces.

## Work Guidance

- Keep domain constants aligned with official WBO and Beyblade X rules.

## Verification

- Type check validation: `npm run auditor:type-check`

## Child DOX Index

- _This directory contains specialized modules with no subdirectories._
