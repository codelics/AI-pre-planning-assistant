"use client";

import {
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UploadedDocument } from "@/components/client-understanding/client-intake/types/uploadedDocument";

interface UploadedFileListProps {
  files: UploadedDocument[];
  onRemoveFile: (id: string) => void;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUploadDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />;

    case "xls":
    case "xlsx":
    case "csv":
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />;

    case "png":
    case "jpg":
    case "jpeg":
    case "avif":
    case "webp":
      return <FileImage className="h-5 w-5 text-blue-500" />;

    case "zip":
      return <FileArchive className="h-5 w-5 text-yellow-600" />;

    default:
      return <FileText className="h-5 w-5 text-muted-foreground" />;
  }
}

export default function UploadedFileList({
  files,
  onRemoveFile,
}: UploadedFileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="rounded-lg border bg-background">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="font-semibold">
          Uploaded Client Information
        </h2>

        <Badge variant="outline">
          {files.length}{" "}
          {files.length === 1
            ? "Document Uploaded"
            : "Documents Uploaded"}
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Type</TableHead>
            <TableHead>Document Name</TableHead>
            <TableHead className="w-32">Size</TableHead>
            <TableHead className="w-56">Uploaded</TableHead>
            <TableHead className="w-32 text-center">
              Status
            </TableHead>
            <TableHead className="w-24 text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {files.map((document) => (
            <TableRow key={document.id}>
              <TableCell>
                {getFileIcon(document.file.name)}
              </TableCell>

              <TableCell>
                <div className="max-w-md">
                  <p
                    className="truncate font-medium"
                    title={document.file.name}
                  >
                    {document.file.name}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                {formatFileSize(document.file.size)}
              </TableCell>

              <TableCell>
                {formatUploadDate(document.uploadedAt)}
              </TableCell>

              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 hover:bg-green-100"
                >
                  {document.status}
                </Badge>
              </TableCell>

              <TableCell className="text-center">
                <button
                  type="button"
                  onClick={() => onRemoveFile(document.id)}
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remove ${document.file.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}