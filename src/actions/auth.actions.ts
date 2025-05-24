"use server";

import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getURL } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login"); // Ensure to return the redirect to properly complete the request
};

export const oAuthLogin = async (provider: Provider) => {
  if (!provider) {
    return redirect("/login?error=No provider selected");
  }

  const supabase = await createClient();

  // Define the redirect URL based on the environment
  const redirectUrl = getURL("/api/auth/callback");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirectUrl },
  });

  // Handle any errors and provide proper redirection
  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  return redirect(data.url); // Ensure to return the redirect after a successful login
};
