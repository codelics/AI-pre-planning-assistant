// src/types/client-analysis.ts

/**
 * Output returned by GPT-1 (Client Analysis).
 * This object is passed into GPT-2 for audit planning.
 */

export interface ClientSummary {
  companyName: string;
  industry: string;
  serviceSector: string;
  businessModel: string;
  headquarters: string;
  fiscalYearEnd: string;
  employeeCount: string;
  companyDescription: string;
}

export interface BusinessUnderstanding {
  primaryRevenueStreams: string[];
  keyProductsAndServices: string[];
  majorBusinessProcesses: string[];
  operationalComplexity: string;
  businessRisks: string[];
}

export interface AIReasoning {
  summary: string;
  evidence: string[];
}

export interface ClientAnalysis {
  clientSummary: ClientSummary;
  businessUnderstanding: BusinessUnderstanding;
  aiReasoning: AIReasoning;
}