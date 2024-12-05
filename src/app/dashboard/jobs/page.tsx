import { api } from "@bolabali/trpc/server";
import { JobsCreateModal, JobsTable } from "@bolabali/components/features/jobs";
import { HeaderPage, Search } from "@bolabali/components/common";

export default async function JobsPage({
  searchParams,
}: {
  readonly searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { limit, page } = await searchParams;

  const jobs = await api.job.getAll({
    limit: !isNaN(parseInt(limit!)) ? parseInt(limit!) : undefined,
    page: !isNaN(parseInt(page!)) ? parseInt(page!) : undefined,
  });

  return (
    <div className="mx-16 my-10 p-8">
      <HeaderPage
        title="Jobs"
        icon="calendar-sync"
        description="Manage your schedule jobs"
      />
      <div className="my-6 flex items-center justify-between gap-4">
        <Search className="max-w-72" />
        <JobsCreateModal />
      </div>
      <JobsTable data={jobs} />
    </div>
  );
}
