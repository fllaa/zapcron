"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { type Session } from "next-auth";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  useDisclosure,
} from "@heroui/react";
import { Menu } from "lucide-react";

import { IconButton, LogoLink } from "@zapcron/components/common";
import { UserDropdown } from "@zapcron/components/features/user";
import { menu } from "@zapcron/constants/menu";

interface HeaderProps {
  user: Session["user"];
}

const Header = ({ user }: HeaderProps) => {
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
                <div className="mt-8 text-start">
                  <UserDropdown user={user} />
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
