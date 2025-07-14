import { HeaderPage } from "@zapcron/components/common";
import { JobsDetailsWrapper } from "@zapcron/components/features/jobs/details";
import { api } from "@zapcron/trpc/server";
import { notFound } from "next/navigation";

export default async function JobsDetailsPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const job = await api.job.get({
    id: parseInt((await params).id),
  });

  if (!job) {
    notFound();
  }
  return (
    <div className="p-2 md:mx-2 md:my-2 md:p-2 lg:mx-2 lg:my-4 lg:p-4 xl:mx-6 xl:my-10 xl:p-6">
      <HeaderPage
        title={job.name}
        icon="calendar-sync"
        description="Scheduled Job"
      />
      <JobsDetailsWrapper data={job} />
    </div>
  );
}
