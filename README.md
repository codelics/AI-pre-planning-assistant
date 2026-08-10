# AI Audit Planning Assistant — PCAOB + RAG

An AI-assisted audit planning application designed to help auditors during the **client pre-planning / initial planning stage**.

The system analyzes uploaded client information, identifies business risks, retrieves relevant PCAOB knowledge from a **Pinecone vector database**, and generates a structured preliminary audit planning analysis.

> **Important:** This project is an AI assistant and decision-support tool. It is not designed to replace the auditor's professional judgment, professional skepticism, responsibility, or accountability. AI-generated results require auditor review and approval.

---

## 1. What This Project Does

The current workflow is:

```text
Auditor
   |
   | Upload client information
   v
Next.js API Route
   |
   | Extract document text
   v
GPT-1 — Client Analysis
   |
   | Client understanding + business risks
   v
RAG Query Construction
   |
   | Industry + identified business risks
   v
Pinecone Vector Database
   |
   | Retrieve relevant PCAOB chunks
   v
RAG Context Builder
   |
   | Format retrieved standards
   v
GPT-2 — Audit Planning
   |
   | Structured Outputs / JSON Schema
   v
Audit Planning Result
   |
   v
Web Application
```

The RAG knowledge base is maintained separately from the live client-analysis workflow.

---

## 2. Main Purpose

The system is intended to reduce the time auditors spend starting an engagement from a blank page.

It provides an initial structure by:

- organizing client information;
- identifying business risks from the supplied client information;
- retrieving relevant PCAOB knowledge;
- connecting client risks with retrieved audit-standard context;
- generating preliminary planning areas;
- identifying areas requiring professional judgment; and
- presenting the result in a structured format.

The output is **preliminary planning support**, not a final audit conclusion.

---

## 3. Technology Stack

The project uses the following technologies that are confirmed by the current implementation:

- **Next.js**
- **TypeScript**
- **OpenAI API**
- **Pinecone**
- **PDF.js Extract**
- **Pinecone vector database / RAG**
- **Structured JSON Schema output from OpenAI**

The current development environment shown during testing used:

```text
Next.js 16.2.11
Turbopack
Node.js / npm
```

The RAG preprocessing workflow also uses Python tooling for PCAOB document preparation, including:

- `python-docx`
- `pandas`
- `langchain_text_splitters`

---

## 4. AI Architecture

### GPT-1 — Client Analysis

GPT-1 receives the extracted client document text.

Its job is to understand the client rather than perform the final audit planning.

It produces structured information including:

- company profile;
- industry;
- service sector;
- business model;
- headquarters;
- fiscal year end;
- employee count;
- company description;
- revenue streams;
- products and services;
- business processes;
- operational complexity;
- business risks; and
- supporting reasoning/evidence.

The current implementation uses:

```text
gpt-4o-mini
```

GPT-1 is intentionally separated from GPT-2 so that client understanding and audit-planning generation are different stages.

---

### RAG Retrieval

The client analysis is used to create the retrieval query.

The current route builds the query from:

```text
client industry
+
identified business risks
```

The application then calls:

```text
retrieveChunks({
  query,
  module,
  topK: 8
})
```

The module currently used by the audit-planning workflow is:

```text
auditPlanning
```

The retriever returns the most relevant PCAOB knowledge chunks from Pinecone.

---

### RAG Context Construction

The retrieved chunks are passed into:

```text
buildContext(chunks)
```

The context builder formats the retrieved knowledge into a GPT-ready string containing information such as:

- standard;
- paragraph;
- title when available; and
- retrieved content.

This formatted context is then provided to GPT-2.

---

### GPT-2 — Audit Planning

GPT-2 receives:

```text
1. Client analysis
2. Retrieved PCAOB RAG context
```

The current implementation uses:

```text
gpt-4.1
```

The response is generated using OpenAI Structured Outputs with a strict JSON Schema.

The schema currently defines:

- `executiveSummary`
- `clientBusinessUnderstanding`
- `planningAreas`
- `standardsApplied`
- `overallAuditPlanningAssessment`
- `limitations`

Each planning area contains fields such as:

- planning area;
- client risk;
- applicable standard;
- explanation;
- audit implication;
- recommended auditor focus; and
- priority.

The priority values are restricted to:

