import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@/utils/supabase/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, revisionSetId, revisionSetDocumentContent } =
    await req.json();
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // Add debug logging
  console.log(
    "Received revisionSetDocumentContent:",
    revisionSetDocumentContent
  );
  console.log("Received revisionSetId:", revisionSetId);

  const SYSTEM_MESSAGE = `You are a helpful AI study assistant named Tuto. 
You help users understand, summarize, and quiz themselves on the content of their uploaded documents. 
If a user asks a question unrelated to the uploaded documents or general study help, politely decline to answer.

You have access to the content of the uploaded document(s) and can help with:
- Summarizing key points
- Generating flashcards or quizzes
- Explaining difficult concepts
- Answering questions based on the document content

Here is the content of the uploaded document(s):
${
  revisionSetDocumentContent
    ? `\`\`\`\n${revisionSetDocumentContent}\n\`\`\``
    : "[No document content available]"
}

Always maintain a supportive, educational tone and encourage effective study habits.`;

  // Store the user's message
  const lastUserMessage = messages[messages.length - 1];
  if (lastUserMessage.role === "user") {
    await supabase.from("chat_logs").insert({
      role: "user",
      content: lastUserMessage.content,
      user_id: userId,
      revision_set_id: revisionSetId,
    });
  }

  const result = streamText({
    model: openai("gpt-4.1-nano"),
    messages,
    system: SYSTEM_MESSAGE,
    onFinish: async (message) => {
      // Store the assistant's response
      await supabase.from("chat_logs").insert({
        role: "assistant",
        content: message.text,
        revision_set_id: revisionSetId,
        user_id: userId,
      });
    },
  });

  return result.toDataStreamResponse();
}
