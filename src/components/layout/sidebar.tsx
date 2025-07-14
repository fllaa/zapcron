"use client";

import { Link } from "@heroui/react";
import { IconButton, LogoLink } from "@zapcron/components/common";
import { UserDropdown } from "@zapcron/components/features/user";
import { menu } from "@zapcron/constants/menu";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

interface SidebarProps {
  user: Session["user"];
}

const Sidebar = ({ user }: SidebarProps) => {
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
      <div className="fixed bottom-0 z-30 flex max-h-screen flex-col gap-4 p-10">
        <UserDropdown user={user} />
      </div>
    </aside>
  );
};

export { Sidebar };
