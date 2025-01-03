"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Divider,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useFormContext } from "react-hook-form";
import CronTime from "cron-time-generator";

const HourlyCard = () => {
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString());
  const hours = Array.from({ length: 24 }, (_, i) => i.toString());

  const { setValue } = useFormContext();

  const [selectedValue, setSelectedValue] = useState("every-hour");
  const [everyValue, setEveryValue] = useState("1");
  const [atValue, setAtValue] = useState("0");

  const cronExpression = useMemo(() => {
    if (selectedValue === "every-hour") {
      return CronTime.everyHour();
    }
    if (selectedValue === "every-n-hour") {
      return CronTime.every(parseInt(everyValue)).hours();
    }
    if (selectedValue === "every-n-hour-at-n") {
      const cronHour = CronTime.every(parseInt(everyValue))
        .hours()
        .split(" ")
        .slice(1, 5)
        .join(" ");
      return `${atValue} ${cronHour}`;
    }
    return "";
  }, [selectedValue, everyValue, atValue]);

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
            value="every-hour"
            classNames={{
              hiddenInput: "hidden",
            }}
          >
            Every Hour
          </Radio>
          <Divider className="my-0.5" />
          <Radio
            value="every-n-hour"
            classNames={{
              hiddenInput: "hidden",
            }}
          >
            <div className="flex items-center gap-2">
              <span>Every</span>
              <Select
                aria-label="Every"
                isDisabled={selectedValue !== "every-n-hour"}
                value={everyValue}
                onChange={(e) => setEveryValue(e.target.value)}
                variant="bordered"
                className="w-16"
                size="sm"
              >
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </Select>
              <span>hour(s)</span>
            </div>
          </Radio>
          <Divider className="my-0.5" />
          <Radio
            value="every-n-hour-at-n"
            classNames={{
              hiddenInput: "hidden",
            }}
          >
            <div className="flex items-center gap-2">
              <span>Every</span>
              <Select
                isDisabled={selectedValue !== "every-n-hour-at-n"}
                value={everyValue}
                onChange={(e) => setEveryValue(e.target.value)}
                variant="bordered"
                className="w-16"
                size="sm"
              >
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </Select>
              <span>hour(s) at</span>
              <Select
                aria-label="At"
                isDisabled={selectedValue !== "every-n-hour-at-n"}
                value={atValue}
                onChange={(e) => setAtValue(e.target.value)}
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
              <span>min(s) past the hour</span>
            </div>
          </Radio>
        </RadioGroup>
      </CardBody>
    </Card>
  );
};

export { HourlyCard };
