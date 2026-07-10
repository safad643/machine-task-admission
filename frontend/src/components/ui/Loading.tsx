import { cn } from "@/lib/utils";
import { Loader } from "./Loader";

export interface LoadingProps {
  message?: string;
  className?: string;
}

export function Loading({
  message = "Loading...",
  className,
}: LoadingProps) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center gap-4",
        className
      )}
    >
      <Loader size="lg" />
      <p className="text-base text-slate">{message}</p>
    </div>
  );
}
