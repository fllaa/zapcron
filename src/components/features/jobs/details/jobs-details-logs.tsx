/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  DateRangePicker,
  type RangeValue,
} from "@heroui/react";
import { format } from "@formkit/tempo";
import {
  today,
  getLocalTimeZone,
  type CalendarDate,
} from "@internationalized/date";

import { api } from "@zapcron/trpc/react";
import { Table } from "@zapcron/components/common";
import { JobsDetailsLogsResponseModal } from "@zapcron/components/features/jobs/details";
import { formatTime, getClientTimezone } from "@zapcron/utils/datetime";
import { type Log } from "@zapcron/server/db/schema";
import { colorByStatus } from "@zapcron/utils/color";
import { LogsMode } from "@zapcron/constants/logs-mode";

type LogWithCreatedBy = Log & { createdBy: { name: string | null } | null };
interface JobsDetailsLogsProps {
  jobId: number;
  data: LogWithCreatedBy[];
}

const JobsDetailsLogs = ({ jobId, data }: JobsDetailsLogsProps) => {
  const [dateFilter, setDateFilter] = useState<RangeValue<CalendarDate> | null>(
    null,
  );
  const {
    data: logs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = api.log.getAllByJob.useInfiniteQuery(
    {
      jobId,
      filter: dateFilter
        ? {
            startDate: dateFilter.start.toString(),
            endDate: dateFilter.end.toString(),
          }
        : undefined,
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.length > 0 ? lastPage[lastPage.length - 1]?.id : undefined,

      initialData: {
        pages: [data],
        pageParams: [data[data.length - 1]?.id],
      },
    },
  );
  const rows = useMemo(
    () =>
      logs.pages.flat(1).map((log) => ({
        key: log.id.toString(),
        status: log.status,
        createdAt: log.createdAt.toISOString(),
        duration: log.duration,
        mode: log.mode,
        createdBy: log.createdBy?.name,
        response: log.response as Record<string, unknown>,
      })),
    [logs],
  );

  const columns = [
    { key: "status", label: "Status Code" },
    { key: "createdAt", label: "Date" },
    { key: "duration", label: "Duration" },
    { key: "mode", label: "Mode" },
    { key: "createdBy", label: "Triggered By" },
    { key: "response", label: "Response" },
  ];

  const renderCell = useCallback(
    (item: Record<string, unknown>, columnKey: React.Key | string) => {
      const _columnKey = columnKey as string;
      const value = item[_columnKey];

      switch (_columnKey) {
        case "status":
          const color = colorByStatus(value as number);
          return (
            <Chip size="sm" color={color} variant="flat">
              {value as number}
            </Chip>
          );
        case "createdAt":
          return format({
            date: value as Date,
            // format date and time
            format: "YYYY-MM-DD HH:mm",
            tz: getClientTimezone(),
          });
        case "duration":
          return formatTime(value as number);
        case "mode":
          return (
            <Chip
              size="sm"
              color={value === LogsMode.IMMEDIATE ? "primary" : "secondary"}
              variant="bordered"
            >
              {value as string}
            </Chip>
          );
        case "response":
          return (
            <JobsDetailsLogsResponseModal
              id={item.key as string}
              data={value as Record<string, unknown>}
            />
          );
        default:
          return value as string;
      }
    },
    [],
  );

  useEffect(() => {
    if (dateFilter) {
      void refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  return (
    <Card className="col-span-8">
      <CardBody>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Logs</h3>
          <DateRangePicker
            className="w-fit"
            size="sm"
            label="Date"
            labelPlacement="outside-left"
            variant="flat"
            maxValue={today(getLocalTimeZone())}
            value={dateFilter}
            onChange={setDateFilter}
            CalendarBottomContent={
              <div className="mx-auto px-2 pb-2 text-right">
                <Button
                  size="sm"
                  variant="bordered"
                  radius="full"
                  color="warning"
                  onPress={() => setDateFilter(null)}
                >
                  Reset
                </Button>
              </div>
            }
            disableAnimation
            showMonthAndYearPickers
          />
        </div>
        <Table
          columns={columns}
          rows={rows}
          renderCell={renderCell}
          className="mt-4"
        />
        <div className="mx-auto mt-4">
          <Button
            onPress={() => fetchNextPage()}
            isDisabled={!hasNextPage}
            isLoading={isFetchingNextPage}
            size="sm"
            variant="ghost"
          >
            {hasNextPage ? "Load More" : "No More Logs"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export { JobsDetailsLogs };
