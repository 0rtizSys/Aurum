"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEcoSymbol = getEcoSymbol;
const db_1 = require("../../../db");
async function getEcoSymbol(guildId) {
    const results = await db_1.pool.query(`
        SELECT economy_symbol
        FROM server_configurations
        WHERE guild_id = $1
        `, [guildId]);
    return results.rows[0]?.economy_symbol ?? "$";
}
