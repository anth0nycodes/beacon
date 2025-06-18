import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DocumentsViewer from "../DocumentsViewer";
import ToolsSidebar from "../ToolsSidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        className="flex-[5] overflow-auto"
        minSize={40}
        maxSize={80}
        defaultSize={50}
      >
        <DocumentsViewer id={id} />
      </ResizablePanel>
      <ResizableHandle className="mx-4" withHandle />
      <ResizablePanel
        className="flex-[5] overflow-auto"
        minSize={35}
        maxSize={60}
        defaultSize={50}
      >
        <ToolsSidebar />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default RevisionSetPage;
