"use client";

import { useState } from "react";
import { Button, Confirmation } from "@/components/ui";
import { Student, StudentStatus } from "@/types";

interface PayRegistrationFeeDialogProps {
  student: Student;
  isMutating: boolean;
  onPay: (id: string) => Promise<Student>;
  onPaid?: () => void;
}

export function PayRegistrationFeeDialog({
  student,
  isMutating,
  onPay,
  onPaid,
}: PayRegistrationFeeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (student.status !== StudentStatus.APPLICATION_CREATED) {
    return null;
  }

  async function handleConfirm() {
    try {
      await onPay(student._id);
      setIsOpen(false);
      onPaid?.();
    } catch {
      setIsOpen(false);
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} disabled={isMutating}>
        Pay Registration Fee
      </Button>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <Confirmation
              title="Pay registration fee"
              description="You are about to pay the registration fee for this application. After payment, student details cannot be edited."
              confirmLabel="Pay now"
              cancelLabel="Cancel"
              variant="primary"
              isLoading={isMutating}
              onConfirm={handleConfirm}
              onCancel={() => setIsOpen(false)}
              className="w-full max-w-md"
            />
          </div>
        </div>
      )}
    </>
  );
}
