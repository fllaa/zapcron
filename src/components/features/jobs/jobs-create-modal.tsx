"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { CronBuilder } from "@zapcron/components/common";
import { HttpMethod } from "@zapcron/constants/http";
import { useConfig } from "@zapcron/hooks";
import { api } from "@zapcron/trpc/react";
import { zCreateJobInput } from "@zapcron/zod/job";
import { Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

const JobsCreateModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const httpMethods = Object.values(HttpMethod);

  const config = useConfig();
  const methods = useForm({
    resolver: zodResolver(zCreateJobInput),
  });
  const { errors } = methods.formState;
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
        size="md"
        variant="solid"
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
                    isInvalid={!!errors.name?.message}
                    errorMessage={JSON.stringify(errors.name?.message)}
                  />
                  <Textarea
                    {...methods.register("description")}
                    label="Description"
                    placeholder="My Job Description"
                    variant="bordered"
                    isInvalid={!!errors.description?.message}
                    errorMessage={JSON.stringify(errors.description?.message)}
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
                    isInvalid={!!errors.url?.message}
                    errorMessage={JSON.stringify(errors.url?.message)}
                  />
                  <Select
                    {...methods.register("method", {
                      required: "Method is required",
                    })}
                    label="Method"
                    placeholder="Select a method"
                    variant="bordered"
                    isInvalid={!!errors.method?.message}
                    errorMessage={JSON.stringify(errors.method?.message)}
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
                    isInvalid={!!errors.headers?.message}
                    errorMessage={JSON.stringify(errors.headers?.message)}
                  />
                  <Textarea
                    {...methods.register("body")}
                    label="Body"
                    placeholder={`{"key": "value"}`}
                    variant="bordered"
                    isInvalid={!!errors.body?.message}
                    errorMessage={JSON.stringify(errors.body?.message)}
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
        {config.debug && <DevTool control={methods.control} />}
      </Modal>
    </>
  );
};

export { JobsCreateModal };
