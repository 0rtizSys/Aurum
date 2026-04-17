import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, MessageFlags, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { emb_color, error_icon } from "../../../configs/exporter";
import { add_balance_bw } from "../../../services/database/tables/clients/manager";

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const add_balance: Command = {
    data: new SlashCommandBuilder()
    .setName('add_balance')
    .setDescription('Add balance to an user wallet or bank')
    .addStringOption(opt=>opt
            .setName('method')
            .setDescription('Add balance to wallet or bank')
            .setRequired(true)
            .addChoices(
                { name: 'Wallet', value: 'wallet' },
                { name: 'Bank', value: 'bank' }
            )
    )
    .addIntegerOption(opt=>opt
            .setName('amount')
            .setDescription("Amount of money you're adding")
            .setRequired(true)
    )
    .addUserOption(opt=>opt
            .setName('user')
            .setDescription('User to give money to')
            .setRequired(true)
    )
    .addBooleanOption(opt=>opt
            .setName('visibility')
            .setDescription('Other people can see your actions')
    ),

    async execute(interaction: ChatInputCommandInteraction){
        type Method = "wallet" | "bank";
        const MAX_AMOUNT = 1_000_000_000;
        const method = interaction.options.getString('method', true) as Method;
        const userTarget = interaction.options.getUser('user', true);
        const userTargetID = userTarget.id
        const amn = interaction.options.getInteger('amount', true);
        const isPublic = interaction.options.getBoolean('visibility') ?? false;
        const guild_id = interaction.guild?.id;
        if(!guild_id){
            await interaction.reply({
                content: "This comand only works on servers, not in DMs etc... 🤖",
                flags: MessageFlags.Ephemeral
            })
            return;
        }
        //! IMPORTANT VALIDATIONS
        if(amn <= 0 || amn > MAX_AMOUNT){
            const errEmbed = new EmbedBuilder()
            .setColor(emb_color)
            .setTitle('✖️ Error')
            .setDescription('Amount cannot be below \`1\` or above \`1,000,000,000\` 😥') 
            .setThumbnail(error_icon)
            .addFields({name:'Hint 💡', value:'Try smaller values like \`1,000\` or \`10,000\`'})
            await interaction.reply({embeds: [errEmbed], flags: MessageFlags.Ephemeral})
            return;
        }
        if(userTarget.bot){
            const errEmbed = new EmbedBuilder()
            .setColor(emb_color)
            .setTitle('✖️ Error')
            .setThumbnail(error_icon)
            .setDescription('`Aurum`: Why would you add balance to Bots?! 😥');
            await interaction.reply({embeds:[errEmbed], flags: MessageFlags.Ephemeral})
            return;
        }
        if(!interaction.inGuild() || !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)){
            const errEmbed = new EmbedBuilder()
            .setColor(emb_color)
            .setTitle('✖️ Error')
            .setThumbnail(error_icon)
            .setDescription('You dont have enough perms to do that! 😥') 
            await interaction.reply({embeds: [errEmbed], flags: MessageFlags.Ephemeral})
            return;
        }
        //? Defering the message after validating
        await interaction.deferReply({flags: isPublic ? undefined : MessageFlags.Ephemeral})
        //? Managing DB logic -
        try{
            await add_balance_bw(userTargetID, guild_id, method, amn)
            const embed = new EmbedBuilder()
            .setColor(emb_color)
            .setTitle('Added balance ✅')
            .setDescription(`${interaction.user} Added $\`${amn}\` to ${userTarget} 💳`)
            await interaction.editReply({embeds: [embed]})
        }catch(error){
            console.error(error);
            const errEmbed = new EmbedBuilder()
            .setColor(emb_color)
            .setTitle('✖️ Something went wrong')
            .setThumbnail(error_icon)
            .setDescription('An unexpected error occurred while processing your request.\nPlease try again in a moment 💡');
            await interaction.editReply({embeds:[errEmbed]})
        }
    }
}