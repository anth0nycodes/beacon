import { z } from "zod";

export const textUploadSchema = z.object({
  text: z.string().min(1, {
    message: "Please enter some text.",
  }),
});

export type TextUploadSchema = z.infer<typeof textUploadSchema>;
