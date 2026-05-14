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

import { internalErrorEmbed, sendSimpleEmbed }
    from "../../../Helpers/simplified_embed_builder";

import { addBalance, removeBalance }
    from "../../../services/database/tables/clients/manager";

export const withdrawCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw money from your bank')
        .addNumberOption(opt => opt
            .setName('amount')
            .setDescription('Amount to withdraw')
            .setRequired(true)
        )
        .addBooleanOption(opt => opt
            .setName('visibility')
            .setDescription('Other people can see how much money you withdraw')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!(requireGuild(interaction))) return;
        const isPublic = interaction.options.getBoolean('visibility') ?? false;
        const amount = interaction.options.getNumber('amount', true);
        const userId = interaction.user.id;
        const guildId = interaction.guild!.id;
        const ecoSymbol = await getEcoSymbol(guildId)
        try {
            if (await isInvalidAmount(interaction, amount)) return;
            if (await hasInsufficientBalance(interaction, userId, guildId, amount, ecoSymbol, "withdraw")) return;
            await interaction.deferReply({ flags: !isPublic ? MessageFlags.Ephemeral : undefined });
            await removeBalance(userId, guildId, "bank", amount)
            await addBalance(userId, guildId, "wallet", amount)
            await sendSimpleEmbed(interaction, {
                title: "Withdrawal completed ✅ ",
                description: isPublic
                ? `Successfully withdrawn \`${ecoSymbol} ${amount}\` from your bank account`
                : `${interaction.user} You have successfully withdrawn \`${ecoSymbol} ${amount}\` from your bank account`
            })

        } catch (e) {
            console.log(e)
            await internalErrorEmbed(interaction);
        }
    }
}