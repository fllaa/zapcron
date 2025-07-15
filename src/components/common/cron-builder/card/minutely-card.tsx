"use client";

import {
  Card,
  CardBody,
  Divider,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@heroui/react";
import CronTime from "cron-time-generator";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

const MinutelyCard = () => {
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString());

  const { setValue } = useFormContext();

  const [selectedValue, setSelectedValue] = useState("every-minute");
  const [everyValue, setEveryValue] = useState("1");

  const cronExpression = useMemo(() => {
    if (selectedValue === "every-minute") {
      return CronTime.everyMinute();
    }
    if (selectedValue === "every-n-minute") {
      return CronTime.every(parseInt(everyValue)).minutes();
    }
    return "";
  }, [selectedValue, everyValue]);

  useEffect(() => {
    setValue("cronspec", cronExpression);
  }, [cronExpression, setValue]);

  return (
    <Card>
      <CardBody className="h-[12.5rem]">
        <RadioGroup
          value={selectedValue}
          onValueChange={(value) => setSelectedValue(value)}
        >
          <Radio
            value="every-minute"
            classNames={{
              hiddenInput: "hidden",
            }}
          >
            Every Minute
          </Radio>
          <Divider className="my-0.5" />
          <Radio
            value="every-n-minute"
            classNames={{
              hiddenInput: "hidden",
            }}
          >
            <div className="flex items-center gap-2">
              <span>Every</span>
              <Select
                aria-label="Every"
                isDisabled={selectedValue !== "every-n-minute"}
                value={everyValue}
                onChange={(e) => setEveryValue(e.target.value)}
                variant="bordered"
                className="w-16"
                size="sm"
              >
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </Select>
              <span>min(s)</span>
            </div>
          </Radio>
        </RadioGroup>
      </CardBody>
    </Card>
  );
};

export { MinutelyCard };
