"use client";

import { createClient } from "@/utils/supabase/client";
import { Folder } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface RevisionSet {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const RecentSets = () => {
  const supabase = createClient();
  const pathname = usePathname();

  const { data: revisionSets, isLoading } = useQuery({
    queryKey: ["recent-revision-sets"],
    queryFn: async () => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const { data, error } = await supabase
        .from("revision_sets")
        .select()
        .eq("user_id", userId)
        .limit(8)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching revision sets:", error);
        return;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-9" />
        <Skeleton className="w-full h-9" />
        <Skeleton className="w-full h-9" />
        <Skeleton className="w-full h-9" />
        <Skeleton className="w-full h-9" />
        <Skeleton className="w-full h-9" />
        <Skeleton className="w-full h-9" />
        <Skeleton className="w-full h-9" />
      </div>
    );
  }

  if (revisionSets?.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No revision sets found. Start by creating a new revision set.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {revisionSets?.map((revisionSet: RevisionSet) => {
        const isActive = pathname === `/revision-sets/${revisionSet.id}`;
        return (
          <Link
            key={revisionSet.id}
            href={`/revision-sets/${revisionSet.id}`}
            className={`text-sm p-2 rounded-md flex items-center gap-2
              ${
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-muted-foreground hover:bg-gray-100"
              }
            `}
          >
            <Folder className="size-4" aria-hidden="true" />
            <p className="truncate max-w-[20ch]">{revisionSet.title}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default RecentSets;
