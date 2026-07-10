import { fetchWithAuth } from "@/lib/data";
import { endpoints } from "@/lib/endpoints";
import type { Student } from "@/types";
import { ApplicationsList } from "./components/ApplicationsList";

export default async function ApplicationsPage() {
  const applications = await fetchWithAuth<Student[]>(
    endpoints.admission.applications
  );

  return <ApplicationsList applications={applications} />;
}
