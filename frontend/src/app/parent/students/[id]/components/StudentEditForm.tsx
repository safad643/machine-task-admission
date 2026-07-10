"use client";

import { Button, Input, Select } from "@/components/ui";
import { useStudentEditForm, mapStudentToFormData } from "@/hooks";
import { Gender, Grade, type Student } from "@/types";
import { formatGradeLabel } from "@/lib/utils";

interface StudentEditFormProps {
  student: Student;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StudentEditForm({
  student,
  onSuccess,
  onCancel,
}: StudentEditFormProps) {
  const {
    fields,
    onSubmit,
    onReset,
    isMutating,
    error,
    clearError,
  } = useStudentEditForm({
    studentId: student._id,
    initialData: mapStudentToFormData(student),
    onSuccess,
  });

  function handleCancel() {
    clearError();
    onReset();
    onCancel?.();
  }

  return (
    <div className="rounded-2xl border border-stone bg-background p-6 shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)] sm:p-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <Input
          label={fields.studentName.label}
          placeholder={fields.studentName.placeholder}
          error={fields.studentName.error}
          required={fields.studentName.required}
          {...fields.studentName.register}
        />

        <Input
          label={fields.dateOfBirth.label}
          type={fields.dateOfBirth.type}
          error={fields.dateOfBirth.error}
          required={fields.dateOfBirth.required}
          {...fields.dateOfBirth.register}
        />

        <Select
          label={fields.gender.label}
          error={fields.gender.error}
          required={fields.gender.required}
          {...fields.gender.register}
        >
          <option value={Gender.MALE}>Male</option>
          <option value={Gender.FEMALE}>Female</option>
          <option value={Gender.OTHER}>Other</option>
        </Select>

        <Input
          label={fields.previousSchool.label}
          placeholder={fields.previousSchool.placeholder}
          error={fields.previousSchool.error}
          required={fields.previousSchool.required}
          {...fields.previousSchool.register}
        />

        <Select
          label={fields.applyingGrade.label}
          error={fields.applyingGrade.error}
          required={fields.applyingGrade.required}
          {...fields.applyingGrade.register}
        >
          <option value="" disabled>
            Select a grade
          </option>
          {Object.values(Grade).map((grade) => (
            <option key={grade} value={grade}>
              {formatGradeLabel(grade)}
            </option>
          ))}
        </Select>

        {error && (
          <div className="rounded-lg border border-danger/20 bg-danger/10 p-3.5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-danger-text">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearError();
                }}
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isMutating}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isMutating}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
