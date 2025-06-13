import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";

export async function fetchAndParsePDF(fileUrl: string) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch PDF: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/pdf")) {
      throw new Error(`Invalid content type: ${contentType}. Expected PDF.`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const loader = new PDFLoader(new Blob([arrayBuffer]));
    const docs = await loader.load();
    return docs.map((doc) => doc.pageContent).join("\n");
  } catch (error) {
    console.error("Error fetching and parsing PDF file:", error);
    throw new Error(
      `PDF processing failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function fetchAndParseDocx(fileUrl: string) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch DOCX: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (
      !contentType?.includes(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ) {
      throw new Error(`Invalid content type: ${contentType}. Expected DOCX.`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const loader = new DocxLoader(new Blob([arrayBuffer]));
    const docs = await loader.load();
    return docs.map((doc) => doc.pageContent).join("\n");
  } catch (error) {
    console.error("Error fetching and parsing DOCX file:", error);
    throw new Error(
      `DOCX processing failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function fetchAndParsePPTX(fileUrl: string) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch PPTX: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (
      !contentType?.includes(
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      )
    ) {
      throw new Error(`Invalid content type: ${contentType}. Expected PPTX.`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const loader = new PPTXLoader(new Blob([arrayBuffer]));
    const docs = await loader.load();
    return docs.map((doc) => doc.pageContent).join("\n");
  } catch (error) {
    console.error("Error fetching and parsing PPTX file:", error);
    throw new Error(
      `PPTX processing failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function fetchAndParsePlainText(fileUrl: string) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch text: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("text/plain")) {
      throw new Error(
        `Invalid content type: ${contentType}. Expected text/plain.`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const loader = new TextLoader(new Blob([arrayBuffer]));
    const docs = await loader.load();
    return docs.map((doc) => doc.pageContent).join("\n");
  } catch (error) {
    console.error("Error fetching and parsing text file:", error);
    throw new Error(
      `Text processing failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
