"use client";

import { Card, CardBody, Pagination, Select, SelectItem } from "@heroui/react";
import { Search } from "@zapcron/components/common";
import { UsersTable } from "@zapcron/components/features/user";
import { useCreateQueryString, useDebouncedState } from "@zapcron/hooks";
import { api } from "@zapcron/trpc/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SettingsUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useDebouncedState("", 300);
  const createQueryString = useCreateQueryString();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const availableLimits = [5, 10, 20, 50, 100];
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [users] = api.user.getAll.useSuspenseQuery({
    limit,
    page,
    query,
  });

  useEffect(() => {
    if (query && users.data?.length === 0 && users._meta.totalPages > 0) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, users.data, users._meta.totalPages]);

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString("page", currentPage.toString())}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, createQueryString, pathname, router]);
  return (
    <div className="col-span-8 space-y-2">
      <h3 className="font-bold text-xl">Users</h3>
      <Card>
        <CardBody>
          <div className="my-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <Search
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery("")}
              className="max-w-72"
            />
          </div>
          <div className="space-y-4">
            <UsersTable users={users} />
            <div className="flex items-center justify-between">
              <Pagination
                initialPage={page}
                total={users._meta.totalPages}
                page={currentPage}
                onChange={setCurrentPage}
              />
              <Select
                className="max-w-20"
                variant="bordered"
                defaultSelectedKeys={[limit.toString()]}
                value={limit.toString()}
                onChange={(e) =>
                  router.push(
                    `${pathname}?${createQueryString("limit", e.target.value)}`,
                  )
                }
              >
                {availableLimits.map((_value) => {
                  const value = _value.toString();
                  return (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  );
                })}
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export { SettingsUsers };
