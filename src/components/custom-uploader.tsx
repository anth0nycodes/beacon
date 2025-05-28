import { useUploadThing } from "@/utils/uploadthing";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import React from "react";
import useUploadedFileStore from "@/store/uploadedFile";

interface UploadButtonProps {
  children: React.ReactNode;
  className?: string;
  resetUpload?: boolean;
  onUploadComplete?: () => void;
}

type UploadedFile = {
  appUrl: string;
  customId?: string | null;
  fileHash: string;
  key: string;
  lastModified?: number;
  name: string;
  serverData: {
    fileUrl: string;
  };
  size: number;
  type: string;
  ufsUrl: string;
  url: string;
};

export function UploadButton({
  children,
  className,
  resetUpload,
  onUploadComplete,
}: UploadButtonProps) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const abortController = useRef<AbortController | null>(null);
  const setUploadedFiles = useUploadedFileStore(
    (state) => state.setUploadedFiles
  );

  const { startUpload } = useUploadThing("documentUpload", {
    onClientUploadComplete: (res) => {
      console.log(res);
      setIsUploading(false);
      setUploadedFiles(res);
      if (typeof onUploadComplete === "function") {
        onUploadComplete();
      }
    },
    onUploadError: (error) => {
      console.log(error);
      setIsUploading(false);
    },
    onUploadBegin: () => setIsUploading(true),
  });

  // Reset uploading state if dialog closes
  useEffect(() => {
    if (resetUpload && abortController.current) {
      abortController.current.abort();
    }
  }, [resetUpload]);

  const handleButtonClick = () => {
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement).click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startUpload([file]);
      console.log(JSON.stringify(file));
    }
  };

  return (
    <>
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf, .docx"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <Button
        className={className}
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        {isUploading ? <Loader2 className="animate-spin" /> : children}
      </Button>
    </>
  );
}
