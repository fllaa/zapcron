"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  User,
} from "@nextui-org/react";
import { CalendarSync, Settings, Workflow } from "lucide-react";

import { IconButton, LogoLink } from "@bolabali/components/common";
import { signOut } from "next-auth/react";

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

const Sidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <>
      <div className="sticky bottom-0 top-0 z-30 flex max-h-screen min-h-[50vh]">
        <div className="flex w-full flex-col overflow-y-auto px-8 pt-6">
          <LogoLink />
          <ul className="mt-8 flex flex-col gap-2">
            {menu.map((item) => {
              const isActive = pathname.includes(item.name.toLowerCase());
              return (
                <li key={item.name} className="text-lg font-semibold">
                  <IconButton
                    as={Link}
                    href={`/dashboard/${item.name.toLowerCase()}`}
                    icon={item.icon}
                    variant={isActive ? "solid" : "ghostv2"}
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
      <div className="fixed bottom-0 z-30 flex max-h-screen p-10">
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: session?.user?.image ?? "",
              }}
              className="transition-transform"
              description={session?.user?.email}
              name={session?.user?.name}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">{session?.user?.name}</p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
};

export { Sidebar };
