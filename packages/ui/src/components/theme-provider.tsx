"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * App-wide UI provider, rendered once at the root of each app:
 * - light / dark / system theme via next-themes, which toggles the `.dark`
 *   class on <html> that the tokens in globals.css key off;
 * - Motion follows the OS "reduce motion" setting (movement is skipped,
 *   fades remain). CSS animations honour it in globals.css.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  );
}
