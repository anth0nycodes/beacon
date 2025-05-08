"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { OAuthButtons } from "./oauth-login";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error");

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-max gap-8 px-4">
        <div className="mt-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-center">Log in to Beacon</h1>
            <OAuthButtons />
            {errorMessage && (
              <p className="text-center text-sm text-destructive">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
