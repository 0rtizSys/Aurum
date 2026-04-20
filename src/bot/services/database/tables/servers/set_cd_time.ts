import { pool } from "../../db";

export async function setCdTime(guildId: string, seconds: number) {
  try {
    await pool.query(
      `
            INSERT INTO server_configurations (guild_id, cooldown_time)
            VALUES ($1, $2)
            ON CONFLICT (guild_id)
            DO UPDATE SET cooldown_time = EXCLUDED.cooldown_time
            `,
      [guildId, seconds],
    );
  } catch (err) {
    console.error(`Error de base de datos\narchivo: set_cd_time.ts\n${err}`);
  }
}
