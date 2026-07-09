/**
 * Same-origin route map. In the browser, all calls go to the Next.js BFF:
 *  - `/api/auth/*`  → auth routes that manage httpOnly cookies (no token in JS)
 *  - `/api/v1/*`    → catch-all proxy that injects the access token server-side
 */
export const API_V1 = "/api/v1";
export const API_AUTH = "/api/auth";

export const routes = {
  auth: {
    login: `${API_AUTH}/login`,
    register: `${API_AUTH}/register`,
    logout: `${API_AUTH}/logout`,
    session: `${API_AUTH}/session`,
  },
  user: {
    me: `${API_V1}/users/me`,
    overview: `${API_V1}/users/me/overview`,
    byId: (userId: string) => `${API_V1}/users/${userId}`,
  },
  wallet: {
    list: `${API_V1}/wallets`,
    create: `${API_V1}/wallets`,
    balance: (walletId: string) => `${API_V1}/wallets/${walletId}/balance`,
  },
  transaction: {
    resolve: (accountNumber: string) => `${API_V1}/transactions/resolve/${accountNumber}`,
    transfer: `${API_V1}/transactions/transfer`,
    me: `${API_V1}/transactions/me`,
    forWallet: (walletId: string) => `${API_V1}/transactions/${walletId}/transactions`,
  },
  kyc: {
    submit: `${API_V1}/kyc/submit`,
    status: `${API_V1}/kyc/status`,
  },
  admin: {
    overview: `${API_V1}/admin/dashboard/overview`,
    me: `${API_V1}/admin/me`,
    users: `${API_V1}/admin/users`,
    userStats: `${API_V1}/admin/users/stats`,
    walletsBalance: `${API_V1}/admin/wallets/balance`,
    credit: (walletId: string) => `${API_V1}/admin/credit/${walletId}`,
    kyc: `${API_V1}/admin/kyc`,
    kycReview: (kycId: string) => `${API_V1}/admin/kyc/${kycId}/review`,
  },
} as const;
