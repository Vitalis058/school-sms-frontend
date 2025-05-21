import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  dataName: string;
  link?: string;
}

function DataTable<TData, TValue>({
  columns,
  data,
  dataName,
  link,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
    state: {
      pagination,
      globalFilter,
    },
  });

  return (
    <div className="container py-5">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-xl ring-1 ring-gray-200/50">
        {/* Global Filter */}
        <div className="flex justify-between p-4">
          <Input
            placeholder={`Search ${dataName}...`}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="focus:border-primary focus:ring-primary max-w-sm"
          />
          {link && (
            <Button>
              <Link href={link} className="flex items-center gap-2">
                {`New ${dataName}`}
                <Plus />
              </Link>
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="border-none">
            <TableHeader className="bg-primary/10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-white/20"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-primary px-6 py-4 text-sm font-semibold"
                    >
                      <div
                        className={
                          header.column.getCanSort()
                            ? "flex cursor-pointer items-center gap-1 select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <ArrowUp size={16} />,
                          desc: <ArrowDown size={16} />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`border-b transition-colors ${
                      index % 2 === 0 ? "bg-accent/40" : "bg-muted/20"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    No {dataName} found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="bg-primary/10 flex items-center justify-between border-t border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-gray-300 hover:bg-cyan-100"
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-gray-300 hover:bg-cyan-100"
            >
              {"<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-gray-300 hover:bg-cyan-100"
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              className="border-gray-30 hover:bg-cyan-100"
            >
              {">>"}
            </Button>
            <span className="text-muted-foreground flex items-center gap-1 text-sm">
              Page{" "}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-semibold">
              Show:
            </span>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-primary/30 border-t border-gray-100 p-4 text-center text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of {data.length} {dataName}
        </div>
      </div>
    </div>
  );
}

export default DataTable;
