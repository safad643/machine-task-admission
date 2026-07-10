import { fetchWithAuth } from "@/lib/data";
import { endpoints } from "@/lib/endpoints";
import { Student } from "@/types";
import { StudentDetailClient } from "./components/StudentDetailClient";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const student = await fetchWithAuth<Student>(endpoints.students.detail(id));

  return (
    <div className="mx-auto max-w-6xl">
      <StudentDetailClient student={student} id={id} />
    </div>
  );
}
