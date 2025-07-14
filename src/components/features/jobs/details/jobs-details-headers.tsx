/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Input } from "@heroui/react";
import { useMemo } from "react";

interface JobsDetailsHeadersProps {
  data: Record<string, unknown>;
}

const JobsDetailsHeaders = ({ data }: JobsDetailsHeadersProps) => {
  const headers = useMemo(() => Object.entries(data), [data]);
  return (
    <div className="col-span-8 md:col-span-4">
      <h3 className="font-semibold text-lg">Headers</h3>
      <div className="mt-2 space-y-1">
        {headers.map(([key, value]) => (
          <Input
            key={key}
            size="sm"
            defaultValue={value as string}
            label={key}
            variant="faded"
            color="primary"
            readOnly
          />
        ))}
      </div>
    </div>
  );
};

export { JobsDetailsHeaders };
