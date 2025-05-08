"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { getURL } from "@/utils/helpers";


export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
};

export const oAuthLogin = async (provider: Provider) => {
  if (!provider) return redirect("/login?error=No provider selected");

  const supabase = await createClient();
  const redirectUrl = getURL("/api/auth/callback");

  const { data,error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirectUrl },
  });
  if (error) {
    redirect("/login?error=Could not authenticate user");
  }

  return redirect(data.url);
};