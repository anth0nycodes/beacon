"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Create a client instance that persists across renders
const queryClient = new QueryClient();

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
