import { settleCoinFlip } from "../services/games/coin_flip";

describe("settleCoinFlip", () => {
  it("returns a winning outcome when the selected side matches the flip", () => {
    const outcome = settleCoinFlip("cara", 100, () => "cara");

    expect(outcome).toEqual({
      choice: "cara",
      result: "cara",
      won: true,
      amount: 100,
      balanceDelta: 100,
    });
  });

  it("returns a losing outcome when the selected side does not match the flip", () => {
    const outcome = settleCoinFlip("cara", 100, () => "cruz");

    expect(outcome).toEqual({
      choice: "cara",
      result: "cruz",
      won: false,
      amount: 100,
      balanceDelta: -100,
    });
  });
});

