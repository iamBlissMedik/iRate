import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Logo, ThemeToggle } from "@irate/ui";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="flex items-center justify-between p-6">
        <Logo />
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Create your iRate account</h1>
            <p className="text-sm text-muted-foreground">
              Get a wallet and account number in seconds.
            </p>
          </div>
          <Suspense>
            <RegisterForm />
          </Suspense>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
