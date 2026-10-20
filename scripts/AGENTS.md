# Purpose

Administrative scripts, build verifications, and environment tools for Beyblade X Tournament.

## Ownership

Beyblade X Tournament Architecture & Development Team.

## Local Contracts

- **Native Node.js / TSX**: All scripts execute directly via `tsx` or native Node.js.
- **Verification Integrity**: Build and validation scripts must exit with code 0 on success.

## Key Files

- [`build.ts`](./build.ts): Build verification script.

## Work Guidance

- Execute build scripts via: `npm run build`.

## Verification

- Run script commands validation: `npm run auditor:script-commands`

## Child DOX Index

- _This directory contains specialized modules with no subdirectories._
