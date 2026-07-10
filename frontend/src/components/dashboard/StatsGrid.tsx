import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { StudentStatus } from "@/types";

interface StatsGridProps {
  total: number;
  counts: Record<StudentStatus, number>;
}

export function StatsGrid({ total, counts }: StatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Applications</CardDescription>
          <CardTitle className="text-3xl">{total}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Pending Payment</CardDescription>
          <CardTitle className="text-3xl">
            {counts[StudentStatus.APPLICATION_CREATED]}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Exam Booked</CardDescription>
          <CardTitle className="text-3xl">
            {counts[StudentStatus.SLOT_BOOKED]}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Completed</CardDescription>
          <CardTitle className="text-3xl">
            {counts[StudentStatus.ADMISSION_COMPLETED]}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
