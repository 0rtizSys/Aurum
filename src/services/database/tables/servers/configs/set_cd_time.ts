import { pool } from "../../../db";

export async function set_cd_time(guildId:string,seconds:number) 
{
    try
    {
        const results = await pool.query
        (
            `
            INSERT INTO server_configurations (guild_id, cooldown_time)
            VALUES ($1, $2)
            ON CONFLICT (guild_id)
            DO UPDATE SET cooldown_time = EXCLUDED.cooldown_time
            `,
            [guildId, seconds]
        )
    }catch(err)
    {
        return false;
        console.error('Error de base de datos\narchivo: set_cd_time.ts')
    }
        
}