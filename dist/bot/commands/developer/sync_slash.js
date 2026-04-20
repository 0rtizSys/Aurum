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
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSlash = void 0;
const discord_js_1 = require("discord.js");
const syncer_1 = require("../../syncer");
const dotenv = __importStar(require("dotenv"));
const simplified_embed_builder_1 = require("../../Helpers/simplified_embed_builder");
dotenv.config();
exports.syncSlash = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("sync_slash")
        .setDescription("sync SC either on global or test server")
        .addStringOption((opt) => opt
        .setName("scope")
        .setDescription("Where to sync")
        .setRequired(true)
        .addChoices({ name: "Global", value: "global" }, { name: "Test", value: "test" })),
    async execute(interaction) {
        if (interaction.user.id !== process.env.OWNER_ID) {
            await (0, simplified_embed_builder_1.notEnoughPermsEmbed)(interaction);
            return;
        }
        const scope = interaction.options.getString("scope", true);
        await interaction.reply({
            content: `🛜 Syncing in ${scope}\n🛜 Synced ${syncer_1.cmds.length}`,
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
        const rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.TOKEN);
        await rest.put(scope === "global"
            ? discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID)
            : discord_js_1.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
            body: syncer_1.cmds.map((cmd) => cmd.data?.toJSON()),
        });
    },
};
