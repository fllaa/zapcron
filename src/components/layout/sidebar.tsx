"use client";

import { Link } from "@heroui/react";
import { IconButton, LogoLink } from "@zapcron/components/common";
import { UserDropdown } from "@zapcron/components/features/user";
import { menu } from "@zapcron/constants/menu";
import type { api } from "@zapcron/trpc/server";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

interface SidebarProps {
  user: Session["user"];
  systemInfo: Awaited<ReturnType<typeof api.system.get>>;
}

const Sidebar = ({ user, systemInfo }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="hidden max-h-screen w-48 flex-shrink-0 md:block lg:w-56 xl:w-64">
      <div className="fixed top-0 bottom-0 z-30 flex max-h-screen min-h-[50vh] md:w-48 lg:w-56 xl:w-64">
        <div className="flex w-full flex-col overflow-y-auto px-8 pt-6">
          <LogoLink />
          <ul className="mt-8 flex flex-col gap-2">
            {menu.map((item) => {
              const isEnabled = pathname.includes(item.name.toLowerCase());
              return (
                <li key={item.name} className="font-semibold text-lg">
                  <IconButton
                    as={Link}
                    href={`/dashboard/${item.name.toLowerCase()}`}
                    icon={item.icon}
                    variant={isEnabled ? "solid" : "ghostv2"}
                    className="w-full rounded-full text-right"
                    size="lg"
                  >
                    {item.name}
                  </IconButton>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="fixed bottom-0 z-30 flex max-h-screen flex-col gap-4 px-10 py-4">
        <UserDropdown user={user} />
        <span className="text-gray-300 text-xs dark:text-gray-700">
          v{systemInfo?.version} | {systemInfo?.commitSha}
        </span>
      </div>
    </aside>
  );
};

export { Sidebar };
