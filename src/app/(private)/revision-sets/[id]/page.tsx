import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DocumentsViewer from "../DocumentsViewer";
import ToolsSidebar from "../ToolsSidebar";

const RevisionSetPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const supabase = await createClient();
  const { id } = await params;
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const { data: revisionSet, error } = await supabase
    .from("revision_sets")
    .select("user_id")
    .eq("id", id)
    .single();

  if (error || !revisionSet) {
    redirect("/revision-sets");
  }

  if (revisionSet.user_id !== userId) {
    redirect("/revision-sets");
  }

  return (
    <div className="flex flex-col md:flex-row">
      <DocumentsViewer id={id} />
      <ToolsSidebar />
    </div>
  );
};

export default RevisionSetPage;
