import React from "react";
import PrivateHeader from "@/components/PrivateHeader";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ClientProviders } from "@/components/ClientProviders";
import PrivateDashboardLayout from "@/components/PrivateSidebar";

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
      <PrivateDashboardLayout>
        <div className="flex flex-col flex-1">
          <PrivateHeader />
          <main className="flex-1 py-4 md:py-6">{children}</main>
        </div>
      </PrivateDashboardLayout>
    </ClientProviders>
  );
};

export default PrivateLayout;
