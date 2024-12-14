"use client";

import React from "react";
import { Card, CardBody } from "@nextui-org/react";

interface JobsDetailsDescriptionProps {
  data?: string | null;
}

const JobsDetailsDescription = ({ data }: JobsDetailsDescriptionProps) => {
  return (
    <Card className="col-span-3">
      <CardBody>
        <h3 className="text-lg font-semibold">Description</h3>
        <p className="mt-4 text-sm text-gray-200">{data}</p>
      </CardBody>
    </Card>
  );
};

export { JobsDetailsDescription };
