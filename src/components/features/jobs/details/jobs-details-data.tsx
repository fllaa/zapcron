"use client";

import React from "react";
import { Card, CardBody, Chip } from "@nextui-org/react";
import {
  ArrowUpDown,
  Clock,
  Fingerprint,
  Link2,
  Timer,
  User,
} from "lucide-react";
import { format } from "@formkit/tempo";
import cronstrue from "cronstrue";

import { type api } from "@bolabali/trpc/server";
import { getClientTimezone } from "@bolabali/utils/datetime";

interface JobsDetailsDataProps {
  data: Awaited<ReturnType<typeof api.job.get>>;
}

const JobsDetailsData = ({ data }: JobsDetailsDataProps) => {
  return (
    <Card className="col-span-5">
      <CardBody>
        <h3 className="text-lg font-semibold">Details</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Chip startContent={<Fingerprint size={12} />} size="sm">
              ID
            </Chip>
            <p className="text-sm text-gray-200">{data!.id}</p>
          </div>
          <div className="space-y-1">
            <Chip startContent={<User size={12} />} size="sm">
              Created By
            </Chip>
            <p className="text-sm text-gray-200">{data!.createdBy.name}</p>
          </div>
          <div className="space-y-1">
            <Chip startContent={<Link2 size={12} />} size="sm">
              URL
            </Chip>
            <p className="text-sm text-gray-200">{data!.url}</p>
          </div>
          <div className="space-y-1">
            <Chip startContent={<ArrowUpDown size={12} />} size="sm">
              Method
            </Chip>
            <p className="text-sm text-gray-200">{data!.method}</p>
          </div>
          <div className="space-y-1">
            <Chip startContent={<Timer size={12} />} size="sm">
              Cronspec
            </Chip>
            <p className="text-sm text-gray-200">
              {cronstrue.toString(data!.cronspec)}
            </p>
          </div>
          <div className="space-y-1">
            <Chip startContent={<Timer size={12} />} size="sm">
              Next Execution
            </Chip>
            <p className="text-sm text-gray-200">
              {format({
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
            <p className="text-sm text-gray-200">
              {format({
                date: data!.createdAt,
                format: "YYYY-MM-DD HH:mm",
                tz: getClientTimezone(),
              })}
            </p>
          </div>
          {data!.updatedAt && (
            <div className="space-y-1">
              <Chip startContent={<Clock size={12} />} size="sm">
                Updated At
              </Chip>
              <p className="text-sm text-gray-200">
                {format({
                  date: data!.updatedAt,

                  format: "YYYY-MM-DD HH:mm",
                  tz: getClientTimezone(),
                })}
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export { JobsDetailsData };
