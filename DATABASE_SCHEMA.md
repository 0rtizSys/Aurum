# Database Schema (inferred from code)

This document describes the database schema used by the bot based on SQL queries found in `src/bot/services/database/tables/**`.

> Note: No migrations/DDL (`CREATE TABLE ...`) were found in this repository.  
> Because of that, types/constraints below are **recommended** and **inferred** from how the code uses PostgreSQL.

## Conventions

- `guild_id` and `user_id` are treated as strings (Discord IDs) → recommended type: `TEXT`.
- Amounts (`wallet`, `bank`) are treated as integers → recommended type: `BIGINT` (prevents overflow).
- Time-related values:
  - `cooldown_time` is stored/handled in **seconds**.
  - `cooldown` is stored as `Date.now()` **epoch milliseconds**.

---

## Clients / Economy

### Table: `clients`

Used by:
- `src/bot/services/database/tables/clients/manager.ts`
- `src/bot/services/database/tables/clients/transaction.ts`

**Columns**

| Column    | Recommended type | Null | Default | Description |
|-----------|------------------|------|---------|-------------|
| `user_id`  | `TEXT`           | NO   |         | User ID (Discord) |
| `guild_id` | `TEXT`           | NO   |         | Guild/server ID (Discord) |
| `wallet`   | `BIGINT`         | NO   | `0`     | Wallet balance |
| `bank`     | `BIGINT`         | NO   | `0`     | Bank balance |

**Constraints / indexes**

- `UNIQUE (user_id, guild_id)` or `PRIMARY KEY (user_id, guild_id)` (required by `ON CONFLICT (user_id, guild_id)`).

**Suggested DDL**

```sql
CREATE TABLE IF NOT EXISTS clients (
  user_id  TEXT   NOT NULL,
  guild_id TEXT   NOT NULL,
  wallet   BIGINT NOT NULL DEFAULT 0,
  bank     BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, guild_id)
);
```

---

## Cooldowns

### Table: `cooldowns_table`

Used by:
- `src/bot/services/database/tables/cooldowns/cd_manager.ts`

**Columns**

| Column    | Recommended type | Null | Default | Description |
|-----------|------------------|------|---------|-------------|
| `guild_id` | `TEXT`           | NO   |         | Guild/server ID (Discord) |
| `user_id`  | `TEXT`           | NO   |         | User ID (Discord) |
| `cooldown` | `BIGINT`         | NO   |         | Cooldown end time in epoch ms (`Date.now() + durationMs`) |

**Constraints / indexes**

- `UNIQUE (guild_id, user_id)` or `PRIMARY KEY (guild_id, user_id)` (required by `ON CONFLICT (guild_id, user_id)`).

**Suggested DDL**

```sql
CREATE TABLE IF NOT EXISTS cooldowns_table (
  guild_id TEXT   NOT NULL,
  user_id  TEXT   NOT NULL,
  cooldown BIGINT NOT NULL,
  PRIMARY KEY (guild_id, user_id)
);
```

---

## Servers / Per-guild configuration

### Table: `server_configurations`

Used by:
- `src/bot/services/database/tables/servers/get_cd_time.ts`
- `src/bot/services/database/tables/servers/set_cd_time.ts`
- `src/bot/services/database/tables/servers/get_eco_symbol.ts`
- `src/bot/services/database/tables/servers/set_eco_symbol.ts`

**Columns**

| Column           | Recommended type | Null | Default | Description |
|------------------|------------------|------|---------|-------------|
| `guild_id`        | `TEXT`           | NO   |         | Guild/server ID (Discord) |
| `cooldown_time`   | `INTEGER`        | YES/NO |         | Work cooldown in seconds (code falls back to `1800` if row is missing) |
| `economy_symbol`  | `TEXT`           | YES/NO |         | Economy symbol (code falls back to `"$"` if row is missing) |

**Constraints / indexes**

- `UNIQUE (guild_id)` or `PRIMARY KEY (guild_id)` (required by `ON CONFLICT (guild_id)`).

**Suggested DDL**

```sql
CREATE TABLE IF NOT EXISTS server_configurations (
  guild_id       TEXT    NOT NULL PRIMARY KEY,
  cooldown_time  INTEGER,
  economy_symbol TEXT
);
```

---

## Integrity notes

- There are no foreign keys enforced by the code (e.g. `clients.guild_id` → `server_configurations.guild_id`), but you may add them if you want strict relational integrity.
- `transferSafe(...)` uses a transaction and `SELECT ... FOR UPDATE` on `clients` to prevent race conditions when transferring from `bank`.
- If you expect large amounts, keep `BIGINT` for `wallet/bank` and validate limits at the application layer.
