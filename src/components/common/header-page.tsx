"use client";

import React from "react";
import { CalendarSync, Settings, Workflow } from "lucide-react";

interface HeaderPage {
  title: string;
  icon?: "calendar-sync" | "settings" | "workflow";
  description?: string;
}

const icons = {
  "calendar-sync": CalendarSync,
  settings: Settings,
  workflow: Workflow,
};

const HeaderPage = ({ title, icon, description }: HeaderPage) => {
  const Icon = icon ? icons[icon] : undefined;
  return (
    <div className="mb-6 flex flex-col gap-0 md:gap-4">
      <div className="flex items-center gap-2 md:gap-5">
        {Icon && <Icon size={24} />}
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
      </div>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
};

export { HeaderPage };
