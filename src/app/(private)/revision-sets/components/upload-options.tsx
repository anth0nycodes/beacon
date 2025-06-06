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
      icon: <FileText className="size-8 text-emerald-500" />,
      title: "Document",
      description: ".pdf, .docx",
      dialogTitle: "Upload Document",
      dialogDescription: "Click the button below to upload a document",
      dialogSubmitButtonTitle: "Upload Document",
    },
    {
      icon: <Presentation className="size-8 text-emerald-500" />,
      title: "Presentation",
      description: ".pptx",
      dialogTitle: "Upload Presentation",
      dialogDescription:
        "Click the button below to upload a PowerPoint presentation",
      dialogSubmitButtonTitle: "Upload Presentation",
    },
    {
      icon: <Type className="size-8 text-emerald-500" />,
      title: "Text",
      description: "Paste text directly",
      dialogTitle: "Add Text Note",
      dialogDescription: "Enter plain text.",
      dialogSubmitButtonTitle: "Add Text",
      placeholder: "Type or paste text here",
    },
    {
      icon: <Video className="size-8 text-emerald-500" />,
      title: "Video",
      description: ".mp4",
      dialogTitle: "Upload Video",
      dialogDescription:
        "Click the button below to upload a video file. Please make sure the video file has audio.",
      dialogSubmitButtonTitle: "Upload Video",
    },
  ];

  const renderContent = (option: OptionsProps) => {
    switch (option.title) {
      case "Text":
        return (
          <div className="flex flex-col items-center gap-4">
            <Textarea
              id={option.title}
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

      case "Video":
        return (
          <div>
            <FileUploadButton
              className={buttonClassName}
              onUploadComplete={() => setOpenDialog(null)}
              acceptedFileTypes=".mp4"
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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-4">
      {options.map((option) => (
        <Dialog
          key={option.title}
          open={openDialog === option.title}
          onOpenChange={(open) => setOpenDialog(open ? option.title : null)}
        >
          <DialogTrigger asChild>
            <div
              className={cn(
                "group flex flex-col items-center justify-center p-6",
                "min-h-[180px] w-full",
                "rounded-xl border border-gray-200 bg-white/50",
                "hover:bg-emerald-400/5 hover:border-emerald-600/50",
                "transition-all duration-200 ease-in-out",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
                "cursor-pointer"
              )}
            >
              <div className="mb-4">{option.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-center">
                {option.title}
              </h3>
              <p className="text-sm text-gray-500 text-center">
                {option.description}
              </p>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {option.dialogTitle}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-500 mb-2">
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
