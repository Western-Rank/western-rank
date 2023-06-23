"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface DataTableProps<TData, TValue, TSortKey> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function CourseTrophy({ placement }: { placement: 0 | 1 | 2 }) {
  const strokeColor = ["stroke-purple-700", "stroke-purple-500", "stroke-purple-300"];
  return (
    <Trophy
      width={11}
      className={cn("scale-[130%] inline-block pb-0.5 ml-1.5 z-0", strokeColor[placement])}
    />
  );
}

export function DataTable<TData, TValue, TSortKey>({
  columns,
  data,
}: DataTableProps<TData, TValue, TSortKey>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border h-full w-[50vw]">
      <Table className="overflow-y-scroll">
        <TableHeader className="sticky top-0 rounded-md z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="bg-white hover:bg-white text-sm rounded-md border-separate overflow-hidden"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="light" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, row_id) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell, cell_id) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
