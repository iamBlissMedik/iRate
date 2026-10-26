import { describe, expect, it } from "vitest";
import { AmountMajorInput } from "../common";
import { formatMajor } from "../money";
import { creditWalletFormSchema } from "../admin";
import { transferFormSchema } from "../transaction";

describe("AmountMajorInput", () => {
  it.each(["1", "1500", "1500.5", "1,500.50", "12,345,678.99", " 20 "])("accepts %j", (v) => {
    expect(AmountMajorInput.safeParse(v).success).toBe(true);
  });

  it.each(["", "0", "0.00", "-5", "1.234", "1,50", "abc", "1e5"])("rejects %j", (v) => {
    expect(AmountMajorInput.safeParse(v).success).toBe(false);
  });
});

describe("form schemas", () => {
  it("validates a send-money form in major units", () => {
    const ok = transferFormSchema.safeParse({ toAccountNumber: "1000000002", amount: "2,500" });
    expect(ok.success).toBe(true);
    const bad = transferFormSchema.safeParse({ toAccountNumber: "123", amount: "2,500" });
    expect(bad.success).toBe(false);
  });

  it("requires a reason when crediting a wallet", () => {
    expect(creditWalletFormSchema.safeParse({ amount: "100", reason: "" }).success).toBe(false);
    expect(creditWalletFormSchema.safeParse({ amount: "100", reason: "Top-up" }).success).toBe(
      true,
    );
  });
});

describe("formatMajor", () => {
  it("formats a major-unit number via exact minor units", () => {
    expect(formatMajor(48000)).toBe("₦48,000.00");
    expect(formatMajor(0.1 + 0.2)).toBe("₦0.30");
  });
});
