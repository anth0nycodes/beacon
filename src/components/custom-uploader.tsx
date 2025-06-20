import { useUploadThing } from "@/utils/uploadthing";
import { useState, useRef, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import React from "react";
import { MAX_FILES, useUploadedFileStore } from "@/store/uploadedFile";
import { toast } from "sonner";
import { textUploadSchema } from "@/schemas/upload-options-schema";
import { UploadedFile } from "@/types/file";

interface FileUploadButtonProps {
  children: ReactNode;
  className?: string;
  onUploadComplete?: () => void;
  acceptedFileTypes?: string;
}

interface TextUploadButtonProps extends FileUploadButtonProps {
  text: string;
  setText: (text: string) => void;
}

export function FileUploadButton({
  children,
  className,
  onUploadComplete,
  acceptedFileTypes,
}: FileUploadButtonProps) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const addUploadedFile = useUploadedFileStore(
    (state) => state.addUploadedFile
  );
  const isAtFileLimit = useUploadedFileStore((state) => state.isAtFileLimit);

  const { startUpload } = useUploadThing("fileUpload", {
    onClientUploadComplete: (res) => {
      console.dir(res, { depth: null });
      setIsUploading(false);
      addUploadedFile(res[0] as UploadedFile);

      if (typeof onUploadComplete === "function") {
        onUploadComplete();
      }
    },
    onUploadError: (error) => {
      // TODO: Handle file size mismatch error custom message
      toast.error("An error occurred while uploading the file.");
      console.error(error);
      setIsUploading(false);
    },
    onUploadBegin: () => setIsUploading(true),
  });

  const handleUploadAttempt = () => {
    if (isAtFileLimit()) {
      toast.error(`You have reached the maximum number of files.`);
      return true; // limit reached
    }
    return false; // safe to upload
  };

  const handleButtonClick = () => {
    if (handleUploadAttempt()) return;
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement).click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    startUpload([file]);
  };

  return (
    <>
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={acceptedFileTypes}
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
  const isAtFileLimit = useUploadedFileStore((state) => state.isAtFileLimit);

  const { startUpload } = useUploadThing("fileUpload", {
    onClientUploadComplete: (res) => {
      console.dir(res, { depth: null });
      setIsUploading(false);
      addUploadedFile(res[0] as UploadedFile);
      setText("");
      if (typeof onUploadComplete === "function") {
        onUploadComplete();
      }
    },
    onUploadError: (error) => {
      toast.error("An error occurred while uploading the file.");
      console.error(error);
      setIsUploading(false);
    },
    onUploadBegin: () => setIsUploading(true),
  });

  const handleButtonClick = () => {
    if (isAtFileLimit()) {
      toast.error(`You have reached the maximum number of files.`);
      return;
    }
    const result = textUploadSchema.safeParse({ text });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    const file = new File([text], `${text}.txt`, { type: "text/plain" });
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
