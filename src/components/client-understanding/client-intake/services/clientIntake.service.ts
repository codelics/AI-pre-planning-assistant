import { AuditPlanningResult } from "../types/audit-planning";
import { UploadedDocument } from "../types/uploadedDocument";

class ClientIntakeService {
  async analyzeClient(
    uploadedFiles: UploadedDocument[]
  ): Promise<AuditPlanningResult> {
    const formData = new FormData();

    uploadedFiles.forEach((document) => {
      formData.append(
        "files",
        document.file
      );
    });

    const response = await fetch(
      "/api/audit-planning",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Audit planning generation failed.");
    }

    const result =
      (await response.json()) as AuditPlanningResult;

    console.log(
      "API Response:",
      result
    );

    return result;
  }
}

const clientIntakeService =
  new ClientIntakeService();

export default clientIntakeService;