import { describe, expect, it } from "vitest";
import {
  adminKycResponseSchema,
  adminOverviewSchema,
  adminUsersResponseSchema,
  adminWalletsBalanceSchema,
  creditWalletSchema,
  kycReviewSchema,
} from "../admin";

// Samples mirror the real irate-backend responses (after the BFF unwraps `data`).

describe("adminUsersResponseSchema", () => {
  it("parses the { users, pagination } shape with nested kyc + wallets", () => {
    const sample = {
      users: [
        {
          id: "u1",
          email: "ada@irate.dev",
          role: "USER",
          createdAt: "2026-06-01T00:00:00.000Z",
          kyc: { id: "k1", status: "VERIFIED", verifiedAt: "2026-06-02T00:00:00.000Z" },
          wallets: [{ id: "w1", balance: "4800000", createdAt: "2026-06-01T00:00:00.000Z" }],
        },
        { id: "u2", email: "no-kyc@irate.dev", role: "USER", kyc: null, wallets: [] },
      ],
      pagination: { total: 2, page: 1, limit: 10, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    };
    const parsed = adminUsersResponseSchema.parse(sample);
    expect(parsed.users[0]?.wallets[0]?.balance).toBe("4800000");
    expect(parsed.users[1]?.kyc).toBeNull();
  });
});

describe("kycReviewSchema", () => {
  it("accepts the backend { action } shape", () => {
    expect(kycReviewSchema.parse({ action: "APPROVE" }).action).toBe("APPROVE");
    expect(kycReviewSchema.safeParse({ action: "MAYBE" }).success).toBe(false);
    // The old { decision, reason } shape must no longer validate.
    expect(kycReviewSchema.safeParse({ decision: "VERIFIED" }).success).toBe(false);
  });
});

describe("creditWalletSchema", () => {
  it("requires a positive integer amount and a non-empty reason", () => {
    expect(creditWalletSchema.safeParse({ amount: 150000, reason: "Top-up" }).success).toBe(true);
    expect(creditWalletSchema.safeParse({ amount: 150000 }).success).toBe(false);
    expect(creditWalletSchema.safeParse({ amount: 150000, reason: "" }).success).toBe(false);
    expect(creditWalletSchema.safeParse({ amount: -1, reason: "x" }).success).toBe(false);
  });
});

describe("adminWalletsBalanceSchema", () => {
  it("parses the aggregate balance card", () => {
    const parsed = adminWalletsBalanceSchema.parse({
      title: "Total Wallet Balance",
      value: "62500000",
      currency: "NGN",
      wallets: 3,
      trend: 2.4,
      trendType: "up",
    });
    expect(parsed.value).toBe("62500000");
    expect(parsed.wallets).toBe(3);
  });
});

describe("adminOverviewSchema", () => {
  it("parses the nested overview (counts as numbers, money as strings)", () => {
    const sample = {
      usersStats: { title: "Total Users", value: 8, trend: 0, trendType: "neutral" },
      walletsBalance: { title: "Total Wallet Balance", value: "62500000", currency: "NGN", wallets: 3, trend: 2.4, trendType: "up" },
      transactionStats: { title: "Transactions", value: 12, trend: 1, trendType: "up" },
      totalCashflow: { title: "Total Cashflow", value: "100000", credit: "200000", debit: "100000", currency: "NGN" },
      transactionVolume: { title: "Transaction Volume", value: "250000", trend: -5, trendType: "down" },
    };
    const parsed = adminOverviewSchema.parse(sample);
    expect(parsed.usersStats.value).toBe(8);
    expect(parsed.walletsBalance.value).toBe("62500000");
  });
});

describe("adminKycResponseSchema", () => {
  it("parses the { kycs, pagination } shape with joined user", () => {
    const parsed = adminKycResponseSchema.parse({
      kycs: [
        {
          id: "k1",
          userId: "u1",
          fullName: "Ada Lovelace",
          dateOfBirth: "1990-01-01T00:00:00.000Z",
          address: "1 Yaba St",
          idType: "NIN",
          idNumber: "12345678901",
          documentUrl: null,
          status: "PENDING",
          createdAt: "2026-06-01T00:00:00.000Z",
          user: { id: "u1", email: "ada@irate.dev", role: "USER" },
        },
      ],
      pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });
    expect(parsed.kycs[0]?.user?.email).toBe("ada@irate.dev");
  });
});
