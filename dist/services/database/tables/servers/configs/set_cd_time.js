"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set_cd_time = set_cd_time;
const db_1 = require("../../../db");
async function set_cd_time(guildId, seconds) {
    try {
        const results = await db_1.pool.query(`
            INSERT INTO server_configurations (guild_id, cooldown_time)
            VALUES ($1, $2)
            ON CONFLICT (guild_id)
            DO UPDATE SET cooldown_time = EXCLUDED.cooldown_time
            `, [guildId, seconds]);
    }
    catch (err) {
        return false;
        console.error('Error de base de datos\narchivo: set_cd_time.ts');
    }
}
