/**
 * Users Data Adapter
 *
 * Transforms user data for admin UI consumption
 */

import { IUserData } from "../types/users.types";
import { formatDate } from "@/shared/utils/date.utils";

export interface UserDisplayData {
  id: string;
  email: string;
  role: string;
  kycStatus: string;
  kycStatusBadge: "success" | "warning" | "error" | "default";
  joinedDate: string;
  lastUpdated: string;
}

export const adaptUserForDisplay = (user: IUserData): UserDisplayData => {
  const kycStatusMap = {
    APPROVED: { label: "Approved", badge: "success" as const },
    PENDING: { label: "Pending", badge: "warning" as const },
    REJECTED: { label: "Rejected", badge: "error" as const },
    NOT_SUBMITTED: { label: "Not Submitted", badge: "default" as const },
  };

  const kycInfo = kycStatusMap[user.kycStatus || "NOT_SUBMITTED"];

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    kycStatus: kycInfo.label,
    kycStatusBadge: kycInfo.badge,
    joinedDate: formatDate(user.createdAt),
    lastUpdated: formatDate(user.updatedAt),
  };
};

export const adaptUsersListForDisplay = (users: IUserData[]) => {
  return users.map(adaptUserForDisplay);
};
