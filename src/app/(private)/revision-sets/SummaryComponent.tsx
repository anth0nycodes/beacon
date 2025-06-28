import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const SummaryComponent = ({ revisionSetId }: { revisionSetId: string }) => {
  const [revisionSetDocumentContent, setRevisionSetDocumentContent] = useState<
    string | null
  >(null);
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: revisionSetDocuments, error: revisionSetDocumentsError } =
    useQuery({
      queryKey: ["revision-set-documents", revisionSetId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("documents")
          .select("content, original_filename")
          .eq("revision_set_id", revisionSetId);
        if (error) {
          throw error;
        }
        return data;
      },
    });

  const {
    data: summary,
    error: summaryError,
    isLoading,
  } = useQuery({
    queryKey: ["summary", revisionSetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_summaries")
        .select("summary_text")
        .eq("revision_set_id", revisionSetId);
      if (error) {
        throw error;
      }
      return data;
    },
  });

  useEffect(() => {
    if (revisionSetDocuments) {
      setRevisionSetDocumentContent(
        revisionSetDocuments
          .map(
            (doc, idx) =>
              `Document ${idx + 1}: ${doc.original_filename}\n\n
              --------------------------------
              Document Content:
              ${doc.content}`
          )
          .join("\n\n")
      );
    }
  }, [revisionSetDocuments]);

  const { mutate: generateSummary, isPending: isGeneratingSummary } =
    // TODO: figure out why this is being called twice
    useMutation({
      mutationFn: async () => {
        try {
          const response = await fetch("/api/generate-summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ revisionSetId, revisionSetDocumentContent }),
          });
          if (!response.ok) {
            throw new Error("Failed to generate summary");
          }
        } catch (error) {
          console.error("Error generating summary:", error);
          toast.error("Failed to generate summary");
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["summary", revisionSetId],
        });
        toast.success("Summary generated successfully!");
      },
    });

  const handleRegenerateSummary = () => {
    generateSummary();
  };

  useEffect(() => {
    if (
      revisionSetDocumentContent &&
      summary?.length === 0 &&
      !isGeneratingSummary
    ) {
      generateSummary();
    }
  }, [
    revisionSetDocumentContent,
    summary,
    isGeneratingSummary,
    generateSummary,
  ]);

  if (isGeneratingSummary || isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (summaryError) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <p className="text-destructive">Error: {summaryError.message}</p>
            <Button onClick={handleRegenerateSummary} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summaryText = summary?.[0]?.summary_text;

  return (
    <Card className="w-full md:h-[calc(100vh-142px)] py-0 h-full flex flex-col">
      <CardContent className="flex-1 overflow-y-auto">
        {summaryText && (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold mb-3 mt-6 text-foreground border-b border-border pb-1">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold mb-2 mt-4 text-foreground">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-3 text-muted-foreground leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-muted-foreground">{children}</li>
                ),
                code: ({ children }) => (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground bg-muted/30 py-2">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
              }}
            >
              {summaryText}
            </ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryComponent;
