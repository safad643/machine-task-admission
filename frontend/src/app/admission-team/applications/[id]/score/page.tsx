import { fetchWithAuth } from "@/lib/data";
import { endpoints } from "@/lib/endpoints";
import { Student } from "@/types";
import ScoreForm from "./components/ScoreForm";

export default async function ApplicationScorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await fetchWithAuth<Student>(
    endpoints.admission.applicationDetail(id)
  );

  return <ScoreForm application={application} id={id} />;
}
