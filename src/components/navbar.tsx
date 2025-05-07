import Link from "next/link";
import React from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { BeaconIcon } from "@/svgs/project-icons";

export const Navbar = async () => {
  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center md:hidden">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-medium text-primary font-secondary"
            >
              <BeaconIcon className="text-black dark:text-white size-6" />
              <p className="text-lg font-medium">Beacon</p>
            </Link>
          </div>

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
};
