import { notFound } from "next/navigation";

import { api } from "@bolabali/trpc/server";
import { HeaderPage } from "@bolabali/components/common";
import { JobsDetailsWrapper } from "@bolabali/components/features/jobs/details";

export default async function JobsDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const job = await api.job.get({
    id: parseInt((await params).id),
  });

  if (!job) {
    notFound();
  }
  return (
    <div className="p-2 md:mx-4 md:my-2 md:p-4 lg:mx-4 lg:my-4 lg:p-6 xl:mx-16 xl:my-10 xl:p-8">
      <HeaderPage
        title={job.name}
        icon="calendar-sync"
        description="Scheduled Job"
      />
      <JobsDetailsWrapper data={job} />
    </div>
  );
}
