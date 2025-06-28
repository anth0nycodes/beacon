"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  TypographyBody,
  TypographyCaption,
  TypographyH5,
} from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FlashcardsComponent = ({ revisionSetId }: { revisionSetId: string }) => {
  const [revisionSetDocumentContent, setRevisionSetDocumentContent] = useState<
    string | null
  >(null);

  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

  const queryClient = useQueryClient();
  const supabase = createClient();

  function handleFlipFlashcard() {
    setIsFlashcardFlipped((prev) => !prev);
    setShowHint(false);
  }

  function handleShowHint() {
    setShowHint((prev) => !prev);
  }

  function handleNextFlashcard() {
    if (currentFlashcardIndex !== (flashcards?.length ?? 0) - 1) {
      setCurrentFlashcardIndex((prev) => prev + 1);
      setIsFlashcardFlipped(false);
      setShowHint(false); // Reset hint when changing cards
    }
  }

  function handlePreviousFlashcard() {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex((prev) => prev - 1);
      setIsFlashcardFlipped(false);
      setShowHint(false); // Reset hint when changing cards
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        handleNextFlashcard();
        break;
      case "ArrowLeft":
        e.preventDefault();
        handlePreviousFlashcard();
        break;
      case " ":
        e.preventDefault();
        handleFlipFlashcard();
        break;
    }
  }

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
          throw error;
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
    return (
      <div className="h-full flex flex-col justify-center gap-12">
        {/* Card Skeleton */}
        <div style={{ perspective: "1000px" }}>
          <div className="relative w-full h-56">
            <div className="absolute inset-0 flex flex-col">
              <Card className="flex-1 flex flex-col justify-center relative p-6">
                {/* Hint Button Skeleton */}
                <div className="absolute top-2 right-2">
                  <Skeleton className="h-8 w-16" />
                </div>

                {/* Question Skeleton */}
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                  </div>
                </div>

                {/* Bottom Text Skeleton */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <Skeleton className="h-4 w-48" />
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Navigation Skeleton */}
        <div className="flex justify-between w-full items-center">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    );
  }

  if (flashcardsError) {
    return <div>Error: {flashcardsError.message}</div>;
  }

  return (
    <div
      className="h-full flex flex-col justify-center gap-12 focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {flashcards
        ?.slice(currentFlashcardIndex, currentFlashcardIndex + 1)
        .map(
          (
            flashcard: Database["public"]["Tables"]["document_flashcards"]["Row"]
          ) => (
            <div style={{ perspective: "1000px" }} key={flashcard.id}>
              <motion.div
                className="relative w-full h-56 cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlashcardFlipped ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                onClick={handleFlipFlashcard}
              >
                {/* Front */}
                <Card
                  className="absolute inset-0 flex flex-col"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <CardContent className="flex-1 flex flex-col justify-center relative p-6">
                    <div className="text-center space-y-4">
                      <TypographyH5>{flashcard.question}</TypographyH5>
                      {showHint && flashcard.hint && (
                        <TypographyBody className="text-muted-foreground">
                          💡 {flashcard.hint}
                        </TypographyBody>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                      <TypographyCaption className="text-center text-muted-foreground">
                        Press <code>Spacebar</code> to flip, arrows to navigate
                      </TypographyCaption>
                    </div>
                  </CardContent>
                  {flashcard.hint && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowHint();
                      }}
                    >
                      <InfoIcon className="size-3 mr-1" />
                      <span className="text-xs">Hint</span>
                    </Button>
                  )}
                </Card>
                {/* Back */}
                <Card
                  className="absolute inset-0 flex flex-col"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <CardContent className="flex-1 flex flex-col justify-center relative p-6">
                    <div className="text-center">
                      <TypographyH5>{flashcard.answer}</TypographyH5>
                    </div>

                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                      <TypographyCaption className="text-center text-muted-foreground">
                        Press <code>Spacebar</code> to flip, arrows to navigate
                      </TypographyCaption>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )
        )}
      <div className="flex justify-between w-full items-center">
        <Button
          disabled={currentFlashcardIndex === 0}
          variant="outline"
          onClick={handlePreviousFlashcard}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <TypographyBody weight="medium">
          {currentFlashcardIndex + 1} / {flashcards?.length}
        </TypographyBody>
        <Button
          disabled={currentFlashcardIndex === (flashcards?.length ?? 0) - 1}
          variant="outline"
          onClick={handleNextFlashcard}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardsComponent;
