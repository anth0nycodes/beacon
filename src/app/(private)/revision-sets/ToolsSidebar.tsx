"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpenCheck,
  BookText,
  CreditCard,
  MessageCircle,
  PencilLine,
} from "lucide-react";
import { ChatComponent } from "./ChatComponent";
import { TypographyCaption } from "@/components/ui/typography";

export const ToolsSidebar = ({ revisionSetId }: { revisionSetId: string }) => {
  return (
    <Tabs className="h-full overflow-y-scroll" defaultValue="chat">
      <TabsList className="inline-flex h-10 rounded-lg p-1 text-muted-foreground bg-primary/5 w-full max-w-full overflow-x-auto items-center justify-start relative">
        <TabsTrigger
          className="inline-flex items-center gap-2 px-3 py-1 cursor-pointer"
          value="chat"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          <TypographyCaption>Chat</TypographyCaption>
        </TabsTrigger>
        <TabsTrigger
          className="inline-flex items-center gap-2 px-3 py-1 cursor-pointer"
          value="summary"
        >
          <BookText className="size-4" aria-hidden="true" />
          <TypographyCaption>Summary</TypographyCaption>
        </TabsTrigger>
        <TabsTrigger
          className="cursor-pointer w-max flex gap-2"
          value="flashcards"
        >
          <CreditCard className="size-4" aria-hidden="true" />
          <TypographyCaption>Flashcards</TypographyCaption>
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer w-max flex gap-2" value="quiz">
          <BookOpenCheck className="size-4" aria-hidden="true" />
          <TypographyCaption>Quiz</TypographyCaption>
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer w-max flex gap-2" value="notes">
          <PencilLine className="size-4" aria-hidden="true" />
          <TypographyCaption>Notes</TypographyCaption>
        </TabsTrigger>
      </TabsList>
      <TabsContent className="" value="chat">
        <ChatComponent revisionSetId={revisionSetId} />
      </TabsContent>
      <TabsContent value="summary">Summary</TabsContent>
      <TabsContent value="flashcards">Flashcards</TabsContent>
      <TabsContent value="quiz">Quiz</TabsContent>
      <TabsContent value="notes">Notes</TabsContent>
    </Tabs>
  );
};
