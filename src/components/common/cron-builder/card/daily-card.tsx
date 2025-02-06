"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Divider,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@heroui/react";
import { useFormContext } from "react-hook-form";
import CronTime from "cron-time-generator";

const DailyCard = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString());
  const days = Array.from({ length: 31 }, (_, i) => i.toString());
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const { setValue } = useFormContext();

  const [selectedValue, setSelectedValue] = useState("every-day");
  const [selectedDays, setSelectedDays] = useState(daysOfWeek);
  const [everyValue, setEveryValue] = useState("1");
  const [atValue, setAtValue] = useState("0");

  const cronExpression = useMemo(() => {
    if (selectedValue === "every-day") {
      return CronTime.everyDay();
    }
    if (selectedValue === "every-specified-day") {
      return CronTime.onSpecificDaysAt(selectedDays, parseInt(atValue));
    }
    if (selectedValue === "every-n-day-at-n") {
      const cronDay = CronTime.every(parseInt(everyValue))
        .days()
        .split(" ")
        .slice(2, 5)
        .join(" ");
      return `0 ${atValue} ${cronDay}`;
    }
    return "";
  }, [selectedValue, selectedDays, everyValue, atValue]);

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
            value="every-day"
            classNames={{
              hiddenInput: "hidden",
            }}
          >
            Every Day
          </Radio>
          <Divider className="my-0.5" />
          <Radio
            value="every-specified-day"
            classNames={{
              hiddenInput: "hidden",
            }}
          >
            <div className="flex items-center">
              <span>Every Specified Day</span>
              <CheckboxGroup
                size="sm"
                isDisabled={selectedValue !== "every-specified-day"}
                aria-label="day"
                orientation="horizontal"
                color="primary"
                defaultValue={daysOfWeek}
                value={selectedDays}
                onValueChange={setSelectedDays}
              >
                {daysOfWeek.map((day) => (
                  <Checkbox key={day} value={day}>
                    {day.slice(0, 3)}
                  </Checkbox>
                ))}
              </CheckboxGroup>
              <span>day(s) at</span>
              <Select
                aria-label="At"
                isDisabled={selectedValue !== "every-specified-day"}
                value={atValue}
                onChange={(e) => setAtValue(e.target.value)}
                variant="bordered"
                className="w-16 flex-shrink-0"
                size="sm"
              >
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </Radio>
          <Divider className="my-0.5" />
          <Radio
            value="every-n-day-at-n"
            classNames={{
              hiddenInput: "hidden",
            }}
          >
            <div className="flex items-center gap-2">
              <span>Every</span>
              <Select
                isDisabled={selectedValue !== "every-n-day-at-n"}
                value={everyValue}
                onChange={(e) => setEveryValue(e.target.value)}
                variant="bordered"
                className="w-16"
                size="sm"
              >
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </Select>
              <span>day(s) at</span>
              <Select
                aria-label="At"
                isDisabled={selectedValue !== "every-n-day-at-n"}
                value={atValue}
                onChange={(e) => setAtValue(e.target.value)}
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
              <span>hour(s) past the day</span>
            </div>
          </Radio>
        </RadioGroup>
      </CardBody>
    </Card>
  );
};

export { DailyCard };
