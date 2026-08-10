export interface ClientSummary {
  companyName: string;
  industry: string;
  serviceSector: string;
  businessModel: string;
  fiscalYearEnd: string;
  headquarters: string;
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