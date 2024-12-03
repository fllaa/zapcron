"use client";

import React, { forwardRef } from "react";
import { Button, Spinner, type ButtonProps } from "@nextui-org/react";
import { cx } from "classix";

interface IconButtonProps extends Omit<ButtonProps, "variant"> {
  icon?: React.ReactNode;
  variant?: ButtonProps["variant"] | "ghostv2";
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, className, isLoading, variant, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant === "ghostv2" ? "ghost" : variant}
        {...props}
        className={cx(className, variant === "ghostv2" && "border-none")}
      >
        {props.icon && (
          <span
            className={cx(
              "absolute left-0 m-1.5 aspect-square h-4/5 place-content-center place-items-center items-center rounded-full",
              variant === "ghostv2" ? "bg-transparent" : "bg-white invert",
            )}
          >
            {isLoading ? (
              <Spinner color={props.color} size="sm" className="flex" />
            ) : (
              <span className="flex items-center justify-center">
                {props.icon}
              </span>
            )}
          </span>
        )}
        {children}
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";

export { IconButton };
