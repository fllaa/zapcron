"use client";

import { format } from "@formkit/tempo";
import { Card, CardBody, Chip, cn } from "@heroui/react";
import { JobsDetailsUpdateModal } from "@zapcron/components/features/jobs/details";
import type { api } from "@zapcron/trpc/server";
import { getClientTimezone } from "@zapcron/utils/datetime";
import cronstrue from "cronstrue";
import {
  ArrowUpDown,
  Clock,
  Fingerprint,
  Link2,
  Pickaxe,
  Timer,
  User,
} from "lucide-react";

interface JobsDetailsDataProps {
  data: Awaited<ReturnType<typeof api.job.get>>;
}

const JobsDetailsData = ({ data }: JobsDetailsDataProps) => {
  return (
    <div className="col-span-8 space-y-2 md:col-span-5">
      <h3 className="font-semibold text-lg">Details</h3>
      <Card>
        <CardBody className="relative">
          <div className="absolute top-4 right-4">
            <JobsDetailsUpdateModal data={data} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Chip startContent={<Fingerprint size={12} />} size="sm">
                ID
              </Chip>
              <p className="text-gray-700 text-sm dark:text-gray-200">
                {data?.id}
              </p>
            </div>
            <div className="space-y-1">
              <Chip startContent={<Pickaxe size={12} />} size="sm">
                Status
              </Chip>
              <p className="text-gray-700 text-sm dark:text-gray-200">
                {data?.isEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
            <div className="space-y-1">
              <Chip startContent={<Link2 size={12} />} size="sm">
                URL
              </Chip>
              <p className="text-gray-700 text-sm dark:text-gray-200">
                {data?.url}
              </p>
            </div>
            <div className="space-y-1">
              <Chip startContent={<ArrowUpDown size={12} />} size="sm">
                Method
              </Chip>
              <p className="text-gray-700 text-sm dark:text-gray-200">
                {data?.method}
              </p>
            </div>
            <div className="space-y-1">
              <Chip startContent={<Timer size={12} />} size="sm">
                Cronspec
              </Chip>
              <p className="text-gray-700 text-sm dark:text-gray-200">
                {/* biome-ignore lint/style/noNonNullAssertion: no non null assertion */}
                {cronstrue.toString(data!.cronspec)}
              </p>
            </div>
            <div className="space-y-1">
              <Chip startContent={<Timer size={12} />} size="sm">
                Next Execution
              </Chip>
              <p
                className={cn(
                  "text-gray-700 text-sm dark:text-gray-200",
                  data?.isEnabled ? "text-green-500" : "text-red-500",
                )}
              >
                {format({
                  // biome-ignore lint/style/noNonNullAssertion: no non null assertion
                  date: data!.executeAt,
                  format: "YYYY-MM-DD HH:mm",
                  tz: getClientTimezone(),
                })}
              </p>
            </div>
            <div className="space-y-1">
              <Chip startContent={<Clock size={12} />} size="sm">
                Created At
              </Chip>
              <p className="text-gray-700 text-sm dark:text-gray-200">
                {format({
                  // biome-ignore lint/style/noNonNullAssertion: no non null assertion
                  date: data!.createdAt,
                  format: "YYYY-MM-DD HH:mm",
                  tz: getClientTimezone(),
                })}
              </p>
            </div>
            {data?.updatedAt && (
              <div className="space-y-1">
                <Chip startContent={<Clock size={12} />} size="sm">
                  Updated At
                </Chip>
                <p className="text-gray-700 text-sm dark:text-gray-200">
                  {format({
                    date: data?.updatedAt,

                    format: "YYYY-MM-DD HH:mm",
                    tz: getClientTimezone(),
                  })}
                </p>
              </div>
            )}
            <div className="space-y-1">
              <Chip startContent={<User size={12} />} size="sm">
                Created By
              </Chip>
              <p className="text-gray-700 text-sm dark:text-gray-200">
                {data?.createdBy.name}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export { JobsDetailsData };
