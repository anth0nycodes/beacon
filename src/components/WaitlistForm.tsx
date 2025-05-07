"use client";

import React, { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WaitlistSchema, waitlistSchema } from "@/schemas/waitlist-schema";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

const WaitlistForm = () => {
  const form = useForm<WaitlistSchema>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const { reset } = form;
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: WaitlistSchema) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/contacts", {
        method: "POST",
        body: JSON.stringify({ email: data.email }),
      });

      if (res.ok) {
        toast.success(
          "Successfully joined waitlist! It might take a minute to reach your inbox."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          }}
          render={({ field }) => (
            <FormItem className="w-full flex-col sm:flex-row flex gap-2">
              <div className="w-full">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@email.com"
                    {...field}
                    className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition"
                  />
                </FormControl>
                <FormMessage className="mt-2" />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-black dark:bg-white text-white dark:text-black px-6 py-2 font-semibold text-base transition hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center w-full">
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default WaitlistForm;
