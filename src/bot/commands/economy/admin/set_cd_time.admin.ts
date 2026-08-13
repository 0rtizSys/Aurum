import {
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
} from "discord.js";

import { setCdTime } from "../../../services/database/repository/servers/set_cd_time";

import { getCdTime } from "../../../services/database/repository/servers/get_cd_time";

import {
    sendSimpleEmbed,
    internalErrorEmbed,
    notEnoughPermsEmbed,
} from "../../../Helpers/simplified_embed_builder";

import { requireGuild } from "../../../Helpers/require_guild";

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const setCdTimeAdmin: Command = {
    data: new SlashCommandBuilder()
        .setName("set_cooldown_time")
        .setDescription("change the cooldown time for the command work")
        .addIntegerOption((opt) =>
            opt
                .setName("time")
                .setDescription("Use seconds to avoid any problems")
                .setRequired(true),
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!(await requireGuild(interaction))) return;
        if (
            !interaction.memberPermissions?.has(
                PermissionFlagsBits.Administrator,
            )
        ) {
            await notEnoughPermsEmbed(interaction);
            return;
        }
        const guildId = interaction.guild!.id;
        const newTime = interaction.options.getInteger("time", true);
        const oldTime = await getCdTime(guildId);
        if (newTime <= 0) {
            await sendSimpleEmbed(interaction, {
                title: "✖️ Error",
                description: "Time must be higher than \`0\`",
                thumType: "error",
                eph: true,
            });
            return;
        }
        await interaction.deferReply();
        try {
            if (await setCdTime(guildId, newTime))
                throw new Error("Failure on function setCdTime");
            await sendSimpleEmbed(interaction, {
                title: "⚙️ Configurations saved",
                description: `Old cooldown time: \`${oldTime}s\`\nNew cooldown time: \`${newTime}s\``,
                thumType: "success",
            });
        } catch (err) {
            console.log(err);
            await internalErrorEmbed(interaction);
        }
    },
};
