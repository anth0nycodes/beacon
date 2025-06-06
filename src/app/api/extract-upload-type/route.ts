import { NextRequest, NextResponse } from "next/server";
import {
  fetchAndParsePDF,
  fetchAndParseDocx,
  fetchAndParsePlainText,
  fetchAndParsePPTX,
  fetchAndParseVideo,
} from "./helpers";

export async function POST(req: NextRequest) {
  try {
    const { fileUrl, type } = await req.json();
    const urls = Array.isArray(fileUrl) ? fileUrl : [fileUrl];
    const types = Array.isArray(type) ? type : [type];

    const results = await Promise.all(
      urls.map((url, i) => processDocument(url, types[i] || types[0]))
    );

    return NextResponse.json({ docs: results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function processDocument(fileUrl: string, fileType: string) {
  console.log("Received fileType:", fileType);
  switch (fileType) {
    case "application/pdf":
      return await handleFileProcessing(fileUrl, fetchAndParsePDF);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return await handleFileProcessing(fileUrl, fetchAndParseDocx);
    case "text/plain":
      return await handleFileProcessing(fileUrl, fetchAndParsePlainText);
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return await handleFileProcessing(fileUrl, fetchAndParsePPTX);
    case "video/mp4":
      return await handleFileProcessing(fileUrl, fetchAndParseVideo);
    default:
      throw new Error("Unsupported file type");
  }
}

async function handleFileProcessing(
  fileUrl: string,
  fetchFunction: (fileUrl: string) => Promise<string>
) {
  if (Array.isArray(fileUrl)) {
    const results = await Promise.all(fileUrl.map(fetchFunction));
    console.log("results:", results);
    return results;
  } else {
    const cleanedDocs = await fetchFunction(fileUrl);
    console.log("cleanedDocs:", cleanedDocs);
    return cleanedDocs;
  }
}
