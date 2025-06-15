import { redirect } from "next/navigation";
import React from "react";
import { createClient } from "@/utils/supabase/server";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  if (process.env.FLAG_SHOW_PRODUCTION_PAGE !== "true") {
    redirect("/");
  }

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
