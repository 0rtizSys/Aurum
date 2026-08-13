import { MessageFlags } from "discord.js";
import { depositCommand } from "../commands/economy/public/deposit";
import { withdrawCommand } from "../commands/economy/public/withdraw";
import { requireGuild } from "../Helpers/require_guild";
import { hasInsufficientBalance, isInvalidAmount } from "../Helpers/validators";
import { getEcoSymbol } from "../services/database/repository/servers/get_eco_symbol";
import { transferInternalSafe } from "../services/database/repository/clients/withdraw-transfer";
import {
    sendSimpleEmbed,
    transactionWentWrong,
} from "../Helpers/simplified_embed_builder";

jest.mock("../Helpers/require_guild", () => ({
    requireGuild: jest.fn(),
}));

jest.mock("../Helpers/validators", () => ({
    hasInsufficientBalance: jest.fn(),
    isInvalidAmount: jest.fn(),
}));

jest.mock("../services/database/tables/servers/get_eco_symbol", () => ({
    getEcoSymbol: jest.fn(),
}));

jest.mock("../services/database/tables/clients/withdraw-transfer", () => ({
    transferInternalSafe: jest.fn(),
}));

jest.mock("../Helpers/simplified_embed_builder", () => ({
    internalErrorEmbed: jest.fn(),
    sendSimpleEmbed: jest.fn(),
    transactionWentWrong: jest.fn(),
}));

const requireGuildMock = jest.mocked(requireGuild);
const isInvalidAmountMock = jest.mocked(isInvalidAmount);
const hasInsufficientBalanceMock = jest.mocked(hasInsufficientBalance);
const getEcoSymbolMock = jest.mocked(getEcoSymbol);
const transferInternalSafeMock = jest.mocked(transferInternalSafe);
const sendSimpleEmbedMock = jest.mocked(sendSimpleEmbed);
const transactionWentWrongMock = jest.mocked(transactionWentWrong);

function createInteraction(amount = 250, visibility = false) {
    return {
        inGuild: jest.fn().mockReturnValue(true),
        guild: { id: "guild-1" },
        user: {
            id: "user-1",
            toString: () => "<@user-1>",
        },
        options: {
            getBoolean: jest.fn().mockReturnValue(visibility),
            getInteger: jest.fn().mockReturnValue(amount),
        },
        deferReply: jest.fn().mockResolvedValue(undefined),
        deferred: true,
        replied: false,
    } as any;
}

beforeEach(() => {
    jest.clearAllMocks();
    requireGuildMock.mockResolvedValue(true);
    isInvalidAmountMock.mockResolvedValue(false);
    hasInsufficientBalanceMock.mockResolvedValue(false);
    getEcoSymbolMock.mockResolvedValue("$");
    transferInternalSafeMock.mockResolvedValue(false);
    sendSimpleEmbedMock.mockResolvedValue(undefined);
    transactionWentWrongMock.mockResolvedValue(undefined);
});

describe("depositCommand", () => {
    it("moves money from wallet to bank and sends success when transaction succeeds", async () => {
        const interaction = createInteraction(250, false);

        await depositCommand.execute(interaction);

        expect(interaction.deferReply).toHaveBeenCalledWith({
            flags: MessageFlags.Ephemeral,
        });
        expect(transferInternalSafeMock).toHaveBeenCalledWith(
            "user-1",
            "guild-1",
            250,
            "wallet",
            "bank",
        );
        expect(transactionWentWrongMock).not.toHaveBeenCalled();
        expect(sendSimpleEmbedMock).toHaveBeenCalledWith(
            interaction,
            expect.objectContaining({
                title: "Deposit completed ✅ ",
            }),
        );
    });

    it("shows a transaction error instead of success when the atomic deposit fails", async () => {
        const interaction = createInteraction(250, false);
        transferInternalSafeMock.mockResolvedValue(true);

        await depositCommand.execute(interaction);

        expect(transactionWentWrongMock).toHaveBeenCalledWith(interaction);
        expect(sendSimpleEmbedMock).not.toHaveBeenCalled();
    });
});

describe("withdrawCommand", () => {
    it("moves money from bank to wallet and sends success when transaction succeeds", async () => {
        const interaction = createInteraction(400, true);

        await withdrawCommand.execute(interaction);

        expect(interaction.deferReply).toHaveBeenCalledWith({
            flags: undefined,
        });
        expect(transferInternalSafeMock).toHaveBeenCalledWith(
            "user-1",
            "guild-1",
            400,
            "bank",
            "wallet",
        );
        expect(transactionWentWrongMock).not.toHaveBeenCalled();
        expect(sendSimpleEmbedMock).toHaveBeenCalledWith(
            interaction,
            expect.objectContaining({
                title: "Withdrawal completed ✅ ",
            }),
        );
    });

    it("shows a transaction error instead of success when the atomic withdrawal fails", async () => {
        const interaction = createInteraction(400, true);
        transferInternalSafeMock.mockResolvedValue(true);

        await withdrawCommand.execute(interaction);

        expect(transactionWentWrongMock).toHaveBeenCalledWith(interaction);
        expect(sendSimpleEmbedMock).not.toHaveBeenCalled();
    });
});
