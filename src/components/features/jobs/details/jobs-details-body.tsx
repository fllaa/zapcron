/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface JobsDetailsBodyProps {
  data: Record<string, unknown>;
}

const JobsDetailsBody = ({ data }: JobsDetailsBodyProps) => {
  return (
    <Card className="col-span-8 md:col-span-4">
      <CardBody>
        <h3 className="text-lg font-semibold">Body</h3>
        <SyntaxHighlighter language="json" style={dracula}>
          {JSON.stringify(data ?? {}, null, 2)}
        </SyntaxHighlighter>
      </CardBody>
    </Card>
  );
};

export { JobsDetailsBody };
