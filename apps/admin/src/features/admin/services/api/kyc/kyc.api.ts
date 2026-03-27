/**
 * Admin KYC API
 *
 * API functions for KYC verification and management
 */

import axios from "@/lib/axios";
import {
  IKycListResponse,
  IKycReviewRequest,
  IKycReviewResponse,
} from "../../../types/kyc.types";

export interface IGetKycsParams {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}

export const getAllKycs = async (params?: IGetKycsParams) => {
  const response = await axios.get<IKycListResponse>("/admin/kyc", {
    params,
  });
  return response.data;
};

export const reviewKyc = async (kycId: string, data: IKycReviewRequest) => {
  const response = await axios.patch<IKycReviewResponse>(
    `/admin/kyc/${kycId}/review`,
    data,
  );
  return response.data;
};
