"use client";

import ClientInformationUploader from "../components/ClientInformationUploader";
import UploadedFileList from "../components/UploadedFileList";

import { UploadedDocument } from "../types/uploadedDocument";

import { Button } from "@/components/ui/button";

interface UploadStateProps {
  uploadedFiles: UploadedDocument[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onGenerate: () => void;
}

export default function UploadState({
  uploadedFiles,
  onFilesSelected,
  onRemoveFile,
  onGenerate,
}: UploadStateProps) {
  return (
    <div className="space-y-6">
      <ClientInformationUploader
        onFilesSelected={onFilesSelected}
      />

      <UploadedFileList
        files={uploadedFiles}
        onRemoveFile={onRemoveFile}
      />

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={onGenerate}
          disabled={uploadedFiles.length === 0}
          size="lg"
        >
          Generate AI Recommendations
        </Button>
      </div>
    </div>
  );
}