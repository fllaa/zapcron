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
import type { api as apiServer } from "@zapcron/trpc/server";
import { zUpdateJobInput } from "@zapcron/zod/job";
import { Pencil, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface JobsDetailsUpdateModalProps {
  data: Awaited<ReturnType<typeof apiServer.job.get>>;
}

const JobsDetailsUpdateModal = ({ data }: JobsDetailsUpdateModalProps) => {
  const config = useConfig();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const httpMethods = Object.values(HttpMethod);

  const _headers = useMemo(() => {
    let headers: Array<{ key: string; value: string }> = [];
    if (data?.headers) {
      try {
        if (typeof data.headers === "object") {
          headers = Object.entries(data.headers).map(([key, value]) => ({
            key,
            value: String(value),
          }));
        }
      } catch (error) {
        console.error(error);
      }
    }

    return headers;
  }, [data]);

  const methods = useForm({
    resolver: zodResolver(zUpdateJobInput),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      description: data?.description,
      isEnabled: data?.isEnabled,
      cronspec: data?.cronspec,
      url: data?.url,
      method: data?.method,
      headers: _headers,
      body: data?.body ? JSON.stringify(data?.body) : "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "headers",
  });

  const utils = api.useUtils();

  const updateJob = api.job.update.useMutation({
    onSuccess: () => {
      if (data) {
        void utils.job.get.invalidate({
          id: data.id,
        });
      }
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
                    // biome-ignore lint/style/noNonNullAssertion: no non null assertion
                    id: data.id!,
                    name: data.name,
                    // biome-ignore lint/style/noNonNullAssertion: no non null assertion
                    description: data.description!,
                    isEnabled: data.isEnabled,
                    // biome-ignore lint/style/noNonNullAssertion: no non null assertion
                    cronspec: data.cronspec!,
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
                  <h4 className="text-gray-500 text-xs dark:text-gray-300">
                    Headers
                  </h4>
                  <div className="flex flex-col gap-4">
                    {fields.map((item, index) => (
                      <div
                        key={item.id}
                        className="relative flex justify-between gap-2"
                      >
                        <Input
                          {...methods.register(`headers.${index}.key`, {
                            required: "Key is required",
                          })}
                          isClearable
                          label="Key"
                          placeholder="Content-Type"
                          variant="bordered"
                          size="sm"
                          isInvalid={
                            !!methods.formState.errors.headers?.message
                          }
                          errorMessage={JSON.stringify(
                            methods.formState.errors.headers?.message,
                          )}
                        />
                        <Input
                          {...methods.register(`headers.${index}.value`, {
                            required: "Value is required",
                          })}
                          isClearable
                          label="Value"
                          placeholder="application/json"
                          variant="bordered"
                          size="sm"
                          isInvalid={
                            !!methods.formState.errors.headers?.message
                          }
                          errorMessage={JSON.stringify(
                            methods.formState.errors.headers?.message,
                          )}
                        />
                        <Button
                          isIconOnly
                          className="absolute top-[-7px] right-[-7px] aspect-square h-5 min-w-5 max-w-5 rounded-full p-0"
                          color="danger"
                          variant="shadow"
                          onPress={() => remove(index)}
                        >
                          <X size={10} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="light"
                      size="sm"
                      startContent={<Plus size={12} />}
                      onPress={() => append({ key: "", value: "" })}
                    >
                      Add Header
                    </Button>
                  </div>
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
        {config.debug && <DevTool control={methods.control} />}
      </Modal>
    </>
  );
};

export { JobsDetailsUpdateModal };
