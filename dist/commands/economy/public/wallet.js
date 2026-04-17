"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_wallet_balance = void 0;
const discord_js_1 = require("discord.js");
const manager_1 = require("../../../services/database/tables/clients/manager");
const discord_js_2 = require("discord.js");
const exporter_1 = require("../../../configs/exporter");
exports.get_wallet_balance = {
    data: new discord_js_2.SlashCommandBuilder()
        .setName('wallet_balance')
        .setDescription('see your wallet balance')
        .addBooleanOption(option => option
        .setName('visibility')
        .setDescription('Other people can see your balance')
        .setRequired(true)),
    async execute(interaction) {
        const visible = interaction.options.getBoolean('visibility', true);
        const user_id = interaction.user.id;
        const guild_id = interaction.guild?.id;
        if (!guild_id) {
            await interaction.reply({
                content: "This comand only works on servers, not in DMs etc... 🤖",
                flags: discord_js_2.MessageFlags.Ephemeral
            });
            return;
        }
        ;
        const user_bal = await (0, manager_1.get_balance_wallet)(user_id, guild_id);
        await interaction.deferReply({ ephemeral: !visible }); //^ Here we defer the message
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(exporter_1.emb_color)
            .setTitle('Wallet Balance 💵')
            .setDescription(`<@${user_id}> Your current balance is $\`${user_bal}\``);
        await interaction.editReply({ content: null, embeds: [embed] });
    }
};
