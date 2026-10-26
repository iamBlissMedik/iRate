import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthLayout } from "@irate/ui";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to access your iRate wallet."
      footer={
        <>
          New to iRate?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {/* useSearchParams (return path, expiry notice) needs a Suspense boundary. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
