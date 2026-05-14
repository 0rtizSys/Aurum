# Esquema de Base de Datos (inferido del código)

Este documento describe el **schema usado por el bot** según las consultas SQL encontradas en `src/bot/services/database/tables/**`.

> Nota: No se encontraron migraciones/DDL (`CREATE TABLE ...`) dentro del repo.  
> Por lo tanto, los tipos/constraints aquí son **recomendados** e **inferidos** a partir del uso en código (PostgreSQL).

## Convenciones

- `guild_id` y `user_id` se tratan como strings (IDs de Discord) → recomendado `TEXT`.
- Montos (`wallet`, `bank`) se tratan como números enteros → recomendado `BIGINT` (evita overflow).
- Tiempos:
  - `cooldown_time` se usa en **segundos**.
  - `cooldown` se guarda como `Date.now()` en **milisegundos epoch**.

---

## Clients / Economía

### Tabla: `clients`

Usada por:
- `src/bot/services/database/tables/clients/manager.ts`
- `src/bot/services/database/tables/clients/transaction.ts`

**Columnas**

| Columna    | Tipo recomendado | Null | Default | Descripción |
|-----------|------------------|------|---------|-------------|
| `user_id`  | `TEXT`           | NO   |         | ID de usuario (Discord) |
| `guild_id` | `TEXT`           | NO   |         | ID de servidor (Discord) |
| `wallet`   | `BIGINT`         | NO   | `0`     | Balance en cartera |
| `bank`     | `BIGINT`         | NO   | `0`     | Balance en banco |

**Constraints / índices**

- `UNIQUE (user_id, guild_id)` o `PRIMARY KEY (user_id, guild_id)` (requerido por el `ON CONFLICT (user_id, guild_id)`).

**DDL sugerido**

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

### Tabla: `cooldowns_table`

Usada por:
- `src/bot/services/database/tables/cooldowns/cd_manager.ts`

**Columnas**

| Columna    | Tipo recomendado | Null | Default | Descripción |
|-----------|------------------|------|---------|-------------|
| `guild_id` | `TEXT`           | NO   |         | ID de servidor (Discord) |
| `user_id`  | `TEXT`           | NO   |         | ID de usuario (Discord) |
| `cooldown` | `BIGINT`         | NO   |         | Fin del cooldown en ms epoch (`Date.now() + durationMs`) |

**Constraints / índices**

- `UNIQUE (guild_id, user_id)` o `PRIMARY KEY (guild_id, user_id)` (requerido por el `ON CONFLICT (guild_id, user_id)`).

**DDL sugerido**

```sql
CREATE TABLE IF NOT EXISTS cooldowns_table (
  guild_id TEXT   NOT NULL,
  user_id  TEXT   NOT NULL,
  cooldown BIGINT NOT NULL,
  PRIMARY KEY (guild_id, user_id)
);
```

---

## Servers / Configuración por servidor

### Tabla: `server_configurations`

Usada por:
- `src/bot/services/database/tables/servers/get_cd_time.ts`
- `src/bot/services/database/tables/servers/set_cd_time.ts`
- `src/bot/services/database/tables/servers/get_eco_symbol.ts`
- `src/bot/services/database/tables/servers/set_eco_symbol.ts`

**Columnas**

| Columna           | Tipo recomendado | Null | Default | Descripción |
|------------------|------------------|------|---------|-------------|
| `guild_id`        | `TEXT`           | NO   |         | ID de servidor (Discord) |
| `cooldown_time`   | `INTEGER`        | SI/NO |         | Cooldown por defecto en segundos (en código cae a `1800` si no existe fila) |
| `economy_symbol`  | `TEXT`           | SI/NO |         | Símbolo de economía (en código cae a `"$"` si no existe fila) |

**Constraints / índices**

- `UNIQUE (guild_id)` o `PRIMARY KEY (guild_id)` (requerido por el `ON CONFLICT (guild_id)`).

**DDL sugerido**

```sql
CREATE TABLE IF NOT EXISTS server_configurations (
  guild_id       TEXT    NOT NULL PRIMARY KEY,
  cooldown_time  INTEGER,
  economy_symbol TEXT
);
```

---

## Observaciones de integridad

- No hay llaves foráneas en el código (p.ej. `clients.guild_id` → `server_configurations.guild_id`), pero se podría considerar si quieres enforcement.
- `transferSafe(...)` usa transacción y `SELECT ... FOR UPDATE` sobre `clients` para evitar race conditions al transferir desde `bank`.
- Si planeas permitir montos grandes, usa `BIGINT` en `wallet/bank` y valida límites en la capa de aplicación.

