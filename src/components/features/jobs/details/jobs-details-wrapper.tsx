"use client";

import React from "react";

import { type api } from "@bolabali/trpc/server";
import {
  JobsDetailsBody,
  JobsDetailsData,
  JobsDetailsDescription,
  JobsDetailsHeaders,
  JobsDetailsLogs,
} from "@bolabali/components/features/jobs/details";

interface JobsDetailsWrapperProps {
  data: Awaited<ReturnType<typeof api.job.get>>;
}

export const JobsDetailsWrapper = ({ data }: JobsDetailsWrapperProps) => {
  return (
    <div className="grid grid-cols-8 gap-4">
      <JobsDetailsData data={data} />
      <JobsDetailsDescription data={data?.description} />
      <JobsDetailsHeaders data={data!.headers as Record<string, unknown>} />
      <JobsDetailsBody data={data!.body as Record<string, unknown>} />
      <JobsDetailsLogs data={data!.logs} />
    </div>
  );
};
