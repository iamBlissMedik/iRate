import { describe, expect, it } from "vitest";
import {
  formatMoney,
  majorToMinor,
  maskAccountNumber,
  minorToMajorNumber,
} from "../money";

describe("formatMoney", () => {
  it("formats kobo minor units as naira", () => {
    expect(formatMoney("4800000")).toBe("₦48,000.00");
  });

  it("handles zero", () => {
    expect(formatMoney("0")).toBe("₦0.00");
  });

  it("keeps remainder kobo exact", () => {
    expect(formatMoney("1234567")).toBe("₦12,345.67");
  });

  it("formats negatives", () => {
    expect(formatMoney("-250000")).toBe("-₦2,500.00");
  });

  it("formats very large balances without precision loss", () => {
    // 9_007_199_254_740_993 kobo — beyond Number.MAX_SAFE_INTEGER as minor units
    expect(formatMoney("900719925474099300")).toContain("9,007,199,254,740,993");
  });

  it("can omit the currency symbol", () => {
    expect(formatMoney("150000", { showSymbol: false })).toBe("1,500.00");
  });
});

describe("majorToMinor", () => {
  it("converts naira to kobo", () => {
    expect(majorToMinor("48,000")).toBe(4_800_000);
    expect(majorToMinor(1500.5)).toBe(150_050);
  });
});

describe("minorToMajorNumber", () => {
  it("converts to a major-unit number for charts", () => {
    expect(minorToMajorNumber("4800000")).toBe(48_000);
  });
});

describe("maskAccountNumber", () => {
  it("masks the middle digits", () => {
    expect(maskAccountNumber("1000000001")).toBe("1000••••01");
  });
});
