import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/server";
import React from "react";
import DocumentIframe from "./DocumentIframe";
import { FileIcon } from "lucide-react";
import { TypographyBody } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export const DocumentsViewer = async ({ id }: { id: string }) => {
  const supabase = await createClient();

  const { data: documents, error } = await supabase
    .from("documents")
    .select()
    .eq("revision_set_id", id);

  if (error) {
    console.error("Error fetching documents:", error);
    return <div>Error fetching documents</div>;
  }

  const { data: revisionSet } = await supabase
    .from("revision_sets")
    .select("title, description, created_at")
    .eq("id", id)
    .single();

  return (
    <div className="flex flex-col gap-4 h-full">
      <div
        className={cn("flex flex-col", revisionSet?.description ? "gap-2" : "")}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{revisionSet?.title}</h2>
          <TypographyBody className="text-muted-foreground">
            {/* TODO: Add character limit for description in rename dialog */}
            {revisionSet?.description}
          </TypographyBody>
        </div>
        <p className="text-sm text-muted-foreground">
          Created on {new Date(revisionSet?.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex-1 flex flex-col h-full">
        <Tabs className="h-full" defaultValue={documents[0].id}>
          <TabsList className="inline-flex h-10 rounded-lg p-1 text-muted-foreground bg-primary/5 w-full max-w-full overflow-x-auto items-center justify-start relative">
            {documents?.map((document) => (
              <TabsTrigger
                key={document.id}
                value={document.id}
                className="cursor-pointer"
              >
                <span className="flex items-center gap-2 max-w-[20ch] sm:max-w-[25ch]">
                  <FileIcon className="size-4" aria-hidden="true" />
                  <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                    {document.original_filename}
                  </span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {documents.map((document) => (
            <TabsContent
              className="h-full"
              key={document.id}
              value={document.id}
            >
              <DocumentIframe
                url={document.ufs_url}
                title={document.original_filename}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
