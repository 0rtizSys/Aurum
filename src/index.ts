import { Client, GatewayIntentBits, Events, MessageFlags, ActivityType, Interaction } from 'discord.js';
import * as dotenv from 'dotenv'
import { cmds } from './syncer';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
})

client.once(Events.ClientReady, () => {
    console.log(`Bot listo como ${client.user?.tag}`);

    client.user?.setPresence({
        activities: [
            {
                name: "Crypto Markets 📈",
                type: ActivityType.Streaming,
                url: "https://www.twitch.tv/k1m6a"
            }
        ],
        status: "online"
    });
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = cmds.find(cmd => cmd.data!.name === interaction.commandName);
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
                content: '❌ Error ejecutando comando',
                flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({
                content: '❌ Error ejecutando comando',
                flags: MessageFlags.Ephemeral
            });
        }
    }
});

client.login(process.env.TOKEN)