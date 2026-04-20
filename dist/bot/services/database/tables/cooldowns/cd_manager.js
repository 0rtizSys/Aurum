"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCooldown = checkCooldown;
exports.setCooldown = setCooldown;
const db_1 = require("../../db");
async function checkCooldown(guildId, userId) {
    const result = await db_1.pool.query(`SELECT cooldown
        FROM cooldowns_table
        WHERE guild_id = $1 AND user_id = $2`, [guildId, userId]);
    const now = Date.now();
    if (result.rowCount === 0) {
        return { allowed: true };
    }
    const cooldownEnd = Number(result.rows[0].cooldown);
    if (cooldownEnd > now) {
        return {
            allowed: false,
            remaining: cooldownEnd - now,
        };
    }
    return { allowed: true };
}
async function setCooldown(guildId, userId, durationMs) {
    const cooldownEnd = Date.now() + durationMs;
    await db_1.pool.query(`INSERT INTO cooldowns_table (guild_id, user_id,cooldown)
        VALUES ($1,$2,$3)
        ON CONFLICT (guild_id, user_id)
        DO UPDATE SET cooldown = EXCLUDED.cooldown`, [guildId, userId, cooldownEnd]);
}
