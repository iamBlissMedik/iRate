import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@irate/ui";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthLayout
      title="Admin sign in"
      description="Restricted to iRate administrators."
      tagline="Keep the ledger honest."
    >
      {/* useSearchParams (return path, notices) needs a Suspense boundary. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
