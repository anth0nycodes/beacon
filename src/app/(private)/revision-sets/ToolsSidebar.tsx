"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpenCheck,
  BookText,
  ChevronDown,
  CreditCard,
  MessageCircle,
  PencilLine,
  Plus,
} from "lucide-react";
import { ChatComponent } from "./ChatComponent";
import { TypographyCaption } from "@/components/ui/typography";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FlashcardsComponent from "./FlashcardsComponent";
import SummaryComponent from "./SummaryComponent";

export const ToolsSidebar = ({ revisionSetId }: { revisionSetId: string }) => {
  return (
    <Tabs className="h-full overflow-y-scroll" defaultValue="chat">
      <TabsList className="inline-flex border h-10 rounded-lg p-1 text-muted-foreground bg-primary/5 w-full max-w-full overflow-x-auto items-center justify-start relative">
        <TabsTrigger value="chat">
          <MessageCircle className="size-4" aria-hidden="true" />
          <TypographyCaption>Chat</TypographyCaption>
        </TabsTrigger>
        <TabsTrigger className="hidden xl:flex" value="summary">
          <BookText className="size-4" aria-hidden="true" />
          <TypographyCaption>Summary</TypographyCaption>
        </TabsTrigger>
        <TabsTrigger value="flashcards">
          <CreditCard className="size-4" aria-hidden="true" />
          <TypographyCaption>Flashcards</TypographyCaption>
        </TabsTrigger>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="data-[state=active]:bg-background xl:hidden cursor-pointer dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
              <ChevronDown className="size-4" aria-hidden="true" />
              <TypographyCaption>More Tools</TypographyCaption>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit p-2 xl:hidden" align="end">
            <div className="flex flex-col gap-1">
              <TabsTrigger className="justify-start h-8" value="summary">
                <BookText className="size-4" aria-hidden="true" />
                <TypographyCaption>Summary</TypographyCaption>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="justify-start h-8">
                <BookOpenCheck className="size-4" aria-hidden="true" />
                <TypographyCaption>Quiz</TypographyCaption>
              </TabsTrigger>
              <TabsTrigger value="notes" className="justify-start h-8">
                <PencilLine className="size-4" aria-hidden="true" />
                <TypographyCaption>Notes</TypographyCaption>
              </TabsTrigger>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <TabsTrigger className="hidden xl:flex" value="quiz">
          <BookOpenCheck className="size-4" aria-hidden="true" />
          <TypographyCaption>Quiz</TypographyCaption>
        </TabsTrigger>
        <TabsTrigger className="hidden xl:flex" value="notes">
          <PencilLine className="size-4" aria-hidden="true" />
          <TypographyCaption>Notes</TypographyCaption>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="chat">
        <ChatComponent revisionSetId={revisionSetId} />
      </TabsContent>
      <TabsContent className="h-full" value="summary">
        <SummaryComponent revisionSetId={revisionSetId} />
      </TabsContent>
      <TabsContent className="h-full" value="flashcards">
        <FlashcardsComponent revisionSetId={revisionSetId} />
      </TabsContent>
      <TabsContent value="quiz">Quiz</TabsContent>
      <TabsContent value="notes">Notes</TabsContent>
    </Tabs>
  );
};
