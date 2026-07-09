import { describe, expect, it } from "vitest";
import { userOverviewSchema } from "../user";
import {
  resolveAccountSchema,
  transactionPageSchema,
  transactionEntrySchema,
} from "../transaction";
import { walletPageSchema } from "../wallet";

// These samples are REAL responses captured from the running backend during the
// live smoke test — they lock the shapes the user app depends on.

describe("userOverviewSchema (GET /users/me/overview)", () => {
  it("parses the real overview (recentTransactions, nullable kycStatus)", () => {
    const sample = {
      accountNumber: "1000000001",
      balance: "4800000",
      currency: "NGN",
      kycStatus: null,
      stats: { totalIn: "5000000", totalOut: "200000", transactionCount: 2 },
      recentTransactions: [
        {
          id: "t1",
          type: "DEBIT",
          direction: "out",
          amount: "200000",
          description: "Transfer to 1000000002",
          counterparty: { accountNumber: "1000000002", name: "Bola" },
          balanceAfter: "4800000",
          createdAt: "2026-06-24T08:21:48.113Z",
        },
        {
          id: "t2",
          type: "CREDIT",
          direction: "in",
          amount: "5000000",
          description: "Opening balance (seed)",
          counterparty: null, // counterparty can be null
          balanceAfter: "5000000",
          createdAt: "2026-06-24T08:21:48.095Z",
        },
      ],
    };
    const parsed = userOverviewSchema.parse(sample);
    expect(parsed.kycStatus).toBeNull();
    expect(parsed.recentTransactions).toHaveLength(2);
    expect(parsed.recentTransactions[1]?.counterparty ?? null).toBeNull();
  });
});

describe("resolveAccountSchema (GET /transactions/resolve/:acct)", () => {
  it("uses the backend key `accountName` (not `name`)", () => {
    const parsed = resolveAccountSchema.parse({
      accountNumber: "1000000002",
      accountName: "Bola",
    });
    expect(parsed.accountName).toBe("Bola");
    // The old `{ name }` shape must fail now.
    expect(resolveAccountSchema.safeParse({ accountNumber: "1000000002", name: "Bola" }).success)
      .toBe(false);
  });
});

describe("transactionPageSchema (GET /transactions/me)", () => {
  it("parses the `{ transactions }` envelope", () => {
    const parsed = transactionPageSchema.parse({
      transactions: [
        {
          id: "t1",
          type: "CREDIT",
          direction: "in",
          amount: "5000000",
          description: "x",
          counterparty: null,
          balanceAfter: "5000000",
          createdAt: "2026-06-24T08:21:48.095Z",
        },
      ],
    });
    expect(parsed.transactions).toHaveLength(1);
  });
});

describe("walletPageSchema (GET /wallets)", () => {
  it("parses the `{ wallets, pagination }` envelope", () => {
    const parsed = walletPageSchema.parse({
      wallets: [
        { id: "w1", userId: "u1", accountNumber: "1000000001", balance: "4800000" },
      ],
      pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });
    expect(parsed.wallets[0]?.balance).toBe("4800000");
  });
});

describe("counterparty name nullability", () => {
  it("accepts a null counterparty name", () => {
    const parsed = transactionEntrySchema.parse({
      id: "t",
      type: "CREDIT",
      direction: "in",
      amount: "100",
      description: "x",
      counterparty: { accountNumber: "1000000002", name: null },
      createdAt: "2026-06-24T08:21:48.095Z",
    });
    expect(parsed.counterparty?.name).toBeNull();
  });
});
