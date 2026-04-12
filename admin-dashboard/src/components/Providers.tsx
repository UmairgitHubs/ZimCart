"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ComponentType } from "react";

import { AuthProvider } from "./auth/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  /** Load after hydration so devtools never appear in the SSR/CSR first paint tree. */
  const [Devtools, setDevtools] = useState<ComponentType<{ initialIsOpen?: boolean }> | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    let cancelled = false;
    void import("@tanstack/react-query-devtools").then((mod) => {
      if (!cancelled) setDevtools(() => mod.ReactQueryDevtools);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>{children}</AuthProvider>
      </Provider>
      {Devtools ? <Devtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
