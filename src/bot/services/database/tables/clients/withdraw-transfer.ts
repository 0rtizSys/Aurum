import { pool }
from "../../db";


export async function transferInternalSafe(
  userId: string,
  guildId: string,
  amount: number,
  from: "wallet" | "bank",
  to: "wallet" | "bank"
): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const current = await client.query(
      `SELECT ${from} FROM clients
       WHERE user_id=$1 AND guild_id=$2
       FOR UPDATE`,
      [userId, guildId]
    );
    if (current.rowCount === 0 || current.rows[0][from] < amount) {
      await client.query('ROLLBACK');
      return true;
    }
    await client.query(
      `UPDATE clients
       SET ${from} = ${from} - $1,
           ${to} = ${to} + $1
       WHERE user_id=$2 AND guild_id=$3`,
      [amount, userId, guildId]
    );
    await client.query('COMMIT');
    return false;
  } catch (e) {
    await client.query('ROLLBACK');
    return true;
  } finally {
    client.release();
  }
}