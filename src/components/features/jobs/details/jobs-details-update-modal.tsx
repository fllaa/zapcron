"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
  Switch,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CronBuilder } from "@zapcron/components/common";
import { api } from "@zapcron/trpc/react";
import { type api as apiServer } from "@zapcron/trpc/server";
import { zUpdateJobInput } from "@zapcron/zod/job";
import { HttpMethod } from "@zapcron/constants/http";

interface JobsDetailsUpdateModalProps {
  data: Awaited<ReturnType<typeof apiServer.job.get>>;
}

const JobsDetailsUpdateModal = ({ data }: JobsDetailsUpdateModalProps) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const httpMethods = Object.values(HttpMethod);

  const methods = useForm({
    resolver: zodResolver(zUpdateJobInput),
    defaultValues: {
      id: data!.id,
      name: data!.name,
      description: data!.description,
      isEnabled: data!.isEnabled,
      cronspec: data!.cronspec,
      url: data!.url,
      method: data!.method,
      headers: data!.headers ? JSON.stringify(data!.headers) : "",
      body: data!.body ? JSON.stringify(data!.body) : "",
    },
  });
  const utils = api.useUtils();

  const updateJob = api.job.update.useMutation({
    onSuccess: () => {
      methods.reset();
      void utils.job.invalidate();
      toast.success("Job updated successfully");
      onOpenChange();
      router.refresh();
    },
  });

  return (
    <>
      <Button isIconOnly size="sm" variant="faded" onPress={onOpen}>
        <Pencil size={12} />
      </Button>
      <Modal
        size="xl"
        scrollBehavior="inside"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit((data) =>
                  updateJob.mutate({
                    id: data.id,
                    name: data.name,
                    description: data.description!,
                    isEnabled: data.isEnabled,
                    cronspec: data.cronspec,
                    url: data.url,
                    method: data.method as HttpMethod,
                    headers: data.headers,
                    body: data.body,
                  }),
                )}
                className="overflow-y-auto"
              >
                <ModalHeader className="flex flex-col gap-1">
                  Update Job
                </ModalHeader>
                <ModalBody>
                  <input type="hidden" {...methods.register("id")} />
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
                  <Switch {...methods.register("isEnabled")}>Enabled</Switch>
                  <CronBuilder
                    tabsProps={{
                      defaultSelectedKey: "custom",
                    }}
                  />
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
                    isLoading={updateJob.isPending}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </form>
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export { JobsDetailsUpdateModal };
