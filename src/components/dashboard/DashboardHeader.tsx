interface DashboardHeaderProps{
    company: string;
    auditYear: number;
    status: number;
}

export default function DashboardHeader({
    company,
    auditYear,
    status,
}:DashboardHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold">{company}</h1>

            <p className="mt-2 text-gray-500 text-lg">
                Client Understanding Dashboard
            </p>

            <div className="mt-6 flex gap-10">
                <div>
                    <p className="text-sm text-gray-500">Audit Year</p>
                    <p className="text-xl font-semibold">{auditYear}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-xl font-semibold text-blue-600">
                        {status}% Complete
                    </p>
                </div>
            </div>
        </div>                 
    );
}