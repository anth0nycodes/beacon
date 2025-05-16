"use client";

import { useState, useEffect } from "react";
import {
  ChevronsUpDown,
  SettingsIcon,
  LogOutIcon,
  BookOpenCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./button";
import { logout } from "@/actions/auth.actions";
import { BeaconIcon } from "@/svgs/project-icons";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ThemeToggle } from "../theme-toggle";
import { Separator } from "./separator";

const supabase = createClient();

const items = [
  {
    title: "Revision Sets",
    url: "/revision-sets",
    icon: BookOpenCheck,
  },
];

export function AppSidebar() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userMeta, setUserMeta] = useState<{
    name?: string;
    email?: string;
    avatar_url?: string;
  } | null>(null);
  const pathname = usePathname();

  // Fetch user data on component mount
  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);

        // Extract metadata from OAuth provider
        const metadata = {
          name: user.user_metadata?.name || user.user_metadata?.full_name,
          email: user.email,
          avatar_url:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            user.user_metadata?.avatar,
        };

        setUserMeta(metadata);
      }
    };

    getUserInfo();
  }, []);

  const { data: userData } = useQuery(
    supabase
      .from("users")
      .select()
      .eq("user_id", userId as string)
      .single(),
    {
      enabled: !!userId, // Only run query when userId is available
    }
  );

  // Determine which data source to use (database or OAuth)
  const displayName = userData?.name || userMeta?.name || "User";
  const displayEmail = userData?.email || userMeta?.email || "";
  const avatarUrl = userMeta?.avatar_url || null;
  const nameInitial = displayName ? displayName.charAt(0).toUpperCase() : "U";

  const isLoading = !userId;

  return (
    <Sidebar className="border-r bg-gray-50/30">
      <SidebarContent className="p-2 flex flex-col">
        <SidebarGroup>
          <Label className="text-2xl font-medium text-primary font-secondary tracking-tight">
            <Link href="/" className="flex items-center mb-6">
              <BeaconIcon className="size-6 mr-2" />
              <p>Beacon</p>
            </Link>
          </Label>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Overview
                  </Label>
                  {items.map((item) => {
                    const isActive = pathname === item.url;

                    return (
                      <SidebarMenuItem
                        key={item.title}
                        className={cn(
                          "mb-1 rounded-lg transition-colors",
                          isActive ? "bg-primary/10" : "hover:bg-primary/10"
                        )}
                      >
                        <SidebarMenuButton asChild>
                          <Link
                            className={cn(
                              "flex items-center gap-3 p-2 font-medium",
                              isActive
                                ? "text-primary"
                                : "text-gray-700 hover:text-primary"
                            )}
                            href={item.url}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </div>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile Section at bottom of sidebar */}
        <Popover>
          <div className="mt-auto mb-2">
            <div className="rounded-lg duration-100">
              <PopoverTrigger className="w-full rounded-lg h-12 transition-colors hover:bg-primary/10 data-[state=open]:bg-primary/10 cursor-pointer">
                <div className="flex items-center justify-evenly md:justify-around w-full">
                  {isLoading ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : (
                    <Avatar className="border border-gray-500 h-8 w-8">
                      <AvatarImage src={avatarUrl || ""} />
                      <AvatarFallback className="bg-primary text-white">
                        {nameInitial}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col flex-grow text-left max-w-[140px]">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-foreground truncate overflow-hidden text-ellipsis">
                          {displayName}
                        </span>
                        <span className="text-xs text-foreground/50 truncate overflow-hidden text-ellipsis">
                          {displayEmail}
                        </span>
                      </>
                    )}
                  </div>
                  <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                </div>
              </PopoverTrigger>
            </div>
          </div>
          <PopoverContent
            className="w-[272px] md:w-59.5"
            side="top"
            align="start"
          >
            <div className="flex flex-col gap-4">
              <Link href="/settings" className="w-full flex items-center gap-1">
                <SettingsIcon className="size-4 mr-2" />
                Settings
              </Link>
              <ThemeToggle />
              <Separator className="" />
              <Button variant="outline" onClick={logout} className="w-full">
                <LogOutIcon className="size-4" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarContent>
    </Sidebar>
  );
}
