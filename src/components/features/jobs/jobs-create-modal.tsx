"use client";

import {
  Button,
  Card,
  CardBody,
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
import Editor from "@monaco-editor/react";
import { CronBuilder } from "@zapcron/components/common";
import { HttpMethod } from "@zapcron/constants/http";
import { useConfig } from "@zapcron/hooks";
import { api } from "@zapcron/trpc/react";
import { zCreateJobInput } from "@zapcron/zod/job";
import { cx } from "classix";
import { Plus, X } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";

const JobsCreateModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const httpMethods = Object.values(HttpMethod);

  const config = useConfig();
  const methods = useForm({
    resolver: zodResolver(zCreateJobInput),
  });
  const { errors } = methods.formState;
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "headers",
  });

  const { theme } = useTheme();
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
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit((data) => {
                  createJob.mutate({
                    name: data.name as string,
                    description: data.description as string,
                    isEnabled: data.isEnabled as boolean,
                    cronspec: data.cronspec as string,
                    url: data.url as string,
                    method: data.method as HttpMethod,
                    headers: data.headers as Array<{
                      key: string;
                      value: string;
                    }>,
                    body: data.body as string,
                  });
                })}
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
                          isInvalid={!!errors.headers?.message}
                          errorMessage={JSON.stringify(errors.headers?.message)}
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
                          isInvalid={!!errors.headers?.message}
                          errorMessage={JSON.stringify(errors.headers?.message)}
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
                  <Card
                    className={cx(errors.body?.message && "outline-red-500")}
                  >
                    <CardBody>
                      <h4 className="mb-1 text-gray-500 text-xs dark:text-gray-300">
                        Body
                      </h4>
                      <Controller
                        control={methods.control}
                        name="body"
                        render={({ field }) => (
                          <Editor
                            height="10rem"
                            defaultLanguage="json"
                            defaultValue={
                              typeof field.value === "string"
                                ? field.value
                                : "{}"
                            }
                            theme={theme === "dark" ? "vs-dark" : "light"}
                            options={{
                              minimap: { enabled: false },
                              wordWrap: "on",
                              fontSize: 14,
                              lineNumbers: "on",
                            }}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </CardBody>
                  </Card>
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
