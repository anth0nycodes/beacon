import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { OpenAIWhisperAudio } from "@langchain/community/document_loaders/fs/openai_whisper_audio";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import ffmpeg from "fluent-ffmpeg";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

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

export async function fetchAndParseVideo(fileUrl: string) {
  const tempDir = tmpdir();
  const videoPath = join(tempDir, "temp-video.mp4");
  const audioPath = join(tempDir, "temp-audio.mp3");

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch video: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("video/mp4")) {
      throw new Error(`Invalid content type: ${contentType}. Expected video.`);
    }

    // Save video to temp file
    const videoBuffer = await response.arrayBuffer();
    await writeFile(videoPath, Buffer.from(videoBuffer));

    // Extract audio using FFmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .toFormat("mp3")
        .on("end", resolve)
        .on("error", (err) =>
          reject(new Error(`FFmpeg processing failed: ${err.message}`))
        )
        .save(audioPath);
    });

    // Process with Whisper
    const loader = new OpenAIWhisperAudio(audioPath, {
      transcriptionCreateParams: {
        language: "en",
      },
    });

    const docs = await loader.load();
    return docs.map((doc) => doc.pageContent).join("\n");
  } catch (error) {
    console.error("Error processing video file:", error);
    throw new Error(
      `Video processing failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  } finally {
    // Clean up temp files
    try {
      await Promise.all([
        unlink(videoPath).catch(() => {}),
        unlink(audioPath).catch(() => {}),
      ]);
    } catch (cleanupError) {
      console.error("Failed to clean up temporary files:", cleanupError);
    }
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
