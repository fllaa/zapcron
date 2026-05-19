"use client";

import {
  Button,
  Card,
  CardBody,
  Chip,
  DateRangePicker,
  type RangeValue,
  Switch,
} from "@heroui/react";
import {
  type CalendarDate,
  fromDate,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { ActionPopover } from "@zapcron/components/common";
import { api } from "@zapcron/trpc/react";
import { CalendarClock, HardDrive, Rows2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const SettingsLogs = () => {
  const [isDateEnabled, setIsDateEnabled] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<RangeValue<CalendarDate> | null>(
    null,
  );
  const utils = api.useUtils();
  const [stats] = api.log.getStats.useSuspenseQuery();

  const [min, max] = useMemo(() => {
    if (!stats.oldest || !stats.newest)
      return [
        today(getLocalTimeZone()).subtract({ days: 2 }),
        today(getLocalTimeZone()),
      ];
    // biome-ignore lint/style/noNonNullAssertion: no non null assertion
    const min = stats.oldest.split("T")[0]!;
    // biome-ignore lint/style/noNonNullAssertion: no non null assertion
    const max = stats.newest.split("T")[0]!;
    return [
      fromDate(new Date(min), "Asia/Jakarta"),
      fromDate(new Date(max), "Asia/Jakarta"),
    ];
  }, [stats]);

  const clearLogs = api.log.clear.useMutation({
    onSuccess() {
      void utils.log.invalidate();
      toast.success("Successfully cleared logs");
    },
  });

  const purgeExpiredLogs = api.log.purgeExpired.useMutation({
    onSuccess(result) {
      void utils.log.invalidate();
      toast.success(`Purged ${result.deleted} expired log(s)`);
    },
    onError() {
      toast.error("Failed to purge expired logs");
    },
  });
  return (
    <div className="col-span-8 space-y-2">
      <h3 className="font-bold text-xl">Log Management</h3>
      <Card>
        <CardBody>
          <h3 className="mb-2 font-medium text-md">Stats</h3>
          <div className="mb-6 flex gap-8">
            <div className="flex items-center gap-2">
              <Chip
                startContent={<HardDrive size={12} />}
                size="sm"
                color="secondary"
              >
                Disk Usage
              </Chip>
              <p className="text-gray-700 text-sm dark:text-gray-200">
                {stats.size}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Chip
                startContent={<Rows2 size={12} />}
                size="sm"
                color="primary"
              >
                Total Logs
              </Chip>
              <p className="text-gray-700 text-sm dark:text-gray-200">
                {stats.total}
              </p>
            </div>
          </div>
          <h3 className="mb-2 font-medium text-md">Retention</h3>
          <div className="mb-6 flex flex-wrap gap-8">
            <div className="flex items-center gap-2">
              <Chip
                startContent={<CalendarClock size={12} />}
                size="sm"
                color={stats.retentionEnabled ? "success" : "default"}
              >
                Policy
              </Chip>
              <p className="text-gray-700 text-sm dark:text-gray-200">
                {stats.retentionEnabled
                  ? `Keep logs for ${stats.retentionDays} day(s)`
                  : "Disabled (set LOG_RETENTION_DAYS)"}
              </p>
            </div>
            {stats.retentionEnabled && (
              <>
                <div className="flex items-center gap-2">
                  <Chip size="sm" variant="flat">
                    Cutoff
                  </Chip>
                  <p className="text-gray-700 text-sm dark:text-gray-200">
                    {stats.cutoffDate
                      ? new Date(stats.cutoffDate).toLocaleString()
                      : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Chip size="sm" color="warning" variant="flat">
                    Expired
                  </Chip>
                  <p className="text-gray-700 text-sm dark:text-gray-200">
                    {stats.expiredCount}
                  </p>
                </div>
              </>
            )}
          </div>
          {stats.retentionEnabled && stats.expiredCount > 0 && (
            <div className="mb-6">
              <ActionPopover
                placement="right"
                trigger={
                  <Button
                    isLoading={purgeExpiredLogs.isPending}
                    color="warning"
                    size="sm"
                    className="w-fit"
                    startContent={<Trash2 size={14} />}
                  >
                    Purge Expired Logs
                  </Button>
                }
                onAction={() => purgeExpiredLogs.mutate()}
              />
            </div>
          )}
          <h3 className="mb-2 font-medium text-md">Clear</h3>
          <div className="mb-2 flex items-center gap-2">
            <Switch
              size="sm"
              isSelected={isDateEnabled}
              onValueChange={setIsDateEnabled}
            />
            <DateRangePicker
              isDisabled={!isDateEnabled}
              className="w-fit"
              size="sm"
              label="Date Filter"
              labelPlacement="outside-left"
              variant="flat"
              minValue={min}
              maxValue={max}
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
          <ActionPopover
            placement="right"
            trigger={
              <Button
                isLoading={clearLogs.isPending}
                color="danger"
                size="sm"
                className="w-fit"
              >
                Clear Logs
              </Button>
            }
            onAction={() =>
              clearLogs.mutate({
                startDate: isDateEnabled
                  ? dateFilter?.start.toString()
                  : undefined,
                endDate: isDateEnabled ? dateFilter?.end.toString() : undefined,
              })
            }
          />
        </CardBody>
      </Card>
    </div>
  );
};

export { SettingsLogs };
