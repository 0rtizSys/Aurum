import { ChatInputCommandInteraction } from "discord.js";
import { amountErrorEmbed, botTargetEmbed, SameUserEmbed } from "./simplified_embed_builder";
import { getBalance } from "../services/database/tables/clients/manager";
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

export async function hasInsufficientBalance(
    interaction: ChatInputCommandInteraction,
    userId: string,
    guildId: string,
    amount: number,
    ecoSymbol: string,
    type: "checkBank" | "checkWallet",
    action: "deposit" | "withdraw" | "transfer"
) {
    if(!["checkBank", "checkWallet"].includes(type)) throw new Error("Invalid action type");
    const balance = type === "checkWallet" 
    ? await getBalance(userId, guildId, "wallet")
    : await getBalance(userId, guildId, "bank");

    if (balance < amount) {
        await InsuficientsFundsEmbed(interaction, balance, amount, ecoSymbol, action);
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

export async function isBotAction(
    interaction: ChatInputCommandInteraction,
    targetId: string,
) {
    const targetUser = await interaction.client.users.fetch(targetId)
    if (targetUser.bot) {
        await botTargetEmbed(interaction);
        return true;
    }
    return false;
}

// test

export function validateAmount(amount: number): boolean {
  const input = { UntAmount: amount };
  const data = UntrustedData.safeParse(input);
  return data.success;
}