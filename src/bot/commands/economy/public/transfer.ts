import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { requireGuild } from "../../../Helpers/require_guild";
import { Command } from "../../types";
import { amountBelowZero, hasSufficientFunds } from "../../../Helpers/validators";
import { internalErrorEmbed, transactionWentWrong } from "../../../Helpers/simplified_embed_builder";
import { transferSafe } from "../../../services/database/tables/clients/transaction";
import { getEcoSymbol } from "../../../services/database/tables/servers/get_eco_symbol";
import { sendSimpleEmbed } from "../../../Helpers/simplified_embed_builder";

export const transferCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('trasnfer bank balance to an user')
        .addUserOption(opt => opt
            .setName('user')
            .setDescription('user to transfer')
            .setRequired(true)
        )
        .addIntegerOption(opt => opt
            .setName('amount')
            .setDescription('amount to transfer')
            .setRequired(true)
        )
        .addBooleanOption(opt => opt
            .setName('visibility')
            .setDescription('Others can see your transaction')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!(await requireGuild(interaction))) return;
        const guildId = interaction.guild!.id;
        const userId = interaction.user.id;
        const targetId = interaction.options.getUser('user')!.id;
        const amount = interaction.options.getInteger('amount', true);
        const isPublic = interaction.options.getBoolean('visibility');
        await interaction.deferReply({ flags: !isPublic ? MessageFlags.Ephemeral : undefined })
        try {
            const symbol = await getEcoSymbol(guildId);
            if (await amountBelowZero(interaction, amount)) return;
            console.log('amountBelowZero OK')
            if (!(await hasSufficientFunds(interaction, userId, guildId, amount, symbol))) return;
            console.log('hasSufficientFunds OK')
            const isAnyError = await transferSafe(userId, targetId, guildId, amount);
            console.log('transferSafe OK')
            if (isAnyError) {
                return await transactionWentWrong(interaction);
            }
            await sendSimpleEmbed(interaction, {
                title: 'Transaction completed 💳',
                description: isPublic
                    ? `${interaction.user} successfully transferred ${symbol}${amount} to <@${targetId}>`
                    : `Successfully transferred ${symbol}${amount} to <@${targetId}>`
            });
        } catch (err) {
            console.log(err)
            await internalErrorEmbed(interaction);
        }
    }
}