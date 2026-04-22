import { pool } from "../../db";

export async function transferSafe(
    userId: string,
    targetId: string,
    guildId: string,
    amount: number,
) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query(
            `INSERT INTO clients (user_id, guild_id, bank)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, guild_id)
             DO UPDATE SET bank = clients.bank - $3`,
            [userId, guildId, amount]
        );

        await client.query(
            `INSERT INTO clients (user_id, guild_id, bank)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, guild_id)
             DO UPDATE SET bank = clients.bank + $3`,
            [targetId, guildId, amount]
        );

        await client.query('COMMIT');
        return false;
    } catch (err) {
        console.log(err)
        return true;
    }

}

/**
 * This transaction uses ACID principles
 */