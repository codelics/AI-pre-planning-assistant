// src/lib/pdf/extract.ts

import fs from "fs/promises";

import { PDFExtract } from "pdf.js-extract";

const pdfExtract = new PDFExtract();

/**
 * Extract all text from a PDF.
 */
export async function extractPdfText(
  filePath: string
): Promise<string> {

  //-----------------------------------
  // Read PDF
  //-----------------------------------

  const buffer =
    await fs.readFile(filePath);

  //-----------------------------------
  // Extract pages
  //-----------------------------------

  const pdf =
    await pdfExtract.extractBuffer(
      buffer,
      {}
    );

  //-----------------------------------
  // Combine all page text
  //-----------------------------------

  const text =
    pdf.pages
      .map((page) =>
        page.content
          .map((item) => item.str)
          .join(" ")
      )
      .join("\n");

  return text;

}