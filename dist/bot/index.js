"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv = __importStar(require("dotenv"));
const syncer_1 = require("./syncer");
const fs_1 = __importDefault(require("fs"));
dotenv.config();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
client.once(discord_js_1.Events.ClientReady, () => {
    console.log(`Bot listo como ${client.user?.tag}`);
    client.user?.setPresence({
        activities: [
            {
                name: "Crypto Markets 📈",
                type: discord_js_1.ActivityType.Streaming,
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
            fs_1.default.writeFileSync('/home/j0srd3v/last_heartbeat.json', JSON.stringify(heartbeat));
            // Un log opcional para que tú veas que funciona (puedes quitarlo luego)
            console.log("💓 Heartbeat actualizado");
        }
        catch (err) {
            console.error("❌ No se pudo escribir el heartbeat:", err);
        }
    }, 30000);
});
client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const command = syncer_1.cmds.find((cmd) => cmd.data.name === interaction.commandName);
    if (!command) {
        console.error(`❌ Comando no encontrado: ${interaction.commandName}`);
        return;
    }
    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "❌ Error ejecutando comando",
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        }
        else {
            await interaction.reply({
                content: "❌ Error ejecutando comando",
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        }
    }
});
client.login(process.env.TOKEN);
