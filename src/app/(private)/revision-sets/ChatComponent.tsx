"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyBody } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/utils/supabase/client";
import { useChat } from "@ai-sdk/react";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export const ChatComponent = ({ revisionSetId }: { revisionSetId: string }) => {
  const [revisionSetDocumentContent, setRevisionSetDocumentContent] = useState<
    string | null
  >(null);
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const form = useForm();

  type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    revision_set_id: string;
  };

  // Query for documents
  const { data: revisionSetDocuments, error: documentsError } = useQuery({
    queryKey: ["revision-set-documents", revisionSetId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("documents")
        .select("content, original_filename")
        .eq("revision_set_id", revisionSetId);

      if (error) throw error;
      if (!data) throw new Error("Documents not found");
      return data;
    },
    enabled: !!revisionSetId,
  });

  // Query for chat history
  const { data: chatHistory, error: chatError } = useQuery({
    queryKey: ["chat-history", revisionSetId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("chat_logs")
        .select()
        .eq("revision_set_id", revisionSetId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!revisionSetId,
  });

  // Process data when both queries are successful
  useEffect(() => {
    if (revisionSetDocuments && chatHistory) {
      try {
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

        // Set initial messages
        const historyMessages = chatHistory.map((msg) => ({
          id: msg.id.toString(),
          role: msg.role,
          content: msg.content,
          revision_set_id: msg.revision_set_id,
        }));

        setInitialMessages(historyMessages);
      } catch (error) {
        console.error("Error processing data:", error);
        toast.error("Failed to process data");
      }
    }
  }, [revisionSetDocuments, chatHistory]);

  // Handle errors
  useEffect(() => {
    if (documentsError) {
      console.error("Error loading documents:", documentsError);
      toast.error("Failed to load documents");
    }
    if (chatError) {
      console.error("Error loading chat history:", chatError);
      toast.error("Failed to load chat history");
    }
  }, [documentsError, chatError]);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    body: {
      revisionSetId,
      revisionSetDocumentContent,
    },
    initialMessages,
  });

  const hasMessages = messages && messages.length > 0;

  function LoadingDots() {
    return (
      <div className="flex space-x-1 items-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
      </div>
    );
  }

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const isStreaming = status === "submitted" || status === "streaming";
  const isLoading = !revisionSetDocuments || !chatHistory;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingDots />
      </div>
    );
  }

  return (
    <Card className="w-full pb-0 md:h-[calc(100vh-142px)] h-full flex flex-col relative">
      <div
        id="message-container"
        className="flex-1 px-4 space-y-10 lg:space-y-4 overflow-y-auto overscroll-y-none flex flex-col"
      >
        {!hasMessages && (
          <div className="flex flex-col gap-2 items-center justify-center text-foreground italic h-full">
            <MessageCircle className="size-12" aria-hidden="true" />
            <TypographyBody className="text-foreground italic">
              Ask away, and start learning!
            </TypographyBody>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex w-full",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-md rounded-lg py-2 px-3 shadow-sm",
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black"
              )}
            >
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return message.role === "assistant" ? (
                      <div
                        key={`${message.id}-${i}`}
                        className="prose dark:prose-invert prose-sm max-w-none break-words"
                      >
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0 break-words">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc pl-4 mb-2 break-words">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-4 mb-2 break-words">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="mb-1 break-words">{children}</li>
                            ),
                            code: ({ children }) => (
                              <code className="bg-muted-foreground/15 rounded px-1 py-0.5 break-words block w-full overflow-x-auto">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div
                        key={`${message.id}-${i}`}
                        className="whitespace-pre-wrap break-words"
                      >
                        {part.text}
                      </div>
                    );
                }
              })}
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="flex justify-start w-full">
            <div className="max-w-[80%] rounded-lg py-2 px-3 shadow-sm bg-white dark:bg-gray-800">
              <LoadingDots />
            </div>
          </div>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="flex items-center px-4 border-t py-3"
        >
          <Input
            className="flex-1 p-2 rounded border border-zinc-300 dark:border-zinc-800 focus:outline-none focus:ring"
            value={input}
            placeholder="Type your question..."
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            disabled={isStreaming}
            className="ml-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Send
          </Button>
        </form>
      </Form>
    </Card>
  );
};
