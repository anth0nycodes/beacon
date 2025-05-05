"use client";

import React from "react";
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
import { z } from "zod";

const WaitlistForm = () => {
  const schema = z.object({
    email: z.string().email().min(1, {
      message: "Please enter a valid email address.",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const onSubmit = (data: { email: string }) => {
    // TODO: handle waitlist submission
    // e.g., send to API or show a toast
    console.log("Waitlist email submitted:", data.email);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2 w-full"
      >
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
            <FormItem className="w-full sm:w-64">
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@email.com"
                  {...field}
                  className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="rounded-md bg-black dark:bg-white text-white dark:text-black px-6 py-2 font-semibold text-base transition hover:bg-gray-800 dark:hover:bg-gray-200"
        >
          Join Waitlist
        </Button>
      </form>
    </Form>
  );
};

export default WaitlistForm;
