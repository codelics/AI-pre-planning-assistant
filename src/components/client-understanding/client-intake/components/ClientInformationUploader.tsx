"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ClientInformationUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
}

export default function ClientInformationUploader({
  onFilesSelected,
  disabled = false,
}: ClientInformationUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (onFilesSelected) {
        onFilesSelected(acceptedFiles);
      }

      console.log("Uploaded Files:", acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    multiple: true,
    disabled,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Intake</CardTitle>

        <CardDescription>
           Upload available client information to support the AI's preliminary
          understanding of the engagement. The AI will analyze the client's
          business and available information, identify knowledge gaps, and
          recommend additional client information and supporting documents that
          auditors should request before performing detailed audit procedures.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          {...getRootProps()}
          className={`
            rounded-lg
            border-2
            border-dashed
            p-12
            text-center
            transition-all
            cursor-pointer

            ${
              isDragActive
                ? "border-primary bg-muted"
                : "border-muted-foreground/30"
            }
          `}
        >
          <input {...getInputProps()} />

          <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />

          <h3 className="mt-6 text-lg font-semibold">
            {isDragActive
              ? "Drop files here..."
              : "Upload Client Information"}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Drag & drop files here or browse from your computer.
          </p>

          <Button
            type="button"
            className="mt-6"
            onClick={open}
            disabled={disabled}
            
          >
            Browse Files
          </Button>

          <p className="mt-8 text-xs text-muted-foreground">
            Supported: PDF • DOCX • XLSX • XLS • CSV • PNG • JPG • JPEG
          </p>
        </div>
      </CardContent>
    </Card>
  );
}