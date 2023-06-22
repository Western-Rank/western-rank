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
import { encodeCourseCode } from "@/lib/courses";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function CourseTrophy({ placement }: { placement: 0 | 1 | 2 }) {
  const strokeColor = ["stroke-purple-600", "stroke-purple-500", "stroke-purple-400"];
  return (
    <Trophy
      width={11}
      className={cn("scale-[130%] inline-block mb-1 ml-1", strokeColor[placement])}
    />
  );
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border h-[64vh] w-[70%]">
      <Table className="overflow-y-scroll">
        <TableHeader className="sticky top-0 rounded-md z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="bg-white hover:bg-white text-xs rounded-md border-separate overflow-hidden"
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
                  <TableCell key={cell.id} className="whitespace-nowrap text-left">
                    {cell_id === 0 && (
                      <Button variant="link" className="text-blue-500 m-0 h-1.5 py-0 px-0" asChild>
                        <Link
                          className="whitespace-nowrap "
                          href={`/course/${encodeCourseCode(cell.renderValue<string>())}`}
                        >
                          {cell.renderValue<string>()}
                        </Link>
                      </Button>
                    )}
                    {cell_id === 0 && (0 == row_id || row_id === 1 || row_id === 2) && (
                      <CourseTrophy placement={row_id} />
                    )}
                    {cell_id !== 0 && flexRender(cell.column.columnDef.cell, cell.getContext())}
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
