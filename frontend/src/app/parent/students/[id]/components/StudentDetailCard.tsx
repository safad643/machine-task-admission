import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Student } from "@/types";
import {
  statusVariantMap,
  formatStatusLabel,
  formatGenderLabel,
  formatCourseLabel,
  formatDate,
  formatDateTime,
} from "../utils";

interface StudentDetailCardProps {
  student: Student;
}

export function StudentDetailCard({ student }: StudentDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{student.studentName}</CardTitle>
            <CardDescription className="mt-1">
              Application ID: {student._id}
            </CardDescription>
          </div>
          <Badge variant={statusVariantMap[student.status]} size="md">
            {formatStatusLabel(student.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate">Date of Birth</dt>
            <dd className="mt-1 text-base text-foreground">
              {formatDate(student.dateOfBirth)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate">Gender</dt>
            <dd className="mt-1 text-base text-foreground">
              {formatGenderLabel(student.gender)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate">Previous School</dt>
            <dd className="mt-1 text-base text-foreground">
              {student.previousSchool}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate">Applying Grade</dt>
            <dd className="mt-1 text-base text-foreground">
              {student.applyingGrade}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate">Exam Score</dt>
            <dd className="mt-1 text-base text-foreground">
              {student.examScore !== null ? student.examScore : "Not available"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate">Assigned Course</dt>
            <dd className="mt-1 text-base text-foreground">
              {formatCourseLabel(student.assignedCourse)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate">Registration Fee</dt>
            <dd className="mt-1 text-base text-foreground">
              {student.feePaid ? "Paid" : "Pending"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate">Exam Slot</dt>
            <dd className="mt-1 text-base text-foreground">
              {student.slotId ? student.slotId : "Not booked"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate">Created At</dt>
            <dd className="mt-1 text-base text-foreground">
              {formatDateTime(student.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate">Updated At</dt>
            <dd className="mt-1 text-base text-foreground">
              {formatDateTime(student.updatedAt)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-slate">Parent ID</dt>
            <dd className="mt-1 text-base text-foreground break-all">
              {student.parentId}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
