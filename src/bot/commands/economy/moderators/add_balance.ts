import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction, PermissionFlagsBits, MessageFlags }
from "discord.js";

import { addBalanceBW }
from "../../../services/database/tables/clients/manager";

import { sendSimpleEmbed, internalErrorEmbed }
from "../../../Helpers/simplified_embed_builder";

import { requireGuild } from "../../../Helpers/require_guild";

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const addBalance: Command = {
  data: new SlashCommandBuilder()
    .setName("add_balance")
    .setDescription("Add balance to an user wallet or bank")
    .addStringOption((opt) =>
      opt
        .setName("method")
        .setDescription("Add balance to wallet or bank")
        .setRequired(true)
        .addChoices(
          { name: "Wallet", value: "wallet" },
          { name: "Bank", value: "bank" },
        ),
    )
    .addIntegerOption((opt) =>
      opt
        .setName("amount")
        .setDescription("Amount of money you're adding")
        .setRequired(true),
    )
    .addUserOption((opt) =>
      opt
        .setName("user")
        .setDescription("User to give money to")
        .setRequired(true),
    )
    .addBooleanOption((opt) =>
      opt
        .setName("visibility")
        .setDescription("Other people can see your actions"),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
     if (!(requireGuild(interaction))) return;
    type typeMethod = "wallet" | "bank";
    const maxAmount = 1_000_000_000;
    const method = interaction.options.getString("method", true) as typeMethod;
    const userTarget = interaction.options.getUser("user", true);
    const userTargetID = userTarget.id;
    const amount = interaction.options.getInteger("amount", true);
    const isPublic = interaction.options.getBoolean("visibility") ?? false;
    const guildId = interaction.guild!.id;
    //! IMPORTANT VALIDATIONS
    if (amount <= 0 || amount > maxAmount) {
      await sendSimpleEmbed(interaction,{
        title:'✖️ Error',
        description:'Amount cannot be below \`1\` or above \`1,000,000,000\`',
        thumType:'error',
        fields:[{ name:'Hint 💡', value:'Try smaller values like \`1,000\` or \`10,000\`'}]
      })
      return;
    }
    if (userTarget.bot) {
      await sendSimpleEmbed(interaction,{
        title:'✖️You dont have enough perms to do that! 😥 Error',
        description:'Aurum: Why would you add balance to Bots?! 😥',
        thumType:'error'
      })
      return;
    }
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)){
      await sendSimpleEmbed(interaction,{
        title:'✖️ Error',
        description:'You dont have enough perms to do that! 😥',
        thumType:'error'
      })
      return;
    }
    //? Defering the message after validating
    await interaction.deferReply({flags: isPublic ? undefined : MessageFlags.Ephemeral,});
    //? Managing DB logic -
    try {
      await addBalanceBW(userTargetID, guildId, method, amount);
      await sendSimpleEmbed(interaction,{
        title:'Added balance ✅',
        description:`${interaction.user} Added $\`${amount}\` to ${userTarget} 💳`,
        thumType:'success'
      })
    } catch (error) {
      console.error(error);
      await internalErrorEmbed(interaction);
    }
  },
};