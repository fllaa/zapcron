"use client";

import { Card, CardBody } from "@heroui/react";

interface JobsDetailsDescriptionProps {
  data?: string | null;
}

const JobsDetailsDescription = ({ data }: JobsDetailsDescriptionProps) => {
  return (
    <div className="col-span-8 space-y-2 md:col-span-3">
      <h3 className="font-semibold text-lg">Description</h3>
      <Card>
        <CardBody>
          <p className="text-gray-700 text-sm dark:text-gray-200">{data}</p>
        </CardBody>
      </Card>
    </div>
  );
};

export { JobsDetailsDescription };
