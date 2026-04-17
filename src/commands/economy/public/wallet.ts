import { EmbedBuilder } from "discord.js";
import { get_balance_wallet } from "../../../services/database/tables/clients/manager";
import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, MessageFlags, ChatInputCommandInteraction } from "discord.js";
import { emb_color } from "../../../configs/exporter";

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const get_wallet_balance: Command = {
    data: new SlashCommandBuilder()
    .setName('wallet_balance')
    .setDescription('see your wallet balance')
    .addBooleanOption(option=>option
            .setName('visibility')
            .setDescription('Other people can see your balance')
            .setRequired(true)
    ),

    async execute(interaction:ChatInputCommandInteraction){
        const visible = interaction.options.getBoolean('visibility', true)
        const user_id = interaction.user.id;
        const guild_id = interaction.guild?.id;
        if(!guild_id){
            await interaction.reply({
                content: "This comand only works on servers, not in DMs etc... 🤖",
                flags: MessageFlags.Ephemeral
            });
            return;
        };
        const user_bal = await get_balance_wallet(user_id,guild_id);
        await interaction.deferReply({ ephemeral: !visible }) //^ Here we defer the message
        const embed = new EmbedBuilder()
        .setColor(emb_color)
        .setTitle('Wallet Balance 💵')
        .setDescription(`<@${user_id}> Your current balance is $\`${user_bal}\``)
        await interaction.editReply({content: null, embeds: [embed]})
    }
}