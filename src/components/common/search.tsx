"use client";

import React, { forwardRef } from "react";
import { Input, type InputProps } from "@nextui-org/react";
import { Search as SearchIcon } from "lucide-react";

type SearchProps = Omit<InputProps, "startContent" | "label">;

const Search = forwardRef<HTMLInputElement, SearchProps>((props, ref) => {
  return (
    <Input
      ref={ref}
      label="Search"
      isClearable
      radius="lg"
      variant="bordered"
      classNames={{
        label: "text-black/50",
        input: [
          "bg-white",
          "text-black/90",
          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
        ],
        innerWrapper: "bg-white",
        inputWrapper: [
          "shadow-md",
          "bg-white",
          "backdrop-blur-md",
          "backdrop-saturate-200",
          "hover:bg-white",
          "group-data-[focus=true]:bg-white",
          "!cursor-text",
        ],
      }}
      placeholder="Type to search..."
      startContent={
        <SearchIcon
          className="pointer-events-none mb-0.5 flex-shrink-0 text-black/50 text-slate-400 dark:text-white/90"
          size={16}
        />
      }
      {...props}
    />
  );
});

Search.displayName = "Search";

export { Search };
