// src/lib/audit-planning/knowledge-router.ts

export const knowledgeRouter = {
  clientInformationRequest: [
    "AS1105",
    "AS2101",
    "AS2110",
  ],

  auditPlanning: [
    "AS2101",
    "AS2105",
    "AS2110",
  ],

  riskAssessment: [
    "AS2110",
    "AS2301",
  ],

  internalControl: [
    "AS2201",
  ],

  auditEvidence: [
    "AS1105",
  ],
} as const;

export type KnowledgeModule = keyof typeof knowledgeRouter;

/**
 * Returns the PCAOB standards assigned to a knowledge module.
 */
export function getKnowledgeStandards(
  module: KnowledgeModule
): readonly string[] {
  return knowledgeRouter[module];
}

/**
 * Checks if a string is a valid knowledge module.
 */
export function isKnowledgeModule(
  value: string
): value is KnowledgeModule {
  return value in knowledgeRouter;
}