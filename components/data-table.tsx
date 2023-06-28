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
import { useEffect } from "react";

import { useInView } from "react-intersection-observer";

interface DataTableProps<TData, TValue, TSortKey> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onLastRowReached?: () => void;
}

export function DataTable<TData, TValue, TSortKey>({
  columns,
  data,
  onLastRowReached,
}: DataTableProps<TData, TValue, TSortKey>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const { ref: lastItemRef, inView } = useInView();

  useEffect(() => {
    if (inView) {
      onLastRowReached?.();
    }
  }, [inView, onLastRowReached]);

  return (
    <div className="rounded-md border flex-1 h-full w-full md:w-[50vw]">
      <Table className="">
        <TableHeader className="sticky top-0 rounded-md z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="bg-white hover:bg-white text-sm rounded-md border-separate overflow-scroll"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="light" key={header.id} style={{ width: header.getSize() }}>
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
          {rows ? (
            rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
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
          <TableRow ref={lastItemRef}>
            <TableCell style={{ height: `2px` }} />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
