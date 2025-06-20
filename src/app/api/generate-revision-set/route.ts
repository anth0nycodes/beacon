import { UploadedFile } from "@/types/file";
import { getFileType } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const revisionSetSchema = z.object({
  uploadedFiles: z.array(
    z.object({
      name: z.string().min(1),
      ufsUrl: z.string().url(),
      type: z.string(),
      key: z.string(),
      size: z.number().positive(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const { uploadedFiles } = revisionSetSchema.parse(await request.json());
    const supabase = await createClient();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const response = await fetch(`${baseUrl}/api/extract-upload-type`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileUrl: uploadedFiles.map((file) => file.ufsUrl),
        type: uploadedFiles.map((file) => file.type),
      }),
    });

    const contents = await response.json();

    const { data: revisionSet, error: revisionSetError } = await supabase
      .from("revision_sets")
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        title: "New Revision Set",
      })
      .select()
      .single();

    if (revisionSetError) {
      return NextResponse.json(
        { error: revisionSetError.message },
        { status: 400 }
      );
    }

    const documentsToInsert = uploadedFiles.map((file, index) => ({
      content: contents[index],
      original_filename: file.name,
      ufs_url: file.ufsUrl,
      file_type: getFileType(file.type),
      file_key: file.key,
      file_size: file.size,
      revision_set_id: revisionSet.id,
    }));

    const { error: documentsError } = await supabase
      .from("documents")
      .insert(documentsToInsert);

    if (documentsError) {
      return NextResponse.json(
        { error: documentsError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ revisionSetId: revisionSet.id });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
