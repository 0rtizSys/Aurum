import {
  ChatInputCommandInteraction,
} from "discord.js";

import { sendSimpleEmbed } from "./simplified_embed_builder";

export async function requireGuild(
  interaction: ChatInputCommandInteraction,
): Promise<boolean> {
  if (!interaction.inGuild()) {
    await sendSimpleEmbed(interaction, {
      title: "✖️ Error",
      description: "This comand only works on servers, not in DMs etc... 🤖",
      thumType: "error",
      eph: true,
    });
    return false;
  }
  return true;
}
