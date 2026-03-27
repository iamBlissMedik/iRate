/**
 * Admin Data Adapter
 *
 * Transforms admin data for UI consumption
 */

import { IAdminData, IAdminProfile } from "../types/admin.types";
import { formatDate } from "@/shared/utils/date.utils";

export interface AdminProfileDisplay {
  id: string;
  email: string;
  role: string;
  memberSince: string;
  formattedDate: string;
}

export const adaptAdminToDisplay = (admin: IAdminData): AdminProfileDisplay => {
  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    memberSince: formatDate(admin.createdAt),
    formattedDate: new Date(admin.createdAt).toLocaleDateString(),
  };
};

export const adaptAdminProfile = (admin: IAdminProfile) => {
  return {
    ...admin,
    formattedDate: formatDate(admin.createdAt),
    walletsCount: admin.wallets?.length || 0,
    transactionsCount: admin.transactions?.length || 0,
  };
};
