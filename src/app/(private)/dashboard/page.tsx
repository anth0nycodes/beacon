import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";

const page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName = user?.user_metadata?.full_name.split(" ")[0];

  return (
    <main>
      <h1>Hello {displayName}</h1>
    </main>
  );
};
export default page;
