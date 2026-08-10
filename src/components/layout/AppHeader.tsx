export default function AppHeader() {
    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
            <div>
                <h1 className="text-lg font-semibold">
                    AI Audit Planning Platform
                </h1>

                <p className="text-sm text-black-600">
                    ABC Corporation • FY2026 Audit
                </p>
            </div>

            <div className="text-sm text-black-600">
                Senior Auditor
            </div>
        </header>
    );
}