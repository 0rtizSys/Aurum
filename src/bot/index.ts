import {
  Client,
  GatewayIntentBits,
  Events,
  MessageFlags,
  ActivityType,
  Interaction,
} from "discord.js";
import * as dotenv from "dotenv";
import { cmds } from "./syncer";
import fs from 'fs';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`Bot listo como ${client.user?.tag}`);

  client.user?.setPresence({
    activities: [
      {
        name: "Crypto Markets 📈",
        type: ActivityType.Streaming,
        url: "https://www.twitch.tv/k1m6a",
      },
    ],
    status: "online",
  });
  /**
   * Set interval to write 
   * the actual state of the
   * bot on the dashboard
   * 
   * ! THIS DOES NOT AFFECT THE [main] BRANCH
   */

  setInterval(() => {
    try {
      const heartbeat = {
        status: 'online',
        last_heartbeat: Date.now(),
        bot_tag: client.user?.tag
      };

      // Escribimos de forma síncrona para asegurar que se guarde antes de que Node siga
      fs.writeFileSync('/home/j0srd3v/last_heartbeat.json', JSON.stringify(heartbeat));

      // Un log opcional para que tú veas que funciona (puedes quitarlo luego)
      console.log("💓 Heartbeat actualizado");

    } catch (err) {
      console.error("❌ No se pudo escribir el heartbeat:", err);
    }
  }, 30000);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = cmds.find(
    (cmd) => cmd.data!.name === interaction.commandName,
  );
  if (!command) {
    console.error(`❌ Comando no encontrado: ${interaction.commandName}`);
    return;
  }
  try {
    await command.execute!(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "❌ Error ejecutando comando",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "❌ Error ejecutando comando",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

client.login(process.env.TOKEN);
