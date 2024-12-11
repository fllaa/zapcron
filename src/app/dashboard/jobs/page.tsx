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
    <div className="mx-16 my-10 p-8">
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
