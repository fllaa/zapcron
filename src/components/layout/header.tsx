"use client";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  useDisclosure,
} from "@heroui/react";
import { IconButton, LogoLink } from "@zapcron/components/common";
import { UserDropdown } from "@zapcron/components/features/user";
import { menu } from "@zapcron/constants/menu";
import type { api } from "@zapcron/trpc/server";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

interface HeaderProps {
  user: Session["user"];
  systemInfo: Awaited<ReturnType<typeof api.system.get>>;
}

const Header = ({ user, systemInfo }: HeaderProps) => {
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Navbar
        className="md:hidden"
        classNames={{
          wrapper: "px-2",
        }}
      >
        <NavbarBrand>
          <LogoLink />
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button variant="light" onPress={onOpen} isIconOnly>
              <Menu />
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="top">
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Menu</DrawerHeader>
              <DrawerBody>
                <ul className="flex flex-col gap-2">
                  {menu.map((item) => {
                    const isEnabled = pathname.includes(
                      item.name.toLowerCase(),
                    );
                    return (
                      <li key={item.name}>
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
                <div className="relative mt-8 text-start">
                  <UserDropdown user={user} />
                  <span className="absolute right-0 bottom-0 py-1.5 text-gray-300 text-xs dark:text-gray-700">
                    v{systemInfo?.version} | {systemInfo?.commitSha}
                  </span>
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { Header };
