"use client";

import React, { forwardRef } from "react";
import { Button, Spinner, type ButtonProps } from "@nextui-org/react";
import { cx } from "classix";

interface RoundedIconButtonProps extends Omit<ButtonProps, "variant"> {
  icon?: React.ReactNode;
  variant?: ButtonProps["variant"] | "ghostv2";
}

const RoundedIconButton = forwardRef<HTMLButtonElement, RoundedIconButtonProps>(
  ({ children, isLoading, variant, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant === "ghostv2" ? "ghost" : variant}
        {...props}
        className={cx(
          "rounded-full",
          variant === "ghostv2" && "border-1 border-gray-700 text-white",
        )}
      >
        {props.icon && (
          <span
            className={cx(
              "absolute left-0 m-1 aspect-square h-[85%] place-content-center place-items-center items-center rounded-full invert",
              variant === "ghostv2" ? "bg-transparent" : "bg-white",
            )}
          >
            {isLoading ? (
              <Spinner color={props.color} size="sm" className="flex" />
            ) : (
              props.icon
            )}
          </span>
        )}
        {children}
      </Button>
    );
  },
);

RoundedIconButton.displayName = "RoundedIconButton";

export { RoundedIconButton };
