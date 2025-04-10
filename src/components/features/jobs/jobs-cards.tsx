"use client";

import React, { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Chip,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Link,
  cn,
  type ChipProps,
} from "@heroui/react";
import { EllipsisVertical, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { v4 } from "uuid";

import { api } from "@zapcron/trpc/react";
import { type api as apiServer } from "@zapcron/trpc/server";
import { ConfirmationModal } from "@zapcron/components/common";
import { colorByStatus } from "@zapcron/utils/color";
import { httpColors, type HttpMethod } from "@zapcron/constants/http";

interface JobsCardsProps {
  jobs: Omit<Awaited<ReturnType<typeof apiServer.job.getAll>>, "_meta">;
}

const JobsCards = ({ jobs }: JobsCardsProps) => {
  const [willDeleteJobId, setWillDeleteJobId] = useState<number | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();
  const utils = api.useUtils();
  const deleteJob = api.job.delete.useMutation({
    onSuccess: () => {
      void utils.job.invalidate();
      setWillDeleteJobId(null);
      toast.success("Job deleted successfully");
    },
  });
  const executeNowJob = api.job.executeNow.useMutation({
    onSuccess: async () => {
      void utils.job.invalidate();
    },
  });

  return (
    <>
      <div className="grid h-full w-full max-w-full grid-cols-1 gap-2 md:hidden">
        {jobs.data.map((job) => {
          const { hostname } = new URL(job.url);
          const httpMethodColor = httpColors[job.method as HttpMethod];
          return (
            <div key={job.id} className="col-span-1">
              <Card
                as={Link}
                href={`${pathname}/${job.id}`}
                className={cn(
                  "hover:shadow-lg",
                  !job.isEnabled && "opacity-50",
                )}
              >
                <CardHeader className="flex items-start justify-between">
                  <div className="flex flex-col items-start">
                    <p className="text-md">{job.name}</p>
                    <div className="flex items-center gap-1">
                      <Chip
                        size="sm"
                        variant="light"
                        color={httpMethodColor as ChipProps["color"]}
                      >
                        {job.method}
                      </Chip>
                      <p className="text-small text-default-500">{hostname}</p>
                    </div>
                  </div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="light" size="sm" isIconOnly>
                        <EllipsisVertical size={16} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Action menu">
                      <DropdownItem
                        key="execute"
                        startContent={<Play size={16} />}
                        onPress={() =>
                          toast.promise(
                            executeNowJob.mutateAsync({
                              id: job.id,
                            }),
                            {
                              loading: "Executing job...",
                              success: "Job executed successfully",
                              error: "Failed to execute job",
                            },
                          )
                        }
                      >
                        Execute Now
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<Trash2 size={16} />}
                        onPress={() => {
                          setWillDeleteJobId(job.id);
                          deleteButtonRef.current?.click();
                        }}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="grid grid-cols-3 text-center">
                    <div className="col-span-1">
                      <Chip size="sm" variant="bordered">
                        {job.cronspec}
                      </Chip>
                    </div>
                    <div className="col-span-1 mx-auto">
                      <Divider orientation="vertical" />
                    </div>
                    <div className="col-span-1 mx-auto flex items-center">
                      <div className="flex items-center">
                        {job.logs
                          .map((log) => log.status)
                          .reverse()
                          .map((status) => {
                            const color = colorByStatus(parseInt(status, 10));
                            return (
                              <Chip
                                key={v4()}
                                size="sm"
                                color={color}
                                className="aspect-square h-2 w-2"
                              />
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>
      <ConfirmationModal
        renderTrigger={(onOpen) => (
          <button
            ref={deleteButtonRef}
            className="hidden"
            onClick={onOpen}
          ></button>
        )}
        onConfirm={() =>
          deleteJob.mutateAsync({
            id: willDeleteJobId!,
          })
        }
        title="Delete Job"
        message="Are you sure you want to delete this job?"
      />
    </>
  );
};

export { JobsCards };
