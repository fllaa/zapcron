import { SettingsLogs } from "@zapcron/components/features/settings";
import { SettingsUsers } from "@zapcron/components/features/settings/settings-users";

export const SettingsWrapper = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <SettingsLogs />
      <SettingsUsers />
    </div>
  );
};
