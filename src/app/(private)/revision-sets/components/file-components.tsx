"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import useUploadedFileStore from "@/store/uploadedFile";

export const ActiveFiles = () => {
  const uploadedFiles = useUploadedFileStore((state) => state.uploadedFiles);

  return (
    <Card className="rounded-2xl h-full py-4 w-full bg-emerald-300/10 border border-emerald-100 shadow-none mx-auto flex flex-col">
      <CardTitle className="flex border-b items-center border-emerald-100 font-semibold px-4 sm:px-5 text-emerald-800 text-base sm:text-lg lg:text-xl">
        <p className="mb-3 text-sm sm:text-base">
          Your Files ({uploadedFiles.length})
        </p>
      </CardTitle>
      <CardContent>
        {uploadedFiles.length > 0 ? (
          <ul>
            {uploadedFiles.map((file) => (
              <li key={file.key}>
                <a
                  href={file.serverData.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.name}
                </a>
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
