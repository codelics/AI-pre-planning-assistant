export type DocumentStatus =
  | "Ready"
  | "Uploading"
  | "Analyzing"
  | "Completed"
  | "Failed";

export interface UploadedDocument {
  id: string;
  file: File;
  uploadedAt: Date;
  status: DocumentStatus;
}