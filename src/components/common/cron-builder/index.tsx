"use client";

import React from "react";
import { Tab, Tabs } from "@nextui-org/react";

import {
  CustomCard,
  DailyCard,
  HourlyCard,
  MinutelyCard,
  MonthlyCard,
} from "./card";

const CronBuilder = () => {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        <Tab key="minutely" title="Minutely">
          <MinutelyCard />
        </Tab>
        <Tab key="hourly" title="Hourly">
          <HourlyCard />
        </Tab>
        <Tab key="daily" title="Daily">
          <DailyCard />
        </Tab>
        <Tab key="monthly" title="Monthly">
          <MonthlyCard />
        </Tab>
        <Tab key="custom" title="Custom">
          <CustomCard />
        </Tab>
      </Tabs>
    </div>
  );
};

export { CronBuilder };
