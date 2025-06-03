import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { chromium } from "playwright";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

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
    case "youtube":
    // return await handleFileProcessing(fileUrl, fetchAndParseYoutubeURL);
    case "url":
    // return await handleFileProcessing(fileUrl, fetchAndParseWebsiteURL);
    default:
      throw new Error("Unsupported file type");
  }
}

async function fetchAndParsePDF(fileUrl: string) {
  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error("Failed to fetch PDF");
  if (!response.headers.get("content-type")?.includes("pdf")) {
    throw new Error("URL does not point to a PDF");
  }
  const arrayBuffer = await response.arrayBuffer();
  const loader = new PDFLoader(new Blob([arrayBuffer]));
  const docs = await loader.load();
  return docs.map((doc) => doc.pageContent).join("\n");
}

async function fetchAndParseDocx(fileUrl: string) {
  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error("Failed to fetch Docx");
  if (!response.headers.get("content-type")?.includes("officedocument")) {
    throw new Error("URL does not point to a Docx");
  }
  const arrayBuffer = await response.arrayBuffer();
  const loader = new DocxLoader(new Blob([arrayBuffer]));
  const docs = await loader.load();
  return docs.map((doc) => doc.pageContent).join("\n");
}

async function fetchAndParsePlainText(fileUrl: string) {
  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error("Failed to fetch Plain Text");
  if (!response.headers.get("content-type")?.includes("text/plain")) {
    throw new Error("URL does not point to a Plain Text");
  }
  const arrayBuffer = await response.arrayBuffer();
  const loader = new TextLoader(new Blob([arrayBuffer]));
  const docs = await loader.load();
  return docs.map((doc) => doc.pageContent).join("\n");
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
