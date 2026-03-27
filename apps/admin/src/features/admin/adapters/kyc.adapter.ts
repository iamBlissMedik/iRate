/**
 * KYC Data Adapter
 *
 * Transforms KYC data for admin UI consumption
 */

import { IKycDocument, KycStatus } from "../types/kyc.types";
import { formatDate } from "@/shared/utils/date.utils";

export interface KycDisplayData {
  id: string;
  userId: string;
  userEmail: string;
  documentType: string;
  status: string;
  statusBadge: "success" | "warning" | "error" | "default";
  reviewNote?: string;
  submittedDate: string;
  reviewedDate?: string;
  canReview: boolean;
}

export const adaptKycForDisplay = (kyc: IKycDocument): KycDisplayData => {
  const statusMap = {
    APPROVED: { label: "Approved", badge: "success" as const },
    PENDING: { label: "Pending Review", badge: "warning" as const },
    REJECTED: { label: "Rejected", badge: "error" as const },
    NOT_SUBMITTED: { label: "Not Submitted", badge: "default" as const },
  };

  const statusInfo = statusMap[kyc.status as KycStatus];

  return {
    id: kyc.id,
    userId: kyc.userId,
    userEmail: kyc.user?.email || "Unknown",
    documentType: kyc.documentType,
    status: statusInfo.label,
    statusBadge: statusInfo.badge,
    reviewNote: kyc.reviewNote,
    submittedDate: formatDate(kyc.createdAt),
    reviewedDate: kyc.reviewedAt ? formatDate(kyc.reviewedAt) : undefined,
    canReview: kyc.status === "PENDING",
  };
};

export const adaptKycListForDisplay = (kycs: IKycDocument[]) => {
  return kycs.map(adaptKycForDisplay);
};
