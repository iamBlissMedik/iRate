import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Logo, ThemeToggle } from "@irate/ui";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel (desktop) */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(60rem_40rem_at_top,white,transparent)]" />
        <Logo className="relative text-primary-foreground [&_span]:text-primary-foreground" />
        <div className="relative space-y-4">
          <h1 className="text-3xl font-semibold leading-tight">
            Money that moves at the speed of you.
          </h1>
          <p className="max-w-sm text-primary-foreground/80">
            Send, receive, and track every naira with bank-grade security and a clear,
            real-time ledger.
          </p>
        </div>
        <p className="relative text-sm text-primary-foreground/70">
          © {new Date().getFullYear()} iRate
        </p>
      </section>

      {/* Form panel */}
      <section className="flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Logo className="lg:hidden" />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
              <p className="text-sm text-muted-foreground">
                Sign in to access your iRate wallet.
              </p>
            </div>
            <Suspense>
              <LoginForm />
            </Suspense>
            <p className="text-center text-sm text-muted-foreground">
              New to iRate?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
