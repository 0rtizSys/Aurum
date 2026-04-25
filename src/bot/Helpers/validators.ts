import { ChatInputCommandInteraction } from "discord.js";
import { amountErrorEmbed, SameUserEmbed } from "./simplified_embed_builder";
import { getBalanceBW } from "../services/database/tables/clients/manager";
import { InsuficientsFundsEmbed } from "./simplified_embed_builder";
import z from 'zod';

//? ------------------------
//? SCHEMAS AND DEFINITIONS
//? ------------------------

const UntrustedData = z.object({
    UntAmount: z.number().min(1).max(1_000_000_000),
})


//? ---------------------
//? EXPORTABLE FUNCTIONS
//? ---------------------

export async function isInvalidAmount(
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

export async function hasEnoughBalance(
    interaction: ChatInputCommandInteraction,
    userId: string,
    guildId: string,
    amount: number,
    ecoSymbol: string,
) {
    const balance = await getBalanceBW(userId, guildId, "bank")
    if (balance < amount) {
        await InsuficientsFundsEmbed(interaction, balance, amount, ecoSymbol);
        return true;
    }
    return false;
}


export async function isSelfTransfer(
    interaction: ChatInputCommandInteraction,
    userId: string,
    targetId: string,
) {
    if (userId === targetId) {
        await SameUserEmbed(interaction);
        return true;
    }
    return false;
}