```text
Low
Medium
High
Critical
```

The overall risk level is restricted to:

```text
Low
Moderate
High
```

---

# 5. RAG Architecture

The RAG system is separated into two major processes.

## A. Offline / Knowledge-Base Ingestion

PCAOB documents are processed before the application uses them.

```text
PCAOB source documents
        |
        v
Document preprocessing
        |
        v
Paragraph / section detection
        |
        v
Chunking
        |
        v
Metadata creation
        |
        v
Embedding
        |
        v
Pinecone
```

The preprocessing code shown in the project:

- loads PCAOB `.docx` files;
- cleans document text;
- detects numbered paragraphs;
- detects sections/headings;
- keeps footnotes atomic;
- validates paragraph grouping;
- chunks long text;
- creates deterministic chunk IDs;
- stores metadata;
- creates JSONL/CSV outputs.

The demonstrated chunking configuration is:

```text
chunk size: 900
chunk overlap: 150
```

---

## B. Online / Runtime Retrieval

When an auditor uploads client information:

```text
Client document
      |
      v
Text extraction
      |
      v
GPT-1 client analysis
      |
      v
Industry + business risks
      |
      v
Embedding / similarity retrieval
      |
      v
Pinecone
      |
      v
Top 8 retrieved chunks
      |
      v
Formatted RAG context
      |
      v
GPT-2 audit planning
```

The uploaded client document is **not automatically added to the PCAOB knowledge base**.

The runtime workflow retrieves from the existing PCAOB knowledge base.

---

# 6. Pinecone's Role

Pinecone is the vector database used by this project.

It stores vector representations of the PCAOB knowledge chunks together with metadata.

The current index used during testing was:

```text
pcaob-knowledge-base
```

The retrieved records contain fields such as:

```text
id
content
metadata
```

Metadata includes information such as:

```text
document
standard
paragraph
section
is_footnote
effective_date
chunk
```

Pinecone is therefore the retrieval layer of the RAG architecture.

It is not the LLM.

---

# 7. Confirmed Important Files

The following files have been discussed and/or provided during development of this project.

## `src/app/api/audit-planning/route.ts`

This is the main runtime API route for the current audit-planning workflow.

Responsibilities:

1. Receive the uploaded file.
2. Parse the multipart form data.
3. Extract PDF text.
4. Run GPT-1 client analysis.
5. Build the RAG query.
6. Retrieve PCAOB chunks from Pinecone.
7. Build the RAG context.
8. Run GPT-2 audit planning.
9. Return the structured audit-planning result.

The runtime flow is:

```text
POST /api/audit-planning
        |
        v
formData()
        |
        v
PDF extraction
        |
        v
runClientAnalysis()
        |
        v
retrieveChunks()
        |
        v
buildContext()
        |
        v
chatCompletion()
        |
        v
NextResponse.json()
```

### Current implementation note

The route shown during development reads:

```text
files[0]
```

and extracts that first file as a PDF using `pdf.js-extract`.

Therefore, although the UI may display support for several file types, the currently shown backend route should be treated as **PDF-first / PDF-specific** unless additional parsers have been implemented elsewhere.

---

## `src/lib/rag/chunk.ts`

Contains a general text chunking utility.

It defines:

```text
TextChunk
ChunkOptions
chunkText()
```

The default runtime utility configuration is:

```text
chunkSize = 1000
overlap = 200
```

It:

- normalizes whitespace;
- handles empty documents;
- splits text into chunks;
- attempts to avoid cutting at sentence boundaries;
- adds overlap between chunks; and
- returns chunk IDs and text.

### Important distinction

The PCAOB preprocessing script shown in the project uses a separate `RecursiveCharacterTextSplitter` configuration:

```text
chunk_size = 900
chunk_overlap = 150
```

Therefore, the project contains a general TypeScript chunking utility and a separate PCAOB ingestion/preprocessing configuration.

---

## `src/lib/rag/context_builder.ts`

Transforms retrieved Pinecone chunks into a single GPT-ready context string.

It:

1. Checks whether any chunks were retrieved.
2. Returns a fallback message when none are available.
3. Formats each chunk.
4. Includes standard and paragraph metadata.
5. Includes the retrieved content.
6. Separates the chunks for the model.

This is the bridge between:

```text
Pinecone retrieval
```

and:

