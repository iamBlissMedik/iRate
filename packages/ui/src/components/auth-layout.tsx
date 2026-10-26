import type { ReactNode } from "react";
import { Logo } from "@irate/ui/components/logo";
import { ThemeToggle } from "@irate/ui/components/theme-toggle";
import { FadeIn } from "@irate/ui/motion";

/**
 * Split-screen layout for sign-in / sign-up pages: a brand panel on large
 * screens and a centred form column with the theme toggle.
 */
export function AuthLayout({
  title,
  description,
  tagline = "Money that moves at the speed of you.",
  children,
  footer,
}: {
  title: string;
  description?: string;
  /** Headline on the brand panel. */
  tagline?: string;
  children: ReactNode;
  /** Shown under the form, e.g. a link to the other auth page. */
  footer?: ReactNode;
}) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(60rem_40rem_at_top,white,transparent)]" />
        <Logo className="relative [&_span]:text-primary-foreground" />
        <div className="relative space-y-4">
          <h2 className="text-3xl leading-tight font-semibold">{tagline}</h2>
          <p className="max-w-sm text-primary-foreground/80">
            Send, receive, and track every naira with bank-grade security and a clear, real-time
            ledger.
          </p>
        </div>
        <p className="relative text-sm text-primary-foreground/70">
          © {new Date().getFullYear()} iRate
        </p>
      </section>

      <section className="flex flex-col">
        <header className="flex items-center justify-between p-6">
          <Logo className="lg:hidden" />
          <ThemeToggle className="ml-auto" />
        </header>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <FadeIn className="w-full max-w-sm space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
            </div>
            {children}
            {footer ? (
              <div className="text-center text-sm text-muted-foreground">{footer}</div>
            ) : null}
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
