"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workCommand = void 0;
const discord_js_1 = require("discord.js");
const cd_manager_1 = require("../../../services/database/tables/cooldowns/cd_manager");
const manager_1 = require("../../../services/database/tables/clients/manager");
const get_cd_time_1 = require("../../../services/database/tables/servers/get_cd_time");
const get_eco_symbol_1 = require("../../../services/database/tables/servers/get_eco_symbol");
const require_guild_1 = require("../../../Helpers/require_guild");
const simplified_embed_builder_1 = require("../../../Helpers/simplified_embed_builder");
const TEMP_MIN = 100;
const TEMP_MAX = 1000;
function randomValues(Na, Nb) {
    return Math.floor(Math.random() * (Nb - Na + 1)) + Na;
}
exports.workCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("work")
        .setDescription("Work to generate money")
        .addBooleanOption((opt) => opt
        .setName("visibility").setDescription("People can see your earnings")),
    async execute(interaction) {
        if (!(0, require_guild_1.requireGuild)(interaction))
            return;
        const ranGains = randomValues(TEMP_MIN, TEMP_MAX);
        const guildId = interaction.guild.id;
        const userId = interaction.user.id;
        const isPublic = interaction.options.getBoolean("visibility") ?? false;
        const cdTime = await (0, get_cd_time_1.getCdTime)(guildId);
        const symbol = await (0, get_eco_symbol_1.getEcoSymbol)(guildId);
        const cd = await (0, cd_manager_1.checkCooldown)(guildId, userId);
        if (!cd.allowed && cd.remaining != null) {
            await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
                title: "On Cooldown 🧊",
                description: `Wait \`${Math.ceil(cd.remaining / 1000)}\` seconds to work again 🕐!`,
                thumType: 'error',
            });
            return;
        }
        await interaction.deferReply({
            flags: !isPublic ? discord_js_1.MessageFlags.Ephemeral : undefined,
        });
        try {
            await (0, manager_1.addBalanceBW)(userId, guildId, "wallet", ranGains);
            await (0, cd_manager_1.setCooldown)(guildId, userId, cdTime * 1000);
            await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
                title: '💼 Work',
                description: `${interaction.user} earned \`${symbol}${ranGains}\` 💵`,
                eph: !isPublic
            });
        }
        catch (e) {
            console.error(e);
            await (0, simplified_embed_builder_1.internalErrorEmbed)(interaction);
        }
    },
};
