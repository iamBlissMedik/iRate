"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type {
  AdminKycQuery,
  AdminUsersQuery,
  CreditWalletInput,
  KYCReviewInput,
  KYCSubmitInput,
  LoginInput,
  RegisterPayload,
  TransferInput,
} from "@irate/contracts";
import { getBrowserApi } from "../browser-client";
import { qk } from "../query-keys";

const api = () => getBrowserApi();

/* ------------------------------------------------------------------ Auth -- */

export function useSession() {
  return useQuery({
    queryKey: qk.session,
    queryFn: ({ signal }) => api().auth.session({ signal }),
    staleTime: 60_000,
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => api().auth.login(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.session }),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterPayload) => api().auth.register(input),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api().auth.logout(),
    onSuccess: () => qc.clear(),
  });
}

/* ------------------------------------------------------------------ User -- */

export function useUserOverview(enabled = true) {
  return useQuery({
    queryKey: qk.user.overview,
    queryFn: ({ signal }) => api().user.overview({ signal }),
    enabled,
  });
}

export function useMe(enabled = true) {
  return useQuery({
    queryKey: qk.user.me,
    queryFn: ({ signal }) => api().user.me({ signal }),
    enabled,
  });
}

/* ---------------------------------------------------------------- Wallet -- */

export function useWallets() {
  return useQuery({
    queryKey: qk.wallet.list,
    queryFn: ({ signal }) => api().wallet.list({ signal }),
  });
}

export function useWalletBalance(walletId: string | undefined) {
  return useQuery({
    queryKey: walletId ? qk.wallet.balance(walletId) : ["wallet", "balance", "none"],
    queryFn: ({ signal }) => api().wallet.balance(walletId!, { signal }),
    enabled: Boolean(walletId),
  });
}

/* ----------------------------------------------------------- Transactions -- */

export function useTransactions() {
  return useQuery({
    queryKey: qk.transaction.me,
    queryFn: ({ signal }) => api().transaction.me({ signal }),
  });
}

export function useWalletTransactions(
  walletId: string | undefined,
  page = 1,
  limit = 20,
) {
  return useQuery({
    queryKey: qk.transaction.forWallet(walletId ?? "none", page, limit),
    queryFn: ({ signal }) =>
      api().transaction.forWallet(walletId!, { page, limit }, { signal }),
    enabled: Boolean(walletId),
    placeholderData: keepPreviousData,
  });
}

/** Name enquiry — only fires for a complete 10-digit account number. */
export function useResolveAccount(accountNumber: string) {
  const valid = /^\d{10}$/.test(accountNumber);
  return useQuery({
    queryKey: qk.transaction.resolve(accountNumber),
    queryFn: ({ signal }) => api().transaction.resolve(accountNumber, { signal }),
    enabled: valid,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useTransfer() {
  const qc = useQueryClient();
  return useMutation({
    // The idempotency key is generated per-attempt unless one is passed.
    mutationFn: ({ input, idempotencyKey }: { input: TransferInput; idempotencyKey?: string }) =>
      api().transaction.transfer(input, idempotencyKey),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.transaction.all });
      qc.invalidateQueries({ queryKey: qk.wallet.all });
      qc.invalidateQueries({ queryKey: qk.user.overview });
    },
  });
}

/* ------------------------------------------------------------------- KYC -- */

export function useKycStatus() {
  return useQuery({
    queryKey: qk.kyc.status,
    queryFn: ({ signal }) => api().kyc.status({ signal }),
  });
}

export function useSubmitKyc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: KYCSubmitInput) => api().kyc.submit(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.kyc.all });
      qc.invalidateQueries({ queryKey: qk.user.overview });
    },
  });
}

/* ----------------------------------------------------------------- Admin -- */

export function useAdminOverview() {
  return useQuery({
    queryKey: qk.admin.overview,
    queryFn: ({ signal }) => api().admin.overview({ signal }),
  });
}

export function useAdminUserStats() {
  return useQuery({
    queryKey: qk.admin.userStats,
    queryFn: ({ signal }) => api().admin.userStats({ signal }),
  });
}

export function useAdminTotalBalance() {
  return useQuery({
    queryKey: qk.admin.walletsBalance,
    queryFn: ({ signal }) => api().admin.walletsBalance({ signal }),
  });
}

export function useAdminUsers(query: AdminUsersQuery) {
  return useQuery({
    queryKey: qk.admin.users(query),
    queryFn: ({ signal }) => api().admin.users(query, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminKyc(query: AdminKycQuery) {
  return useQuery({
    queryKey: qk.admin.kyc(query),
    queryFn: ({ signal }) => api().admin.kyc(query, { signal }),
    placeholderData: keepPreviousData,
  });
}

export function useCreditWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ walletId, input }: { walletId: string; input: CreditWalletInput }) =>
      api().admin.credit(walletId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.admin.all });
      qc.invalidateQueries({ queryKey: qk.wallet.all });
    },
  });
}

export function useReviewKyc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kycId, input }: { kycId: string; input: KYCReviewInput }) =>
      api().admin.reviewKyc(kycId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.admin.all }),
  });
}

/** Escape hatch for ad-hoc calls outside the predefined hooks. */
export { getBrowserApi } from "../browser-client";
