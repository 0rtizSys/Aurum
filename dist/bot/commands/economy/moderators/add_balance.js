"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBalance = void 0;
const discord_js_1 = require("discord.js");
const manager_1 = require("../../../services/database/tables/clients/manager");
const simplified_embed_builder_1 = require("../../../Helpers/simplified_embed_builder");
const require_guild_1 = require("../../../Helpers/require_guild");
exports.addBalance = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("add_balance")
        .setDescription("Add balance to an user wallet or bank")
        .addStringOption((opt) => opt
        .setName("method")
        .setDescription("Add balance to wallet or bank")
        .setRequired(true)
        .addChoices({ name: "Wallet", value: "wallet" }, { name: "Bank", value: "bank" }))
        .addIntegerOption((opt) => opt
        .setName("amount")
        .setDescription("Amount of money you're adding")
        .setRequired(true))
        .addUserOption((opt) => opt
        .setName("user")
        .setDescription("User to give money to")
        .setRequired(true))
        .addBooleanOption((opt) => opt
        .setName("visibility")
        .setDescription("Other people can see your actions")),
    async execute(interaction) {
        if (!((0, require_guild_1.requireGuild)(interaction)))
            return;
        const maxAmount = 1000000000;
        const method = interaction.options.getString("method", true);
        const userTarget = interaction.options.getUser("user", true);
        const userTargetID = userTarget.id;
        const amount = interaction.options.getInteger("amount", true);
        const isPublic = interaction.options.getBoolean("visibility") ?? false;
        const guildId = interaction.guild.id;
        //! IMPORTANT VALIDATIONS
        if (amount <= 0 || amount > maxAmount) {
            await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
                title: '✖️ Error',
                description: 'Amount cannot be below \`1\` or above \`1,000,000,000\`',
                thumType: 'error',
                fields: [{ name: 'Hint 💡', value: 'Try smaller values like \`1,000\` or \`10,000\`' }]
            });
            return;
        }
        if (userTarget.bot) {
            await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
                title: '✖️You dont have enough perms to do that! 😥 Error',
                description: 'Aurum: Why would you add balance to Bots?! 😥',
                thumType: 'error'
            });
            return;
        }
        if (!interaction.memberPermissions?.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
                title: '✖️ Error',
                description: 'You dont have enough perms to do that! 😥',
                thumType: 'error'
            });
            return;
        }
        //? Defering the message after validating
        await interaction.deferReply({ flags: isPublic ? undefined : discord_js_1.MessageFlags.Ephemeral, });
        //? Managing DB logic -
        try {
            await (0, manager_1.addBalanceBW)(userTargetID, guildId, method, amount);
            await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
                title: 'Added balance ✅',
                description: `${interaction.user} Added $\`${amount}\` to ${userTarget} 💳`,
                thumType: 'success'
            });
        }
        catch (error) {
            console.error(error);
            await (0, simplified_embed_builder_1.internalErrorEmbed)(interaction);
        }
    },
};
