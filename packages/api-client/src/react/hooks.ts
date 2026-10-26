"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
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

/**
 * Sign out, then hard-navigate to the login page. The full reload drops every
 * piece of in-memory state (query cache included); it runs even if the logout
 * call fails, because the BFF clears its cookies regardless.
 */
export function useSignOut(loginPath = "/login") {
  return useMutation({
    mutationFn: () => api().auth.logout(),
    onSettled: () => window.location.assign(loginPath),
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

/* ----------------------------------------------------------- Transactions -- */

export function useTransactions() {
  return useQuery({
    queryKey: qk.transaction.me,
    queryFn: ({ signal }) => api().transaction.me({ signal }),
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
