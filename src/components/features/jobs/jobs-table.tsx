"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { api } from "@bolabali/trpc/react";
import { Table } from "@bolabali/components/common";

const JobsTable = () => {
  const searchParams = useSearchParams();

  const [jobs] = api.job.getAll.useSuspenseQuery({
    limit: parseInt(searchParams.get("limit") ?? "10", 10),
    page: parseInt(searchParams.get("page") ?? "1", 10),
  });

  const rows = useMemo(
    () =>
      jobs.map((job) => ({
        key: job.id.toString(),
        name: job.name,
        cronspec: job.cronspec,
        url: job.url,
        createdAt: job.createdAt.toISOString(),
        executeAt: job.executeAt.toISOString(),
      })),
    [jobs],
  );

  const columns = [
    { key: "name", label: "Name" },
    { key: "cronspec", label: "Cronspec" },
    { key: "url", label: "URL" },
    { key: "createdAt", label: "Created Date" },
    { key: "executeAt", label: "Next Execution" },
  ];

  return <Table rows={rows} columns={columns} />;
};

export { JobsTable };
