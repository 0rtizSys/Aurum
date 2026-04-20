import { pool } from "../../../db";

export async function setEcoSymbol(guildId: string, symbol: string) {
  try {
    await pool.query(
      `
            INSERT INTO server_configurations (guild_id, economy_symbol)
            VALUES ($1, $2)
            ON CONFLICT(guild_id)
            DO UPDATE SET economy_symbol = EXCLUDED.economy_symbol
            `,
      [guildId, symbol],
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
