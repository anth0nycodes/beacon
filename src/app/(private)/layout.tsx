import React from "react";
import PrivateSidebar from "@/components/PrivateSidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ClientProviders } from "@/components/ClientProviders";

const PrivateLayout = async ({ children }: { children: React.ReactNode }) => {
  // Server component - can use await directly
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ClientProviders>
      <main className="w-full h-full">
        <PrivateSidebar>{children}</PrivateSidebar>
      </main>
    </ClientProviders>
  );
};

export default PrivateLayout;
