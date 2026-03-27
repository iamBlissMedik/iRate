/**
 * Admin Users API
 *
 * API functions for user management
 */

import axios from "@/lib/axios";
import {
  IUsersListResponse,
  IUserStatsResponse,
} from "../../../types/users.types";

export interface IGetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: "USER" | "ADMIN";
  kycStatus?: "PENDING" | "APPROVED" | "REJECTED" | "NOT_SUBMITTED";
}

export const getAllUsers = async (params?: IGetUsersParams) => {
  const response = await axios.get<IUsersListResponse>("/admin/users", {
    params,
  });
  return response.data;
};

export const getUsersStats = async () => {
  const response = await axios.get<IUserStatsResponse>("/admin/users/stats");
  return response.data;
};
