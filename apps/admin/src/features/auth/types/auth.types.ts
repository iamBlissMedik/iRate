import { signInSchema } from "@/lib/validators/authSchemas";
import z from "zod";

// interface Admin {
//   _id: string;
//   name: string;
//   email: string;
// }

export type ILoginRequest = z.infer<typeof signInSchema>;

export interface ILoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
  };
}

export interface IAuthUser {
  id: string;
  email: string;
  accessToken: string;
  role: "USER" | "ADMIN";
}
