
import { pool } from "../../db";

//^ Get Balance Wallet Function

export async function getBalance(
  userId: string,
  guildId: string,
  Type: "wallet" | "bank"
) {
  /**
   * Optimized balance getter function which allows wallet and bank 
   * parameters of the cog options
  */
  await pool.query(
    `
    INSERT INTO clients (user_id, guild_id, wallet, bank)
    VALUES ($1, $2, 0, 0)
    ON CONFLICT (user_id, guild_id) DO NOTHING
    `, [userId, guildId]
  )

  const query = `SELECT ${Type} FROM clients WHERE guild_id=$1 AND user_id=$2`
  const balanceResult = await pool.query(query, [guildId, userId])
  return balanceResult.rows[0][Type];
}

//^ Add Balance ( Prototype )

export async function addBalance(
  userId: string,
  guildId: string,
  Type: "wallet" | "bank",
  amn: number,
) {
  if (!["wallet", "bank"].includes(Type)) throw new Error("Invalid balance type")
  const query =
    `
  INSERT INTO clients (user_id, guild_id, ${Type})
  VALUES ($1, $2, $3)
  ON CONFLICT (user_id, guild_id)
  DO UPDATE SET ${Type} = clients.${Type} + $3
  RETURNING ${Type};
  `
  const result = await pool.query(query, [userId, guildId, amn]);
  return result.rows[0][Type];
}

export async function removeBalance(
  userId: string,
  guildId: string,
  Type: "wallet" | "bank",
  amn: number,
) {
  if (!["wallet", "bank"].includes(Type)) throw new Error("Invalid balance type")
  const query =
    `
  INSERT INTO clients (user_id, guild_id, ${Type})
  VALUES ($1, $2, $3)
  ON CONFLICT (user_id, guild_id)
  DO UPDATE SET ${Type} = clients.${Type} - $3
  RETURNING ${Type};
  `
  const result = await pool.query(query, [userId, guildId, amn]);
  return result.rows[0][Type];
}