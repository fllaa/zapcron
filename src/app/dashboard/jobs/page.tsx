import { HeaderPage } from "@zapcron/components/common";
import { JobsWrapper } from "@zapcron/components/features/jobs";
import { api, HydrateClient } from "@zapcron/trpc/server";

export default async function JobsPage({
  searchParams,
}: {
  readonly searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { limit, page } = await searchParams;

  await api.job.getAll
    .prefetch({
      // biome-ignore lint/style/noNonNullAssertion: no non null assertion
      limit: !Number.isNaN(parseInt(limit!)) ? parseInt(limit!) : undefined,
      // biome-ignore lint/style/noNonNullAssertion: no non null assertion
      page: !Number.isNaN(parseInt(page!)) ? parseInt(page!) : undefined,
    })
    .catch(() => {
      // ignore
    });

  return (
    <div className="p-2 md:mx-2 md:my-2 md:p-2 lg:mx-2 lg:my-4 lg:p-4 xl:mx-6 xl:my-10 xl:p-6">
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
