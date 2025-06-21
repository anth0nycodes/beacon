"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ChevronsUpDown,
  FolderPlus,
  Folders,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Separator } from "./separator";
import { logout } from "@/actions/auth.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { BeaconIcon } from "@/svgs/project-icons";
import { createClient } from "@/utils/supabase/client";
import RecentSets from "@/app/(private)/revision-sets/RecentSets";

const supabase = createClient();

const generalItems = [
  {
    title: "All Revision Sets",
    url: "/revision-sets/all",
    icon: Folders,
  },
];

const toolItems = [
  {
    title: "Create Revision Set",
    url: "/revision-sets",
    icon: FolderPlus,
  },
];

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AppSidebar({ className, ...props }: AppSidebarProps) {
  const pathname = usePathname();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id;

      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }

      return data;
    },
  });

  // Determine which data source to use (database or OAuth)
  const displayName = userData?.name || "User";
  const displayEmail = userData?.email || "";
  const avatarUrl = userData?.avatar_url || null;
  const nameInitial = displayName ? displayName.charAt(0).toUpperCase() : "U";

  return (
    <Sidebar className={cn("border-r bg-gray-50/30", className)} {...props}>
      <SidebarContent className="p-2 justify-between flex flex-col">
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
                  <Label className="text-xs font-medium text-foreground/80 uppercase tracking-wider mb-2">
                    Overview
                  </Label>
                  {generalItems.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                      <div
                        key={item.title}
                        className={cn(
                          "mb-1 rounded-lg transition-colors",
                          isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "text-muted-foreground hover:bg-gray-100"
                        )}
                      >
                        <Link
                          key={item.title}
                          href={item.url}
                          className="text-sm p-2 rounded-md flex items-center gap-2"
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col">
                  <Label className="text-xs font-medium text-foreground/80 uppercase tracking-wider mb-2">
                    Tools
                  </Label>
                  {toolItems.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                      <div
                        key={item.title}
                        className={cn(
                          "mb-1 rounded-lg transition-colors",
                          isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "text-muted-foreground hover:bg-gray-100"
                        )}
                      >
                        <Link
                          key={item.title}
                          href={item.url}
                          className="text-sm p-2 rounded-md flex items-center gap-2"
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col">
                  <Label className="text-xs font-medium text-foreground/80 uppercase tracking-wider mb-2">
                    Recent Sets
                  </Label>
                  <RecentSets />
                </div>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile Section at bottom of sidebar */}
        <SidebarGroup>
          <Popover>
            <div className="mt-auto mb-2">
              <div className="rounded-lg duration-100">
                <PopoverTrigger className="w-full rounded-lg h-12 transition-colors hover:bg-primary/10 data-[state=open]:bg-primary/10 cursor-pointer">
                  <div className="flex items-center justify-start gap-4 w-full">
                    {isLoading ? (
                      <div className="flex items-center justify-evenly md:justify-evenly w-full">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="flex flex-col flex-grow text-left max-w-[140px]">
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="size-4" />
                      </div>
                    ) : (
                      <>
                        <Avatar className="border border-gray-500 size-8">
                          <AvatarImage src={avatarUrl || ""} />
                          <AvatarFallback className="bg-primary text-background">
                            {nameInitial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-grow text-left max-w-[140px]">
                          <span className="text-sm font-medium text-foreground truncate">
                            {displayName}
                          </span>
                          <span className="text-xs text-foreground/50 truncate">
                            {displayEmail}
                          </span>
                        </div>
                        <ChevronsUpDown className="size-4 text-muted-foreground" />
                      </>
                    )}
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
                <Link
                  href="/settings"
                  className="w-full flex items-center gap-1"
                >
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
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
