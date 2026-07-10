import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatGradeLabel } from "@/lib/utils";
import {
  statusVariantMap,
  statusLabelMap,
} from "@/lib/status-utils";
import { formatDate } from "@/lib/date-utils";
import type { Student } from "@/types";

interface RecentTableProps {
  items: Student[];
  description: string;
  dateColumnLabel: string;
  viewHref: (id: string) => string;
  viewAllHref: string;
  viewAllLabel: string;
  className?: string;
}

export function RecentTable({
  items,
  description,
  dateColumnLabel,
  viewHref,
  viewAllHref,
  viewAllLabel,
  className,
}: RecentTableProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border border-stone">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-stone bg-muted">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  {dateColumnLabel}
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-stone last:border-b-0 hover:bg-paper/50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {item.studentName}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate">
                    {formatGradeLabel(item.applyingGrade)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariantMap[item.status]} size="sm">
                      {statusLabelMap[item.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={viewHref(item._id)}
                      className="text-sm font-medium text-seal underline decoration-seal/30 underline-offset-4 transition-colors hover:text-seal-light hover:decoration-seal"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-seal underline decoration-seal/30 underline-offset-4 transition-colors hover:text-seal-light hover:decoration-seal"
          >
            {viewAllLabel}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
