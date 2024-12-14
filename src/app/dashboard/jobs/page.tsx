import { api, HydrateClient } from "@bolabali/trpc/server";
import { auth } from "@bolabali/server/auth";
import { JobsWrapper } from "@bolabali/components/features/jobs";
import { HeaderPage } from "@bolabali/components/common";

export default async function JobsPage({
  searchParams,
}: {
  readonly searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { limit, page } = await searchParams;

  const session = await auth();

  if (session?.user) {
    void api.job.getAll.prefetch({
      limit: !isNaN(parseInt(limit!)) ? parseInt(limit!) : undefined,
      page: !isNaN(parseInt(page!)) ? parseInt(page!) : undefined,
    });
  }

  return (
    <div className="p-2 md:mx-4 md:my-2 md:p-4 lg:mx-4 lg:my-4 lg:p-6 xl:mx-16 xl:my-10 xl:p-8">
      <HeaderPage
        title="Jobs"
        icon="calendar-sync"
        description="Manage your schedule jobs"
      />
      <HydrateClient>
        <JobsWrapper />
      </HydrateClient>
    </div>
  );
}
