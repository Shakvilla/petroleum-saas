'use client';

import React, { useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';
import { useResponsive } from '@/components/responsive-provider';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  MoreHorizontal,
  Eye,
  Download,
  Filter,
  ArrowUpDown,
  DollarSign,
  Calendar,
  Package,
  User,
} from 'lucide-react';
import { format } from 'date-fns';

// Transaction interface based on the API response
interface Transaction {
  id: string;
  customer: {
    id: string;
    name: string;
    type: string;
  };
  fuelType: string;
  volume: number;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'IN_PROGRESS' | 'CANCELLED';
  timestamp: string;
  deliveryMethod?: string;
  paymentMethod?: string;
}

interface TransactionsDataTableProps {
  data: Transaction[];
  onView?: (transaction: Transaction) => void;
  onExport?: () => void;
}

const statusColors = {
  COMPLETED: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const fuelTypeColors = {
  'Premium Gasoline': 'bg-purple-100 text-purple-800',
  'Regular Gasoline': 'bg-blue-100 text-blue-800',
  'Diesel': 'bg-gray-100 text-gray-800',
  'Kerosene': 'bg-orange-100 text-orange-800',
  'Jet Fuel': 'bg-indigo-100 text-indigo-800',
};

export const TransactionsDataTable: React.FC<TransactionsDataTableProps> = ({
  data,
  onView,
  onExport,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { isMobile, isTablet } = useResponsive();

  const columns: ColumnDef<Transaction>[] = useMemo(
    () => [
      {
        accessorKey: 'customer',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className={cn(
                'h-8',
                isMobile ? 'px-1' : isTablet ? 'px-2' : 'px-2 lg:px-3'
              )}
            >
              Customer
              <ArrowUpDown className={cn(
                'ml-2',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            </Button>
          );
        },
        cell: ({ row }) => {
          const customer = row.getValue('customer') as Transaction['customer'];
          const initials = customer.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();

          return (
            <div className={cn(
              'flex items-center',
              isMobile ? 'space-x-2' : 'space-x-3'
            )}>
              <Avatar className={cn(
                isMobile ? 'h-6 w-6' : isTablet ? 'h-7 w-7' : 'h-8 w-8'
              )}>
                <AvatarFallback className={cn(
                  isMobile ? 'text-xs' : 'text-xs'
                )}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className={cn(
                  'font-medium truncate',
                  isMobile ? 'text-sm' : 'text-base'
                )}>
                  {customer.name}
                </div>
                <div className={cn(
                  'text-muted-foreground flex items-center truncate',
                  isMobile ? 'text-xs' : 'text-sm'
                )}>
                  <User className={cn(
                    'mr-1',
                    isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'
                  )} />
                  <span className="truncate">{customer.type}</span>
                </div>
                {/* Mobile: Show fuel type and status inline */}
                {isMobile && (
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={cn(
                      'text-xs',
                      fuelTypeColors[row.original.fuelType as keyof typeof fuelTypeColors] || 'bg-gray-100 text-gray-800'
                    )}>
                      {row.original.fuelType}
                    </Badge>
                    <Badge className={cn(
                      'text-xs',
                      statusColors[row.original.status]
                    )}>
                      {row.original.status}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          const customer = row.getValue(id) as Transaction['customer'];
          return customer.name.toLowerCase().includes(value.toLowerCase());
        },
      },
      {
        accessorKey: 'fuelType',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className={cn(
                'h-8',
                isMobile ? 'px-1' : isTablet ? 'px-2' : 'px-2 lg:px-3'
              )}
            >
              Fuel Type
              <ArrowUpDown className={cn(
                'ml-2',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            </Button>
          );
        },
        cell: ({ row }) => {
          const fuelType = row.getValue('fuelType') as string;
          return (
            <Badge className={cn(
              fuelTypeColors[fuelType as keyof typeof fuelTypeColors] || 'bg-gray-100 text-gray-800',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              {fuelType}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        // Hide on mobile since we show it inline in the customer column
        meta: {
          className: isMobile ? 'hidden' : '',
        } as any,
      },
      {
        accessorKey: 'volume',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className={cn(
                'h-8',
                isMobile ? 'px-1' : isTablet ? 'px-2' : 'px-2 lg:px-3'
              )}
            >
              Volume
              <ArrowUpDown className={cn(
                'ml-2',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            </Button>
          );
        },
        cell: ({ row }) => {
          const volume = row.getValue('volume') as number;
          return (
            <div className={cn(
              'flex items-center text-muted-foreground',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              <Package className={cn(
                'mr-1',
                isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'
              )} />
              {volume.toLocaleString()}L
            </div>
          );
        },
        // Hide on mobile to save space
        meta: {
          className: isMobile ? 'hidden' : '',
        } as any,
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className={cn(
                'h-8',
                isMobile ? 'px-1' : isTablet ? 'px-2' : 'px-2 lg:px-3'
              )}
            >
              Amount
              <ArrowUpDown className={cn(
                'ml-2',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            </Button>
          );
        },
        cell: ({ row }) => {
          const amount = row.getValue('amount') as number;
          return (
            <div className={cn(
              'flex items-center font-semibold',
              isMobile ? 'text-sm' : 'text-base'
            )}>
              <DollarSign className={cn(
                'mr-1',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
              ${amount.toLocaleString()}
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className={cn(
                'h-8',
                isMobile ? 'px-1' : isTablet ? 'px-2' : 'px-2 lg:px-3'
              )}
            >
              Status
              <ArrowUpDown className={cn(
                'ml-2',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            </Button>
          );
        },
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          return (
            <Badge className={cn(
              statusColors[status as keyof typeof statusColors],
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              {status}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        // Hide on mobile since we show it inline in the customer column
        meta: {
          className: isMobile ? 'hidden' : '',
        } as any,
      },
      {
        accessorKey: 'timestamp',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className={cn(
                'h-8',
                isMobile ? 'px-1' : isTablet ? 'px-2' : 'px-2 lg:px-3'
              )}
            >
              Date
              <ArrowUpDown className={cn(
                'ml-2',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = new Date(row.getValue('timestamp'));
          return (
            <div className={cn(
              'flex items-center text-muted-foreground',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              <Calendar className={cn(
                'mr-1',
                isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'
              )} />
              {isMobile ? format(date, 'MMM dd') : format(date, 'MMM dd, yyyy')}
            </div>
          );
        },
        // Hide on mobile to save space
        meta: {
          className: isMobile ? 'hidden' : '',
        } as any,
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const transaction = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(
                  'p-0',
                  isMobile ? 'h-6 w-6' : 'h-8 w-8'
                )}>
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className={cn(
                    isMobile ? 'h-3 w-3' : 'h-4 w-4'
                  )} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={cn(
                isMobile ? 'w-48' : 'w-56'
              )}>
                {onView && (
                  <DropdownMenuCheckboxItem onClick={() => onView(transaction)}>
                    <Eye className={cn(
                      'mr-2',
                      isMobile ? 'h-3 w-3' : 'h-4 w-4'
                    )} />
                    View Details
                  </DropdownMenuCheckboxItem>
                )}
                <DropdownMenuCheckboxItem
                  onClick={() => navigator.clipboard.writeText(transaction.id)}
                >
                  <Download className={cn(
                    'mr-2',
                    isMobile ? 'h-3 w-3' : 'h-4 w-4'
                  )} />
                  Copy Transaction ID
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [isMobile, isTablet, onView]
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Responsive Header with filters and actions */}
      <div className={cn(
        'flex items-center justify-between',
        isMobile ? 'flex-col space-y-3' : 'flex-row'
      )}>
        <div className={cn(
          'flex items-center',
          isMobile ? 'w-full space-x-2' : isTablet ? 'space-x-2' : 'space-x-2'
        )}>
          <Input
            placeholder="Search transactions..."
            value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
            onChange={event =>
              table.getColumn('customer')?.setFilterValue(event.target.value)
            }
            className={cn(
              isMobile ? 'flex-1' : 'max-w-sm'
            )}
          />
          <Select
            value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
            onValueChange={value =>
              table
                .getColumn('status')
                ?.setFilterValue(value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className={cn(
              isMobile ? 'w-32' : 'w-[180px]'
            )}>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={(table.getColumn('fuelType')?.getFilterValue() as string) ?? ''}
            onValueChange={value =>
              table
                .getColumn('fuelType')
                ?.setFilterValue(value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className={cn(
              isMobile ? 'w-32' : 'w-[180px]'
            )}>
              <SelectValue placeholder="Filter by fuel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fuel Types</SelectItem>
              <SelectItem value="Premium Gasoline">Premium Gasoline</SelectItem>
              <SelectItem value="Regular Gasoline">Regular Gasoline</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Kerosene">Kerosene</SelectItem>
              <SelectItem value="Jet Fuel">Jet Fuel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className={cn(
          'flex items-center',
          isMobile ? 'w-full justify-between' : 'space-x-2'
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={cn(
                isMobile ? 'text-xs' : 'text-sm'
              )}>
                <Filter className={cn(
                  'mr-2',
                  isMobile ? 'h-3 w-3' : 'h-4 w-4'
                )} />
                View
                <ChevronDown className={cn(
                  'ml-2',
                  isMobile ? 'h-3 w-3' : 'h-4 w-4'
                )} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {onExport && (
            <Button variant="outline" size={isMobile ? 'sm' : 'sm'} onClick={onExport}>
              <Download className={cn(
                'mr-2',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
              {isMobile ? 'Export' : 'Export'}
            </Button>
          )}
        </div>
      </div>

      {/* Responsive Table */}
      <div className="rounded-md border overflow-hidden">
        <div className={cn(
          'overflow-x-auto',
          isMobile ? 'max-w-full' : ''
        )}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead 
                        key={header.id}
                        className={cn(
                          (header.column.columnDef.meta as any)?.className || ''
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      isMobile ? 'hover:bg-gray-50' : ''
                    )}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell 
                        key={cell.id}
                        className={cn(
                          (cell.column.columnDef.meta as any)?.className || '',
                          isMobile ? 'py-3' : 'py-4'
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className={cn(
                      'text-center',
                      isMobile ? 'h-20' : 'h-24'
                    )}
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Responsive Pagination */}
      <div className={cn(
        'flex items-center justify-between py-4',
        isMobile ? 'flex-col space-y-3' : 'space-x-2'
      )}>
        <div className={cn(
          'text-muted-foreground',
          isMobile ? 'text-xs' : 'text-sm'
        )}>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className={cn(
          'flex items-center',
          isMobile ? 'space-x-4' : 'space-x-6 lg:space-x-8'
        )}>
          <div className={cn(
            'flex items-center',
            isMobile ? 'space-x-1' : 'space-x-2'
          )}>
            <p className={cn(
              'font-medium',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              Rows per page
            </p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={value => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className={cn(
                isMobile ? 'h-6 w-[60px]' : 'h-8 w-[70px]'
              )}>
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className={cn(
            'flex items-center justify-center font-medium',
            isMobile ? 'text-xs w-[80px]' : 'text-sm w-[100px]'
          )}>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className={cn(
            'flex items-center',
            isMobile ? 'space-x-1' : 'space-x-2'
          )}>
            <Button
              variant="outline"
              className={cn(
                'p-0',
                isMobile ? 'hidden h-6 w-6' : 'hidden h-8 w-8 lg:flex'
              )}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              {'<<'}
            </Button>
            <Button
              variant="outline"
              className={cn(
                'p-0',
                isMobile ? 'h-6 w-6' : 'h-8 w-8'
              )}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              {'<'}
            </Button>
            <Button
              variant="outline"
              className={cn(
                'p-0',
                isMobile ? 'h-6 w-6' : 'h-8 w-8'
              )}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              {'>'}
            </Button>
            <Button
              variant="outline"
              className={cn(
                'p-0',
                isMobile ? 'hidden h-6 w-6' : 'hidden h-8 w-8 lg:flex'
              )}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              {'>>'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
