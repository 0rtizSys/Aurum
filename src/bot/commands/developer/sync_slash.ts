import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  REST,
  Routes,
} from "discord.js";
import { cmds } from "../../syncer";
import * as dotenv from "dotenv";
dotenv.config();

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const syncSlash: Command = {
  data: new SlashCommandBuilder()
    .setName("sync_slash")
    .setDescription("sync SC either on global or test server")
    .addStringOption((opt) =>
      opt
        .setName("scope")
        .setDescription("Where to sync")
        .setRequired(true)
        .addChoices(
          { name: "Global", value: "global" },
          { name: "Test", value: "test" },
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      await interaction.reply({
        content: "❌ Not enough perms",
        flags: 64, // ephemeral
      });
      return;
    }

    const scope = interaction.options.getString("scope", true);
    await interaction.reply({
      content: `🛜 Syncing in ${scope}\n🛜 Synced ${cmds.length}`,
      flags: MessageFlags.Ephemeral,
    });

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
    await rest.put(
      scope === "global"
        ? Routes.applicationCommands(process.env.CLIENT_ID!)
        : Routes.applicationGuildCommands(
            process.env.CLIENT_ID!,
            process.env.GUILD_ID!,
          ),
      {
        body: cmds.map((cmd) => cmd.data?.toJSON()),
      },
    );
  },
};
