"use client";

import { Card, CardBody } from "@heroui/react";

interface JobsDetailsDescriptionProps {
  data?: string | null;
}

const JobsDetailsDescription = ({ data }: JobsDetailsDescriptionProps) => {
  return (
    <Card className="col-span-8 md:col-span-3">
      <CardBody>
        <h3 className="font-semibold text-lg">Description</h3>
        <p className="mt-4 text-gray-700 text-sm dark:text-gray-200">{data}</p>
      </CardBody>
    </Card>
  );
};

export { JobsDetailsDescription };
