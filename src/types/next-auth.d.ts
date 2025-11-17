import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      email?: string | null;
      role?: "USER" | "ADMIN" | null;
      accessToken?: string | null;
    } & DefaultSession["user"];
  }
}
