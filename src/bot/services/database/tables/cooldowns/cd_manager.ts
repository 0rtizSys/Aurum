import { pool } from "../../db";

export async function checkCooldown(
  guildId: string,
  userId: string,
): Promise<{ allowed: boolean; remaining?: number }> {
  const result = await pool.query(
    `SELECT cooldown
        FROM cooldowns_table
        WHERE guild_id = $1 AND user_id = $2`,
    [guildId, userId],
  );

  const now = Date.now();
  console.log(now);

  if (result.rowCount === 0) {
    return { allowed: true };
  }

  const cooldownEnd = Number(result.rows[0].cooldown);
  if (cooldownEnd > now) {
    return {
      allowed: false,
      remaining: cooldownEnd - now,
    };
  }
  return { allowed: true };
}

export async function setCooldown(
  guildId: string,
  userId: string,
  durationMs: number,
): Promise<void> {
  const cooldownEnd = Date.now() + durationMs;
  await pool.query(
    `INSERT INTO cooldowns_table (guild_id, user_id,cooldown)
        VALUES ($1,$2,$3)
        ON CONFLICT (guild_id, user_id)
        DO UPDATE SET cooldown = EXCLUDED.cooldown`,
    [guildId, userId, cooldownEnd],
  );
}
