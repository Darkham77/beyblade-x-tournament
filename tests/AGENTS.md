# Purpose

Test suites verifying Beyblade X scoring invariants, point systems, and tournament format mechanics.

## Ownership

Beyblade X Tournament Architecture & Development Team.

## Local Contracts

- **Scoring Immutability**: Spin (1), Over (2), Burst (2), and Xtreme (3) finish rules must never be altered.
- **Zero Regressions**: All test suites must pass before merging.

## Key Files

- [`index.test.ts`](./index.test.ts): Unit tests for scoring, finish points, and tournament progression.

## Work Guidance

- Execute test checks and validations via canonical npm scripts.

## Verification

- Run test suites: `npm run auditor:test-hygiene`

## Child DOX Index

- _This directory contains specialized modules with no subdirectories._
