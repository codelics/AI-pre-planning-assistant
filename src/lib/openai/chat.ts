// src/lib/openai/chat.ts

import { getOpenAI } from "./client";

import { auditPlanningSystemPrompt } from "@/lib/prompts/audit-planning";
import { buildAuditPlanningPrompt } from "@/lib/prompts/build-audit-planning-prompt";

import type {
  AuditPlanningResult,
} from "@/components/client-understanding/client-intake/types/audit-planning";

interface ChatCompletionOptions {
  clientAnalysis: string;
  context: string;
}

//=====================================================
// JSON Schema — enforced via OpenAI Structured Outputs
//=====================================================

const auditPlanningResultSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    executiveSummary: {
      type: "string",
    },

    clientBusinessUnderstanding: {
      type: "object",
      additionalProperties: false,
      properties: {
        companyName: {
          type: "string",
        },
        industry: {
          type: "string",
        },
        businessModel: {
          type: "string",
        },
        revenueSources: {
          type: "array",
          items: {
            type: "string",
          },
        },
        productsAndServices: {
          type: "array",
          items: {
            type: "string",
          },
        },
        majorBusinessProcesses: {
          type: "array",
          items: {
            type: "string",
          },
        },
        operationalComplexity: {
          type: "string",
        },
      },
      required: [
        "companyName",
        "industry",
        "businessModel",
        "revenueSources",
        "productsAndServices",
        "majorBusinessProcesses",
        "operationalComplexity",
      ],
    },

    planningAreas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: {
            type: "string",
          },
          planningArea: {
            type: "string",
          },
          clientRisk: {
            type: "string",
          },
          applicableStandard: {
            type: "string",
          },
          explanation: {
            type: "string",
          },
          auditImplication: {
            type: "string",
          },
          recommendedAuditorFocus: {
            type: "string",
          },
          priority: {
            type: "string",
            enum: [
              "Low",
              "Medium",
              "High",
              "Critical",
            ],
          },
        },
        required: [
          "id",
          "planningArea",
          "clientRisk",
          "applicableStandard",
          "explanation",
          "auditImplication",
          "recommendedAuditorFocus",
          "priority",
        ],
      },
    },

    standardsApplied: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          standardNumber: {
            type: "string",
          },
          standardTitle: {
            type: "string",
          },
          reasonApplied: {
            type: "string",
          },
        },
        required: [
          "standardNumber",
          "standardTitle",
          "reasonApplied",
        ],
      },
    },

    overallAuditPlanningAssessment: {
      type: "object",
      additionalProperties: false,
      properties: {
        overallRiskLevel: {
          type: "string",
          enum: [
            "Low",
            "Moderate",
            "High",
          ],
        },
        significantPlanningConsiderations: {
          type: "array",
          items: {
            type: "string",
          },
        },
        areasRequiringProfessionalJudgment: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: [
        "overallRiskLevel",
        "significantPlanningConsiderations",
        "areasRequiringProfessionalJudgment",
      ],
    },

    limitations: {
      type: "string",
    },
  },

  required: [
    "executiveSummary",
    "clientBusinessUnderstanding",
    "planningAreas",
    "standardsApplied",
    "overallAuditPlanningAssessment",
    "limitations",
  ],
} as const;

export async function chatCompletion({
  clientAnalysis,
  context,
}: ChatCompletionOptions): Promise<AuditPlanningResult> {

  //-----------------------------------
  // Get OpenAI client
  //-----------------------------------

  const openai = getOpenAI();

  //-----------------------------------
  // Build GPT prompt
  //-----------------------------------

  const prompt =
    buildAuditPlanningPrompt({
      clientAnalysis,
      context,
    });

  //-----------------------------------
  // Call OpenAI
  //-----------------------------------

  const response =
    await openai.responses.create({

      model: "gpt-4.1",

      input: [

        {
          role: "system",

          content:
            auditPlanningSystemPrompt,
        },

        {
          role: "user",

          content:
            prompt,
        },

      ],

      text: {
        format: {
          type: "json_schema",
          name: "audit_planning_result",
          strict: true,
          schema: auditPlanningResultSchema,
        },
      },

    });

  //-----------------------------------
  // Parse JSON
  //-----------------------------------

  const output =
    response.output_text;

  const auditPlanning =
    JSON.parse(
      output
    ) as AuditPlanningResult;

  //-----------------------------------
  // Return result
  //-----------------------------------

  return auditPlanning;

}