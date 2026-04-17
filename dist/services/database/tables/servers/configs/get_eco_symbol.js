"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_eco_symbol = get_eco_symbol;
const db_1 = require("../../../db");
async function get_eco_symbol(guildId) {
    const results = await db_1.pool.query(`
        SELECT economy_symbol
        FROM server_configurations
        WHERE guild_id = $1
        `, [guildId]);
    return results.rows[0]?.economy_symbol ?? '$';
}
