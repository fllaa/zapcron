"use client";

import React, { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Button, Chip, Link, Tooltip } from "@nextui-org/react";
import { ChevronRight, Trash2 } from "lucide-react";
import cronstrue from "cronstrue";
import { toast } from "sonner";
import { format } from "@formkit/tempo";

import { api } from "@bolabali/trpc/react";
import { type api as apiServer } from "@bolabali/trpc/server";
import { ConfirmationModal, Table } from "@bolabali/components/common";
import { getClientTimezone } from "@bolabali/utils/datetime";
import { colorByStatus } from "@bolabali/utils/color";

interface JobsTableProps {
  jobs: Awaited<ReturnType<typeof apiServer.job.getAll>>;
}

const JobsTable = ({ jobs }: JobsTableProps) => {
  const pathname = usePathname();
  const utils = api.useUtils();
  const deleteJob = api.job.delete.useMutation({
    onSuccess: () => {
      void utils.job.invalidate();
      toast.success("Job deleted successfully");
    },
  });

  const rows = useMemo(
    () =>
      jobs.data.map((job) => ({
        key: job.id.toString(),
        name: job.name,
        cronspec: job.cronspec,
        url: job.url,
        history: job.logs.map((log) => log.status),
      })),
    [jobs],
  );

  const columns = [
    { key: "name", label: "Name" },
    { key: "cronspec", label: "Cronspec" },
    { key: "url", label: "URL" },
    { key: "history", label: "History" },
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
        case "history":
          return (
            <div className="flex items-center gap-0.5">
              {(value as string[]).reverse().map((status, index) => {
                const color = colorByStatus(parseInt(status, 10));
                return (
                  <Chip
                    key={index}
                    size="sm"
                    color={color}
                    className="aspect-square h-2 w-2"
                  />
                );
              })}
            </div>
          );
        case "actions":
          return (
            <div className="flex items-center gap-2">
              <ConfirmationModal
                trigger={(onOpen) => (
                  <Button
                    onClick={onOpen}
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="danger"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
                onConfirm={() =>
                  deleteJob.mutateAsync({
                    id: parseInt(item.key as string),
                  })
                }
                title="Delete Job"
                message="Are you sure you want to delete this job?"
              />
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
