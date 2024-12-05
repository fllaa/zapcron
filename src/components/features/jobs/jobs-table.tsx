"use client";

import React, { useMemo } from "react";

import { Table } from "@bolabali/components/common";
import { type Job } from "@bolabali/server/db/schema";

interface JobsTableProps {
  data: Job[];
}

const JobsTable = ({ data }: JobsTableProps) => {
  const rows = useMemo(
    () =>
      data.map((job) => ({
        key: job.id.toString(),
        name: job.name,
        cronspec: job.cronspec,
        url: job.url,
        createdAt: job.createdAt.toISOString(),
        executeAt: job.executeAt.toISOString(),
      })),
    [data],
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
