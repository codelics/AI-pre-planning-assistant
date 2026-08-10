interface FindingsCardProps{
    findings:number;
}

export default function FindingsCard({findings,}:FindingsCardProps){
    return(
        <div className="rounded-lg border bg-white p-6 shadow-sm cursor-pointer hover:shadow-md transition">
            <h3 className="font-semibold text-lg">
                Important Insights
            </h3>

            <p className="mt-6 text-3xl font-bold">
                {findings}
            </p>

            <p className="text-gray-500">Findings</p>
        </div>
    );
}