```text
GPT-2 audit planning
```

---

## `src/lib/rag/retriever.ts`

This is the retrieval layer referenced by the audit-planning route.

The route calls:

```text
retrieveChunks()
```

with:

```text
query
module
topK
```

Its purpose is to retrieve relevant knowledge from the vector database.

The exact internal implementation of this file should be kept synchronized with the Pinecone index configuration.

---

## `src/lib/openai/client.ts`

Contains the OpenAI client initialization.

The current implementation uses lazy initialization through:

```text
getOpenAI()
```

It checks for:

```text
OPENAI_API_KEY
```

before creating the OpenAI client.

This prevents the client from being created until it is actually needed.

---

## `src/lib/openai/chat.ts`

Contains the GPT-2 audit-planning call.

Responsibilities:

1. Receive client analysis and RAG context.
2. Build the audit-planning prompt.
3. Call OpenAI Responses API.
4. Apply the strict JSON Schema.
5. Read `response.output_text`.
6. Parse the JSON.
7. Return `AuditPlanningResult`.

This file is the main LLM-generation layer for the final audit-planning result.

---

## `src/lib/prompts/audit-planning.ts`

Contains the system-level instructions used by GPT-2.

It defines the role and behavior expected from the audit-planning model.

---

## `src/lib/prompts/build-audit-planning-prompt.ts`

Builds the runtime user prompt from:

```text
clientAnalysis
+
context
```

This allows the GPT-2 prompt to receive the current client analysis together with the retrieved PCAOB knowledge.

---

## `scripts/upload-pcaob.ts`

This is the PCAOB ingestion/upload script referenced during development.

Its role is to:

1. Load PCAOB knowledge.
2. Generate embeddings.
3. Prepare vectors.
4. Upload vectors to Pinecone.
5. Store metadata with the vectors.

During testing, the script reported:

```text
Pinecone index: pcaob-knowledge-base
```

and processed multiple PCAOB standards.

### Security note

Never commit API keys, Pinecone keys, or other credentials into this file or into GitHub.

---

# 8. PCAOB Preprocessing Script

The PCAOB preprocessing code shown during development performs several steps.

## Document loading

It loads a PCAOB Word document using:

```python
Document(INPUT_DOC)
```

## Text cleaning

It:

- normalizes Unicode;
- removes unwanted footnote superscript markers;
- normalizes whitespace;
- converts bullet characters into consistent text.

## Paragraph detection

It identifies actual numbered paragraph starts using a regular expression rather than searching a flattened document for paragraph-like numbers.

This prevents references such as:

```text
AS 2505.08
```

from being incorrectly treated as the start of paragraph `.08`.

## Heading detection

The preprocessing code checks:

- Word heading styles;
- title styles;
- bold short paragraphs;
- list formatting;
- fallback text characteristics.

## Footnote handling

Footnotes are kept as atomic entries because they contain many paragraph references that could otherwise be mistaken for new paragraph boundaries.

## Validation

The script checks for duplicate paragraph numbers before chunking.

## Chunking

The PCAOB preprocessing script uses:

```text
RecursiveCharacterTextSplitter
chunk_size = 900
chunk_overlap = 150
```

## Metadata

Each chunk contains metadata such as:

```text
document
standard
paragraph
section
is_footnote
effective_date
chunk
```

## Output

The preprocessing process creates:

```text
cleaned_document.txt
rag_chunks.jsonl
rag_chunks.csv
metadata.json
```

These outputs can be inspected before uploading vectors to Pinecone.

---

# 9. Environment Variables

Create:

```text
.env.local
```

Do not commit it to GitHub.

The project requires an OpenAI API key and Pinecone configuration.

A typical configuration should contain placeholders similar to:

```env
OPENAI_API_KEY=your_openai_api_key

PINECONE_API_KEY=your_pinecone_api_key

PINECONE_INDEX=pcaob-knowledge-base
```

Use the exact Pinecone environment-variable names expected by your current `retriever.ts` and `upload-pcaob.ts`.

Do not copy real credentials into this README.

---

# 10. Installation

