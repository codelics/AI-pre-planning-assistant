"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-gray-200 bg-white h-[calc(100vh-64px)] p-6">

      <h2 className="mb-7 text-xs font-semibold uppercase tracking-[0.18em] text-black">
        Navigation
      </h2>

      <nav>

        {/* Dashboard */}

        <Link
          href="/"
          className={`block rounded-lg px-4 py-3 text-[15px] transition-all ${
            pathname === "/"
              ? "border-l-4 border-blue-600 bg-blue-50 font-semibold text-blue-700 shadow-sm"
              : "font-medium text-black hover:bg-gray-100"
          }`}
        >
          Dashboard
        </Link>

        {/* Client Understanding */}

        <div className="mt-9 mb-4 text-xs font-bold uppercase tracking-[0.18em] text-black">
          Client Understanding
        </div>

        <div className="space-y-1 pl-3">

          <Link
            href="/client-understanding/request"
            className={`block rounded-lg px-4 py-3 text-[15px] transition-all ${
              pathname === "/client-understanding/request"
                ? "border-l-4 border-blue-600 bg-blue-50 font-semibold text-blue-700 shadow-sm"
                : "font-medium text-black hover:bg-gray-100"
            }`}
          >
            Information Request
          </Link>

          <div className="cursor-pointer rounded-lg px-4 py-3 font-medium text-black transition-all hover:bg-gray-100">
            Documents
          </div>

          <div className="cursor-pointer rounded-lg px-4 py-3 font-medium text-black transition-all hover:bg-gray-100">
            Business Profile
          </div>

          <div className="cursor-pointer rounded-lg px-4 py-3 font-medium text-black transition-all hover:bg-gray-100">
            Industry Analysis
          </div>

          <div className="cursor-pointer rounded-lg px-4 py-3 font-medium text-black transition-all hover:bg-gray-100">
            Changes Detected
          </div>

          <div className="cursor-pointer rounded-lg px-4 py-3 font-medium text-black transition-all hover:bg-gray-100">
            Accounting Context
          </div>

          <div className="cursor-pointer rounded-lg px-4 py-3 font-medium text-black transition-all hover:bg-gray-100">
            AI Findings
          </div>

        </div>

        {/* Reports */}

        <div className="mt-9 mb-4 text-xs font-bold uppercase tracking-[0.18em] text-black">
          Reports
        </div>

        <div className="cursor-pointer rounded-lg px-4 py-3 font-medium text-black transition-all hover:bg-gray-100">
          Evidence Explorer
        </div>

        {/* Settings */}

        <div className="mt-9 mb-4 text-xs font-bold uppercase tracking-[0.18em] text-black">
          Settings
        </div>

      </nav>

    </aside>
  );
}