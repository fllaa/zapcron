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
  Switch,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CronBuilder } from "@bolabali/components/common";
import { api } from "@bolabali/trpc/react";
import { zCreateJobInput } from "@bolabali/zod/job";
import { HttpMethod } from "@bolabali/constants/http";

const JobsCreateModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const httpMethods = Object.values(HttpMethod);

  const methods = useForm({
    resolver: zodResolver(zCreateJobInput),
  });
  const utils = api.useUtils();

  const createJob = api.job.create.useMutation({
    onSuccess: () => {
      methods.reset();
      void utils.job.invalidate();
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
        backdrop="blur"
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
                    isEnabled: data.isEnabled as boolean,
                    cronspec: data.cronspec as string,
                    url: data.url as string,
                    method: data.method as HttpMethod,
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
                  <Switch defaultSelected {...methods.register("isEnabled")}>
                    Enabled
                  </Switch>
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
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export { JobsCreateModal };
