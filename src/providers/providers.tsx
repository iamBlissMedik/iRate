"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "react-hot-toast";
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
