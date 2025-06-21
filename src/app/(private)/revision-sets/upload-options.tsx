"use client";

import { FileText, Video, Presentation, Type } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  FileUploadButton,
  TextUploadButton,
} from "@/components/custom-uploader";
import { TypographyBody, TypographyCaption } from "@/components/ui/typography";

interface OptionsProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  dialogTitle: string;
  dialogDescription: string;
  dialogSubmitButtonTitle: string;
  placeholder?: string;
}

const buttonClassName = "w-full py-3 text-sm sm:text-base font-medium";
const inputClassName = "w-full text-base p-3 rounded-md placeholder:text-sm";

const UploadOptions = () => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [text, setText] = useState<string>("");

  const options: OptionsProps[] = [
    {
      icon: <FileText className="size-6 text-emerald-500" />,
      title: "Document",
      description: ".pdf, .docx",
      dialogTitle: "Upload Document",
      dialogDescription: "Click the button below to upload a document",
      dialogSubmitButtonTitle: "Upload Document",
    },
    {
      icon: <Presentation className="size-6 text-emerald-500" />,
      title: "Presentation",
      description: ".pptx",
      dialogTitle: "Upload Presentation",
      dialogDescription:
        "Click the button below to upload a PowerPoint presentation",
      dialogSubmitButtonTitle: "Upload Presentation",
    },
    {
      icon: <Type className="size-6 text-emerald-500" />,
      title: "Text",
      description: "Paste text directly",
      dialogTitle: "Add Text Note",
      dialogDescription: "Enter plain text.",
      dialogSubmitButtonTitle: "Add Text",
      placeholder: "Type or paste text here",
    },
  ];

  const renderContent = (option: OptionsProps) => {
    switch (option.title) {
      case "Text":
        return (
          <div className="flex flex-col items-center gap-4">
            <Textarea
              id={option.title}
              // disabled={isUploading}
              className={cn(
                inputClassName,
                "min-h-[8rem] max-h-[8rem] resize-none sm:min-h-[10rem] sm:max-h-[10rem]"
              )}
              placeholder={option.placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <TextUploadButton
              className={buttonClassName}
              text={text}
              setText={setText}
              onUploadComplete={() => setOpenDialog(null)}
            >
              {option.dialogSubmitButtonTitle}
            </TextUploadButton>
          </div>
        );

      case "Document":
        return (
          <div>
            <FileUploadButton
              className={buttonClassName}
              onUploadComplete={() => setOpenDialog(null)}
              acceptedFileTypes=".pdf, .docx"
            >
              {option.dialogSubmitButtonTitle}
            </FileUploadButton>
          </div>
        );

      case "Presentation":
        return (
          <div>
            <FileUploadButton
              className={buttonClassName}
              onUploadComplete={() => setOpenDialog(null)}
              acceptedFileTypes=".pptx"
            >
              {option.dialogSubmitButtonTitle}
            </FileUploadButton>
          </div>
        );

      default:
        return (
          <div className="grid gap-4">
            <div className="flex flex-col items-center gap-4 w-full">
              <Input
                id={option.title}
                className={inputClassName}
                placeholder={option.placeholder}
              />
              <Button className={buttonClassName}>
                {option.dialogSubmitButtonTitle}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto px-4">
      {options.map((option) => (
        <Dialog
          key={option.title}
          open={openDialog === option.title}
          onOpenChange={(open) => setOpenDialog(open ? option.title : null)}
        >
          <DialogTrigger asChild>
            <div className="group flex p-2 cursor-pointer gap-3 border border-gray-200 rounded-lg hover:border-emerald-500 transition-all duration-200">
              <div className="border-2 border-gray-200 rounded-lg p-1">
                {option.icon}
              </div>
              <div className="flex flex-col">
                <TypographyBody weight="semibold">
                  {option.title}
                </TypographyBody>
                <TypographyCaption>{option.description}</TypographyCaption>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {option.dialogTitle}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground mb-2">
                {option.dialogDescription}
              </DialogDescription>
            </DialogHeader>
            {renderContent(option)}
          </DialogContent>
        </Dialog>
      ))}
    </section>
  );
};

export default UploadOptions;
