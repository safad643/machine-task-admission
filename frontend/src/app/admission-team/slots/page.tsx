import { fetchWithAuth } from "@/lib/data";
import { endpoints } from "@/lib/endpoints";
import type { ExamSlot } from "@/types";
import { CreateSlotForm } from "./components/CreateSlotForm";
import { SlotsTable } from "./components/SlotsTable";

export default async function ExamSlotsPage() {
  const slots = await fetchWithAuth<ExamSlot[]>(endpoints.examSlots.all);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          Exam Slot Management
        </h1>
        <p className="mt-1 text-base text-slate">
          Create and manage exam slots for admission applicants.
        </p>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <CreateSlotForm />
        <SlotsTable slots={slots} />
      </div>
    </div>
  );
}
