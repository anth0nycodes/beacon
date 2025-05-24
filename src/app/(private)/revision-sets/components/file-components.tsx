import { File, FileCheck } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// TODO: Add type safety and remove hardcoded values in future
export const FileQuantity = () => {
  return <div className="text-sm sm:text-base mb-3 ">Files added: 0 / 5 (Free limit)</div>;
};

export const FileUploader = () => {
  const fileIcons = [
    {
      id: "file-check",
      icon: <FileCheck className="size-8 text-emerald-500" />,
    },
    {
      id: "file",
      icon: <File className="size-8 text-emerald-500" />,
    },
  ];
  return (
    <Card className="rounded-2xl h-fit py-4 w-full bg-emerald-300/10 border border-emerald-100 shadow-none mx-auto">
      <CardTitle className="flex border-b items-center border-emerald-100 font-semibold px-4 sm:px-5 text-emerald-800 text-base sm:text-lg lg:text-xl">
        <FileQuantity />
      </CardTitle>
      <CardContent>
        <div className="flex flex-col gap-4 items-center text-center">
          <div className="flex gap-2">
            {fileIcons.map((icon) => (
              <div className="p-2 rounded-md bg-emerald-500/20" key={icon.id}>
                {icon.icon}
              </div>
            ))}
          </div>
          <p className="font-semibold text-base sm:text-lg lg:text-xl text-foreground">
            Add more files
          </p>
          <Button className="bg-emerald-500 text-white text-base sm:text-lg rounded-full px-4 py-2 sm:px-6 sm:py-3 font-semibold hover:bg-emerald-600">
            Browse your files
          </Button>
          <div className="flex flex-col text-xs sm:text-sm items-center mt-2">
            <p className="font-semibold">Supported file types:</p>
            <p>Documents: .pdf, .docx</p>
            <p>Other: Plain text, URLs, YouTube videos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ActiveFiles = () => (
  <Card className="rounded-2xl h-full py-4 w-full bg-emerald-300/10 border border-emerald-100 shadow-none mx-auto flex flex-col">
    <CardTitle className="flex border-b items-center border-emerald-100 font-semibold px-4 sm:px-5 text-emerald-800 text-base sm:text-lg lg:text-xl">
      <p className="mb-3 text-sm sm:text-base">Your Files (0)</p>
    </CardTitle>
  </Card>
);

<div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
  <FileUploader />
  <ActiveFiles />
</div>;
