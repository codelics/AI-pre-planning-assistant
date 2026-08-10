// src/types/audit-planning.ts

/**
 * GPT2 Audit Planning Result
 *
 * This is the structured output returned by the
 * Audit Planning AI.
 */

export interface AuditPlanningResult {

  executiveSummary: string;

  clientBusinessUnderstanding: ClientBusinessUnderstanding;

  planningAreas: PlanningArea[];

  standardsApplied: StandardReference[];

  overallAuditPlanningAssessment: OverallAuditPlanningAssessment;

  limitations: string;

}

/**
 * Summary of the client's business
 * used during audit planning.
 */
export interface ClientBusinessUnderstanding {

  companyName: string;

  industry: string;

 businessModel: string;

  revenueSources: string[];

  productsAndServices: string[];

  majorBusinessProcesses: string[];

  operationalComplexity: string;

}

/**
 * Individual audit planning area.
 */
export interface PlanningArea {

  id: string;

  planningArea: string;

  clientRisk: string;

  applicableStandard: string;

  explanation: string;

  auditImplication: string;

  recommendedAuditorFocus: string;

  priority: AuditPriority;

}

/**
 * PCAOB standards used by GPT2.
 */
export interface StandardReference {

  standardNumber: string;

  standardTitle: string;

  reasonApplied: string;

}

/**
 * Overall audit planning assessment.
 */
export interface OverallAuditPlanningAssessment {

  overallRiskLevel: RiskLevel;

  significantPlanningConsiderations: string[];

  areasRequiringProfessionalJudgment: string[];

}

/**
 * Audit priority.
 */
export type AuditPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

/**
 * Overall risk level.
 */
export type RiskLevel =
  | "Low"
  | "Moderate"
  | "High";