import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { IAuthUser, ILoginResponse } from "@/types/auth.types";
import { login } from "@/services/auth.service";
import { use } from "react";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const request = {
            email: credentials.email.toLowerCase(),
            password: credentials.password,
          };

          const res: ILoginResponse = await login(request);
          if (!res) return null;
          const {
            user: { email, id, role },
            accessToken,
          } = res;
          const user: IAuthUser = {
            id,
            email,
            accessToken,
            role,
          };
          return user;
        } catch (err) {
          if (axios.isAxiosError(err)) {
            throw new Error(
              err.response?.data?.message || "An error occurred during login"
            );
          } else if (err instanceof Error) {
            throw new Error(err.message || "An error occurred during login");
          } else {
            throw new Error("An error occurred during login");
          }
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60, updateAge: 15 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      const user = token.user as IAuthUser | undefined;
      session.user = {
        email: user?.email ?? null,
        accessToken: user?.accessToken ?? null,
        id: user?.id ?? null,
        role: user?.role ?? null,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
