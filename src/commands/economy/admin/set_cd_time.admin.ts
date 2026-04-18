import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { set_cd_time } from "../../../services/database/tables/servers/configs/set_cd_time";
import { get_cd_time } from "../../../services/database/tables/servers/configs/get_cd_time";
import { emb_color } from "../../../configs/exporter";
import { error_icon } from "../../../configs/exporter";

export interface Command{
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const set_cd_time_admin: Command = {
    data: new SlashCommandBuilder()
    .setName('set_cooldown_time')
    .setDescription('change the cooldown time for the command work')
    .addIntegerOption(opt=>opt
            .setName('time')
            .setDescription('Use seconds to avoid any problems')
            .setRequired(true)
    ),
    async execute(interaction: ChatInputCommandInteraction){
        if(!interaction.inGuild()){
            const errEmbed = new EmbedBuilder()
            .setColor(emb_color)
            .setTitle('✖️ Error')
            .setDescription('This comand only works on servers, not in DMs etc... 🤖')
            .setThumbnail(error_icon);
            await interaction.reply({embeds:[errEmbed], flags: MessageFlags.Ephemeral})
            return;
        }
        const guild_id = interaction.guild!.id;
        const newTime = interaction.options.getInteger('time', true);
        const oldTime = await get_cd_time(guild_id);
        await interaction.deferReply();
        try{
            await set_cd_time(guild_id, newTime);
            const embed = new EmbedBuilder()
            .setColor(emb_color)
            .setTitle('⚙️ Configurations saved')
            .setDescription(`Old cooldown time: \`${oldTime}s\`\nNew cooldown time: \`${newTime}s\``)
            await interaction.editReply({embeds:[embed]})
        }catch(err){
            const errEmbed = new EmbedBuilder()
            .setColor(emb_color)
            .setTitle('✖️ Error')
            .setDescription('An unexpected error occurred while processing your request.\nPlease try again in a moment 💡')
            .setThumbnail(error_icon);
            await interaction.reply({embeds:[errEmbed], flags: MessageFlags.Ephemeral})
            return;
        }
    }
}