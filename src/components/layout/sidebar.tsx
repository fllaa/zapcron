"use client";

import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { type Session } from "next-auth";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  User,
} from "@nextui-org/react";
import { CalendarSync, Settings, Workflow } from "lucide-react";

import { IconButton, LogoLink } from "@zapcron/components/common";
import { UserProfileDrawer } from "@zapcron/components/features/user";

const menu = [
  {
    icon: <CalendarSync size={20} />,
    name: "Jobs",
  },
  {
    icon: <Workflow size={20} />,
    name: "Workflow",
  },
  {
    icon: <Settings size={20} />,
    name: "Settings",
  },
];

interface SidebarProps {
  user: Session["user"];
}

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();
  const buttonProfileRef = useRef<HTMLButtonElement>(null);

  return (
    <aside className="hidden max-h-screen w-60 flex-shrink-0 md:block lg:w-72 xl:w-80">
      <div className="fixed bottom-0 top-0 z-30 flex max-h-screen min-h-[50vh] md:w-60 lg:w-72 xl:w-80">
        <div className="flex w-full flex-col overflow-y-auto px-8 pt-6">
          <LogoLink />
          <ul className="mt-8 flex flex-col gap-2">
            {menu.map((item) => {
              const isEnabled = pathname.includes(item.name.toLowerCase());
              return (
                <li key={item.name} className="text-lg font-semibold">
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
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: user?.image ?? "",
              }}
              className="transition-transform"
              description={user?.email}
              name={user?.name}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="user" className="h-14 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">{user?.name}</p>
            </DropdownItem>
            <DropdownItem
              key="profile"
              onPress={() => buttonProfileRef.current?.click()}
            >
              Profile
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <UserProfileDrawer buttonRef={buttonProfileRef} user={user} />
    </aside>
  );
};

export { Sidebar };
