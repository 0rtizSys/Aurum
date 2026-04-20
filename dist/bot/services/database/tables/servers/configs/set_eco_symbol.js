"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEcoSymbol = setEcoSymbol;
const db_1 = require("../../../db");
async function setEcoSymbol(guildId, symbol) {
    try {
        await db_1.pool.query(`
            INSERT INTO server_configurations (guild_id, economy_symbol)
            VALUES ($1, $2)
            ON CONFLICT(guild_id)
            DO UPDATE SET economy_symbol = EXCLUDED.economy_symbol
            `, [guildId, symbol]);
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
