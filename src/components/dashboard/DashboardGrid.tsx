import StatusCard from "./StatusCard";
import ProgressCard from "./ProgressCard";
import FindingsCard from "./FindingsCard";
import EvidenceCoverageCard from "./EvidenceCoverageCard";


interface DashboardGridProps{
    status: number;

    documents:{
        received: number;
        total: number;
    };

    aiAnalysis:{
        completed:number;
        total:number;
    };

    findings: number;

    evidenceCoverage: number;

}

export default function DashboardGrid({
    status,
    documents,
    aiAnalysis,
    findings,
    evidenceCoverage,
}:DashboardGridProps){
    return(
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <StatusCard status={status} />

            <ProgressCard
                title="Documents"
                current={documents.received}
                total={documents.total}
                label="Received"
            />

            <ProgressCard
                title="AI Analysis"
                current={aiAnalysis.completed}
                total={aiAnalysis.total}
                label="Agents Complete"
            />

            <FindingsCard findings={findings} />
            <EvidenceCoverageCard coverage={evidenceCoverage} />

        </div>
    );
}