## Step 1 — Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
```

## Step 2 — Install dependencies

If the repository contains `package-lock.json`:

```bash
npm ci
```

Otherwise:

```bash
npm install
```

## Step 3 — Create `.env.local`

Create:

```text
.env.local
```

Add the required API credentials.

Example:

```env
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=pcaob-knowledge-base
```

Use your actual variable names if the implementation differs.

## Step 4 — Verify Pinecone

Make sure the Pinecone index exists and matches the index configured by the application.

Current demonstrated index:

```text
pcaob-knowledge-base
```

## Step 5 — Load the PCAOB knowledge base

Run the ingestion script using the project's current command:

```bash
npx tsx --env-file=.env.local scripts/upload-pcaob.ts
```

The script should report that the Pinecone client and required keys are loaded and should begin embedding/uploading PCAOB knowledge.

Do this when initializing or intentionally updating the knowledge base.

## Step 6 — Start the application

```bash
npm run dev
```

The development server should start on:

```text
http://localhost:3000
```

---

# 11. How to Use the Application

## Step 1

Open the web application.

## Step 2

Go to:

```text
Client Understanding
→ Information Request
```

## Step 3

Upload the client information document.

The intended client-information document can contain:

- company profile;
- industry;
- service sector;
- headquarters;
- employees;
- company description;
- business model;
- products and services;
- major business processes;
- financial information;
- client-identified business risks;
- internal controls;
- management structure; and
- audit information request.

## Step 4

Submit the document for analysis.

## Step 5

The backend extracts the document text.

## Step 6

GPT-1 analyzes the client information.

## Step 7

The system constructs a RAG query from the client's industry and identified business risks.

## Step 8

Pinecone retrieves the most relevant PCAOB knowledge chunks.

The current audit-planning route requests:

```text
topK = 8
```

## Step 9

The retrieved PCAOB chunks are formatted into the RAG context.

## Step 10

GPT-2 receives:

```text
Client Analysis
+
PCAOB RAG Context
```

and generates the preliminary audit-planning result.

## Step 11

The result is returned to the web application.

---

# 12. Example Runtime Logs

During development, the pipeline was verified through logs similar to:

```text
EXTRACTED TEXT:
...

GPT1 Client Analysis:
...

========== RETRIEVED CHUNKS ==========

Retrieved chunks: 8

========== RAG CONTEXT ==========

========== Chunk 1 ==========
Standard: AS 2110
Paragraph: .70
...

GPT2 Audit Planning:
...

POST /api/audit-planning 200
```

These logs are useful for verifying that:

```text
document extraction
→ GPT-1
→ Pinecone retrieval
→ RAG context
→ GPT-2
```

are all executing.

Do not log confidential client information or secrets in production.

---

# 13. Updating the PCAOB Knowledge Base

The knowledge base is maintained separately from client uploads.

When PCAOB source material is changed:

```text
1. Update the source document.
2. Re-run preprocessing.
3. Validate the generated chunks.
4. Generate embeddings.
5. Upload/update the vectors in Pinecone.
6. Test retrieval.
7. Test the final audit-planning output.
```

Do not assume that simply uploading a new document automatically removes obsolete vectors.

If an old document must be replaced, the ingestion process should use deterministic IDs/namespaces or an explicit delete/upsert strategy so obsolete vectors do not remain in the index.

---

# 14. Client Documents vs. PCAOB Knowledge

These are intentionally different data flows.

## Client information

Used at runtime:

```text
Client document
→ text extraction
→ GPT-1
→ client analysis
```

## PCAOB knowledge

Maintained separately:

```text
PCAOB documents
→ preprocessing
→ chunks
→ embeddings
→ Pinecone
```

## Combined at runtime

```text
GPT-1 client analysis
+
Pinecone PCAOB retrieval
→ RAG context
→ GPT-2
```

This separation is an important part of the architecture.

---

# 15. Data Flow in Detail

```text
┌──────────────────────────┐
│      Auditor / UI        │
└────────────┬─────────────┘
             │
             │ Client document
             ▼
┌──────────────────────────┐
│ audit-planning/route.ts  │
└────────────┬─────────────┘
             │
             │ Extract text
             ▼
┌──────────────────────────┐
│      GPT-1 Analysis      │
│       gpt-4o-mini        │
└────────────┬─────────────┘
             │
             │ Industry + risks
             ▼
┌──────────────────────────┐
│      RAG Retriever       │
│      retrieveChunks()    │
└────────────┬─────────────┘
             │
             │ Similarity retrieval
             ▼
