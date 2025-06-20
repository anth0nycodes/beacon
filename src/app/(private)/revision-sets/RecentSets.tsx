"use client";

import { createClient } from "@/utils/supabase/client";
import { FileIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

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

  const [revisionSets, setRevisionSets] = useState<RevisionSet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentSets = async () => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { data, error } = await supabase
      .from("revision_sets")
      .select()
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching revision sets:", error);
      return;
    }

    setRevisionSets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecentSets();
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    );
  }

  if (revisionSets.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No revision sets found. Start by creating a new revision set.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {revisionSets?.map((revisionSet) => {
        const isActive = pathname === `/revision-sets/${revisionSet.id}`;
        return (
          <Link
            key={revisionSet.id}
            href={`/revision-sets/${revisionSet.id}`}
            className={`text-sm p-2 rounded-md flex items-center gap-2
              ${
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-gray-500 hover:bg-gray-100"
              }
            `}
          >
            <FileIcon className="w-4 h-4" aria-hidden="true" />
            <p>{revisionSet.title}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default RecentSets;
