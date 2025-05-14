"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-between space-x-2">
        <div className="w-full flex items-center gap-1">
          <Sun className="size-4 mr-2" />
          <span className="text-base">Light</span>
        </div>
        <Switch
          id="theme-mode"
          checked={false}
          className="transition-all duration-200 ease-in-out"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between space-x-2 transition-colors duration-200">
      <div className="w-full flex items-center gap-1">
        {theme === "light" ? (
          <>
            <Sun className="size-4 transition-transform mr-2 duration-200" />
            <span className="text-base">Light</span>
          </>
        ) : (
          <>
            <Moon className="size-4 transition-transform mr-2 duration-200" />
            <span className="text-base">Dark</span>
          </>
        )}
      </div>
      <Switch
        id="theme-mode"
        checked={theme === "dark"}
        onCheckedChange={handleThemeChange}
        className="transition-all duration-200 ease-in-out"
      />
    </div>
  );
}
