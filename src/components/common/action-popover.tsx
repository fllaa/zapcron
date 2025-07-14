"use client";

import {
  Button,
  Popover,
  PopoverContent,
  type PopoverProps,
  PopoverTrigger,
} from "@heroui/react";
import type React from "react";

interface ActionPopoverProps extends Omit<PopoverProps, "children"> {
  trigger: React.ReactNode;
  onAction: () => void;
  message?: string;
  desc?: string;
}

const ActionPopover = ({
  trigger,
  onAction,
  message,
  desc,
}: ActionPopoverProps) => {
  const _message = message ?? "Are you sure?";
  const _desc = desc ?? "This action cannot be undone.";
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center gap-2">
          <div className="px-1 py-2">
            <div className="font-bold text-small">{_message}</div>
            <div className="text-tiny">{_desc}</div>
          </div>
          <Button size="sm" onPress={onAction}>
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { ActionPopover };
