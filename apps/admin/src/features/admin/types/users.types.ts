/**
 * Admin Users Management Types
 *
 * Types for managing users in admin panel
 */

export interface IUserData {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  kycStatus?: "PENDING" | "APPROVED" | "REJECTED" | "NOT_SUBMITTED";
}

export interface IUsersListResponse {
  success: boolean;
  message: string;
  data: {
    users: IUserData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface IUserStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    activeUsers: number;
    pendingKyc: number;
    approvedKyc: number;
    rejectedKyc: number;
  };
}
