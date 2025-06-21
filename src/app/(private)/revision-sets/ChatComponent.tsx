"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyBody } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/utils/supabase/client";
import { useChat } from "@ai-sdk/react";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";

export const ChatComponent = ({ revisionSetId }: { revisionSetId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [revisionSetDocumentContent, setRevisionSetDocumentContent] = useState<
    string | null
  >(null);
  const [revisionSetDocumentName, setRevisionSetDocumentName] =
    useState<string>("");
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const form = useForm();
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    body: {
      revisionSetId,
      revisionSetDocumentContent,
    },
    initialMessages,
  });

  const hasMessages = messages && messages.length > 0;

  type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    revision_set_id: string;
  };

  function LoadingDots() {
    return (
      <div className="flex space-x-1 items-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
      </div>
    );
  }
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  useEffect(() => {
    const loadFileAndHistory = async () => {
      try {
        const supabase = createClient();

        // Load the document for this revision set
        const { data: revisionSetDocuments, error: documentsError } =
          await supabase
            .from("documents")
            .select()
            .eq("revision_set_id", revisionSetId);

        if (documentsError) throw documentsError;
        if (!revisionSetDocuments) throw new Error("File not found");

        setRevisionSetDocumentName(
          revisionSetDocuments.map((doc) => doc.original_filename).join(", ")
        );
        setRevisionSetDocumentContent(
          revisionSetDocuments
            .map(
              (doc, idx) =>
                `---\nDocument ${idx + 1}: ${doc.original_filename}\n---\n${
                  doc.content
                }`
            )
            .join("\n\n")
        );

        // Load chat history
        const { data: chatHistory, error: chatError } = await supabase
          .from("chat_logs")
          .select()
          .eq("revision_set_id", revisionSetId)
          .order("created_at", { ascending: true });

        if (chatError) throw chatError;

        // Map chat history to ChatMessage[]
        const historyMessages = chatHistory.map((msg) => ({
          id: msg.id.toString(),
          role: msg.role,
          content: msg.content,
          revision_set_id: msg.revision_set_id,
        }));

        setInitialMessages(historyMessages);
      } catch (error) {
        console.error("Error loading file or chat history:", error);
        toast.error("Failed to load file or chat history");
      } finally {
        setIsLoading(false);
      }
    };

    loadFileAndHistory();
  }, [revisionSetId, router]);

  const isStreaming = status === "submitted" || status === "streaming";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingDots />
      </div>
    );
  }

  return (
    <Card className="w-full pb-0 md:h-[calc(100vh-142px)] h-full flex flex-col relative">
      <div className="flex-1 px-4 space-y-10 lg:space-y-4 overflow-y-auto overscroll-y-none flex flex-col">
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
        <div ref={messagesEndRef} />
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
            disabled={isStreaming}
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
