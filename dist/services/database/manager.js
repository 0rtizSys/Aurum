"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_balance_wallet = get_balance_wallet;
exports.add_balance_bw = add_balance_bw;
const db_1 = require("./db");
//^ Get Balance Wallet Function
async function get_balance_wallet(ui, gi) {
  let result = await db_1.pool.query(
    `SELECT wallet
        FROM clients
        WHERE user_id = $1 AND guild_id = $2`,
    [ui, gi],
  );
  if (result.rowCount === 0) {
    await db_1.pool.query(
      `INSERT INTO clients (user_id, guild_id, wallet)
            VALUES ($1, $2, 0)`,
      [ui, gi],
    );
    result = await db_1.pool.query(
      `SELECT wallet
            FROM clients
            WHERE user_id = $1 AND guild_id = $2`,
      [ui, gi],
    );
  }
  return result.rows[0].wallet;
}
//^ Add Balance ( Prototype )
async function add_balance_bw(ui, gi, type, amn) {
  if (type === "wallet") {
    await db_1.pool.query(
      `INSERT INTO clients (user_id, guild_id, wallet)
            VALUES ($1,$2,$3)
            ON CONFLICT (user_id, guild_id)
            DO UPDATE SET wallet = clients.wallet + $3`,
      [ui, gi, amn],
    );
  } else if (type === "bank") {
    await db_1.pool.query(
      `INSERT INTO clients (user_id, guild_id, bank)
            VALUES ($1,$2,$3)
            ON CONFLICT (user_id, guild_id)
            DO UPDATE SET bank = clients.bank + $3`,
      [ui, gi, amn],
    );
  }
}
