"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingSlash = void 0;
const discord_js_1 = require("discord.js");
const exporter_1 = require("../../configs/exporter");
exports.pingSlash = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Sends bot latency'),
    async execute(interaction) {
        await interaction.reply({
            content: "🏓 pinging..."
        });
        const sent = await interaction.fetchReply();
        const ping = sent.createdTimestamp - interaction.createdTimestamp;
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(exporter_1.emb_color)
            .setTitle('Pong 🏓')
            .addFields({ name: 'Latency', value: `${ping}ms 📶`, inline: true }, { name: 'API', value: `${interaction.client.ws.ping}ms 🛜`, inline: true });
        await interaction.editReply({
            content: null,
            embeds: [embed]
        });
    }
};
