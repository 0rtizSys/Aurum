import { randomInt } from "crypto";

export const coinSides = ["cara", "cruz"] as const;

export type CoinSide = (typeof coinSides)[number];

export type CoinFlipOutcome = {
  choice: CoinSide;
  result: CoinSide;
  won: boolean;
  amount: number;
  balanceDelta: number;
};

export function isCoinSide(value: string): value is CoinSide {
  return coinSides.includes(value as CoinSide);
}

export function flipCoin(): CoinSide {
  return coinSides[randomInt(coinSides.length)];
}

export function settleCoinFlip(
  choice: CoinSide,
  amount: number,
  flip: () => CoinSide = flipCoin,
): CoinFlipOutcome {
  const result = flip();
  const won = choice === result;

  return {
    choice,
    result,
    won,
    amount,
    balanceDelta: won ? amount : -amount,
  };
}

