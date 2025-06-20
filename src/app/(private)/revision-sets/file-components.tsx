"use client";

import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { MAX_FILES, useUploadedFileStore } from "@/store/uploadedFile";
import {
  FileCheck,
  Type,
  FileText,
  Trash2,
  Loader2,
  Presentation,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadedFile } from "@/types/file";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const clearUploadedFiles = useUploadedFileStore(
    (state) => state.clearUploadedFiles
  );

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
          clearUploadedFiles={clearUploadedFiles}
          isGeneratingRevisionSet={isGeneratingRevisionSet}
          setIsGeneratingRevisionSet={setIsGeneratingRevisionSet}
        />
      ) : null}
    </div>
  );
};

const GenerateRevisionSetButton = ({
  uploadedFiles,
  clearUploadedFiles,
  isGeneratingRevisionSet,
  setIsGeneratingRevisionSet,
}: {
  uploadedFiles: UploadedFile[];
  clearUploadedFiles: () => void;
  isGeneratingRevisionSet: boolean;
  setIsGeneratingRevisionSet: (isGeneratingRevisionSet: boolean) => void;
}) => {
  const router = useRouter();

  const handleGenerateRevisionSet = async () => {
    try {
      setIsGeneratingRevisionSet(true);
      toast.loading("📝 Generating revision set...");

      const response = await fetch("/api/generate-revision-set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadedFiles }),
      });

      if (!response.ok) {
        throw new Error("Failed to create revision set");
      }

      const { revisionSetId } = await response.json();
      router.push(`/revision-sets/${revisionSetId}`);
    } catch (error) {
      console.error("Error generating revision set:", error);
      router.push("/revision-sets");
      toast.error("Failed to generate revision set");
    } finally {
      setIsGeneratingRevisionSet(false);
      clearUploadedFiles();
      toast.dismiss();
    }
  };

  return (
    <Button
      disabled={isGeneratingRevisionSet}
      className="w-fit mx-auto"
      onClick={handleGenerateRevisionSet}
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
