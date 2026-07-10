import { fetchWithAuth } from "@/lib/data";
import { endpoints } from "@/lib/endpoints";
import { StudentStatus, type PaginatedResponse, type Student } from "@/types";
import { ApplicationsList } from "./components/ApplicationsList";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

interface ApplicationsPageProps {
  searchParams: Promise<{ page?: string; status?: string }> | {
    page?: string;
    status?: string;
  };
}

function isValidStatus(value: string): value is StudentStatus {
  return Object.values(StudentStatus).includes(value as StudentStatus);
}

export default async function ApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const params = await searchParams;
  const page = Math.max(
    1,
    parseInt(params.page ?? String(DEFAULT_PAGE), 10) || DEFAULT_PAGE
  );
  const statusFilter: "ALL" | StudentStatus =
    params.status && isValidStatus(params.status) ? params.status : "ALL";

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(DEFAULT_LIMIT));
  if (statusFilter !== "ALL") {
    queryParams.set("status", statusFilter);
  }

  const response = await fetchWithAuth<PaginatedResponse<Student>>(
    `${endpoints.admission.applications}?${queryParams.toString()}`
  );

  const applications = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];
  const total = Array.isArray(response) ? applications.length : response.total;
  const totalPages = Array.isArray(response) ? 1 : response.totalPages;

  return (
    <ApplicationsList
      applications={applications}
      total={total}
      page={page}
      totalPages={totalPages}
      status={statusFilter}
    />
  );
}
