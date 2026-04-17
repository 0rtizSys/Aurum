"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_balance = void 0;
const discord_js_1 = require("discord.js");
const exporter_1 = require("../../../configs/exporter");
const manager_1 = require("../../../services/database/tables/clients/manager");
exports.add_balance = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('add_balance')
        .setDescription('Add balance to an user wallet or bank')
        .addStringOption(opt => opt
        .setName('method')
        .setDescription('Add balance to wallet or bank')
        .setRequired(true)
        .addChoices({ name: 'Wallet', value: 'wallet' }, { name: 'Bank', value: 'bank' }))
        .addIntegerOption(opt => opt
        .setName('amount')
        .setDescription("Amount of money you're adding")
        .setRequired(true))
        .addUserOption(opt => opt
        .setName('user')
        .setDescription('User to give money to')
        .setRequired(true))
        .addBooleanOption(opt => opt
        .setName('visibility')
        .setDescription('Other people can see your actions')),
    async execute(interaction) {
        const MAX_AMOUNT = 1000000000;
        const method = interaction.options.getString('method', true);
        const userTarget = interaction.options.getUser('user', true);
        const userTargetID = userTarget.id;
        const amn = interaction.options.getInteger('amount', true);
        const isPublic = interaction.options.getBoolean('visibility') ?? false;
        const guild_id = interaction.guild?.id;
        if (!guild_id) {
            await interaction.reply({
                content: "This comand only works on servers, not in DMs etc... 🤖",
                flags: discord_js_1.MessageFlags.Ephemeral
            });
            return;
        }
        //! IMPORTANT VALIDATIONS
        if (amn <= 0 || amn > MAX_AMOUNT) {
            const errEmbed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('✖️ Error')
                .setDescription('Amount cannot be below \`1\` or above \`1,000,000,000\` 😥')
                .setThumbnail(exporter_1.error_icon)
                .addFields({ name: 'Hint 💡', value: 'Try smaller values like \`1,000\` or \`10,000\`' });
            await interaction.reply({ embeds: [errEmbed], flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        if (userTarget.bot) {
            const errEmbed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('✖️ Error')
                .setThumbnail(exporter_1.error_icon)
                .setDescription('`Aurum`: Why would you add balance to Bots?! 😥');
            await interaction.reply({ embeds: [errEmbed], flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        if (!interaction.inGuild() || !interaction.memberPermissions?.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            const errEmbed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('✖️ Error')
                .setThumbnail(exporter_1.error_icon)
                .setDescription('You dont have enough perms to do that! 😥');
            await interaction.reply({ embeds: [errEmbed], flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        //? Defering the message after validating
        await interaction.deferReply({ flags: isPublic ? undefined : discord_js_1.MessageFlags.Ephemeral });
        //? Managing DB logic -
        try {
            await (0, manager_1.add_balance_bw)(userTargetID, guild_id, method, amn);
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('Added balance ✅')
                .setDescription(`${interaction.user} Added $\`${amn}\` to ${userTarget} 💳`);
            await interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            console.error(error);
            const errEmbed = new discord_js_1.EmbedBuilder()
                .setColor(exporter_1.emb_color)
                .setTitle('✖️ Something went wrong')
                .setThumbnail(exporter_1.error_icon)
                .setDescription('An unexpected error occurred while processing your request.\nPlease try again in a moment 💡');
            await interaction.editReply({ embeds: [errEmbed] });
        }
    }
};
