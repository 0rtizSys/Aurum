import { pool } from "../../db";

//^ Get Balance Wallet Function

export async function getBalanceBW(
  userId: string,
  guildId: string,
): Promise<number> {
  let result = await pool.query(
    `SELECT wallet
        FROM clients
        WHERE user_id = $1 AND guild_id = $2`,
    [userId, guildId],
  );

  if (result.rowCount === 0) {
    await pool.query(
      `INSERT INTO clients (user_id, guild_id, wallet)
            VALUES ($1, $2, 0)`,
      [userId, guildId],
    );

    result = await pool.query(
      `SELECT wallet
            FROM clients
            WHERE user_id = $1 AND guild_id = $2`,
      [userId, guildId],
    );
  }
  return result.rows[0].wallet;
}

//^ Add Balance ( Prototype )

export async function addBalanceBW(
  userId: string,
  guildId: string,
  type: string,
  amn: number,
) {
  if (type === "wallet") {
    await pool.query(
      `INSERT INTO clients (user_id, guild_id, wallet)
            VALUES ($1,$2,$3)
            ON CONFLICT (user_id, guild_id)
            DO UPDATE SET wallet = clients.wallet + $3`,
      [userId, guildId, amn],
    );
  } else if (type === "bank") {
    await pool.query(
      `INSERT INTO clients (user_id, guild_id, bank)
            VALUES ($1,$2,$3)
            ON CONFLICT (user_id, guild_id)
            DO UPDATE SET bank = clients.bank + $3`,
      [userId, guildId, amn],
    );
  }
}