┌──────────────────────────┐
│         Pinecone         │
│   PCAOB Knowledge Base   │
└────────────┬─────────────┘
             │
             │ Top 8 chunks
             ▼
┌──────────────────────────┐
│     context_builder.ts   │
└────────────┬─────────────┘
             │
             │ RAG context
             ▼
┌──────────────────────────┐
│      GPT-2 Planning      │
│          gpt-4.1         │
│   Structured Outputs     │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Preliminary Audit Plan   │
└──────────────────────────┘
```

---

# 16. Why GPT-1 and GPT-2 Are Separate

The system deliberately separates:

```text
Client Understanding
```

from:

```text
Audit Planning
```

GPT-1 focuses on extracting and organizing information about the client.

GPT-2 uses that analysis together with retrieved PCAOB knowledge to generate the preliminary planning output.

This makes the pipeline easier to inspect, test, and improve.

---

# 17. Structured Output

The final audit-planning response is not simply free-form text.

OpenAI Structured Outputs are used with:

```text
strict: true
```

and a defined JSON Schema.

This helps keep the response consistent with the application's expected data structure.

The final response is parsed using:

```text
JSON.parse(response.output_text)
```

and returned as:

```text
AuditPlanningResult
```

---

# 18. Professional-Use Disclaimer

This system should be treated as an AI-assisted planning tool.

It does not:

- replace an auditor;
- replace professional judgment;
- replace professional skepticism;
- establish audit conclusions by itself;
- perform substantive audit testing;
- independently verify client information;
- replace management inquiry;
- replace walkthroughs; or
- assume responsibility for the audit engagement.

The auditor remains responsible for evaluating whether AI-generated information is appropriate for the engagement.

---

# 19. Security

Never commit:

```text
.env.local
```

or API credentials.

Your `.gitignore` should include at minimum:

```gitignore
.env
.env.local
.env.*.local
```

Also avoid logging:

- API keys;
- client confidential information;
- personally identifiable information;
- confidential financial information; or
- sensitive audit documentation.

If a secret has accidentally been exposed in source control, rotate it immediately.

---

# 20. Development Checklist

Before running the application:

```text
[ ] Node.js installed
[ ] npm installed
[ ] Dependencies installed
[ ] .env.local created
[ ] OPENAI_API_KEY configured
[ ] Pinecone API key configured
[ ] Pinecone index exists
[ ] PCAOB knowledge uploaded
[ ] No secrets committed to Git
```

Before testing the RAG:

```text
[ ] PCAOB vectors exist in Pinecone
[ ] Metadata is present
[ ] Retriever can return chunks
[ ] Retrieved chunks are relevant
[ ] RAG context contains standard references
[ ] GPT-2 receives the RAG context
```

---

# 21. Troubleshooting

## Application does not start

Run:

```bash
npm install
npm run dev
```

Check the terminal for the exact Next.js error.

---

## OpenAI error

Check:

```text
OPENAI_API_KEY
```

and confirm the key is available to the server environment.

---

## Pinecone retrieval returns zero chunks

Check:

```text
PINECONE_API_KEY
PINECONE_INDEX
```

and verify that the index contains vectors.

Also verify that the retriever's namespace/filter configuration matches the ingestion script.

---

## Retrieved chunks are irrelevant

Inspect:

```text
========== RETRIEVED CHUNKS ==========
```

in the development logs.

Check:

1. The GPT-1 client analysis.
2. The generated query.
3. The selected module.
4. The retrieved chunk scores.
5. The PCAOB metadata.
6. The chunk quality.
7. The embedding/index configuration.

---

## GPT-2 output fails schema validation

Check:

```text
auditPlanningResultSchema
```

and compare it with:

```text
AuditPlanningResult
```

Also check the prompt files:

```text
src/lib/prompts/audit-planning.ts
src/lib/prompts/build-audit-planning-prompt.ts
```

---

# 22. Recommended Testing Sequence

Test the system from left to right.

### Test 1 — Document extraction

Verify that:

```text
EXTRACTED TEXT
```

contains the expected client information.

### Test 2 — GPT-1

Verify that the client analysis contains the expected:

```text
industry
business risks
business model
revenue sources
processes
```

### Test 3 — RAG query

Verify the query is constructed from the client analysis.

### Test 4 — Pinecone

Verify that:

```text
Retrieved chunks: 8
```

or an appropriate number of relevant chunks is returned.

### Test 5 — RAG context

Verify that the context contains PCAOB standard and paragraph information.

### Test 6 — GPT-2

Verify that the final output contains the required structured fields.

### Test 7 — UI

Verify that the final result is displayed correctly.

---

# 23. Current Scope

The current feature demonstrated in development is:

```text
Client Pre-Planning / Initial Audit Planning Assistance
```

The system currently focuses on:

```text
Client Information
→ Client Understanding
→ Business Risk Identification
→ PCAOB Retrieval
→ Preliminary Audit Planning
```

It is intended to provide an initial structure so the auditor does not have to start the planning process completely from scratch.

---

# 24. Future Development

Potential future improvements include:

- broader document-format support;
- improved document ingestion;
- better citation/source display;
- richer Pinecone metadata filtering;
- audit-standard coverage expansion;
- stronger retrieval evaluation;
- document versioning;
- knowledge-base update workflows;
- audit-trail logging;
- user authentication;
- role-based access;
- persistent engagement storage;
- auditor approval workflows;
- human-in-the-loop review;
- additional audit-planning modules;
- evidence exploration;
- change detection;
- accounting-context analysis; and
- additional AI-assisted audit features.

These items are future development considerations and should not be interpreted as currently implemented functionality unless present in the repository.

---

# 25. Repository Structure

The following structure reflects the files confirmed during development. Other UI files may exist in the repository but were not fully provided in the materials used to prepare this README.

```text
client-understanding-ai-team-ui/
│
├── src/
│   ├── app/
│   │   └── api/
│   │       └── audit-planning/
│   │           └── route.ts
│   │
│   ├── lib/
│   │   ├── openai/
│   │   │   ├── client.ts
│   │   │   └── chat.ts
│   │   │
│   │   ├── prompts/
│   │   │   ├── audit-planning.ts
│   │   │   └── build-audit-planning-prompt.ts
│   │   │
│   │   └── rag/
│   │       ├── chunk.ts
│   │       ├── context_builder.ts
│   │       └── retriever.ts
│   │
│   └── components/
│       └── client-understanding/
│           └── client-intake/
│               └── types/
│                   ├── analysis.ts
│                   └── audit-planning.ts
│
├── scripts/
│   └── upload-pcaob.ts
│
├── .env.local
├── package.json
└── README.md
```

---

# 26. File Responsibility Summary

| File | Responsibility |
|---|---|
| `src/app/api/audit-planning/route.ts` | Main audit-planning API pipeline |
| `src/lib/rag/chunk.ts` | General TypeScript text chunking |
| `src/lib/rag/retriever.ts` | Retrieves relevant Pinecone knowledge |
| `src/lib/rag/context_builder.ts` | Converts retrieved chunks into GPT context |
| `src/lib/openai/client.ts` | Initializes OpenAI client |
| `src/lib/openai/chat.ts` | GPT-2 audit-planning generation |
| `src/lib/prompts/audit-planning.ts` | GPT-2 system instructions |
| `src/lib/prompts/build-audit-planning-prompt.ts` | Builds GPT-2 runtime prompt |
| `scripts/upload-pcaob.ts` | PCAOB embedding/vector ingestion |
| `src/components/.../analysis.ts` | Client-analysis TypeScript type |
| `src/components/.../audit-planning.ts` | Audit-planning TypeScript type |

---

# 27. Quick Start

For an already configured environment:

```bash
npm ci
```

Create/configure:

```text
.env.local
```

Load/update PCAOB knowledge when needed:

```bash
npx tsx --env-file=.env.local scripts/upload-pcaob.ts
```

Start the application:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Then:

```text
Client Understanding
→ Information Request
→ Upload Client Information
→ Generate AI Recommendations
```

---

# 28. Final Note

This project demonstrates how an AI assistant can combine:

```text
LLM reasoning
+
structured outputs
+
retrieval-augmented generation
+
Pinecone vector search
+
PCAOB knowledge
+
human auditor review
```

The core design principle is:

> **AI assists the auditor; the auditor remains the decision-maker.**

The objective is to make the initial audit-planning process more organized, productive, and efficient while keeping professional judgment at the center of the engagement.
