import { HeaderPage } from "@zapcron/components/common";
import { SettingsWrapper } from "@zapcron/components/features/settings";
import { api, HydrateClient } from "@zapcron/trpc/server";

export default async function SettingsPage() {
  await api.log.getStats.prefetch().catch(() => {
    // ignore
  });

  return (
    <div className="p-2 md:mx-2 md:my-2 md:p-2 lg:mx-2 lg:my-4 lg:p-4 xl:mx-6 xl:my-10 xl:p-6">
      <HeaderPage
        title="Settings"
        icon="settings"
        description="Configure your application settings"
      />
      <HydrateClient>
        <SettingsWrapper />
      </HydrateClient>
    </div>
  );
}
