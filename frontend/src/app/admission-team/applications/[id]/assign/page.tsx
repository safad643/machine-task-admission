import { fetchWithAuth } from "@/lib/data";
import { endpoints } from "@/lib/endpoints";
import { Student } from "@/types";
import AssignCourseForm from "./components/AssignCourseForm";

interface ApplicationAssignCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationAssignCoursePage({
  params,
}: ApplicationAssignCoursePageProps) {
  const { id } = await params;

  const application = await fetchWithAuth<Student>(
    endpoints.admission.applicationDetail(id)
  );

  return <AssignCourseForm application={application} id={id} />;
}
