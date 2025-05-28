"use client";

import { FileCheck, Link2, Type, Video } from "lucide-react";
import React, { useRef, useState } from "react";
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
import { UploadButton } from "@/components/custom-uploader";

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

  const options: OptionsProps[] = [
    {
      icon: <FileCheck className="size-8 text-emerald-500" />,
      title: "Document",
      description: ".pdf, .docx",
      dialogTitle: "Upload Document",
      dialogDescription: "Click the button below to upload a document",
      dialogSubmitButtonTitle: "Select File",
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
      icon: <Link2 className="size-8 text-emerald-500" />,
      title: "Website Link",
      description: "Public URL",
      dialogTitle: "Add Website URL",
      dialogDescription: "Enter a valid public URL.",
      dialogSubmitButtonTitle: "Add URL",
      placeholder: "Type or paste Website URL here",
    },
    {
      icon: <Video className="size-8 text-emerald-500" />,
      title: "YouTube Video",
      description: "YouTube URL",
      dialogTitle: "Add YouTube Video",
      dialogDescription: "Enter a valid YouTube URL.",
      dialogSubmitButtonTitle: "Add Video",
      placeholder: "Type or paste YouTube URL here",
    },
  ];

  const renderContent = (option: OptionsProps) => {
    switch (option.title) {
      case "Text":
        return (
          <div className="grid gap-4">
            <div className="flex flex-col items-center gap-4 w-full">
              <Textarea
                id={option.title}
                className={cn(
                  inputClassName,
                  "min-h-[8rem] sm:min-h-[10rem] resize-y"
                )}
                placeholder={option.placeholder}
              />
              <Button className={buttonClassName}>
                {option.dialogSubmitButtonTitle}
              </Button>
            </div>
          </div>
        );

      case "Document":
        return (
          <div>
            <UploadButton
              className={buttonClassName}
              resetUpload={openDialog !== "Document"}
              onUploadComplete={() => setOpenDialog(null)}
            >
              {option.dialogSubmitButtonTitle}
            </UploadButton>
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
          <DialogContent className="sm:max-w-[425px] p-6">
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
