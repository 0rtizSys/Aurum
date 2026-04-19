"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSimpleEmbed = sendSimpleEmbed;
exports.internalErrorEmbed = internalErrorEmbed;
exports.notEnoughPermsEmbed = notEnoughPermsEmbed;
const exporter_1 = require("../configs/exporter");
const discord_js_1 = require("discord.js");
async function sendSimpleEmbed(interaction, options) {
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(exporter_1.embColor);
    if (options.title) {
        embed.setTitle(options.title);
    }
    if (options.description) {
        embed.setDescription(options.description);
    }
    if (options.thumType === "error") {
        embed.setThumbnail(exporter_1.errorIcon);
    }
    else if (options.thumType === "success") {
        embed.setThumbnail(exporter_1.successIcon);
    }
    if (options.fields) {
        embed.addFields(options.fields);
    }
    if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [embed] });
    }
    else {
        interaction.reply({ embeds: [embed], flags: options.eph ? discord_js_1.MessageFlags.Ephemeral : undefined });
    }
}
//?-------------------------------
//? Internal Error Embed Manager
//?-------------------------------
async function internalErrorEmbed(interaction) {
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(exporter_1.embColor)
        .setTitle('✖️ Something went wrong')
        .setDescription('An unexpected error occurred while processing your request.\nPlease try again in a moment 💡')
        .setThumbnail(exporter_1.errorIcon);
    if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [embed] });
    }
    else {
        interaction.reply({ embeds: [embed], flags: discord_js_1.MessageFlags.Ephemeral });
    }
}
//?---------------------------------
//? Not Enough Perms Embed Manager
//?---------------------------------
async function notEnoughPermsEmbed(interaction) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('✖️ Error')
        .setDescription('Aurum: You dont have enough perms to do that! 😥')
        .setThumbnail(exporter_1.errorIcon);
    if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [embed] });
    }
    else {
        interaction.reply({ embeds: [embed], flags: discord_js_1.MessageFlags.Ephemeral });
    }
}
