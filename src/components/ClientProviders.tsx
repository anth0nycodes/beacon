"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Create a client instance that persists across renders
const queryClient = new QueryClient();

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
