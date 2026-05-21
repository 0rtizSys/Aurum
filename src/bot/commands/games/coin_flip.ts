import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
} from "discord.js";

import { Command } from "../types";
import { requireGuild } from "../../Helpers/require_guild";
import { isInvalidAmount } from "../../Helpers/validators";
import { internalErrorEmbed, sendSimpleEmbed } from "../../Helpers/simplified_embed_builder";
import { getEcoSymbol } from "../../services/database/tables/servers/get_eco_symbol";
import { applyWalletWager } from "../../services/database/tables/clients/wager";
import { CoinSide, isCoinSide, settleCoinFlip } from "../../services/games/coin_flip";

const DEFAULT_BET = 50;

function formatSide(side: CoinSide): string {
    return side === "cara" ? "Cara" : "Cruz";
}

function formatSignedAmount(amount: number, won: boolean, symbol: string): string {
    return `${won ? "+" : "-"}${symbol}${amount}`;
}

export const coinFlipCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Bet wallet money by flipping a coin')
        .addStringOption(opt => opt
            .setName('choice')
            .setDescription('Choose one side of the coin')
            .setRequired(true)
            .addChoices(
                { name: 'Cara', value: 'cara' },
                { name: 'Cruz', value: 'cruz' }
            )
        )
        .addIntegerOption(opt => opt
            .setName('amount')
            .setDescription(`Amount to bet from your wallet (default ${DEFAULT_BET})`)
            .setMinValue(1)
        )
        .addBooleanOption(opt => opt
            .setName("visibility")
            .setDescription("Other people can see your flip")
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!(await requireGuild(interaction))) return;

        const guildId = interaction.guild!.id;
        const userId = interaction.user.id;
        const choiceOption = interaction.options.getString('choice', true);
        const amount = interaction.options.getInteger('amount') ?? DEFAULT_BET;
        const isPublic = interaction.options.getBoolean("visibility") ?? false;

        if (!isCoinSide(choiceOption)) {
            await sendSimpleEmbed(interaction, {
                title: "✖️ Invalid coin side",
                description: "Choose `Cara` or `Cruz` to play coinflip.",
                thumType: "error",
                eph: true,
            });
            return;
        }

        if (await isInvalidAmount(interaction, amount)) return;

        await interaction.deferReply({
            flags: !isPublic ? MessageFlags.Ephemeral : undefined,
        });

        try {
            const symbol = await getEcoSymbol(guildId);
            const outcome = settleCoinFlip(choiceOption, amount);
            const wager = await applyWalletWager(
                userId,
                guildId,
                outcome.amount,
                outcome.balanceDelta,
            );

            if (!wager.ok) {
                await sendSimpleEmbed(interaction, {
                    title: "✖️ Insufficient funds",
                    description: `Current wallet: \`${symbol}${wager.currentBalance}\`\nBet amount: \`${symbol}${amount}\``,
                    thumType: "error",
                });
                return;
            }

            await sendSimpleEmbed(interaction, {
                title: outcome.won ? "Coinflip won 🪙" : "Coinflip lost 🪙",
                description: `${interaction.user} chose \`${formatSide(outcome.choice)}\` and the coin landed on \`${formatSide(outcome.result)}\`.`,
                thumType: outcome.won ? "success" : "error",
                fields: [
                    {
                        name: "Bet",
                        value: `\`${symbol}${outcome.amount}\``,
                        inline: true,
                    },
                    {
                        name: "Result",
                        value: `\`${formatSignedAmount(outcome.amount, outcome.won, symbol)}\``,
                        inline: true,
                    },
                    {
                        name: "Wallet",
                        value: `\`${symbol}${wager.previousBalance}\` → \`${symbol}${wager.newBalance}\``,
                    },
                ],
            });
        } catch (error) {
            console.error("Error en comando coinflip:", error);
            await internalErrorEmbed(interaction);
        }
    },
};
