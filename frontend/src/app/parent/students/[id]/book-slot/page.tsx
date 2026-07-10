import { fetchWithAuth } from "@/lib/data";
import { endpoints } from "@/lib/endpoints";
import type { Student, ExamSlot } from "@/types";
import { BookSlotClient } from "./components/BookSlotClient";

interface BookSlotPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookSlotPage({ params }: BookSlotPageProps) {
  const { id } = await params;

  const student = await fetchWithAuth<Student>(endpoints.students.detail(id));
  const slots = await fetchWithAuth<ExamSlot[]>(endpoints.examSlots.list);

  return <BookSlotClient student={student} slots={slots} id={id} />;
}
