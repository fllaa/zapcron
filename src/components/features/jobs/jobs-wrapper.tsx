"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination, Select, SelectItem } from "@nextui-org/react";

import { api } from "@bolabali/trpc/react";
import { JobsCreateModal, JobsTable } from "@bolabali/components/features/jobs";
import { Search } from "@bolabali/components/common";
import { useCreateQueryString, useDebouncedState } from "@bolabali/hooks";

interface JobsWrapper {
  children: React.ReactNode;
}

const JobsWrapper = () => {
  const [query, setQuery] = useDebouncedState("", 300);
  const createQueryString = useCreateQueryString();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const availableLimits = [5, 10, 20, 50];
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [jobs] = api.job.getAll.useSuspenseQuery({
    limit,
    page,
    query,
  });

  return (
    <>
      <div className="my-6 flex items-center justify-between gap-4">
        <Search
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
          className="max-w-72"
        />
        <JobsCreateModal />
      </div>
      <div className="space-y-4">
        <JobsTable jobs={jobs} />
        <div className="flex items-center justify-between">
          <Pagination
            initialPage={page}
            total={jobs._meta.totalPages}
            onChange={(page) =>
              router.push(
                `${pathname}?${createQueryString("page", page.toString())}`,
              )
            }
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
