"use client";

import {
  JobsDetailsBody,
  JobsDetailsData,
  JobsDetailsDescription,
  JobsDetailsHeaders,
  JobsDetailsLogs,
} from "@zapcron/components/features/jobs/details";

import type { api } from "@zapcron/trpc/server";

interface JobsDetailsWrapperProps {
  data: Awaited<ReturnType<typeof api.job.get>>;
}

export const JobsDetailsWrapper = ({ data }: JobsDetailsWrapperProps) => {
  if (!data) return null;
  return (
    <div className="grid grid-cols-8 gap-4">
      <JobsDetailsData data={data} />
      <JobsDetailsDescription data={data?.description} />
      <JobsDetailsHeaders data={data?.headers as Record<string, unknown>} />
      <JobsDetailsBody data={data?.body as Record<string, unknown>} />
      <JobsDetailsLogs jobId={data.id} data={data.logs} />
    </div>
  );
};
