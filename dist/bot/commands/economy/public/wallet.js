"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletBalance = void 0;
const discord_js_1 = require("discord.js");
const manager_1 = require("../../../services/database/tables/clients/manager");
const simplified_embed_builder_1 = require("../../../Helpers/simplified_embed_builder");
const get_eco_symbol_1 = require("../../../services/database/tables/servers/get_eco_symbol");
const require_guild_1 = require("../../../Helpers/require_guild");
exports.getWalletBalance = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("wallet_balance")
        .setDescription("see your wallet balance")
        .addBooleanOption((option) => option
        .setName("visibility")
        .setDescription("Other people can see your balance")
        .setRequired(true)),
    async execute(interaction) {
        if (!(await (0, require_guild_1.requireGuild)(interaction)))
            return;
        const isPublic = interaction.options.getBoolean("visibility", true);
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;
        await interaction.deferReply({ flags: !isPublic ? discord_js_1.MessageFlags.Ephemeral : undefined }); //^ Here we defer the message
        try {
            const symbol = await (0, get_eco_symbol_1.getEcoSymbol)(guildId);
            const userBal = await (0, manager_1.getBalanceBW)(userId, guildId, "wallet");
            await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
                title: "Wallet Balance 💵",
                description: isPublic
                    ? `Your current balance is \`${symbol}${userBal}\``
                    : `${interaction.user} Your current balance is \`${symbol}${userBal}\``,
                eph: !isPublic,
            });
        }
        catch (e) {
            console.log(e);
            await (0, simplified_embed_builder_1.internalErrorEmbed)(interaction);
        }
    },
};
