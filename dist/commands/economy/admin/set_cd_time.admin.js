"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set_cd_time_admin = void 0;
const discord_js_1 = require("discord.js");
const set_cd_time_1 = require("../../../services/database/tables/servers/configs/set_cd_time");
const get_cd_time_1 = require("../../../services/database/tables/servers/configs/get_cd_time");
const exporter_1 = require("../../../configs/exporter");
const exporter_2 = require("../../../configs/exporter");
exports.set_cd_time_admin = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('set_cooldown_time')
        .setDescription('change the cooldown time for the command work')
        .addIntegerOption(opt => opt
        .setName('time')
        .setDescription('Use seconds to avoid any problems')
        .setRequired(true)),
    async execute(interaction) {
        if (!interaction.inGuild()) {
            const errEmbed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('✖️ Error')
                .setDescription('This comand only works on servers, not in DMs etc... 🤖')
                .setThumbnail(exporter_2.error_icon);
            await interaction.reply({ embeds: [errEmbed], flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        if (!interaction.memberPermissions.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            const errEmbed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('✖️ Error')
                .setDescription('You dont have enough perms to do that! 😥')
                .setThumbnail(exporter_2.error_icon);
            await interaction.reply({ embeds: [errEmbed], flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        const guild_id = interaction.guild.id;
        const newTime = interaction.options.getInteger('time', true);
        const oldTime = await (0, get_cd_time_1.get_cd_time)(guild_id);
        if (newTime <= 0) {
            const errEmbed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('✖️ Error')
                .setDescription('Time must be higher than \`0\`')
                .setThumbnail(exporter_2.error_icon);
            await interaction.reply({ embeds: [errEmbed], flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        await interaction.deferReply();
        try {
            await (0, set_cd_time_1.set_cd_time)(guild_id, newTime);
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('⚙️ Configurations saved')
                .setDescription(`Old cooldown time: \`${oldTime}s\`\nNew cooldown time: \`${newTime}s\``)
                .setThumbnail(exporter_2.success_icon);
            await interaction.editReply({ embeds: [embed] });
        }
        catch (err) {
            const errEmbed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('✖️ Error')
                .setDescription('An unexpected error occurred while processing your request.\nPlease try again in a moment 💡')
                .setThumbnail(exporter_2.error_icon);
            await interaction.reply({ embeds: [errEmbed], flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
    }
};
