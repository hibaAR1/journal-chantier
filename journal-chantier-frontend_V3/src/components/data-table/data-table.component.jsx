import {useState} from "react";

import {Table, TableBody, TableCell, TableHeader, TableRow, TableHead} from "../ui/table.jsx";

import {
    flexRender,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {Button} from "../ui/button.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select.jsx";
import {FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight} from "react-icons/fi";
import TableVisibleComponent from "../table/table-visible/table-visible.component.jsx";

const DataTableComponent = ({columns, data, list, addBtn = '', refreshBtn = '', linkBtn= '', hiddenColumns = {}, rowClassFn }) => {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState(hiddenColumns);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        }
    });

    return (
        <form className="p-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-row-reverse justify-between mb-2">
                <TableVisibleComponent table={table} list={list}/>

                <div className="flex justify-start gap-2">
                    {addBtn}
                    {linkBtn}
                    {refreshBtn}
                </div>
            </div>
            <div className="rounded-xl border-none w-[100%]">
                <Table className="">
                    <TableHeader>
                        {/*{isFiltered ? filterRow(table) : ''}*/}
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b-[3px] border-b-white">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            className=""
                                            key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                        <TableRow>
                            {table.getHeaderGroups()[0].headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.column.getCanFilter() ? flexRender(header.column.columnDef.Filter, header.getContext()) : null}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className={`${rowClassFn ? rowClassFn(row.original) : ''}`}
                                    key={row.id}
                                >
                                    {row.original.is_separator ? (
                                        <TableCell colSpan={columns.length} className="py-2">
                                            <div className="flex items-center gap-4 w-full">
    <span className="px-3 py-1 text-sm font-semibold text-black rounded-full shadow">
        Tâches réintégrées
    </span>
                                                <div className="flex-1 h-px bg-gray-300"></div>
                                            </div>

                                        </TableCell>
                                    ) : (
                                        row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))
                                    )}

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Aucune données.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </div>

            <div className="flex items-center justify-between text-sm font-light my-2 text-black">

                <div className="flex flex-col md:flex-row items-center gap-2">
                    <p className="">Lignes</p>
                    <Select
                        className=""
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize}/>
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-2">

                    <div className="flex items-center justify-end">
                        Page {table.getState().pagination.pageIndex + 1}/{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="primaryOutline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <FiChevronsLeft className="h-4 w-4"/>
                        </Button>
                        <Button
                            variant="primaryOutline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <FiChevronLeft className="h-4 w-4"/>
                        </Button>
                        <Button
                            variant="primaryOutline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <FiChevronRight className="h-4 w-4"/>
                        </Button>
                        <Button
                            variant="primaryOutline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <FiChevronsRight className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
};

export default DataTableComponent;
