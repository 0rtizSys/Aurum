import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags }
    from "discord.js";

import { Command }
    from "../../types";

import { requireGuild }
    from "../../../Helpers/require_guild";

import { hasInsufficientBalance, isInvalidAmount }
    from "../../../Helpers/validators";

import { getEcoSymbol }
    from "../../../services/database/tables/servers/get_eco_symbol";

import { internalErrorEmbed, sendSimpleEmbed, transactionWentWrong }
    from "../../../Helpers/simplified_embed_builder";

import { transferInternalSafe }
from "../../../services/database/tables/clients/withdraw-transfer";

export const depositCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Deposit money to your bank')
        .addIntegerOption(opt => opt
            .setName('amount')
            .setDescription('Amount to withdraw')
            .setRequired(true)
        )
        .addBooleanOption(opt => opt
            .setName('visibility')
            .setDescription('Other people can see how much money you deposit')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!(await requireGuild(interaction))) return;
        const isPublic = interaction.options.getBoolean('visibility') ?? false;
        const amount = interaction.options.getInteger('amount', true);
        const userId = interaction.user.id;
        const guildId = interaction.guild!.id;
        const ecoSymbol = await getEcoSymbol(guildId)
        try {
            if (await isInvalidAmount(interaction, amount)) return;
            if (await hasInsufficientBalance(interaction, userId, guildId, amount, ecoSymbol, "checkWallet", "deposit")) return;
            await interaction.deferReply({ flags: !isPublic ? MessageFlags.Ephemeral : undefined });
            const isAnyError = await transferInternalSafe(userId, guildId, amount, "wallet", "bank");
            if (isAnyError) {
                return await transactionWentWrong(interaction);
            }
            await sendSimpleEmbed(interaction, {
                title: "Deposit completed ✅ ",
                description: isPublic
                ? `Successfully deposit \`${ecoSymbol} ${amount}\` from your wallet`
                : `${interaction.user} You have successfully deposit \`${ecoSymbol} ${amount}\` from your wallet`
            })

        } catch (e) {
            console.log(e)
            await internalErrorEmbed(interaction);
        }
    }
}
