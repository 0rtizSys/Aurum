import { pool } from "../../db";

export async function transferSafe(
    userId: string,
    targetId: string,
    guildId: string,
    amount: number,
) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const sender = await client.query(
            `
            SELECT bank
            FROM clients
            WHERE user_id=$1 AND guild_id=$2
            FOR UPDATE
            `,
            [userId, guildId],
        );

        if (sender.rowCount === 0 || sender.rows[0].bank < amount) {
            await client.query("ROLLBACK");
            return true;
        }

        await client.query(
            `UPDATE clients
             SET bank = bank - $1
             WHERE user_id = $2 AND guild_id = $3`,
            [amount, userId, guildId],
        );

        await client.query(
            `INSERT INTO clients (user_id, guild_id, bank)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, guild_id)
             DO UPDATE SET bank = clients.bank + EXCLUDED.bank`,
            [targetId, guildId, amount],
        );

        await client.query("COMMIT");
        return false;
    } catch (err) {
        await client.query("ROLLBACK");
        console.log(err);
        return true;
    } finally {
        client.release();
    }
}

/**
 * This transaction uses ACID principles
 */
