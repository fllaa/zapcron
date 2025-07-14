/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Card, CardBody } from "@heroui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface JobsDetailsHeadersProps {
  data: Record<string, unknown>;
}

const JobsDetailsHeaders = ({ data }: JobsDetailsHeadersProps) => {
  return (
    <Card className="col-span-8 md:col-span-4">
      <CardBody>
        <h3 className="font-semibold text-lg">Headers</h3>
        <SyntaxHighlighter language="json" style={dracula}>
          {JSON.stringify(data ?? {}, null, 2)}
        </SyntaxHighlighter>
      </CardBody>
    </Card>
  );
};

export { JobsDetailsHeaders };
