import { z } from "zod";
import { IsoDateTime } from "./common";
import { KYCIdType, KYCStatus } from "./enums";

export const kycSubmitSchema = z.object({
  fullName: z.string().min(2, "Enter your full legal name").max(120),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}/, "Enter a valid date of birth"),
  address: z.string().min(5, "Enter your residential address").max(200),
  idType: KYCIdType,
  idNumber: z.string().min(4, "Enter a valid ID number").max(40),
  documentUrl: z.string().url("Must be a valid URL").optional(),
});
export type KYCSubmitInput = z.infer<typeof kycSubmitSchema>;

export const kycRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fullName: z.string(),
  dateOfBirth: IsoDateTime,
  address: z.string(),
  idType: z.string(),
  idNumber: z.string(),
  documentUrl: z.string().nullable().optional(),
  status: KYCStatus,
  verifiedAt: IsoDateTime.nullable().optional(),
  createdAt: IsoDateTime.optional(),
});
export type KYCRecord = z.infer<typeof kycRecordSchema>;

export const kycStatusSchema = z.object({
  status: KYCStatus,
  submittedAt: IsoDateTime.nullable().optional(),
  verifiedAt: IsoDateTime.nullable().optional(),
});
export type KYCStatusResult = z.infer<typeof kycStatusSchema>;

// Admin KYC review lives in `admin.ts` (backend expects `{ action }`).
