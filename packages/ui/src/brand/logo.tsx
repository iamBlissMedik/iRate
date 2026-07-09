import { cn } from "../lib/cn";

/** iRate wordmark + glyph. `variant` controls whether the wordmark shows. */
export function Logo({
  className,
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "mark";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
          <path
            d="M12 3v18M7 8c0-1.7 2.2-3 5-3s5 1.3 5 3-2.2 3-5 3-5 1.3-5 3 2.2 3 5 3 5-1.3 5-3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {variant === "full" ? (
        <span className="text-lg tracking-tight">
          i<span className="text-primary">Rate</span>
        </span>
      ) : null}
    </span>
  );
}
