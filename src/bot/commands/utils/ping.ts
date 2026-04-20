import { SlashCommandBuilder, ChatInputCommandInteraction }
  from "discord.js";

import { sendSimpleEmbed } from "../../Helpers/simplified_embed_builder";

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const pingSlash: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Sends bot latency"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "🏓 pinging...",
    });
    const sent = await interaction.fetchReply();
    const ping = sent.createdTimestamp - interaction.createdTimestamp;

    await sendSimpleEmbed(interaction, {
      title: 'Pong 🏓',
      fields: [
        { name: "Latency", value: `${ping}ms 📶`, inline: true },
        {
          name: "API", value: `${interaction.client.ws.ping}ms 🛜`, inline: true,
        },
      ]
    })
  },
};
