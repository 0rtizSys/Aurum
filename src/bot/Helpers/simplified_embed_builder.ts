import { embColor, errorIcon, successIcon } from "../configs/exporter";

import {
  EmbedBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";

type SimpleEmbedOptions = {
  title?: string;
  description?: string;
  thumType?: "error" | "success";
  eph?: boolean;
  fields?: { name: string, value: string, inline?: boolean }[];
};

export async function sendSimpleEmbed(
  interaction: ChatInputCommandInteraction,
  options: SimpleEmbedOptions,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setColor(embColor)

  if (options.title) { embed.setTitle(options.title) }
  if (options.description) { embed.setDescription(options.description) }

  if (options.thumType === "error") { embed.setThumbnail(errorIcon); }
  else if (options.thumType === "success") { embed.setThumbnail(successIcon); }

  if (options.fields) { embed.addFields(options.fields) }

  if (interaction.deferred || interaction.replied) { await interaction.editReply({ embeds: [embed] }); }
  else { interaction.reply({ embeds: [embed], flags: options.eph ? MessageFlags.Ephemeral : undefined }); }
}

//?-------------------------------
//? Internal Error Embed Manager
//?-------------------------------

export async function internalErrorEmbed(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(embColor)
    .setTitle('✖️ Something went wrong')
    .setDescription('An unexpected error occurred while processing your request.\nPlease try again in a moment 💡')
    .setThumbnail(errorIcon)

  if (interaction.deferred || interaction.replied) { await interaction.editReply({ embeds: [embed] }) }
  else { interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }) }
}

//?---------------------------------
//? Not Enough Perms Embed Manager
//?---------------------------------


export async function notEnoughPermsEmbed(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('✖️ Error')
    .setDescription('Aurum: You dont have enough perms to do that! 😥')
    .setThumbnail(errorIcon)

  if (interaction.deferred || interaction.replied) { await interaction.editReply({ embeds: [embed] }) }
  else { interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }) }
}