"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalanceBW = getBalanceBW;
exports.addBalanceBW = addBalanceBW;
const db_1 = require("../../db");
//^ Get Balance Wallet Function
async function getBalanceBW(userId, guildId, Type) {
    /**
     * Optimized balance getter function which allows wallet and bank
     * parameters of the cog options
    */
    await db_1.pool.query(`
    INSERT INTO clients (user_id, guild_id, wallet, bank)
    VALUES ($1, $2, 0, 0)
    ON CONFLICT (user_id, guild_id) DO NOTHING
    `, [userId, guildId]);
    const query = `SELECT ${Type} FROM clients WHERE guild_id=$1 AND user_id=$2`;
    const balanceResult = await db_1.pool.query(query, [guildId, userId]);
    return balanceResult.rows[0][Type];
}
//^ Add Balance ( Prototype )
async function addBalanceBW(userId, guildId, Type, amn) {
    if (!["wallet", "bank"].includes(Type))
        throw new Error("Invalid balance type");
    const query = `
  INSERT INTO clients (user_id, guild_id, ${Type})
  VALUES ($1, $2, $3)
  ON CONFLICT (user_id, guild_id)
  DO UPDATE SET ${Type} = clients.${Type} + $3
  RETURNING ${Type};
  `;
    const result = await db_1.pool.query(query, [userId, guildId, amn]);
    return result.rows[0][Type];
}
