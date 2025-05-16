import { createClient } from "@/utils/supabase/server";
import React from "react";
import { redirect } from "next/navigation";
const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/revision-sets");
  }
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center w-full max-w-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
