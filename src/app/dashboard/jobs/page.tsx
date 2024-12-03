import { HeaderPage } from "@bolabali/app/_components/common";
import { CardPage } from "@bolabali/app/_components/layout";

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
