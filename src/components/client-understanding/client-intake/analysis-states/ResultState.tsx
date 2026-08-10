"use client";

import { AuditPlanningResult } from "../types/audit-planning";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResultStateProps {
  analysis: AuditPlanningResult;
}

export default function ResultState(props: ResultStateProps) {
  const { analysis } = props;

  if (!analysis) {
    return (
      <div className="p-10 text-red-500">
        Audit planning result is undefined.
      </div>
    );
  }

  const { clientBusinessUnderstanding, overallAuditPlanningAssessment } =
    analysis;

  return (
    <div className="space-y-6">
      {/* Header */}

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">
            AI Audit Planning
          </CardTitle>

          <p className="text-muted-foreground">
            {analysis.executiveSummary}
          </p>
        </CardHeader>
      </Card>

      {/* Client Business Understanding */}

      <Card>
        <CardHeader>
          <CardTitle>Client Business Understanding</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-medium">
                {clientBusinessUnderstanding.companyName}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Industry</p>
              <p className="font-medium">
                {clientBusinessUnderstanding.industry}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Business Model</p>
              <p className="font-medium">
                {clientBusinessUnderstanding.businessModel}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Operational Complexity
              </p>
              <Badge>
                {clientBusinessUnderstanding.operationalComplexity}
              </Badge>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="mb-2 font-medium">Revenue Sources</p>
              <div className="flex flex-wrap gap-2">
                {clientBusinessUnderstanding.revenueSources.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium">Products & Services</p>
              <div className="flex flex-wrap gap-2">
                {clientBusinessUnderstanding.productsAndServices.map(
                  (item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  )
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium">Major Business Processes</p>
              <div className="flex flex-wrap gap-2">
                {clientBusinessUnderstanding.majorBusinessProcesses.map(
                  (item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planning Areas */}

      <Card>
        <CardHeader>
          <CardTitle>Planning Areas</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left">Planning Area</th>
                <th className="py-3 text-left">Client Risk</th>
                <th className="py-3 text-left">Priority</th>
                <th className="py-3 text-left">Standard</th>
                <th className="py-3 text-left">Auditor Focus</th>
              </tr>
            </thead>

            <tbody>
              {analysis.planningAreas.map((area) => (
                <tr key={area.id} className="border-b">
                  <td className="py-3 font-medium">{area.planningArea}</td>
                  <td className="py-3 text-muted-foreground">
                    {area.clientRisk}
                  </td>
                  <td className="py-3">
                    <Badge>{area.priority}</Badge>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {area.applicableStandard}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {area.recommendedAuditorFocus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Standards Applied */}

      <Card>
        <CardHeader>
          <CardTitle>Standards Applied</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {analysis.standardsApplied.map((standard) => (
            <div key={standard.standardNumber}>
              <p className="font-medium">
                {standard.standardNumber} — {standard.standardTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                {standard.reasonApplied}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Overall Assessment */}

      <Card>
        <CardHeader>
          <CardTitle>Overall Audit Planning Assessment</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Overall Risk Level
            </p>
            <Badge>{overallAuditPlanningAssessment.overallRiskLevel}</Badge>
          </div>

          <div>
            <p className="mb-2 font-medium">
              Significant Planning Considerations
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {overallAuditPlanningAssessment.significantPlanningConsiderations.map(
                (item) => (
                  <li key={item}>{item}</li>
                )
              )}
            </ul>
          </div>

          <div>
            <p className="mb-2 font-medium">
              Areas Requiring Professional Judgment
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {overallAuditPlanningAssessment.areasRequiringProfessionalJudgment.map(
                (item) => (
                  <li key={item}>{item}</li>
                )
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Limitations */}

      <Card>
        <CardHeader>
          <CardTitle>Limitations</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">{analysis.limitations}</p>
        </CardContent>
      </Card>
    </div>
  );
}