"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { BeaconIcon } from "@/svgs/project-icons";

const MobileNavbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex font-secondary md:hidden items-center">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-transparent">
            <MenuIcon className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0 font-secondary">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 py-5">
              <SheetTitle className="flex items-center gap-2 text-2xl font-medium">
                <BeaconIcon className="text-black dark:text-white size-6" />
                <p className="text-lg font-medium">Beacon</p>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex-1 overflow-y-auto">
              <div className="space-y-px">
                <Button
                  variant="ghost"
                  className="flex w-full items-center gap-3 justify-start px-4 py-3 rounded-none text-md font-medium"
                  asChild
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Link href="/">
                    <span>Home</span>
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="flex w-full items-center gap-3 justify-start px-4 py-3 rounded-none text-md font-medium"
                  asChild
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Link href="/pricing">
                    <span>Pricing</span>
                  </Link>
                </Button>
              </div>
            </nav>

            <div className="p-4 mt-auto">
              {user ? (
                <div className="space-y-2">
                  <Link href="/revision-sets" className="w-full block">
                    <Button className="w-full" onClick={() => setShowMobileMenu(false)}>
                      Revise
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button className="w-full" onClick={() => setShowMobileMenu(false)} asChild>
                  <Link href="/login">Get started</Link>
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
