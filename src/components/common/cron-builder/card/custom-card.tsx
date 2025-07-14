"use client";

import { Card, CardBody, Input } from "@heroui/react";
import cronstrue from "cronstrue";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

const CustomCard = () => {
  const { register, watch } = useFormContext();

  const value = watch("cronspec") as string;

  const description = useMemo(
    () =>
      cronstrue.toString(value, {
        throwExceptionOnParseError: false,
      }),
    [value],
  );
  return (
    <Card>
      <CardBody className="h-[12.5rem]">
        <Input
          {...register("cronspec")}
          label="Cron Expression"
          variant="bordered"
          description={description}
        />
      </CardBody>
    </Card>
  );
};

export { CustomCard };
