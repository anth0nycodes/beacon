"use client";

import React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { BeaconIcon } from "@/svgs/project-icons";

const DesktopNavbar = () => {
  return (
    <nav className="hidden font-secondary md:flex justify-between items-center p-4 container mx-auto">
      <div>
        <Link href="/" className="flex items-center gap-2 text-2xl font-medium">
          <BeaconIcon className="text-black dark:text-white size-6" />
          <p className="text-lg font-medium">Beacon</p>
        </Link>
      </div>

      <div>
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <Button asChild variant="ghost">
                <Link href="/pricing">Pricing</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild>
                <Link href="/login">Get started</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default DesktopNavbar;
