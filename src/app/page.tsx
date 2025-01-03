import { redirect } from "next/navigation";

import { auth } from "@zapcron/server/auth";
import { LogoLink } from "@zapcron/components/common";
import { AuthCard } from "@zapcron/components/features/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return redirect("/dashboard/jobs");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <LogoLink />
        <AuthCard />
      </div>
    </main>
  );
}
