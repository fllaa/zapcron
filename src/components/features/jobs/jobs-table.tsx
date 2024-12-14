"use client";

import React, { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Button, Chip, Link, Tooltip } from "@nextui-org/react";
import { ChevronRight, Trash2 } from "lucide-react";
import cronstrue from "cronstrue";
import { format } from "@formkit/tempo";

import { Table } from "@bolabali/components/common";
import { getClientTimezone } from "@bolabali/utils/datetime";
import { type Job } from "@bolabali/server/db/schema";

interface JobsTableProps {
  jobs: {
    data: Job[];
    _meta: Record<string, unknown>;
  };
}

const JobsTable = ({ jobs }: JobsTableProps) => {
  const pathname = usePathname();

  const rows = useMemo(
    () =>
      jobs.data.map((job) => ({
        key: job.id.toString(),
        name: job.name,
        cronspec: job.cronspec,
        url: job.url,
        createdAt: format({
          date: job.createdAt,
          format: "medium",
          tz: getClientTimezone(),
        }),
      })),
    [jobs],
  );

  const columns = [
    { key: "name", label: "Name" },
    { key: "cronspec", label: "Cronspec" },
    { key: "url", label: "URL" },
    { key: "createdAt", label: "Created Date" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = useCallback(
    (item: Record<string, unknown>, columnKey: React.Key | string) => {
      const _columnKey = columnKey as string;
      const value = item[_columnKey];

      switch (_columnKey) {
        case "cronspec":
          return (
            <Tooltip
              content={`${cronstrue.toString(value as string)}, Next: ${format({
                date: item.executeAt as Date,
                // format date and time
                format: "YYYY-MM-DD HH:mm",
                tz: getClientTimezone(),
              })}`}
            >
              <Chip size="sm" variant="bordered">
                {value as string}
              </Chip>
            </Tooltip>
          );
        case "url":
          const hostname = new URL(value as string).hostname;
          return (
            <Button
              isExternal
              showAnchorIcon
              as={Link}
              href={value as string}
              variant="light"
              size="sm"
            >
              {hostname}
            </Button>
          );
        case "actions":
          return (
            <div className="flex items-center gap-2">
              <Button isIconOnly size="sm" variant="flat" color="danger">
                <Trash2 size={16} />
              </Button>
              <Button
                as={Link}
                href={`${pathname}/${item.key as string}`}
                isIconOnly
                size="sm"
                variant="flat"
                color="secondary"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          );
        default:
          return value as string;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="h-full w-full max-w-full overflow-x-scroll px-2 py-4 scrollbar-hide">
      <Table rows={rows} columns={columns} renderCell={renderCell} />
    </div>
  );
};

export { JobsTable };
