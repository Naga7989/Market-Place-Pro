"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Sync localStorage tokens to cookies on client mount to prevent middleware redirect loops
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        // Parse current cookies
        const cookies = document.cookie.split(";").reduce((acc, c) => {
          const [key, val] = c.trim().split("=");
          if (key) acc[key] = val || "";
          return acc;
        }, {} as Record<string, string>);

        if (!cookies["access_token"] || cookies["access_token"] !== token) {
          document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        }
      }
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
