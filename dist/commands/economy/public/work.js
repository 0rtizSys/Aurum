"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.work_command = void 0;
const discord_js_1 = require("discord.js");
const exporter_1 = require("../../../configs/exporter");
const cd_manager_1 = require("../../../services/database/tables/cooldowns/cd_manager");
const manager_1 = require("../../../services/database/tables/clients/manager");
const get_cd_time_1 = require("../../../services/database/tables/servers/configs/get_cd_time");
const get_eco_symbol_1 = require("../../../services/database/tables/servers/configs/get_eco_symbol");
const TEMP_MIN = 100;
const TEMP_MAX = 1000;
const TYPE = "wallet";
function randomValues(Na, Nb) {
    return Math.floor(Math.random() * (Nb - Na + 1)) + Na;
}
exports.work_command = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('work')
        .setDescription('Work to generate money')
        .addBooleanOption(opt => opt
        .setName('visibility')
        .setDescription('People can see your earnings')),
    async execute(interaction) {
        if (!interaction.inGuild()) {
            const errEmbed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('✖️ Error')
                .setDescription('This comand only works on servers, not in DMs etc... 🤖')
                .setThumbnail(exporter_1.error_icon);
            await interaction.reply({ embeds: [errEmbed], flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        const ranGains = randomValues(TEMP_MIN, TEMP_MAX);
        const guild_id = interaction.guild.id;
        const user_id = interaction.user.id;
        const isPublic = interaction.options.getBoolean('visibility') ?? false;
        const cd_time = await (0, get_cd_time_1.get_cd_time)(guild_id);
        const symbol = await (0, get_eco_symbol_1.get_eco_symbol)(guild_id);
        const cd = await (0, cd_manager_1.check_cooldown)(guild_id, user_id);
        if (!cd.allowed && cd.remaining != null) {
            const errEmbed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setThumbnail(exporter_1.error_icon)
                .setTitle('On Cooldown 🧊')
                .setDescription(`Wait \`${Math.ceil(cd.remaining / 1000)}\` seconds to work again 🕐!`);
            await interaction.reply({ embeds: [errEmbed], flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        await interaction.deferReply({ flags: isPublic ? undefined : discord_js_1.MessageFlags.Ephemeral });
        try {
            await (0, manager_1.add_balance_bw)(user_id, guild_id, TYPE, ranGains);
            await (0, cd_manager_1.set_cooldown)(guild_id, user_id, cd_time * 1000);
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('💼 Work')
                .setDescription(`${interaction.user} earned \`${symbol}${ranGains}\` 💵`);
            await interaction.editReply({ embeds: [embed] });
        }
        catch (e) {
            console.error(e);
            const errEmbed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('✖️ Something went wrong')
                .setThumbnail(exporter_1.error_icon)
                .setDescription('An unexpected error occurred while processing your request.\nPlease try again in a moment 💡');
            await interaction.editReply({ embeds: [errEmbed] });
        }
    }
};
