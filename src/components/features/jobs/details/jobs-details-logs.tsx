/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React, { useCallback, useMemo } from "react";
import { Card, CardBody, Chip } from "@nextui-org/react";
import { format } from "@formkit/tempo";

import { Table } from "@bolabali/components/common";
import { JobsDetailsLogsResponseModal } from "@bolabali/components/features/jobs/details";
import { getClientTimezone } from "@bolabali/utils/datetime";
import { type Log } from "@bolabali/server/db/schema";

interface JobsDetailsLogsProps {
  data: Log[];
}

const JobsDetailsLogs = ({ data }: JobsDetailsLogsProps) => {
  const rows = useMemo(
    () =>
      data.map((log) => ({
        key: log.id.toString(),
        status: log.status,
        createdAt: log.createdAt.toISOString(),
        response: log.response as Record<string, unknown>,
      })),
    [data],
  );

  const columns = [
    { key: "status", label: "Status Code" },
    { key: "createdAt", label: "Date" },
    { key: "response", label: "Response" },
  ];

  const renderCell = useCallback(
    (item: Record<string, unknown>, columnKey: React.Key | string) => {
      const _columnKey = columnKey as string;
      const value = item[_columnKey];

      switch (_columnKey) {
        case "status":
          // if 2xx or 3xx, color success, if 4xx, color warning, if 5xx, color danger
          const status = value as number;
          let color = "default";
          if (status >= 200 && status < 400) {
            color = "success";
          } else if (status >= 400 && status < 500) {
            color = "warning";
          } else if (status >= 500) {
            color = "danger";
          }
          return (
            <Chip
              size="sm"
              color={color as "default" | "success" | "warning" | "danger"}
            >
              {status}
            </Chip>
          );
        case "createdAt":
          return format({
            date: value as Date,
            // format date and time
            format: "YYYY-MM-DD HH:mm",
            tz: getClientTimezone(),
          });
        case "response":
          return (
            <JobsDetailsLogsResponseModal
              data={value as Record<string, unknown>}
            />
          );
        default:
          return value as string;
      }
    },
    [],
  );
  return (
    <Card className="col-span-8">
      <CardBody>
        <h3 className="text-lg font-semibold">Logs</h3>
        <Table columns={columns} rows={rows} renderCell={renderCell} />
      </CardBody>
    </Card>
  );
};

export { JobsDetailsLogs };
