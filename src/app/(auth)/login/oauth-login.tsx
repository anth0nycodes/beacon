"use client";

import { oAuthLogin } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Provider } from "@supabase/supabase-js";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type OAuthProvider = {
  name: Provider;
  displayName: string;
  icon: React.ReactNode;
};

export const OAuthButtons = () => {
  const oAuthProviders: OAuthProvider[] = [
    {
      name: "github",
      displayName: "GitHub",
      icon: <FaGithub className="size-5" />,
    },
    {
      name: "google",
      displayName: "Google",
      icon: <FcGoogle className="size-5" />,
    },
  ];

  return (
    <>
      {oAuthProviders.map((provider) => (
        <Button
          onClick={async () => await oAuthLogin(provider.name)}
          key={provider.name}
          variant="outline"
          className="flex items-center w-full justify-center gap-2"
        >
          {provider.icon} Continue with {provider.displayName}
        </Button>
      ))}
    </>
  );
};
