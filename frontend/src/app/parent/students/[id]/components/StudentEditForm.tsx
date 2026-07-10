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
    form,
    submit,
    isMutating,
    error,
    clearError,
  } = useStudentEditForm({
    studentId: student._id,
    initialData: mapStudentToFormData(student),
    onSuccess,
  });

  const {
    register,
    formState: { errors },
  } = form;

  function handleCancel() {
    clearError();
    form.reset(mapStudentToFormData(student));
    onCancel?.();
  }

  return (
    <div className="rounded-2xl border border-stone bg-background p-6 shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)] sm:p-8">
      <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
        <Input
          label="Student Name"
          placeholder="e.g. Jane Doe"
          error={errors.studentName?.message}
          required
          {...register("studentName")}
        />

        <Input
          label="Date of Birth"
          type="date"
          error={errors.dateOfBirth?.message}
          required
          {...register("dateOfBirth")}
        />

        <Select
          label="Gender"
          error={errors.gender?.message}
          required
          {...register("gender")}
        >
          <option value={Gender.MALE}>Male</option>
          <option value={Gender.FEMALE}>Female</option>
          <option value={Gender.OTHER}>Other</option>
        </Select>

        <Input
          label="Previous School"
          placeholder="e.g. Springdale Elementary"
          error={errors.previousSchool?.message}
          required
          {...register("previousSchool")}
        />

        <Select
          label="Applying Grade"
          error={errors.applyingGrade?.message}
          required
          {...register("applyingGrade")}
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
