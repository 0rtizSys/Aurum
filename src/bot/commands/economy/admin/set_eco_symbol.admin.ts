import {
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
} from "discord.js";

import { requireGuild } from "../../../Helpers/require_guild";

import { getEcoSymbol } from "../../../services/database/repository/servers/get_eco_symbol";

import {
    sendSimpleEmbed,
    internalErrorEmbed,
    notEnoughPermsEmbed,
} from "../../../Helpers/simplified_embed_builder";

import { setEcoSymbol } from "../../../services/database/repository/servers/set_eco_symbol";

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const setEconomySymbolAdmin: Command = {
    data: new SlashCommandBuilder()
        .setName("set_economy_symbol")
        .setDescription("set the server economy symbol")
        .addStringOption((opt) =>
            opt
                .setName("symbol")
                .setDescription("Symbol must be 1 or 2 digits")
                .setRequired(true),
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!(await requireGuild(interaction))) return;
        const guildId = interaction.guild!.id;
        const newSymbol = interaction.options.getString("symbol", true);
        const oldSymbol = await getEcoSymbol(guildId);
        if (
            !interaction.memberPermissions?.has(
                PermissionFlagsBits.Administrator,
            )
        ) {
            await notEnoughPermsEmbed(interaction);
        }
        if (newSymbol.length > 2 || newSymbol.length === 0) {
            await sendSimpleEmbed(interaction, {
                title: "✖️ Error",
                description: "Symbol length must be 1 or 2 digits",
                thumType: "error",
                eph: true,
            });
            return;
        }
        try {
            await setEcoSymbol(guildId, newSymbol);
            await sendSimpleEmbed(interaction, {
                title: "⚙️ Configuration saved",
                description: `Old symbol: \`${oldSymbol}\`\nNew symbol: \`${newSymbol}\``,
                thumType: "success",
                eph: false,
            });
        } catch (e) {
            console.log(e);
            await internalErrorEmbed(interaction);
        }
    },
};
