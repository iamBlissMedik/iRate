/**
 * Admin KYC Management Types
 *
 * Types for KYC verification and management
 */

export type KycStatus = "PENDING" | "APPROVED" | "REJECTED" | "NOT_SUBMITTED";

export interface IKycDocument {
  id: string;
  userId: string;
  documentType: string;
  documentUrl: string;
  status: KycStatus;
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface IKycListResponse {
  success: boolean;
  message: string;
  data: {
    kycs: IKycDocument[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface IKycReviewRequest {
  status: "APPROVED" | "REJECTED";
  reviewNote?: string;
}

export interface IKycReviewResponse {
  success: boolean;
  message: string;
  data: IKycDocument;
}
