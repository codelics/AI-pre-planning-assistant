interface EvidenceCoverageCardProps{
    coverage:number;
}

export default function EvidenceCoverageCard({coverage,}:EvidenceCoverageCardProps){
    return(
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-lg">
                Evidence Coverage
            </h3>

            <p className="mt-6 text-3xl font-bold text-green-600">
                {coverage}%
            </p>
        </div>
    );
}