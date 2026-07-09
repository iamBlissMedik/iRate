import type {
  AdminKycQuery,
  AdminKycResponse,
  AdminKycRow,
  AdminOverview,
  AdminUsersQuery,
  AdminUsersResponse,
  AdminUserStats,
  AdminWalletsBalance,
  CreditResult,
  CreditWalletInput,
  KYCRecord,
  KYCReviewInput,
  KYCSubmitInput,
  LoginInput,
  LoginResult,
  RegisterPayload,
  RegisterResult,
  ResolvedAccount,
  Session,
  TransactionPage,
  TransferInput,
  TransferResult,
  User,
  UserOverview,
  Wallet,
  WalletBalance,
  WalletPage,
} from "@irate/contracts";
import {
  adminKycResponseSchema,
  adminOverviewSchema,
  adminUsersResponseSchema,
  adminUserStatsSchema,
  adminWalletsBalanceSchema,
  kycRecordSchema,
  resolveAccountSchema,
  sessionSchema,
  transactionPageSchema,
  userOverviewSchema,
  userSchema,
  walletPageSchema,
} from "@irate/contracts";
import type { HttpClient, HttpRequestOptions } from "./http";
import { ApiError } from "./errors";
import { routes } from "./routes";

type Opts = Pick<HttpRequestOptions, "signal">;

/**
 * Typed endpoint surface over an {@link HttpClient}. Every method maps 1:1 to a
 * backend route (via the BFF) and returns the unwrapped `data` payload.
 */
export function createApi(client: HttpClient) {
  return {
    auth: {
      login: (input: LoginInput, opts?: Opts) =>
        client.post<LoginResult>(routes.auth.login, input, opts),
      register: (input: RegisterPayload, opts?: Opts) =>
        client.post<RegisterResult>(routes.auth.register, input, opts),
      logout: (opts?: Opts) => client.post<void>(routes.auth.logout, undefined, opts),
      session: (opts?: Opts) =>
        client.get<Session>(routes.auth.session, { schema: sessionSchema, ...opts }),
    },

    user: {
      me: (opts?: Opts) => client.get<User>(routes.user.me, { schema: userSchema, ...opts }),
      overview: (opts?: Opts) =>
        client.get<UserOverview>(routes.user.overview, {
          schema: userOverviewSchema,
          ...opts,
        }),
      byId: (userId: string, opts?: Opts) =>
        client.get<User>(routes.user.byId(userId), { schema: userSchema, ...opts }),
    },

    wallet: {
      // Backend returns `{ wallets, pagination }`; validate, then unwrap to the array.
      list: (opts?: Opts) =>
        client
          .get<WalletPage>(routes.wallet.list, { schema: walletPageSchema, ...opts })
          .then((r) => r.wallets ?? []),
      create: (opts?: Opts) => client.post<Wallet>(routes.wallet.create, {}, opts),
      balance: (walletId: string, opts?: Opts) =>
        client.get<WalletBalance>(routes.wallet.balance(walletId), opts),
    },

    transaction: {
      resolve: (accountNumber: string, opts?: Opts) =>
        client.get<ResolvedAccount>(routes.transaction.resolve(accountNumber), {
          schema: resolveAccountSchema,
          ...opts,
        }),
      transfer: (input: TransferInput, idempotencyKey?: string) =>
        client.post<TransferResult>(routes.transaction.transfer, input, {
          idempotencyKey,
        }),
      // Backend returns `{ transactions, pagination }`; validate, then unwrap.
      me: (opts?: Opts) =>
        client
          .get<TransactionPage>(routes.transaction.me, {
            schema: transactionPageSchema,
            ...opts,
          })
          .then((r) => r.transactions ?? []),
      forWallet: (
        walletId: string,
        query: { page?: number; limit?: number } = {},
        opts?: Opts,
      ) =>
        client.get<TransactionPage>(routes.transaction.forWallet(walletId), {
          params: query,
          schema: transactionPageSchema,
          ...opts,
        }),
    },

    kyc: {
      submit: (input: KYCSubmitInput, opts?: Opts) =>
        client.post<KYCRecord>(routes.kyc.submit, input, opts),
      // `/kyc/status` 404s when the user has no KYC record — treat as `null`.
      status: (opts?: Opts) =>
        client
          .get<KYCRecord>(routes.kyc.status, { schema: kycRecordSchema, ...opts })
          .catch((err) => {
            if (err instanceof ApiError && err.status === 404) return null;
            throw err;
          }),
    },

    admin: {
      overview: (opts?: Opts) =>
        client.get<AdminOverview>(routes.admin.overview, {
          schema: adminOverviewSchema,
          ...opts,
        }),
      me: (opts?: Opts) => client.get<User>(routes.admin.me, { schema: userSchema, ...opts }),
      users: (query: AdminUsersQuery, opts?: Opts) =>
        client.get<AdminUsersResponse>(routes.admin.users, {
          params: query,
          schema: adminUsersResponseSchema,
          ...opts,
        }),
      userStats: (opts?: Opts) =>
        client.get<AdminUserStats>(routes.admin.userStats, {
          schema: adminUserStatsSchema,
          ...opts,
        }),
      walletsBalance: (opts?: Opts) =>
        client.get<AdminWalletsBalance>(routes.admin.walletsBalance, {
          schema: adminWalletsBalanceSchema,
          ...opts,
        }),
      credit: (walletId: string, input: CreditWalletInput) =>
        client.post<CreditResult>(routes.admin.credit(walletId), input),
      kyc: (query: AdminKycQuery, opts?: Opts) =>
        client.get<AdminKycResponse>(routes.admin.kyc, {
          params: query,
          schema: adminKycResponseSchema,
          ...opts,
        }),
      reviewKyc: (kycId: string, input: KYCReviewInput) =>
        client.patch<AdminKycRow>(routes.admin.kycReview(kycId), input),
    },
  };
}

export type IrateApi = ReturnType<typeof createApi>;
