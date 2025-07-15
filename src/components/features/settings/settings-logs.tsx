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
import { HardDrive, Rows2 } from "lucide-react";
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
