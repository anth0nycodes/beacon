import { useUploadThing } from "@/utils/uploadthing";
import { useState, useRef, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import React from "react";
import { useUploadedFileStore } from "@/store/uploadedFile";
import { toast } from "sonner";
import { textUploadSchema } from "@/schemas/upload-options-schema";

interface FileUploadButtonProps {
  children: ReactNode;
  className?: string;
  onUploadComplete?: () => void;
}

interface TextUploadButtonProps extends FileUploadButtonProps {
  text: string;
  setText: (text: string) => void;
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

export function FileUploadButton({
  children,
  className,
  onUploadComplete,
}: FileUploadButtonProps) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const addUploadedFile = useUploadedFileStore(
    (state) => state.addUploadedFile
  );
  const uploadedFiles = useUploadedFileStore((state) => state.uploadedFiles);

  const { startUpload } = useUploadThing("fileUpload", {
    onClientUploadComplete: (res) => {
      console.dir(res, { depth: null });
      setIsUploading(false);
      const newFile = res[0] as UploadedFile;

      if (uploadedFiles.some((file) => file.fileHash === newFile.fileHash)) {
        toast.error("This file has already been uploaded.");
        return;
      }

      addUploadedFile(newFile);

      if (typeof onUploadComplete === "function") {
        onUploadComplete();
      }
    },
    onUploadError: (error) => {
      console.log(error);
      toast.error("An error occurred while uploading the file.");
      setIsUploading(false);
    },
    onUploadBegin: () => setIsUploading(true),
  });

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

export function TextUploadButton({
  children,
  className,
  onUploadComplete,
  text,
  setText,
}: TextUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const addUploadedFile = useUploadedFileStore(
    (state) => state.addUploadedFile
  );
  const uploadedFiles = useUploadedFileStore((state) => state.uploadedFiles);

  const { startUpload } = useUploadThing("fileUpload", {
    onClientUploadComplete: (res) => {
      console.dir(res, { depth: null });
      setIsUploading(false);
      const newFile = res[0] as UploadedFile;

      if (uploadedFiles.some((file) => file.fileHash === newFile.fileHash)) {
        toast.error("This file has already been uploaded.");
        return;
      }

      addUploadedFile(newFile);
      setText("");
      if (typeof onUploadComplete === "function") {
        onUploadComplete();
      }
    },
    onUploadError: (error) => {
      console.log(error);
      toast.error("An error occurred while uploading the file.");
      setIsUploading(false);
    },
    onUploadBegin: () => setIsUploading(true),
  });

  const handleButtonClick = () => {
    const result = textUploadSchema.safeParse({ text });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    const file = new File([text], text, { type: "text/plain" });
    startUpload([file]);
  };

  return (
    <Button
      className={className}
      onClick={handleButtonClick}
      disabled={isUploading}
    >
      {isUploading ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}
