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
import { useRef } from "react";

import { useVirtual } from "@tanstack/react-virtual";

interface DataTableProps<TData, TValue, TSortKey> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onBottomReached: (containerRefElement?: HTMLDivElement | null) => void;
}

export function DataTable<TData, TValue, TSortKey>({
  columns,
  data,
  onBottomReached,
}: DataTableProps<TData, TValue, TSortKey>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();

  //Virtualizing is optional, but might be necessary if we are going to potentially have hundreds or thousands of rows
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  return (
    <div
      className="rounded-md border flex-1 h-full w-full md:w-[50vw] overflow-y-scroll"
      ref={tableContainerRef}
      onScroll={() => onBottomReached(tableContainerRef.current)}
    >
      <Table className="">
        <TableHeader className="sticky top-0 rounded-md z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="bg-white hover:bg-white text-sm rounded-md border-separate overflow-hidden"
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
          {paddingTop > 0 && (
            <TableRow>
              <TableCell style={{ height: `${paddingTop}px` }} />
            </TableRow>
          )}
          {virtualRows ? (
            virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
          {paddingBottom > 0 && (
            <TableRow>
              <TableCell style={{ height: `${paddingBottom}px` }} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
