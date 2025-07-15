"use client";

import { Pagination, Select, SelectItem } from "@heroui/react";
import { Search } from "@zapcron/components/common";
import {
  JobsCards,
  JobsCreateModal,
  JobsImportModal,
  JobsTable,
} from "@zapcron/components/features/jobs";
import { useCreateQueryString, useDebouncedState } from "@zapcron/hooks";
import { api } from "@zapcron/trpc/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

interface JobsWrapper {
  children: React.ReactNode;
}

const JobsWrapper = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useDebouncedState("", 300);
  const createQueryString = useCreateQueryString();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const availableLimits = [5, 10, 20, 50, 100, 200];
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [jobs] = api.job.getAll.useSuspenseQuery({
    limit,
    page,
    query,
  });

  useEffect(() => {
    if (query && jobs.data?.length === 0 && jobs._meta.totalPages > 0) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, jobs.data, jobs._meta.totalPages]);

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString("page", currentPage.toString())}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, createQueryString, pathname, router]);

  return (
    <>
      <div className="my-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <Search
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
          className="max-w-72"
        />
        <div className="flex gap-2">
          <JobsImportModal />
          <JobsCreateModal />
        </div>
      </div>
      <div className="space-y-4">
        <JobsTable jobs={jobs} />
        <JobsCards jobs={jobs} />
        <div className="flex items-center justify-between">
          <Pagination
            initialPage={page}
            total={jobs._meta.totalPages}
            page={currentPage}
            onChange={setCurrentPage}
          />
          <Select
            className="max-w-20"
            variant="bordered"
            defaultSelectedKeys={[limit.toString()]}
            value={limit.toString()}
            onChange={(e) =>
              router.push(
                `${pathname}?${createQueryString("limit", e.target.value)}`,
              )
            }
          >
            {availableLimits.map((_value) => {
              const value = _value.toString();
              return (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              );
            })}
          </Select>
        </div>
      </div>
    </>
  );
};

export { JobsWrapper };
