import { HeaderPage } from "@bolabali/components/common";
import { CardPage } from "@bolabali/components/layout";

export default function JobsPage() {
  return (
    <CardPage className="mx-16 my-10 p-8">
      <HeaderPage
        title="Jobs"
        icon="calendar-sync"
        description="Manage your schedule jobs"
      />
    </CardPage>
  );
}
