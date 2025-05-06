import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().email().min(1, {
    message: "Please enter a valid email address.",
  }),
});

export type WaitlistSchema = z.infer<typeof waitlistSchema>;
