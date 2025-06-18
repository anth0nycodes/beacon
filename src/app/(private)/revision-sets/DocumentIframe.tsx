"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface DocumentIframeProps {
  url: string;
  title: string;
}

const DocumentIframe = ({ url, title }: DocumentIframeProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <Skeleton className="absolute inset-0 flex items-center justify-center bg-background/80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </Skeleton>
      )}
      <iframe
        src={`https://docs.google.com/gview?url=${url}&embedded=true`}
        className="w-full h-full"
        title={title}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default DocumentIframe;
