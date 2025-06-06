"use client";

import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { MAX_FILES, useUploadedFileStore } from "@/store/uploadedFile";
import {
  FileCheck,
  Type,
  Link2,
  FileText,
  Trash2,
  Loader2,
  Presentation,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadedFile } from "@/components/custom-uploader";
import { toast } from "sonner";

const FileLimitText = () => {
  const uploadedFiles = useUploadedFileStore((state) => state.uploadedFiles);
  return (
    <p className="text-sm mb-3 sm:text-base text-emerald-800">
      Files added: {uploadedFiles.length} / {MAX_FILES}
    </p>
  );
};

// TODO: make this component more responsive
export const ActiveFiles = () => {
  const uploadedFiles = useUploadedFileStore((state) => state.uploadedFiles);
  const [isGeneratingRevisionSet, setIsGeneratingRevisionSet] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-2xl h-full py-4 w-full bg-emerald-300/10 border max-w-3xl mx-auto border-emerald-100 shadow-none flex flex-col">
        <CardTitle className="flex border-b items-center border-emerald-100 font-semibold px-4 sm:px-5 text-emerald-800 text-base sm:text-lg lg:text-xl">
          <FileLimitText />
        </CardTitle>
        <CardContent>
          {uploadedFiles.length > 0 ? (
            <ul className="space-y-3">
              {uploadedFiles.map((file) => (
                <li key={file.key} className="w-full">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full min-w-0">
                    <div className="flex-shrink-0">
                      <UploadedFileIcon type={file.type} />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      {/* TODO: fix text truncation */}
                      <p className="truncate text-sm sm:text-base text-emerald-800 font-medium">
                        {file.name}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <DeleteFile fileKey={file.key} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm sm:text-base text-emerald-800">
              No files uploaded yet
            </p>
          )}
        </CardContent>
      </Card>
      {uploadedFiles.length > 0 ? (
        <GenerateRevisionSetButton
          uploadedFiles={uploadedFiles}
          isGeneratingRevisionSet={isGeneratingRevisionSet}
          setIsGeneratingRevisionSet={setIsGeneratingRevisionSet}
        />
      ) : null}
    </div>
  );
};

const GenerateRevisionSetButton = ({
  uploadedFiles,
  isGeneratingRevisionSet,
  setIsGeneratingRevisionSet,
}: {
  uploadedFiles: UploadedFile[];
  isGeneratingRevisionSet: boolean;
  setIsGeneratingRevisionSet: (isGeneratingRevisionSet: boolean) => void;
}) => {
  const handleGenerateRevisionSet = async (uploadedFiles: UploadedFile[]) => {
    try {
      setIsGeneratingRevisionSet(true);
      toast.loading("📝 Generating revision set...");
      const response = await fetch("/api/extract-upload-type", {
        method: "POST",
        body: JSON.stringify({
          fileUrl: uploadedFiles.map((file) => file.ufsUrl),
          type: uploadedFiles.map((file) => file.type),
        }),
      });
      const data = await response.json();
      console.log("data:", data);
      return data;
    } catch (error) {
      toast.error("Failed to generate revision set");
      console.error(error);
    } finally {
      setIsGeneratingRevisionSet(false);
      toast.dismiss();
    }
  };
  return (
    <Button
      disabled={isGeneratingRevisionSet}
      className="w-fit mx-auto"
      onClick={() => handleGenerateRevisionSet(uploadedFiles)}
    >
      {isGeneratingRevisionSet ? (
        <div className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span>Generate Revision Set</span>
        </div>
      ) : (
        "Generate Revision Set"
      )}
    </Button>
  );
};

const UploadedFileIcon = ({ type }: { type: string }) => {
  if (
    type === "application/pdf" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return <FileText className="size-5 text-emerald-500" />;
  }
  if (type === "text/plain") {
    return <Type className="size-5 text-emerald-500" />;
  }
  if (
    type ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return <Presentation className="size-5 text-emerald-500" />;
  }
  if (type === "video/mp4") {
    return <Video className="size-5 text-emerald-500" />;
  }
  return <FileCheck className="size-5 text-emerald-500" />;
};

const DeleteFile = ({ fileKey }: { fileKey: string }) => {
  const removeUploadedFile = useUploadedFileStore(
    (state) => state.removeUploadedFile
  );
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => removeUploadedFile(fileKey)}
    >
      <Trash2 className="size-5 text-destructive" />
    </Button>
  );
};
