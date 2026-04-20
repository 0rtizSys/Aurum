"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingSlash = void 0;
const discord_js_1 = require("discord.js");
const simplified_embed_builder_1 = require("../../Helpers/simplified_embed_builder");
exports.pingSlash = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Sends bot latency"),
    async execute(interaction) {
        await interaction.reply({
            content: "🏓 pinging...",
        });
        const sent = await interaction.fetchReply();
        const ping = sent.createdTimestamp - interaction.createdTimestamp;
        await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
            title: 'Pong 🏓',
            fields: [
                { name: "Latency", value: `${ping}ms 📶`, inline: true },
                {
                    name: "API", value: `${interaction.client.ws.ping}ms 🛜`, inline: true,
                },
            ]
        });
    },
};
