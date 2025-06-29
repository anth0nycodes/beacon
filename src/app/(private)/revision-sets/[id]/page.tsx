import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DocumentsViewer } from "../DocumentsViewer";
import { ToolsSidebar } from "../ToolsSidebar";
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
    <ResizablePanelGroup
      className="!flex-col gap-6 lg:gap-0 lg:!flex-row"
      direction="horizontal"
    >
      <ResizablePanel
        className="!basis-auto lg:!basis-0"
        minSize={40}
        maxSize={80}
        defaultSize={50}
      >
        <DocumentsViewer id={id} />
      </ResizablePanel>
      <ResizableHandle className="mx-4 hidden lg:flex" withHandle />
      <ResizablePanel
        className="!basis-auto lg:!basis-0"
        minSize={35}
        maxSize={60}
        defaultSize={50}
      >
        <ToolsSidebar revisionSetId={id} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default RevisionSetPage;
