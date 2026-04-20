"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalanceBW = getBalanceBW;
exports.addBalanceBW = addBalanceBW;
const db_1 = require("../../db");
//^ Get Balance Wallet Function
async function getBalanceBW(userId, guildId) {
    let result = await db_1.pool.query(`SELECT wallet
        FROM clients
        WHERE user_id = $1 AND guild_id = $2`, [userId, guildId]);
    if (result.rowCount === 0) {
        await db_1.pool.query(`INSERT INTO clients (user_id, guild_id, wallet)
            VALUES ($1, $2, 0)`, [userId, guildId]);
        result = await db_1.pool.query(`SELECT wallet
            FROM clients
            WHERE user_id = $1 AND guild_id = $2`, [userId, guildId]);
    }
    return result.rows[0].wallet;
}
//^ Add Balance ( Prototype )
async function addBalanceBW(userId, guildId, type, amn) {
    if (type === "wallet") {
        await db_1.pool.query(`INSERT INTO clients (user_id, guild_id, wallet)
            VALUES ($1,$2,$3)
            ON CONFLICT (user_id, guild_id)
            DO UPDATE SET wallet = clients.wallet + $3`, [userId, guildId, amn]);
    }
    else if (type === "bank") {
        await db_1.pool.query(`INSERT INTO clients (user_id, guild_id, bank)
            VALUES ($1,$2,$3)
            ON CONFLICT (user_id, guild_id)
            DO UPDATE SET bank = clients.bank + $3`, [userId, guildId, amn]);
    }
}
