import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { IAuthUser, ILoginResponse } from "@/features/auth/types/auth.types";
import { login } from "@/features/auth/services/auth.api";

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
        if (!credentials?.email || !credentials.password) return null;

        try {
          const request = {
            email: credentials.email.toLowerCase(),
            password: credentials.password,
          };

          const res: ILoginResponse = await login(request);
          if (!res?.user || !res.accessToken) return null;

          const {
            user: { id, email, role },
            accessToken,
          } = res;

          // Only allow ADMIN
          if (role !== "ADMIN") {
            // Throw error that will be caught on frontend
            throw new Error("Only admins can log in");
          }

          const authUser: IAuthUser = { id, email, role, accessToken };
          return authUser;
        } catch (err) {
          if (axios.isAxiosError(err)) {
            throw new Error(err.response?.data?.message || "Login failed");
          }
          throw new Error(err instanceof Error ? err.message : "Login failed");
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
