"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCdTimeAdmin = void 0;
const discord_js_1 = require("discord.js");
const set_cd_time_1 = require("../../../services/database/tables/servers/configs/set_cd_time");
const get_cd_time_1 = require("../../../services/database/tables/servers/configs/get_cd_time");
const simplified_embed_builder_1 = require("../../../Helpers/simplified_embed_builder");
const require_guild_1 = require("../../../Helpers/require_guild");
exports.setCdTimeAdmin = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("set_cooldown_time")
        .setDescription("change the cooldown time for the command work")
        .addIntegerOption((opt) => opt
        .setName("time")
        .setDescription("Use seconds to avoid any problems")
        .setRequired(true)),
    async execute(interaction) {
        if (!(await (0, require_guild_1.requireGuild)(interaction))) { }
        ;
        if (!interaction.memberPermissions?.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            await (0, simplified_embed_builder_1.notEnoughPermsEmbed)(interaction);
            return;
        }
        ;
        const guildId = interaction.guild.id;
        const newTime = interaction.options.getInteger("time", true);
        const oldTime = await (0, get_cd_time_1.getCdTime)(guildId);
        if (newTime <= 0) {
            await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
                title: '✖️ Error',
                description: 'Time must be higher than \`0\`',
                thumType: 'error',
                eph: true
            });
            return;
        }
        await interaction.deferReply();
        try {
            await (0, set_cd_time_1.setCdTime)(guildId, newTime);
            await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
                title: '⚙️ Configurations saved',
                description: `Old cooldown time: \`${oldTime}s\`\nNew cooldown time: \`${newTime}s\``,
                thumType: 'success'
            });
        }
        catch (err) {
            console.log(err);
            await (0, simplified_embed_builder_1.internalErrorEmbed)(interaction);
        }
    },
};
