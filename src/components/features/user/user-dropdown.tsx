"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Switch,
  User,
} from "@heroui/react";
import { ConfirmationModal } from "@zapcron/components/common";
import { UserProfileDrawer } from "@zapcron/components/features/user";
import _ from "lodash";
import { Moon, Sun } from "lucide-react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRef } from "react";

interface UserDropdownProps {
  user: Session["user"];
}

const UserDropdown = ({ user }: UserDropdownProps) => {
  const buttonProfileRef = useRef<HTMLButtonElement>(null);
  const buttonSignoutRef = useRef<HTMLButtonElement>(null);
  const { theme, setTheme } = useTheme();
  return (
    <>
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: user?.image ?? "",
            }}
            className="transition-transform"
            description={_.truncate(user?.email ?? "", { length: 24 })}
            name={user?.name}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="theme-switcher" closeOnSelect={false}>
            <Switch
              isSelected={theme === "dark"}
              color="secondary"
              endContent={<Moon />}
              size="md"
              startContent={<Sun />}
              onValueChange={(value) => setTheme(value ? "dark" : "light")}
            >
              Dark mode
            </Switch>
          </DropdownItem>
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
          <DropdownItem
            key="logout"
            color="danger"
            onPress={() => buttonSignoutRef.current?.click()}
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <UserProfileDrawer buttonRef={buttonProfileRef} user={user} />
      <ConfirmationModal
        onConfirm={signOut}
        renderTrigger={(onOpen) => (
          <button
            type="button"
            ref={buttonSignoutRef}
            onClick={onOpen}
            className="hidden"
          >
            Sign Out
          </button>
        )}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        color="danger"
      />
    </>
  );
};

export { UserDropdown };
