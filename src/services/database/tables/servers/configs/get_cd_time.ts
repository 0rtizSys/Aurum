import { pool } from "../../../db";

export async function get_cd_time(
    guildId: string,
) {
    const results = await pool.query(
        `
        SELECT cooldown_time
        FROM server_configurations
        WHERE guild_id = $1
        `,
        [guildId]
    )
    return results.rows[0]?.cooldown_time ?? 1800 // returns seconds
}