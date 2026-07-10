"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paramName?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  paramName = "page",
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set(paramName, String(page));
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = (): Array<number | "ellipsis"> => {
    const pages: Array<number | "ellipsis"> = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-4"
    >
      {currentPage <= 1 ? (
        <span
          aria-disabled="true"
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-slate opacity-50"
        >
          Previous
        </span>
      ) : (
        <Link
          href={buildHref(currentPage - 1)}
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-brass-light hover:bg-paper"
        >
          Previous
        </Link>
      )}

      <div className="hidden items-center gap-1 sm:flex">
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-sm text-slate"
            >
              …
            </span>
          ) : page === currentPage ? (
            <span
              key={page}
              aria-current="page"
              className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-paper"
            >
              {page}
            </Link>
          )
        )}
      </div>

      <span className="text-sm text-slate sm:hidden">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage >= totalPages ? (
        <span
          aria-disabled="true"
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-slate opacity-50"
        >
          Next
        </span>
      ) : (
        <Link
          href={buildHref(currentPage + 1)}
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-brass-light hover:bg-paper"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
