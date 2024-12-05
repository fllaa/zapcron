"use client";

import React from "react";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";

import { CronBuilder } from "@bolabali/components/common";
import { api } from "@bolabali/trpc/react";
import { zCreateJobInput } from "@bolabali/zod/job";

const JobsCreateModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  const methods = useForm({
    resolver: zodResolver(zCreateJobInput),
  });

  const createJob = api.job.create.useMutation({
    onSuccess: () => {
      methods.reset();
      toast.success("Job created successfully");
      onOpenChange();
    },
  });

  return (
    <>
      <Button
        size="lg"
        variant="bordered"
        startContent={<Plus size={16} />}
        onPress={onOpen}
      >
        Create
      </Button>
      <Modal
        size="xl"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit((data) =>
                  createJob.mutate({
                    name: data.name as string,
                    description: data.description as string,
                    cronspec: data.cronspec as string,
                    url: data.url as string,
                    method: data.method as
                      | "GET"
                      | "POST"
                      | "PUT"
                      | "PATCH"
                      | "DELETE",
                    headers: data.headers as string,
                    body: data.body as string,
                  }),
                )}
                className="overflow-y-auto"
              >
                <ModalHeader className="flex flex-col gap-1">
                  Create Job
                </ModalHeader>
                <ModalBody>
                  <Input
                    {...methods.register("name", {
                      required: "Name is required",
                    })}
                    autoFocus
                    isClearable
                    label="Name"
                    placeholder="My Job"
                    variant="bordered"
                    isInvalid={!!methods.formState.errors.name?.message}
                    errorMessage={methods.formState.errors.name?.message?.toString()}
                  />
                  <Textarea
                    {...methods.register("description")}
                    label="Description"
                    placeholder="My Job Description"
                    variant="bordered"
                    isInvalid={!!methods.formState.errors.description?.message}
                    errorMessage={methods.formState.errors.description?.message?.toString()}
                  />
                  <CronBuilder />
                  <Input
                    {...methods.register("url", {
                      required: "URL is required",
                    })}
                    isClearable
                    label="URL"
                    placeholder="https://example.com"
                    variant="bordered"
                    isInvalid={!!methods.formState.errors.url?.message}
                    errorMessage={methods.formState.errors.url?.message?.toString()}
                  />
                  <Select
                    {...methods.register("method", {
                      required: "Method is required",
                    })}
                    label="Method"
                    placeholder="Select a method"
                    variant="bordered"
                    isInvalid={!!methods.formState.errors.method?.message}
                    errorMessage={methods.formState.errors.method?.message?.toString()}
                  >
                    {httpMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </Select>
                  <Textarea
                    {...methods.register("headers")}
                    label="Headers"
                    placeholder={`{"Content-Type": "application/json"}`}
                    variant="bordered"
                    isInvalid={!!methods.formState.errors.headers?.message}
                    errorMessage={methods.formState.errors.headers?.message?.toString()}
                  />
                  <Textarea
                    {...methods.register("body")}
                    label="Body"
                    placeholder={`{"key": "value"}`}
                    variant="bordered"
                    isInvalid={!!methods.formState.errors.body?.message}
                    errorMessage={methods.formState.errors.body?.message?.toString()}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={createJob.isPending}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </form>
              <DevTool control={methods.control} />
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
      {/* TODO: Remove this in production */}
    </>
  );
};

export { JobsCreateModal };
