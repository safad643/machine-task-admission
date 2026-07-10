import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  statusVariantMap,
  statusLabelMap,
  statusOrder,
} from "@/lib/status-utils";
import type { StudentStatus } from "@/types";

interface StatusBreakdownProps {
  counts: Record<StudentStatus, number>;
}

export function StatusBreakdown({ counts }: StatusBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Breakdown</CardTitle>
        <CardDescription>Applications by current status.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {statusOrder.map((status) => (
            <li
              key={status}
              className="flex items-center justify-between rounded-lg border border-stone bg-paper/50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Badge variant={statusVariantMap[status]} size="sm">
                  {statusLabelMap[status]}
                </Badge>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {counts[status]}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
