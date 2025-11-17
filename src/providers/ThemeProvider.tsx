"use client";
import { ReactNode } from "react";
import { ThemeProvider  as Provider} from "next-themes";
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </Provider>
  );
};
