"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpenCheck,
  BookText,
  CreditCard,
  MessageCircle,
  PencilLine,
} from "lucide-react";

export const ToolsSidebar = () => {
  return (
    <Tabs defaultValue="chat">
      <TabsList className="inline-flex h-10 rounded-lg p-1 text-muted-foreground bg-primary/5 w-full max-w-full overflow-x-auto items-center justify-start relative">
        <TabsTrigger
          className="inline-flex items-center gap-2 px-3 py-1 cursor-pointer"
          value="chat"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          <span>Chat</span>
        </TabsTrigger>
        <TabsTrigger
          className="inline-flex items-center gap-2 px-3 py-1 cursor-pointer"
          value="summary"
        >
          <BookText className="size-4" aria-hidden="true" />
          <span>Summary</span>
        </TabsTrigger>
        <TabsTrigger
          className="cursor-pointer w-max flex gap-2"
          value="flashcards"
        >
          <CreditCard className="size-4" aria-hidden="true" />
          <span>Flashcards</span>
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer w-max flex gap-2" value="quiz">
          <BookOpenCheck className="size-4" aria-hidden="true" />
          <span>Quiz</span>
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer w-max flex gap-2" value="notes">
          <PencilLine className="size-4" aria-hidden="true" />
          <span>Notes</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="chat">Chat</TabsContent>
      <TabsContent value="summary">Summary</TabsContent>
      <TabsContent value="flashcards">Flashcards</TabsContent>
      <TabsContent value="quiz">Quiz</TabsContent>
      <TabsContent value="notes">Notes</TabsContent>
    </Tabs>
  );
};
