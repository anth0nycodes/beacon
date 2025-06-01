import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { fileUrl } = await req.json();

  // Helper to process a single file
  async function processFile(url: string) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch PDF");
    if (!response.headers.get("content-type")?.includes("pdf")) {
      throw new Error("URL does not point to a PDF");
    }
    const arrayBuffer = await response.arrayBuffer();
    const loader = new PDFLoader(new Blob([arrayBuffer]));
    const docs = await loader.load();
    return docs.map((doc) => doc.pageContent).join("\n");
  }

  try {
    if (Array.isArray(fileUrl)) {
      const results = await Promise.all(fileUrl.map(processFile));
      console.log("results:", results);
      return NextResponse.json({ docs: results });
    } else {
      const cleanedDocs = await processFile(fileUrl);
      console.log("cleanedDocs:", cleanedDocs);
      return NextResponse.json({ docs: cleanedDocs });
    }
  } catch (error) {
    console.error("Error extracting PDF:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
