"use client";

import {
  Button,
  type ButtonProps,
  Popover,
  PopoverContent,
  type PopoverProps,
  PopoverTrigger,
} from "@heroui/react";
import React from "react";

interface ActionPopoverProps extends Omit<PopoverProps, "children"> {
  trigger: React.ReactNode;
  onAction: () => void;
  message?: string;
  desc?: string;
  placement?: PopoverProps["placement"];
  color?: ButtonProps["color"];
}

const ActionPopover = ({
  trigger,
  onAction,
  message,
  desc,
  placement,
  color,
}: ActionPopoverProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const _message = message ?? "Are you sure?";
  const _desc = desc ?? "This action cannot be undone.";
  const _onAction = () => {
    onAction();
    setIsOpen(false);
  };
  return (
    <Popover
      placement={placement}
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center gap-2">
          <div className="px-1 py-2">
            <div className="font-bold text-small">{_message}</div>
            <div className="text-tiny">{_desc}</div>
          </div>
          <Button size="sm" onPress={_onAction} color={color ?? "danger"}>
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { ActionPopover };
