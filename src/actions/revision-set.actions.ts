"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export async function updateRevisionSet(params: {
  id: string;
  title: string;
  description?: string;
}) {
  try {
    const { id, title, description } = updateSchema.parse(params);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("revision_sets")
      .update({ title, description })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/revision-sets/all");
    return { data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues };
    }
    return { error: (error as any).message };
  }
}

export async function deleteRevisionSet(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("revision_sets").delete().eq("id", id);

  if (error) {
    return { error };
  }

  revalidatePath("/revision-sets/all");
  return {};
}
