import { ChatInputCommandInteraction } from "discord.js";
import { amountErrorEmbed } from "./simplified_embed_builder";
import { getBalanceBW } from "../services/database/tables/clients/manager";
import { InsuficientsFundsEmbed } from "./simplified_embed_builder";
import z from 'zod';

//? ------------------------
//? SCHEMAS AND DEFINITIONS
//? ------------------------

const UntrustedData = z.object({
    UntAmount: z.number().min(1).max(1_000_000_000),
})

const hasSufficientFundsSchema = z.object({
    userID: z.string()
        .min(17, "Invalid user ID length")
        .max(19, "Invalid user ID length"),
    guildID: z.string()
        .min(17, "Invalid guild ID length")
        .max(19, "Invalid guild ID length"),
    Amount: z.number(),
    economySymbol: z.string(),
})

//? ---------------------
//? EXPORTABLE FUNCTIONS
//? ---------------------

export async function amountBelowZero(
    interaction: ChatInputCommandInteraction,
    amount: number
): Promise<boolean> {
    const input = { UntAmount: amount }
    const data = UntrustedData.safeParse(input)
    if (data.success !== true) {
        await amountErrorEmbed(interaction);
        return true;
    }
    return false;
}

export async function hasSufficientFunds(
    interaction: ChatInputCommandInteraction,
    userId: string,
    guildId: string,
    amount: number,
    ecoSymbol: string,
) {
    const input = { userID: userId, guildID: guildId, Amount: amount, economySymbol: ecoSymbol }
    const data = hasSufficientFundsSchema.safeParse(input)
    const balance = await getBalanceBW(userId, guildId, "bank")

    if (data.success !== true) {
        console.log('error parsing')
        return true;
    } else {
        if (balance < amount) {
            await InsuficientsFundsEmbed(interaction, balance, amount, ecoSymbol)
            return false;
        }
        return true;
    }

}