import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";

export async function POST(req: NextRequest) {
  try {
    const { revisionSetId, revisionSetDocumentContent } = await req.json();
    const supabase = await createClient();

    if (!revisionSetId || !revisionSetDocumentContent) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const SYSTEM_MESSAGE = `
     You are a helpful assistant that creates flashcards for a revision set.
     You will be given a revision set document content and you will need to create 10 flashcards TOTAL for it.
     The flashcards should be in a JSON array format which includes the question, answer, and hint.
     ONLY return the JSON array of flashcards, no other text or comments.
     The flashcards should be in the following format:
     [
        {
            "question": "question",
            "answer": "answer",
            "hint": "hint"
        }
     ]
     `;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Create flashcards for the following revision set: ${revisionSetDocumentContent}`,
      system: SYSTEM_MESSAGE,
      temperature: 0.3,
    });

    const flashcardsJson = JSON.parse(text);

    const flashcardsInsert = flashcardsJson.map(
      (fc: Database["public"]["Tables"]["document_flashcards"]["Row"]) => ({
        revision_set_id: revisionSetId,
        question: fc.question,
        answer: fc.answer,
        hint: fc.hint,
      })
    );

    const { error: insertError } = await supabase
      .from("document_flashcards")
      .insert(flashcardsInsert)
      .select();

    if (insertError) {
      return NextResponse.json({
        message: "Failed to create flashcards",
        details: insertError.message,
      });
    }

    return NextResponse.json({
      message: "Flashcards created successfully",
    });
  } catch (error) {
    console.error("Error in create-flashcards route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({
      message: "Failed to create flashcards",
      details: errorMessage,
    });
  }
}
