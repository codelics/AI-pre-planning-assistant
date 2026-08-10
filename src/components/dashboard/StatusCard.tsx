interface StatusCardProps {
    status: number;
}

export default function StatusCard({ status }: StatusCardProps) {
    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-lg">Status</h3>

            <div className="mt-4 h-3 w-full rounded-full bg-gray-200">
                <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{ width: `${status}%` }}
                />
            </div>

            <p className="mt-4 text-lg font-semibold">
                {status}% Complete
            </p>
        </div>
    );
}