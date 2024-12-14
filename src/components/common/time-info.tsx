"use client";

import React from "react";
import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import { Info } from "lucide-react";
import { format } from "@formkit/tempo";

import { useCurrentDate } from "@bolabali/hooks";

interface TimeInfoProps {
  serverDate: string;
}

export const TimeInfo = ({ serverDate }: TimeInfoProps) => {
  const clientDate = useCurrentDate();
  return (
    <div className="absolute -right-[215px] top-12 flex items-center gap-4 transition-all duration-500 ease-in-out hover:-right-[12px]">
      <Button isIconOnly size="sm" variant="faded">
        <Info size={12} />
      </Button>
      <Card>
        <CardBody className="grid grid-cols-2 gap-2">
          <span className="text-sm">Server Time:</span>
          <Chip size="sm" className="text-xs">
            {format(new Date(serverDate), "HH:mm:ss")}
          </Chip>
          <span className="text-sm">Client Time:</span>
          <Chip size="sm" className="text-xs">
            {format(clientDate, "HH:mm:ss")}
          </Chip>
        </CardBody>
      </Card>
    </div>
  );
};
