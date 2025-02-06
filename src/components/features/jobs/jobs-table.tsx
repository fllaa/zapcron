"use client";

import React, { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Button, Chip, Link, Tooltip, cn } from "@heroui/react";
import { ChevronRight, Play, Trash2 } from "lucide-react";
import cronstrue from "cronstrue";
import { toast } from "sonner";
import { format } from "@formkit/tempo";

import { api } from "@zapcron/trpc/react";
import { type api as apiServer } from "@zapcron/trpc/server";
import { ConfirmationModal, Table } from "@zapcron/components/common";
import { getClientTimezone } from "@zapcron/utils/datetime";
import { colorByStatus } from "@zapcron/utils/color";

interface JobsTableProps {
  jobs: Omit<Awaited<ReturnType<typeof apiServer.job.getAll>>, "_meta">;
  isImport?: boolean;
}

const JobsTable = ({ jobs, isImport }: JobsTableProps) => {
  const pathname = usePathname();
  const utils = api.useUtils();
  const deleteJob = api.job.delete.useMutation({
    onSuccess: () => {
      void utils.job.invalidate();
      toast.success("Job deleted successfully");
    },
  });
  const executeNowJob = api.job.executeNow.useMutation({
    onSuccess: () => {
      void utils.job.invalidate();
    },
  });

  const rows = useMemo(
    () =>
      jobs.data.map((job) => ({
        key: job.id.toString(),
        name: job.name,
        isEnabled: job.isEnabled,
        cronspec: job.cronspec,
        url: job.url,
        executeAt: job.executeAt,
        history: job.logs.map((log) => log.status),
      })),
    [jobs],
  );

  const columns = isImport
    ? [
        { key: "name", label: "Name" },
        { key: "cronspec", label: "Cronspec" },
        { key: "url", label: "URL" },
      ]
    : [
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
      const isEnabled = item.isEnabled as boolean;

      switch (_columnKey) {
        case "name":
          return (
            <span className={cn(!isEnabled && "opacity-50")}>
              {value as string}
            </span>
          );
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
              <Chip
                size="sm"
                variant="bordered"
                className={cn(!isEnabled && "opacity-50")}
              >
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
              className={cn(!isEnabled && "opacity-50")}
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
                    className={cn(
                      "aspect-square h-2 w-2",
                      !isEnabled && "opacity-50",
                    )}
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
                    onPress={onOpen}
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
                onPress={() =>
                  toast.promise(
                    executeNowJob.mutateAsync({
                      id: parseInt(item.key as string),
                    }),
                    {
                      loading: "Executing job...",
                      success: "Job executed successfully",
                      error: "Failed to execute job",
                    },
                  )
                }
                isIconOnly
                size="sm"
                variant="flat"
                color="primary"
              >
                <Play size={16} />
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
