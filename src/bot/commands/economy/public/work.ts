import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction, MessageFlags }
  from "discord.js";

import { checkCooldown, setCooldown, }
  from "../../../services/database/tables/cooldowns/cd_manager";

import { addBalanceBW }
  from "../../../services/database/tables/clients/manager";

import { getCdTime }
  from "../../../services/database/tables/servers/configs/get_cd_time";

import { getEcoSymbol }
  from "../../../services/database/tables/servers/configs/get_eco_symbol";

import { requireGuild }
  from "../../../Helpers/require_guild";

import { sendSimpleEmbed, internalErrorEmbed }
  from "../../../Helpers/simplified_embed_builder";

const TEMP_MIN: number = 100;
const TEMP_MAX: number = 1000;

function randomValues(Na: number, Nb: number) {
  return Math.floor(Math.random() * (Nb - Na + 1)) + Na;
}

export type Command = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export const workCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work to generate money")
    .addBooleanOption((opt) =>
      opt
        .setName("visibility").setDescription("People can see your earnings"),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!requireGuild(interaction)) return;
    const ranGains = randomValues(TEMP_MIN, TEMP_MAX);
    const guildId = interaction.guild!.id;
    const userId = interaction.user.id;
    const isPublic = interaction.options.getBoolean("visibility") ?? false;
    const cdTime = await getCdTime(guildId);
    const symbol = await getEcoSymbol(guildId);
    const cd = await checkCooldown(guildId, userId);
    if (!cd.allowed && cd.remaining != null) {
      await sendSimpleEmbed(interaction, {
        title: "On Cooldown 🧊",
        description: `Wait \`${Math.ceil(cd.remaining / 1000)}\` seconds to work again 🕐!`,
        thumType: 'error',
      });
      return;
    }
    await interaction.deferReply({
      flags: !isPublic ? MessageFlags.Ephemeral : undefined,
    });
    try {
      await addBalanceBW(userId, guildId, "wallet", ranGains);
      await setCooldown(guildId, userId, cdTime * 1000);
      await sendSimpleEmbed(interaction, {
        title: '💼 Work',
        description: `${interaction.user} earned \`${symbol}${ranGains}\` 💵`,
        eph: !isPublic
      })
    } catch (e) {
      console.error(e);
      await internalErrorEmbed(interaction);
    }
  },
};
