import { redirect } from "next/navigation";
import React from "react";
import { ClientProviders } from "@/components/ClientProviders";
import PrivateHeader from "@/components/PrivateHeader";
import PrivateDashboardLayout from "@/components/PrivateSidebar";
import { createClient } from "@/utils/supabase/server";

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
        <div className="flex flex-col flex-1 h-full">
          <PrivateHeader />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </PrivateDashboardLayout>
    </ClientProviders>
  );
};

export default PrivateLayout;
