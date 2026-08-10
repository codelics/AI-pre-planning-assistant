import { NextResponse } from "next/server";
import { PDFExtract } from "pdf.js-extract";

import { openai } from "@/lib/openai";
import { retrieveChunks } from "@/lib/rag/retriever";
import { buildContext } from "@/lib/rag/context-builder";
import { chatCompletion } from "@/lib/openai/chat";

import { ClientAnalysis } from "@/components/client-understanding/client-intake/types/analysis";
import { AuditPlanningResult } from "@/components/client-understanding/client-intake/types/audit-planning";

const pdfExtract = new PDFExtract();

export async function POST(request: Request) {
  try {

    //-----------------------------------
    // Parse uploaded files
    //-----------------------------------

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {

      return NextResponse.json(
        { message: "No files uploaded." },
        { status: 400 }
      );

    }

    //-----------------------------------
    // Extract PDF text
    //-----------------------------------

    const file = files[0];
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfExtract.extractBuffer(buffer, {});

    const extractedText = pdfData.pages
      .map((page) => page.content.map((item) => item.str).join(" "))
      .join("\n");

    console.log(
      "EXTRACTED TEXT:",
      extractedText.substring(0, 500)
    );

    //-----------------------------------
    // STAGE 1 — GPT1 Client Analysis
    // (silent — never returned to the client)
    //-----------------------------------

    const clientAnalysis =
      await runClientAnalysis(extractedText);

    console.log(
      "GPT1 Client Analysis (internal only):",
      clientAnalysis
    );

    //-----------------------------------
    // STAGE 2 — Retrieve PCAOB knowledge
    //-----------------------------------

    const module = "auditPlanning" as const;

    const query = [
      clientAnalysis.clientSummary.industry,
      clientAnalysis.businessUnderstanding.businessRisks.join(" "),
    ].join(" ");

    const chunks = await retrieveChunks({
      query,
      module,
      topK: 8,
    });

    console.log("========== RETRIEVED CHUNKS ==========");
    console.log(JSON.stringify(chunks, null, 2));

    console.log(
      "Retrieved chunks:",
      chunks.length
    );

    //-----------------------------------
    // STAGE 3 — Build GPT2 context
    //-----------------------------------

    const context = buildContext(chunks);

    console.log("========== RAG CONTEXT ==========");
    console.log(context);


    //-----------------------------------
    // STAGE 4 — GPT2 Audit Planning
    //-----------------------------------

    const auditPlanning: AuditPlanningResult =
      await chatCompletion({
        clientAnalysis: JSON.stringify(clientAnalysis),
        context,
      });

    console.log(
      "GPT2 Audit Planning (returned to client):",
      auditPlanning
    );

    //-----------------------------------
    // Return ONLY the audit planning result
    //-----------------------------------

    return NextResponse.json(auditPlanning);

  } catch (error) {

    console.error(
      "Audit planning pipeline error:",
      error
    );

    return NextResponse.json(
      { message: "Failed to generate audit planning." },
      { status: 500 }
    );

  }
}

//=====================================================
// GPT1 — Client Analysis (internal, never returned)
//=====================================================

async function runClientAnalysis(
  extractedText: string
): Promise<ClientAnalysis> {

  const completion =
    await openai.chat.completions.create({

      model: "gpt-4o-mini",

      response_format: {
        type: "json_object",
      },

      messages: [

        {
          role: "system",

          content: `
<ROLE>
You are an AI Client Analysis Assistant.

You specialize in:
- Business understanding
- Company profiling
- Industry analysis
- Business process analysis
- Business risk identification

Your job is ONLY to understand the client and business from uploaded documents. Do not perform audit planning, recommend audit procedures, or recommend additional client documents.
</ROLE>

==================================================

<OBJECTIVE>
Analyze the uploaded document and extract:

1. Client profile information
2. Business model
3. Revenue sources
4. Products and services
5. Business processes
6. Operational complexity
7. Business risks
8. Supporting evidence

The JSON structure must be followed exactly.
</OBJECTIVE>

==================================================

<ANALYSIS_INSTRUCTIONS>

STEP 1 - CLIENT UNDERSTANDING

Identify:
- Company name
- Industry
- Service sector
- Business model
- Headquarters/location
- Fiscal year end
- Number of employees
- Company description

STEP 2 - BUSINESS ANALYSIS

Determine:
- Primary revenue streams
- Products and services
- Major business processes
- Operational complexity
- Business risks

STEP 3 - BUSINESS RISK IDENTIFICATION

Identify business risks that can reasonably be inferred from the uploaded document.

Do not invent facts.
Do not recommend audit procedures.
Do not recommend audit planning.
Only identify potential business risks supported by the available information.
If there is insufficient evidence to identify a risk, do not invent one.

Consider risks related to:
- Revenue recognition
- Inventory management and valuation
- Cash management
- Accounts receivable
- Procurement and purchasing
- Fixed assets
- Supplier dependency
- Customer concentration
- Regulatory compliance
- Operational complexity
- Internal control environment
- Information technology systems
- Business continuity
- Fraud risk indicators

For each identified risk, ensure it is supported by information contained in the uploaded document.

STEP 4 - AI REASONING

Provide:
- A concise explanation summarizing the client's business.
- Explain why each identified business risk was inferred.
- Quote or summarize supporting evidence from the uploaded document.

Do not introduce information that is not supported by the uploaded document.

</ANALYSIS_INSTRUCTIONS>

==================================================

<OUTPUT_SCHEMA>
Return JSON ONLY. No markdown, no comments, no explanations outside JSON.

{
  "clientSummary": {
    "companyName": "",
    "industry": "",
    "serviceSector": "",
    "businessModel": "",
    "headquarters": "",
    "fiscalYearEnd": "",
    "employeeCount": "",
    "companyDescription": ""
  },
  "businessUnderstanding": {
    "primaryRevenueStreams": [],
    "keyProductsAndServices": [],
    "majorBusinessProcesses": [],
    "operationalComplexity": "",
    "businessRisks": []
  },
  "aiReasoning": {
    "summary": "",
    "evidence": []
  }
}
</OUTPUT_SCHEMA>

Return only the completed JSON object.
`,
        },

        {
          role: "user",
          content: extractedText,
        },

      ],

    });

  return JSON.parse(
    completion.choices[0].message.content || "{}"
  ) as ClientAnalysis;

}