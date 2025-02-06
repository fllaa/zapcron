"use client";

import React from "react";
import { Tab, Tabs, type TabsProps } from "@heroui/react";

import {
  CustomCard,
  DailyCard,
  HourlyCard,
  MinutelyCard,
  MonthlyCard,
} from "./card";

interface CronBuilderProps {
  tabsProps?: TabsProps;
}

const CronBuilder = ({ tabsProps }: CronBuilderProps) => {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" {...tabsProps}>
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
