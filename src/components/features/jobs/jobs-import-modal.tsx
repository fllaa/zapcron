"use client";

import React, { useMemo, useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Switch,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import { Download, Import, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import parser from "cron-parser";
import { ZodError, type z } from "zod";

import { JobsTable } from "@zapcron/components/features/jobs";
import { api } from "@zapcron/trpc/react";
import { zBulkCreateJobInput } from "@zapcron/zod/job";
import { parseCsv } from "@zapcron/utils/csv";

const JobsImportModal = () => {
  const [jobs, setJobs] = useState<z.infer<typeof zBulkCreateJobInput>>([]);
  const [isEnableAll, setIsEnableAll] = useState<boolean>(true);
  const rowJobs = useMemo(
    () => ({
      data: jobs.map((job, i) => ({
        id: i,
        key: job.name,
        name: job.name,
        cronspec: job.cronspec,
        url: job.url,
        isEnabled: true,
        executeAt: parser.parseExpression(job.cronspec).next().toDate(),
        logs: [],
      })),
    }),
    [jobs],
  );
  const isFilled = useMemo(() => jobs.length > 0, [jobs]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const utils = api.useUtils();

  const bulkCreateJob = api.job.bulkCreate.useMutation({
    onSuccess: () => {
      void utils.job.invalidate();
      toast.success("Job created successfully");
      onOpenChange();
    },
  });

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.promise(
      async () => {
        const data: Record<string, unknown>[] = await parseCsv(file);
        // papaparse looks like have an issue
        // the result always has last element that only have single key with empty string value
        // so we pop it
        if (Object.keys(data[data.length - 1] as object).length === 1) {
          data.pop();
        }
        const parsedData = zBulkCreateJobInput.parse(data);
        setJobs(parsedData);
      },
      {
        loading: "Importing jobs...",
        success: "Jobs imported successfully",
        error: (error) => {
          if (error instanceof ZodError) {
            return "CSV is invalid.";
          }
          return "Failed import jobs";
        },
      },
    );
  };

  const onReset = () => setJobs([]);

  const onDownloadTemplate = () => {
    // get file from /docs/template-import.csv
    const url = "/docs/template-import.csv";
    window.open(url, "_blank");
  };

  const onSubmit = () => {
    toast.promise(
      async () => {
        await bulkCreateJob.mutateAsync(
          jobs.map((job) => ({
            ...job,
            isEnabled: isEnableAll,
          })),
        );
      },
      {
        loading: "Creating jobs...",
        success: "Bulk jobs created successfully",
        error: "Create bulk jobs failed",
      },
    );
  };

  return (
    <>
      <Button
        size="md"
        variant="bordered"
        startContent={<Import size={16} />}
        onPress={onOpen}
      >
        Import
      </Button>
      <Modal
        size={isFilled ? "4xl" : "md"}
        scrollBehavior="inside"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit} className="relative overflow-y-auto">
              <ModalHeader className="flex flex-col gap-1">
                Import Bulk Jobs
              </ModalHeader>
              <ModalBody>
                <input
                  id="upload-file"
                  type="file"
                  accept="text/csv"
                  className="hidden"
                  onChange={onUpload}
                />
                {isFilled ? (
                  <JobsTable jobs={rowJobs} isImport />
                ) : (
                  <Button
                    as="label"
                    htmlFor="upload-file"
                    variant="faded"
                    className="py-16"
                    startContent={<Import size={16} />}
                  >
                    Upload File
                  </Button>
                )}
              </ModalBody>
              <ModalFooter
                className={cn(
                  "flex items-center justify-between",
                  isFilled &&
                    "sticky bottom-0 left-0 right-0 rounded-2xl bg-content1",
                )}
              >
                <div className="flex items-center gap-2">
                  {isFilled ? (
                    <div className="flex items-center gap-2">
                      <Switch
                        size="sm"
                        isSelected={isEnableAll}
                        onValueChange={setIsEnableAll}
                        defaultSelected
                      >
                        Enable All
                      </Switch>
                      <Button
                        size="sm"
                        color="warning"
                        variant="light"
                        onPress={onReset}
                        startContent={<RefreshCcw size={16} />}
                      >
                        Reset
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      color="secondary"
                      variant="light"
                      onPress={onDownloadTemplate}
                      startContent={<Download size={16} />}
                    >
                      Template
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={bulkCreateJob.isPending}
                  >
                    Import
                  </Button>
                </div>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export { JobsImportModal };
