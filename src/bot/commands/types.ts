import {
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    ChatInputCommandInteraction,
} from "discord.js";

export type Command = {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};
export type Embeds = {
    interaction: ChatInputCommandInteraction;
};
export type SimpleEmbedOptions = {
    title?: string;
    description?: string;
    thumType?: "error" | "success";
    eph?: boolean;
    fields?: { name: string; value: string; inline?: boolean }[];
};
