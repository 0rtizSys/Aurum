import {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction
} from "discord.js";
import { emb_color } from "../../configs/exporter";

export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const pingSlash: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Sends bot latency'),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            content: "🏓 pinging..."
        });
        const sent = await interaction.fetchReply();
        const ping = sent.createdTimestamp - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .setColor(emb_color)
            .setTitle('Pong 🏓')
            .addFields(
                { name: 'Latency', value: `${ping}ms 📶`, inline: true },
                { name: 'API', value: `${interaction.client.ws.ping}ms 🛜`, inline: true }
            );

        await interaction.editReply({
            content: null,
            embeds: [embed]
        });
    }
};
