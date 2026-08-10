import { ClientAnalysis } from "../types/analysis";

export const clientAnalysis: ClientAnalysis = {
  clientSummary: {
    companyName: "ABC Manufacturing Corporation",
    industry: "Manufacturing",
    serviceSector: "Industrial Equipment",
    businessModel: "Manufactures and distributes industrial equipment to commercial customers.",
    fiscalYearEnd: "December 31",
    headquarters: "Quezon City, Philippines",
    employeeCount: 275,
    companyDescription:
      "ABC Manufacturing Corporation designs, manufactures, and distributes industrial machinery and replacement parts for commercial clients across the Philippines.",
  },

  businessUnderstanding: {
    primaryRevenueStreams: [
      "Equipment Sales",
      "Maintenance Services",
      "Replacement Parts",
    ],

    keyProductsAndServices: [
      "Industrial Pumps",
      "Industrial Machinery",
      "Preventive Maintenance",
    ],

    majorBusinessProcesses: [
      "Procurement",
      "Manufacturing",
      "Inventory Management",
      "Sales",
      "Distribution",
      "After-sales Support",
    ],

    regulatoryEnvironment: [
      "BIR Regulations",
      "Philippine Financial Reporting Standards (PFRS)",
      "Corporate Governance Requirements",
    ],

    operationalComplexity: "Medium",

    businessRisks: [
      "Inventory valuation",
      "Revenue recognition",
      "Supply chain disruption",
      "Foreign supplier dependency",
    ],
  },

  recommendedClientInformationRequests: [
    {
      id: crypto.randomUUID(),
      documentName: "Trial Balance",
      priority: "High",
      reason:
        "Required as the primary financial data source for audit planning.",
    },

    {
      id: crypto.randomUUID(),
      documentName: "General Ledger",
      priority: "High",
      reason:
        "Required to understand account activity and significant transactions.",
    },

    {
      id: crypto.randomUUID(),
      documentName: "Bank Statements",
      priority: "High",
      reason:
        "Supports cash verification and preliminary analytical procedures.",
    },

    {
      id: crypto.randomUUID(),
      documentName: "Inventory Listing",
      priority: "High",
      reason:
        "Inventory represents a significant account balance for this client.",
    },

    {
      id: crypto.randomUUID(),
      documentName: "Organization Chart",
      priority: "Medium",
      reason:
        "Helps understand management structure and governance.",
    },
  ],

  preliminaryAuditPlanning: [
    {
      id: crypto.randomUUID(),
      planningArea: "Revenue Recognition",
      riskLevel: "High",
      recommendation:
        "Perform detailed substantive testing over revenue transactions and evaluate revenue recognition controls.",
    },

    {
      id: crypto.randomUUID(),
      planningArea: "Inventory",
      riskLevel: "High",
      recommendation:
        "Plan inventory observation and perform valuation testing.",
    },

    {
      id: crypto.randomUUID(),
      planningArea: "Cash",
      riskLevel: "Medium",
      recommendation:
        "Perform bank confirmations and bank reconciliation testing.",
    },

    {
      id: crypto.randomUUID(),
      planningArea: "Fixed Assets",
      riskLevel: "Medium",
      recommendation:
        "Verify significant additions and inspect supporting documentation.",
    },

    {
      id: crypto.randomUUID(),
      planningArea: "Internal Controls",
      riskLevel: "Medium",
      recommendation:
        "Evaluate key business processes and identify control deficiencies.",
    },
  ],

  aiReasoning: {
    summary:
      "The client operates within the manufacturing industry where inventory, revenue recognition, and procurement activities represent the primary audit focus. Based on the client's business profile, the recommended information requests support risk assessment and preliminary audit planning.",

    evidence: [
      "Manufacturing businesses typically maintain significant inventory balances.",
      "Revenue is generated through product sales and maintenance services.",
      "Inventory valuation and revenue recognition are expected significant risk areas.",
      "Cash and procurement activities require early audit planning consideration.",
    ],
  },
};

export default clientAnalysis;