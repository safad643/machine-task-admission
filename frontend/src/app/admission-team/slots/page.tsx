import { fetchWithAuth } from "@/lib/data";
import { endpoints } from "@/lib/endpoints";
import { PageShell } from "@/components/PageShell";
import type { ExamSlot } from "@/types";
import { CreateSlotForm } from "./components/CreateSlotForm";
import { SlotsTable } from "./components/SlotsTable";

export default async function ExamSlotsPage() {
  const slots = await fetchWithAuth<ExamSlot[]>(endpoints.examSlots.all);

  return (
    <PageShell
      title="Exam Slot Management"
      description="Create and manage exam slots for admission applicants."
    >
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <CreateSlotForm />
        <SlotsTable slots={slots} />
      </div>
    </PageShell>
  );
}
