"use client";

import { Input, type InputProps } from "@heroui/react";
import { Search as SearchIcon } from "lucide-react";
import { forwardRef } from "react";

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
          "bg-white dark:text-white/90",
          "text-black/90 dark:text-white/90",
          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
        ],
        innerWrapper: "bg-transparent",
        inputWrapper: [
          "shadow-xl",
          "bg-default-200/50",
          "dark:bg-default/60",
          "backdrop-blur-xl",
          "backdrop-saturate-200",
          "hover:bg-default-200/70",
          "dark:hover:bg-default/70",
          "group-data-[focus=true]:bg-default-200/50",
          "dark:group-data-[focus=true]:bg-default/60",
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
