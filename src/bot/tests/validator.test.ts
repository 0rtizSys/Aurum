import { validateAmount } from "../../bot/Helpers/validators";

describe("validateAmount", () => {
  it("should return false for amount below 1", () => {
    expect(validateAmount(0)).toBe(false);
  });

  it("should return false for amount above 1_000_000_000", () => {
    expect(validateAmount(2_000_000_000)).toBe(false);
  });

  it("should return true for valid amount", () => {
    expect(validateAmount(500)).toBe(true);
  });
});