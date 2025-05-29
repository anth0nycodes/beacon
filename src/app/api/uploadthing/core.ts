import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { createClient } from "@/utils/supabase/server";

const f = createUploadthing();

export const ourFileRouter = {
  // define routes for different upload types
  fileUpload: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    "text/plain": {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // this code runs on your server before upload
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If you throw, the user will not be able to upload
      if (!user) {
        throw new UploadThingError("Unauthorized");
      }

      // whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      try {
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { fileUrl: file.ufsUrl };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
