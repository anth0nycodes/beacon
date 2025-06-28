import { createClient } from "@/utils/supabase/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { revisionSetId, revisionSetDocumentContent } = await request.json();
  const supabase = await createClient();

  const SYSTEM_MESSAGE = `You are an expert academic assistant that creates well-structured summaries for study purposes.

Format your response in Markdown with:
- Use ## for main sections
- Use ### for subsections  
- Use bullet points (-) for lists
- Use \`code\` for technical terms
- Use **bold** for key concepts
- Use > for important quotes or definitions
- Keep summaries between 200-500 words`;

  try {
    const { text } = await generateText({
      model: openai("gpt-4.1-nano"),
      system: SYSTEM_MESSAGE,
      prompt: `Please create a revision set summary of the following revision set content: ${revisionSetDocumentContent}`,
    });

    const { error: insertError } = await supabase
      .from("document_summaries")
      .insert({
        revision_set_id: revisionSetId,
        summary_text: text,
      })
      .select();

    if (insertError) {
      return NextResponse.json({
        message: "Failed to generate summary",
        details: insertError.message,
      });
    }

    return NextResponse.json({
      message: "Summary generated successfully",
    });
  } catch (error) {
    console.error("Error in generate-summary route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({
      message: "Failed to generate summary",
      details: errorMessage,
    });
  }
}
