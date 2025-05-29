"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { MAX_FILES, useUploadedFileStore } from "@/store/uploadedFile";
import { FileCheck, Type, Link2, Video, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <Card className="rounded-2xl h-full py-4 w-full bg-emerald-300/10 border max-w-3xl mx-auto border-emerald-100 shadow-none flex flex-col">
      <CardTitle className="flex border-b items-center border-emerald-100 font-semibold px-4 sm:px-5 text-emerald-800 text-base sm:text-lg lg:text-xl">
        <FileLimitText />
      </CardTitle>
      <CardContent>
        {uploadedFiles.length > 0 ? (
          <ul>
            {uploadedFiles.map((file) => (
              <li key={file.key}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <UploadedFileIcon type={file.type} />
                    <p className="truncate sm:max-w-[40ch]">{file.name}</p>
                    {/* TODOL fix text truncation */}
                  </div>
                  <DeleteFile fileKey={file.key} />
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
  );
};

const UploadedFileIcon = ({ type }: { type: string }) => {
  if (type.startsWith("application/")) {
    return <FileText className="size-5 text-emerald-500" />;
  }
  if (type.startsWith("text/")) {
    return <Type className="size-5 text-emerald-500" />;
  }
  if (type === "youtube") {
    return <Video className="size-5 text-emerald-500" />;
  }
  if (type === "url" || type === "link") {
    return <Link2 className="size-5 text-emerald-500" />;
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
