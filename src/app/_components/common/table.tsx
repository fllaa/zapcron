import {
  Table as NTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  type TableProps as NTableProps,
} from "@nextui-org/react";

interface TableProps extends NTableProps {
  rows: Record<string, string | number | boolean>[];
  columns: Record<"key" | "label", string>[];
  ariaLabel?: string;
}

const Table = ({ rows, columns, ariaLabel, ...props }: TableProps) => {
  return (
    <NTable {...props} aria-label={ariaLabel ?? "Table"}>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key?.toString()}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </NTable>
  );
};

export { Table };
