"use client";

import React from "react";
import {
  Table as NTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  type TableProps as NTableProps,
} from "@heroui/react";

interface TableProps extends NTableProps {
  rows: ({ key: string } & Record<string, unknown>)[];
  columns: Record<"key" | "label", string>[];
  ariaLabel?: string;
  renderCell?: (
    item: Record<string, unknown>,
    columnKey: React.Key | string,
  ) => React.ReactNode;
}

const Table = ({
  rows,
  columns,
  ariaLabel,
  renderCell,
  ...props
}: TableProps) => {
  return (
    <NTable {...props} aria-label={ariaLabel ?? "Table"}>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key?.toString()}>
            {(columnKey) => (
              <TableCell>
                {renderCell
                  ? renderCell(item, columnKey)
                  : getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </NTable>
  );
};

export { Table };
