import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, }
    from "discord.js";

import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags }
    from "discord.js";

import { requireGuild }
    from "../../../Helpers/require_guild";

import { Command }
    from "../../types";

import { isInvalidAmount, hasEnoughBalance, isSelfTransfer }
    from "../../../Helpers/validators";

import { internalErrorEmbed }
    from "../../../Helpers/simplified_embed_builder";

import { transferSafe }
    from "../../../services/database/tables/clients/transaction";

import { getEcoSymbol }
    from "../../../services/database/tables/servers/get_eco_symbol";

export const transferCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Transfer bank balance to a user')
        .addUserOption(opt => opt
            .setName('user')
            .setDescription('User to transfer')
            .setRequired(true)
        )
        .addIntegerOption(opt => opt
            .setName('amount')
            .setDescription('Amount to transfer')
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
        const isPublic = interaction.options.getBoolean('visibility') ?? false;
        await interaction.deferReply({ flags: !isPublic ? MessageFlags.Ephemeral : undefined })
        try {
            const symbol = await getEcoSymbol(guildId);
            if (await isSelfTransfer(interaction, userId, targetId)) return;
            if (await isInvalidAmount(interaction, amount)) return;
            if (!(await hasEnoughBalance(interaction, userId, guildId, amount, symbol))) return;

            const confirmButton = new ButtonBuilder()
                .setCustomId('transfer_confirm')
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Success)

            const cancelButton = new ButtonBuilder()
                .setCustomId('transfer_cancel')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(confirmButton, cancelButton);

            const msg = await interaction.editReply({
                content: "¿Confirmas esta transferencia?",
                components: [row],
            });

            const collector = msg.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 15000, // 15 segundos
            });

            collector.on("collect", async (i) => {
                if (i.user.id !== interaction.user.id) return;

                if (i.customId === "transfer_confirm") {
                    await transferSafe(userId, targetId, guildId, amount);

                    await i.update({
                        content: "Transferencia completada 💳",
                        components: [],
                    });
                }

                if (i.customId === "transfer_cancel") {
                    await i.update({
                        content: "Transferencia cancelada ❌",
                        components: [],
                    });
                }
            });
        } catch (err) {
            console.log(err)
            await internalErrorEmbed(interaction);
        }
    }
}