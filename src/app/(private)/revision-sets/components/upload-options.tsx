import { FileCheck, Link2, Type, Video } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

const UploadOptions = () => {
  const options = [
    {
      icon: <FileCheck className="size-8 text-emerald-500" />,
      title: "Document",
      description: "Upload PDF or Word documents (.pdf, .docx)",
    },
    {
      icon: <Type className="size-8 text-emerald-500" />,
      title: "Text",
      description: "Paste text directly",
    },
    {
      icon: <Link2 className="size-8 text-emerald-500" />,
      title: "Website Link",
      description: "Public URL",
    },
    {
      icon: <Video className="size-8 text-emerald-500" />,
      title: "YouTube Video",
      description: "YouTube URL",
    },
  ];
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-4">
      {options.map((option) => (
        <div
          key={option.title}
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
          <div className="mb-4 transition-transform duration-200 group-hover:scale-110">
            {option.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2 text-center">
            {option.title}
          </h3>
          <p className="text-sm text-gray-500 text-center">
            {option.description}
          </p>
        </div>
      ))}
    </section>
  );
};

export default UploadOptions;
