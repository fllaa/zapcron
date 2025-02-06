"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Select, SelectItem } from "@heroui/react";
import { useFormContext } from "react-hook-form";
import CronTime from "cron-time-generator";

const MonthlyCard = () => {
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString());
  const hours = Array.from({ length: 24 }, (_, i) => i.toString());
  const days = Array.from({ length: 31 }, (_, i) => i.toString());

  const { setValue } = useFormContext();

  const [selectedDay, setSelectedDay] = useState("1");
  const [selectedHour, setSelectedHour] = useState("0");
  const [selectedMinute, setSelectedMinute] = useState("0");

  const cronExpression = useMemo(() => {
    return CronTime.everyMonthOn(
      parseInt(selectedDay),
      parseInt(selectedHour),
      parseInt(selectedMinute),
    );
  }, [selectedDay, selectedHour, selectedMinute]);

  useEffect(() => {
    setValue("cronspec", cronExpression);
  }, [cronExpression, setValue]);
  return (
    <Card>
      <CardBody className="h-[12.5rem]">
        <div className="grid grid-cols-2 gap-2">
          <span>Every month at day</span>
          <Select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
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
          <span>at hour</span>
          <Select
            value={selectedHour}
            onChange={(e) => setSelectedHour(e.target.value)}
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
          <span>and minute</span>
          <Select
            value={selectedMinute}
            onChange={(e) => setSelectedMinute(e.target.value)}
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
        </div>
      </CardBody>
    </Card>
  );
};

export { MonthlyCard };
