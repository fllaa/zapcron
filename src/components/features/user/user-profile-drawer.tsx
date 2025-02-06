/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React from "react";
import { type Session } from "next-auth";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";

import { Role } from "@zapcron/constants/role";

interface UserProfileDrawerProps {
  buttonRef: React.RefObject<HTMLButtonElement>;
  user: Session["user"];
}

const UserProfileDrawer = ({ buttonRef, user }: UserProfileDrawerProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const roles = Object.values(Role);

  return (
    <>
      <button ref={buttonRef} className="hidden" onClick={onOpen}>
        open
      </button>
      <Drawer
        placement="left"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Your Profile
              </DrawerHeader>
              <DrawerBody>
                <Avatar
                  isBordered
                  className="h-24 w-24 text-large"
                  src={user?.image ?? ""}
                />
                <div className="my-2 space-y-2">
                  <Input
                    label="Name"
                    placeholder="John Doe"
                    variant="bordered"
                    value={user?.name ?? ""}
                    isDisabled
                  />
                  <Input
                    label="Email"
                    placeholder="johndoe@mail.com"
                    variant="bordered"
                    value={user?.email ?? ""}
                    isDisabled
                  />
                  <Select
                    label="Role"
                    placeholder="Select a role"
                    variant="bordered"
                    defaultSelectedKeys={[user?.role]}
                    isDisabled
                  >
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button color="primary" onPress={onClose} isDisabled>
                  Save
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { UserProfileDrawer };
