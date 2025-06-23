import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/server";
import React from "react";
import DocumentIframe from "./DocumentIframe";
import { ChevronDown, FileIcon, Plus } from "lucide-react";
import { TypographyBody, TypographyCaption } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Show first 3 documents as tabs, rest in dropdown
  const visibleDocuments = documents?.slice(0, 1) || [];
  const hiddenDocuments = documents?.slice(1) || [];
  const hasMoreDocuments = hiddenDocuments.length > 0;

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
            {visibleDocuments?.map((document) => (
              <TabsTrigger
                key={document.id}
                value={document.id}
                className="cursor-pointer"
              >
                <span className="flex items-center gap-2 max-w-[15ch] sm:max-w-[20ch]">
                  <FileIcon className="size-4" aria-hidden="true" />
                  <span className="truncate">{document.original_filename}</span>
                </span>
              </TabsTrigger>
            ))}
            {hasMoreDocuments && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="data-[state=active]:bg-background cursor-pointer dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                    <ChevronDown className="size-4" aria-hidden="true" />
                    <TypographyCaption>More Sources</TypographyCaption>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-fit p-2 max-h-40 overflow-y-auto"
                  align="end"
                >
                  <div className="flex flex-col gap-1">
                    {hiddenDocuments.map((document) => (
                      <TabsTrigger
                        key={document.id}
                        value={document.id}
                        className="justify-start h-8 text-sm"
                      >
                        <span className="flex items-center gap-2 max-w-[20ch]">
                          <FileIcon className="size-4" aria-hidden="true" />
                          <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                            {document.original_filename}
                          </span>
                        </span>
                      </TabsTrigger>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
