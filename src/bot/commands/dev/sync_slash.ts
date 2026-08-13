import {
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    ChatInputCommandInteraction,
    MessageFlags,
    REST,
    Routes,
} from "discord.js";
import * as dotenv from "dotenv";
import { notEnoughPermsEmbed } from "../../Helpers/simplified_embed_builder";

dotenv.config();

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const syncSlash: Command = {
    data: new SlashCommandBuilder()
        .setName("sync_slash_guild")
        .setDescription("Limpia duplicados y sincroniza solo en la Guild"),

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== process.env.OWNER_ID) {
            await notEnoughPermsEmbed(interaction);
            return;
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            const { cmds } = await import("../../syncer");

            const rest = new REST({ version: "10" }).setToken(
                process.env.TOKEN!,
            );
            const payload = cmds
                .filter((c) => c && c.data)
                .map((c) => c.data.toJSON());

            await rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENT_ID!,
                    process.env.GUILD_ID!,
                ),
                { body: payload },
            );

            await interaction.editReply({
                content: `✅ Guild sincronizada con \`${payload.length}\` comandos.`,
            });
        } catch (e) {
            console.error(e);
            await interaction.editReply({
                content: "❌ Error en la sincronización.",
            });
        }
    },
};

if (require.main === module) {
    (async () => {
        console.log("🧹 Iniciando LIMPIEZA PROFUNDA...");

        try {
            const { cmds } = await import("../../syncer");

            const rest = new REST({ version: "10" }).setToken(
                process.env.TOKEN!,
            );
            const payload = cmds
                .filter((c) => c && c.data)
                .map((c) => c.data.toJSON());

            console.log("1️⃣  Borrando Globales...");
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
                body: [],
            });

            console.log(
                `2️⃣  Instalando ${payload.length} comandos en Guild...`,
            );
            await rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENT_ID!,
                    process.env.GUILD_ID!,
                ),
                { body: payload },
            );

            console.log("\n✨ ¡LISTO! Reinicia Discord (Ctrl+R).");
        } catch (error) {
            console.error("❌ Falló el script:", error);
        }
    })();
}
