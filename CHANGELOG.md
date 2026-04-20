# Changelog

## [1.5.1] - 2026-04-20

### 🔧 Fixes & Refactors
- Resolved circular dependency in `sync_slash.ts` and refactored the sync logic for better runtime stability.
- Updated `package.json` entry point and fixed the directory mismatch between source files and the compiled `dist/` layout.
- Added optional chaining (`?`) to `bank.ts` command descriptions to prevent "undefined" crashes during registration.

## [v1.4.0 & v1.5.0] - 2026-04-20
- Added `bank_balance` for members to view their bank balance

## Changes
- Changed param names in `manager.ts`
- Changed variable `visible` to `isPublic` in `wallet.ts`
- Removed unused `const result =` in `set_cd_time.ts` and `set_eco_symbol.ts`

## Know bugs
- `bank.ts` isnt syncing correctly somehow but its correctly exported

## [v1.2.0] - 2026-04-19
- Added `set_economy_symbol` so admins can change the economy icon

## Changes

- Translated `CHANGELOG.md` From Spanish to English
- Refactored function names and types

## Removed

- All `dashboard/` folder
- All `backend/` folder

## [v1.1.2] - 2026-04-18
- Fixed inconsistencies in embed thumbnail width and height
- Removed new image text from thumbnails

## [v1.1.1] - 2026-04-17
- Optimized user-admin permission validation
- Added `success_icon.png` file

## [1.1.0] - 2026-04-17
- Added `set_cooldown_time` so admins can manage the cooldown time for the `work` command

### Patches
- Added `['seconds']` to the `work` command cooldown alert

### Changes
- Renamed `setCooldown` and `getCooldown` to snake_case
- Removed `s_stacker.ts` — wasn't pulling its weight
- Removed `s_manager.ts` — same deal
- Cleaned up leftover `console.log()` calls from `cd_manager.ts` and `work`

## [1.0.1] - 2026-04-17
- Fixed a bug in the `work` command where the cooldown was showing milliseconds instead of seconds
- Improved time system handling and consistency

## Status
- `work` command is now more stable and consistent
- Cooldown system is more reliable and easier to maintain

## [1.0.0] - 2026-04-17
- Added `/work` so users can earn money in a simple way
- Added `/wallet_balance` to check wallet balance publicly or privately
- Added `/add_balance` so admins can grant balance to users
- Added support for sending balance to wallet or bank from the admin side
- Added a cooldown to `/work` to prevent spam
- Set up per-server config reading (cooldown, economy symbol) — groundwork is laid
- Added `/ping` to quickly check if the bot is alive
- Added internal slash command sync to make testing and deploys easier

## Status
The economy foundation is up and running, but some things are still half-baked — internal support for settings and bank exists, though not everything has user-facing commands ye