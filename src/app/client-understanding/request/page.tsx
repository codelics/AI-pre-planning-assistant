"use client";

import { useState } from "react";

import MainLayout from "@/components/layout/MainLayout";

import UploadState from "@/components/client-understanding/client-intake/analysis-states/UploadState";
import LoadingState from "@/components/client-understanding/client-intake/analysis-states/LoadingState";
import ResultState from "@/components/client-understanding/client-intake/analysis-states/ResultState";

import { AnalysisState } from "@/components/client-understanding/client-intake/analysis-states/AnalysisState";
import { UploadedDocument } from "@/components/client-understanding/client-intake/types/uploadedDocument";
import { AuditPlanningResult } from "@/components/client-understanding/client-intake/types/audit-planning";
import clientIntakeService from "@/components/client-understanding/client-intake/services/clientIntake.service";

export default function InformationRequestPage() {
  const [uploadedFiles, setUploadedFiles] =
    useState<UploadedDocument[]>([]);

  const [analysisState, setAnalysisState] =
    useState<AnalysisState>("upload");

  const [analysis, setAnalysis] =
    useState<AuditPlanningResult | null>(null);

  const [isGenerationComplete, setIsGenerationComplete] =
    useState(false);

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles((previousFiles) => {
      const existingFiles = new Set(
        previousFiles.map(
          (document) =>
            `${document.file.name}-${document.file.size}-${document.file.lastModified}`
        )
      );

      const newDocuments: UploadedDocument[] = files
        .filter((file) => {
          const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
          return !existingFiles.has(fileKey);
        })
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          uploadedAt: new Date(),
          status: "Ready",
        }));

      return [...previousFiles, ...newDocuments];
    });
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((previousFiles) =>
      previousFiles.filter(
        (document) => document.id !== id
      )
    );
  };

  const handleGenerate = async () => {
    try {
      setAnalysisState("loading");
      setIsGenerationComplete(false);

      const result =
        await clientIntakeService.analyzeClient(
          uploadedFiles
        );

      if (!result) {
        setAnalysisState("upload");
        return;
      }

      setIsGenerationComplete(true);
      setAnalysis(result);
      setAnalysisState("completed");
    } catch (error) {
      console.error(error);
      setAnalysisState("upload");
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Information Request
          </h1>

          <p className="mt-2 text-gray-600">
            AI-assisted client information request planning.
          </p>
        </div>

        {analysisState === "upload" && (
          <UploadState
            uploadedFiles={uploadedFiles}
            onFilesSelected={handleFilesSelected}
            onRemoveFile={handleRemoveFile}
            onGenerate={handleGenerate}
          />
        )}

        {analysisState === "loading" && (
          <LoadingState isComplete={isGenerationComplete} />
        )}

        {analysisState === "completed" &&
          analysis && (
            <ResultState analysis={analysis} />
          )}

      </div>
    </MainLayout>
  );
}