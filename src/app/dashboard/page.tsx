import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import { dashboardData } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <DashboardHeader
        company={dashboardData.company}
        auditYear={dashboardData.auditYear}
        status={dashboardData.status}
      />

      <DashboardGrid
        status={dashboardData.status}
        documents={dashboardData.documents}
        aiAnalysis={dashboardData.aiAnalysis}
        findings={dashboardData.findings}
        evidenceCoverage={dashboardData.evidenceCoverage}
      />
    </div>
  );
}