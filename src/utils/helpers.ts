import { FileText, Presentation, Type, File as FileIcon } from "lucide-react";

export const getURL = (path: string = "") => {
  // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL &&
    process.env.NEXT_PUBLIC_SITE_URL.trim() !== ""
      ? process.env.NEXT_PUBLIC_SITE_URL
      : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
      process?.env?.NEXT_PUBLIC_VERCEL_URL &&
        process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ""
      ? process.env.NEXT_PUBLIC_VERCEL_URL
      : // If neither is set, default to localhost for local development.
        "http://localhost:3000/";

  // Trim the URL and remove trailing slash if exists.
  url = url.replace(/\/+$/, "");
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Ensure path starts without a slash to avoid double slashes in the final URL.
  path = path.replace(/^\/+/, "");

  // Concatenate the URL and the path.
  return path ? `${url}/${path}` : url;
};

export const getFileType = (
  mimeType: string
): "pdf" | "docx" | "txt" | "pptx" => {
  switch (mimeType) {
    case "application/pdf":
      return "pdf";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "docx";
    case "text/plain":
      return "txt";
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "pptx";
    default:
      return "txt"; // or handle unknown types appropriately
  }
};

export const getFileIconStyling = (type: string) => {
  switch (type) {
    case "pdf":
      return { IconType: FileText, color: "text-red-500", bg: "bg-red-50" };
    case "docx":
      return { IconType: FileText, color: "text-blue-500", bg: "bg-blue-50" };
    case "pptx":
      return {
        IconType: Presentation,
        color: "text-orange-500",
        bg: "bg-orange-50",
      };
    case "txt":
      return {
        IconType: Type,
        color: "text-muted-foreground",
        bg: "bg-gray-100",
      };
    default:
      return {
        IconType: FileIcon,
        color: "text-muted-foreground",
        bg: "bg-gray-100",
      };
  }
};
