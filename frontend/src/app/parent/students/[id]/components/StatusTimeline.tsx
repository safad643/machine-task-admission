import { StudentStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusOrder: StudentStatus[] = [
  StudentStatus.APPLICATION_CREATED,
  StudentStatus.REGISTRATION_FEE_PAID,
  StudentStatus.SLOT_BOOKED,
  StudentStatus.EXAM_COMPLETED,
  StudentStatus.ADMISSION_COMPLETED,
];

function formatStatusLabel(status: StudentStatus): string {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

interface StatusTimelineProps {
  status: StudentStatus;
}

export function StatusTimeline({ status }: StatusTimelineProps) {
  const currentIndex = statusOrder.indexOf(status);

  return (
    <ol className="flex w-full items-start" aria-label="Application status timeline">
      {statusOrder.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        const isLast = index === statusOrder.length - 1;

        return (
          <li key={step} className="relative flex flex-1 flex-col items-center">
            <div className="flex w-full items-center justify-center">
              <div
                className={cn(
                  "z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  isCompleted && "border-success bg-success text-white",
                  isCurrent && "border-brass bg-brass text-white",
                  isPending && "border-border bg-paper text-slate"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "absolute top-4 left-1/2 h-0.5 w-full",
                    isCompleted ? "bg-success" : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
            <span
              className={cn(
                "mt-2 px-1 text-center text-xs font-medium leading-tight",
                isCompleted && "text-success",
                isCurrent && "text-brass",
                isPending && "text-slate"
              )}
            >
              {formatStatusLabel(step)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
