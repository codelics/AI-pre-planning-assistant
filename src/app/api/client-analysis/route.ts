import { NextResponse } from "next/server";
import { PDFExtract } from "pdf.js-extract";

import { openai } from "@/lib/openai";

const pdfExtract = new PDFExtract();


export async function POST(request: Request) {

  try {

    const formData = await request.formData();

    const files = formData.getAll("files") as File[];


    console.log(
      "Received Files:",
      files
    );


    if (!files.length) {

      return NextResponse.json(
        {
          message: "No files uploaded.",
        },
        {
          status: 400,
        }
      );

    }



    // ===============================
    // EXTRACT PDF TEXT
    // ===============================

    const file = files[0];

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );


    const pdfData =
      await pdfExtract.extractBuffer(
        buffer,
        {}
      );


    const extractedText =
      pdfData.pages
        .map((page) =>
          page.content
            .map((item) => item.str)
            .join(" ")
        )
        .join("\n");



    console.log(
      "EXTRACTED TEXT:",
      extractedText.substring(0,500)
    );



    // ===============================
    // OPENAI CLIENT ANALYSIS
    // ===============================


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


The result will directly populate a React UI.

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


Return JSON ONLY.

Do not return:
- Markdown
- Comments
- Explanations outside JSON


The JSON MUST exactly match this structure:


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


==================================================


<VALIDATION_CHECKLIST>

Before returning JSON verify:


CLIENT SUMMARY:

[ ] Company name completed

[ ] Industry completed

[ ] Service sector completed

[ ] Business model completed

[ ] Headquarters/location completed

[ ] Fiscal year end completed

[ ] Employee count completed

[ ] Company description completed



BUSINESS UNDERSTANDING:

[ ] Primary revenue streams identified

[ ] Key products and services identified

[ ] Major business processes identified

[ ] Operational complexity assessed

[ ] Business model identified


BUSINESS RISK IDENTIFICATION:

[ ] Business risks identified

[ ] Risks are supported by the uploaded document

[ ] No unsupported assumptions were made

[ ] No audit procedures were recommended

[ ] No audit planning recommendations were generated

[ ] Every identified risk has supporting evidence


DATA QUALITY:

[ ] All extracted information is based only on the uploaded document

[ ] Unknown information is left blank or marked as "Not identified"

[ ] No hallucinated company information was added



AI REASONING:

[ ] Summary completed

[ ] Evidence contains at least 3 supporting observations

[ ] Evidence is based only on the uploaded document



FINAL CHECK:

[ ] JSON is valid

[ ] JSON matches the required schema exactly

[ ] No extra fields were added

[ ] No Markdown was returned

[ ] No audit planning recommendations were included

[ ] No client information request recommendations were included


</VALIDATION_CHECKLIST>


==================================================


Return only the completed JSON object.

`

          },


          {

            role:"user",

            content: extractedText,

          }


        ],

      });



    const analysis =
      JSON.parse(
        completion
          .choices[0]
          .message
          .content || "{}"
      );



    console.log(
      "AI ANALYSIS:",
      analysis
    );



    return NextResponse.json(
      analysis
    );



  } catch(error) {


    console.error(
      "Client analysis error:",
      error
    );



    return NextResponse.json(

      {
        message:
          "Failed to analyze client."
      },

      {
        status:500
      }

    );

  }

}