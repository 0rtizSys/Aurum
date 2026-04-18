"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_cooldown = check_cooldown;
exports.set_cooldown = set_cooldown;
const db_1 = require("../../db");
async function check_cooldown(guildId, userId) {
    const result = await db_1.pool.query(`SELECT cooldown
        FROM cooldowns_table
        WHERE guild_id = $1 AND user_id = $2`, [guildId, userId]);
    const now = Date.now();
    console.log(now);
    if (result.rowCount === 0) {
        return { allowed: true };
    }
    const cooldownEnd = Number(result.rows[0].cooldown);
    if (cooldownEnd > now) {
        return {
            allowed: false,
            remaining: cooldownEnd - now
        };
    }
    return { allowed: true };
}
async function set_cooldown(guildId, userId, durationMs) {
    const cooldownEnd = Date.now() + durationMs;
    await db_1.pool.query(`INSERT INTO cooldowns_table (guild_id, user_id,cooldown)
        VALUES ($1,$2,$3)
        ON CONFLICT (guild_id, user_id)
        DO UPDATE SET cooldown = EXCLUDED.cooldown`, [guildId, userId, cooldownEnd]);
}
