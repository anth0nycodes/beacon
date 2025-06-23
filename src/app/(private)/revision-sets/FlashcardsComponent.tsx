"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FlashcardsComponent = ({ revisionSetId }: { revisionSetId: string }) => {
  const [revisionSetDocumentContent, setRevisionSetDocumentContent] = useState<
    string | null
  >(null);

  const queryClient = useQueryClient();
  const supabase = createClient();

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
    data: flashcards,
    error: flashcardsError,
    isLoading,
  } = useQuery({
    queryKey: ["flashcards", revisionSetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_flashcards")
        .select("*")
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

  const { mutate: createFlashcards, isPending: isCreatingFlashcards } =
    useMutation({
      mutationFn: async () => {
        if (!revisionSetDocumentContent) {
          toast.error("Document content is not available yet.");
          return;
        }
        try {
          const response = await fetch("/api/create-flashcards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              revisionSetId,
              revisionSetDocumentContent,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create flashcards");
          }
        } catch (error) {
          console.error("Error creating flashcards:", error);
          toast.error("Failed to create flashcards");
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["flashcards", revisionSetId],
        });
        toast.success("Flashcards created successfully");
      },
    });

  useEffect(() => {
    if (
      revisionSetDocumentContent &&
      flashcards?.length === 0 &&
      !isCreatingFlashcards
    ) {
      createFlashcards();
    }
  }, [
    revisionSetDocumentContent,
    flashcards,
    isCreatingFlashcards,
    createFlashcards,
  ]);

  if (isLoading || isCreatingFlashcards) {
    return <div>Loading and creating flashcards...</div>;
  }

  if (flashcardsError) {
    return <div>Error: {flashcardsError.message}</div>;
  }

  return (
    <div className="flex flex-col max-h-100 overflow-y-scroll gap-12">
      {flashcards?.map(
        (
          flashcard: Database["public"]["Tables"]["document_flashcards"]["Row"]
        ) => (
          <Card key={flashcard.id}>
            <CardHeader>
              <CardTitle>{flashcard.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{flashcard.answer}</p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default FlashcardsComponent;
