"use client";

import { Avatar, Chip, cn } from "@heroui/react";
import { Table } from "@zapcron/components/common";
import type { api as apiServer } from "@zapcron/trpc/server";
import { CircleCheck, CircleSlash } from "lucide-react";
import type React from "react";
import { useCallback, useMemo } from "react";

interface UsersTableProps {
  users: Omit<Awaited<ReturnType<typeof apiServer.user.getAll>>, "_meta">;
}

const UsersTable = ({ users }: UsersTableProps) => {
  const rows = useMemo(
    () =>
      users.data.map((user) => ({
        key: user.id.toString(),
        name: user.name,
        email: user.email,
        verified: !!user.emailVerified,
        image: user.image,
        role: user.role,
      })),
    [users],
  );

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "verified", label: "Verified" },
    { key: "image", label: "Image" },
    { key: "role", label: "Role" },
  ];

  const renderCell = useCallback(
    (item: Record<string, unknown>, columnKey: React.Key | string) => {
      const _columnKey = columnKey as string;
      const value = item[_columnKey];

      switch (_columnKey) {
        case "verified":
          return (
            <div className="flex items-center gap-2">
              {value ? (
                <CircleCheck size={16} className="text-success" />
              ) : (
                <CircleSlash size={16} className="text-danger" />
              )}
            </div>
          );

        case "image":
          return (
            <div className="flex items-center gap-2">
              <Avatar src={value as string} name={item.name as string} />
            </div>
          );
        case "role":
          return (
            <Chip
              color={
                (value as string).toLowerCase() === "admin"
                  ? "primary"
                  : "secondary"
              }
              variant="flat"
            >
              {value as string}
            </Chip>
          );
        default:
          return value as string;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="scrollbar-hide hidden h-full w-full max-w-full overflow-x-scroll px-2 py-4 md:block">
      <Table rows={rows} columns={columns} renderCell={renderCell} />
    </div>
  );
};

export { UsersTable };
