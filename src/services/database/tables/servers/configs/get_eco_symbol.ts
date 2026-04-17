import { pool } from "../../../db";

export async function get_eco_symbol(
    guildId:string
){
    const results = await pool.query(
        `
        SELECT economy_symbol
        FROM server_configurations
        WHERE guild_id = $1
        `,
        [guildId]
    )
    return results.rows[0]?.economy_symbol ?? '$';
}