"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireGuild = requireGuild;
const simplified_embed_builder_1 = require("./simplified_embed_builder");
async function requireGuild(interaction) {
    if (!interaction.inGuild()) {
        await (0, simplified_embed_builder_1.sendSimpleEmbed)(interaction, {
            title: "✖️ Error",
            description: "This comand only works on servers, not in DMs etc... 🤖",
            thumType: "error",
            eph: true,
        });
        return false;
    }
    return true;
}
