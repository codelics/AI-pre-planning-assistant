"use client";

import { Badge } from "@/components/ui/badge";

import {
  CheckCircle2,
  LoaderCircle,
  Circle,
} from "lucide-react";

interface AnalysisProgressProps {
  progress: number;
}

export default function AnalysisProgress({
  progress,
}: AnalysisProgressProps) {
  const steps = [
    {
      title: "Reading client information",
      status: progress >= 20 ? "completed" : "current",
    },
    {
      title: "Identifying industry",
      status:
        progress >= 40
          ? "completed"
          : progress >= 20
          ? "current"
          : "pending",
    },
    {
      title: "Understanding business model",
      status:
        progress >= 60
          ? "completed"
          : progress >= 40
          ? "current"
          : "pending",
    },
    {
      title: "Determining required client information",
      status:
        progress >= 80
          ? "completed"
          : progress >= 60
          ? "current"
          : "pending",
    },
    {
      title: "Generating audit planning recommendations",
      status:
        progress >= 100
          ? "completed"
          : progress >= 80
          ? "current"
          : "pending",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl rounded-xl border bg-background p-8 shadow-sm">

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">
          Analyzing Client Information
        </h2>

        <p className="text-muted-foreground">
          AI is reviewing the uploaded client information to determine the
          recommended information requests and preliminary audit planning.
        </p>
      </div>

      <div className="mt-8 space-y-3">

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Analysis Progress
          </span>

          <Badge variant="outline">
            {progress}%
          </Badge>
        </div>

        {/* Temporary Tailwind progress bar */}

        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

      </div>

      <div className="mt-10 space-y-5">
        {steps.map((step) => (
          <div
            key={step.title}
            className="flex items-center gap-4"
          >
            {step.status === "completed" && (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            )}

            {step.status === "current" && (
              <LoaderCircle className="h-5 w-5 animate-spin text-blue-600" />
            )}

            {step.status === "pending" && (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}

            <span
              className={
                step.status === "pending"
                  ? "text-muted-foreground"
                  : "font-medium"
              }
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg border bg-muted/40 p-4">
        <p className="text-sm text-muted-foreground">
          Please wait while the AI analyzes the client information. This
          process identifies the client's business characteristics,
          determines the information required from the client, and prepares
          preliminary audit planning recommendations.
        </p>
      </div>

    </div>
  );
}