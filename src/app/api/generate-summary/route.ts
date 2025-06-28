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

    // Store the markdown text directly (no JSON parsing needed)
    const { data, error } = await supabase
      .from("document_summaries")
      .insert({
        revision_set_id: revisionSetId,
        summary_text: text, // Store the markdown text directly
      })
      .select(); // Get the inserted record back

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        summary: text,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
