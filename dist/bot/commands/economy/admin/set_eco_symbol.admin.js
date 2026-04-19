"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEconomySymbolAdmin = void 0;
const discord_js_1 = require("discord.js");
const require_guild_1 = require("../../../Helpers/require_guild");
const get_eco_symbol_1 = require("../../../services/database/tables/servers/configs/get_eco_symbol");
const simplified_embed_builder_1 = require("../../../Helpers/simplified_embed_builder");
const set_eco_symbol_1 = require("../../../services/database/tables/servers/configs/set_eco_symbol");
exports.setEconomySymbolAdmin = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("set_economy_symbol")
        .setDescription("set the server economy symbol")
        .addStringOption((opt) => opt
        .setName("symbol")
        .setDescription("Symbol must be 1 or 2 digits")
        .setRequired(true)),
    async execute(interaction) {
        if (!(await (0, require_guild_1.requireGuild)(interaction)))
            return;
        const guildId = interaction.guild.id;
        const newSymbol = interaction.options.getString("symbol", true);
        const oldSymbol = await (0, get_eco_symbol_1.getEcoSymbol)(guildId);
        if (newSymbol.length > 2 || newSymbol.length === 0) {
            await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
                title: "✖️ Error",
                description: "Symbol length must be 1 or 2 digits",
                thumType: "error",
                eph: true,
            });
            return;
        }
        try {
            await (0, set_eco_symbol_1.setEcoSymbol)(guildId, newSymbol);
            await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
                title: "⚙️ Configuration saved",
                description: `Old symbol: \`${oldSymbol}\`\nNew symbol: \`${newSymbol}\``,
                thumType: "success",
                eph: false,
            });
        }
        catch (e) {
            console.log(e);
            await (0, simplified_embed_builder_1.internalErrorEmbed)(interaction);
        }
    },
};
