"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCdTime = setCdTime;
const db_1 = require("../../../db");
async function setCdTime(guildId, seconds) {
    try {
        await db_1.pool.query(`
            INSERT INTO server_configurations (guild_id, cooldown_time)
            VALUES ($1, $2)
            ON CONFLICT (guild_id)
            DO UPDATE SET cooldown_time = EXCLUDED.cooldown_time
            `, [guildId, seconds]);
    }
    catch (err) {
        console.error(`Error de base de datos\narchivo: set_cd_time.ts\n${err}`);
    }
}
