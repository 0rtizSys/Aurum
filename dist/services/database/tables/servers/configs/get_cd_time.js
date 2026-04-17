"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_cooldown_time = get_cooldown_time;
const db_1 = require("../../../db");
async function get_cooldown_time(guildId) {
    const results = await db_1.pool.query(`
        SELECT cooldown_time
        FROM server_configurations
        WHERE guild_id = $1
        `, [guildId]);
    return results.rows[0]?.cooldown_time ?? 1800; // returns seconds
}
