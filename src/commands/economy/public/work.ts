import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { emb_color, error_icon } from "../../../configs/exporter";
import { checkCooldown, setCooldown } from "../../../services/database/tables/cooldowns/cd_manager";
import { add_balance_bw } from "../../../services/database/tables/clients/manager";
import { get_cooldown_time } from "../../../services/database/tables/servers/configs/get_cd_time";
import { get_eco_symbol } from "../../../services/database/tables/servers/configs/get_eco_symbol";
import { PassThrough } from "node:stream";

const TEMP_MIN: number = 100;
const TEMP_MAX: number = 1000;
const TYPE: string = "wallet";

function randomValues(Na: number, Nb: number){
    return Math.floor(Math.random() * (Nb - Na + 1)) + Na;
}

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction:ChatInputCommandInteraction) => Promise<void>;
}

export const work_command: Command = {
    data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work to generate money')
    .addBooleanOption(opt=>opt
            .setName('visibility')
            .setDescription('People can see your earnings')
    ),

    async execute(interaction:ChatInputCommandInteraction){
        if(!interaction.inGuild()){
            const errEmbed = new EmbedBuilder()
            .setColor(emb_color)
            .setTitle('✖️ Error')
            .setDescription('This comand only works on servers, not in DMs etc... 🤖')
            .setThumbnail(error_icon);
            await interaction.reply({embeds:[errEmbed]})
            return;
        }
        const ranGains = randomValues(TEMP_MIN, TEMP_MAX);
        const guild_id = interaction.guild!.id;
        const user_id = interaction.user.id;
        const isPublic = interaction.options.getBoolean('visibility') ?? false;
        const cd_time = await get_cooldown_time(guild_id);
        const symbol = await get_eco_symbol(guild_id);
        const cd = await checkCooldown(guild_id, user_id)
        if(!cd.allowed && cd.remaining != null){
            const errEmbed = new EmbedBuilder()
            .setColor(emb_color)
            .setThumbnail(error_icon)
            .setTitle('On Cooldown 🧊')
            .setDescription(`Wait \`${Math.ceil(cd.remaining / 1000)}\` to work again 🕐!`);
            await interaction.reply({embeds:[errEmbed], flags: MessageFlags.Ephemeral});
            return;
        }
        await interaction.deferReply({flags: isPublic ? undefined : MessageFlags.Ephemeral})
        try{
            await add_balance_bw(user_id, guild_id, TYPE, ranGains);
            await setCooldown(guild_id, user_id, cd_time*1000); console.log(cd_time*1000) //! DEBUG
            const embed = new EmbedBuilder()
            .setColor(emb_color)
            .setTitle('💼 Work')
            .setDescription(`${interaction.user} earned \`${symbol}${ranGains}\` 💵`)
            await interaction.editReply({embeds:[embed]})
        }catch(e){
            console.error(e);
            const errEmbed = new EmbedBuilder()
            .setColor(emb_color)
            .setTitle('✖️ Something went wrong')
            .setThumbnail(error_icon)
            .setDescription('An unexpected error occurred while processing your request.\nPlease try again in a moment 💡');
            await interaction.editReply({embeds:[errEmbed]})
        }
    }
}