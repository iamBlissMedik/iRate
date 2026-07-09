import { z } from "zod";
import { UserRole } from "./enums";
import { IsoDateTime } from "./common";

/** Strong password policy for a fintech app: 8+ chars, upper, lower, digit. */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[0-9]/, "Must include a number");

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .transform((v) => v.trim().toLowerCase());

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

/** Payload actually sent to the backend (confirmPassword stripped). */
export const registerPayloadSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type RegisterPayload = z.infer<typeof registerPayloadSchema>;

export const authUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: UserRole,
  createdAt: IsoDateTime.optional(),
});
export type AuthUser = z.infer<typeof authUserSchema>;

/** Login/refresh responses expose the access token to the BFF, never the browser. */
export const authTokensSchema = z.object({
  accessToken: z.string(),
});
export type AuthTokens = z.infer<typeof authTokensSchema>;

export const loginResultSchema = z.object({
  accessToken: z.string(),
  user: authUserSchema.optional(),
});
export type LoginResult = z.infer<typeof loginResultSchema>;

export const registerResultSchema = z.object({
  user: authUserSchema.optional(),
  accountNumber: z.string().optional(),
});
export type RegisterResult = z.infer<typeof registerResultSchema>;

/** Browser-facing session shape returned by the BFF `/api/auth/session` route. */
export const sessionSchema = z.object({
  authenticated: z.boolean(),
  user: authUserSchema.nullable(),
});
export type Session = z.infer<typeof sessionSchema>;
