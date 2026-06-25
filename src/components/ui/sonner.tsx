"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          fontFamily: "var(--font-sans)",
          borderRadius: "10px",
          border: "1px solid hsl(var(--border))",
          boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
        },
      }}
    />
  );
}
