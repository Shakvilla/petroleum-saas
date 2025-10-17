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
import { TenantAwareButton } from '@/components/ui/tenant-aware-button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  Filter,
  Download,
  Plus,
} from 'lucide-react';
import { format } from 'date-fns';

// User interface based on the API response
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';
  lastLoginAt: string;
  createdAt: string;
  permissions: Array<{
    resource: string;
    action: string;
  }>;
  tenantId: string;
}

interface UsersTableProps {
  data: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onView?: (user: User) => void;
  onCreate?: () => void;
}

const roleColors = {
  ADMIN: 'bg-red-100 text-red-800',
  MANAGER: 'bg-blue-100 text-blue-800',
  OPERATOR: 'bg-green-100 text-green-800',
  VIEWER: 'bg-gray-100 text-gray-800',
};

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  SUSPENDED: 'bg-red-100 text-red-800',
};

export const UsersTable: React.FC<UsersTableProps> = ({
  data,
  onEdit,
  onDelete,
  onView,
  onCreate,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { isMobile, isTablet } = useResponsive();

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <TenantAwareButton
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className={cn(
                'h-8',
                isMobile ? 'px-1' : isTablet ? 'px-2' : 'px-2 lg:px-3'
              )}
            >
              User
              <ChevronDown className={cn(
                'ml-2',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            </TenantAwareButton>
          );
        },
        cell: ({ row }) => {
          const user = row.original;
          const initials = user.name
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
                <AvatarImage src="" alt={user.name} />
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
                  {user.name}
                </div>
                <div className={cn(
                  'text-muted-foreground flex items-center truncate',
                  isMobile ? 'text-xs' : 'text-sm'
                )}>
                  <Mail className={cn(
                    'mr-1',
                    isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'
                  )} />
                  <span className="truncate">{user.email}</span>
                </div>
                {/* Mobile: Show role and status inline */}
                {isMobile && (
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={cn(
                      'text-xs',
                      roleColors[user.role as keyof typeof roleColors]
                    )}>
                      {user.role}
                    </Badge>
                    <Badge className={cn(
                      'text-xs',
                      statusColors[user.status as keyof typeof statusColors]
                    )}>
                      {user.status}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'role',
        header: ({ column }) => {
          return (
            <TenantAwareButton
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className={cn(
                'h-8',
                isMobile ? 'px-1' : isTablet ? 'px-2' : 'px-2 lg:px-3'
              )}
            >
              Role
              <ChevronDown className={cn(
                'ml-2',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            </TenantAwareButton>
          );
        },
        cell: ({ row }) => {
          const role = row.getValue('role') as string;
          return (
            <Badge className={cn(
              roleColors[role as keyof typeof roleColors],
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              {role}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        // Hide on mobile since we show it inline in the name column
        meta: {
          className: isMobile ? 'hidden' : '',
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => {
          return (
            <TenantAwareButton
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
              <ChevronDown className={cn(
                'ml-2',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            </TenantAwareButton>
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
        // Hide on mobile since we show it inline in the name column
        meta: {
          className: isMobile ? 'hidden' : '',
        },
      },
      {
        accessorKey: 'lastLoginAt',
        header: ({ column }) => {
          return (
            <TenantAwareButton
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className={cn(
                'h-8',
                isMobile ? 'px-1' : isTablet ? 'px-2' : 'px-2 lg:px-3'
              )}
            >
              Last Login
              <ChevronDown className={cn(
                'ml-2',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            </TenantAwareButton>
          );
        },
        cell: ({ row }) => {
          const date = new Date(row.getValue('lastLoginAt'));
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
        },
      },
      {
        accessorKey: 'permissions',
        header: 'Permissions',
        cell: ({ row }) => {
          const permissions = row.getValue('permissions') as Array<{
            resource: string;
            action: string;
          }>;
          return (
            <div className={cn(
              'text-muted-foreground',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              {permissions.length} permission
              {permissions.length !== 1 ? 's' : ''}
            </div>
          );
        },
        enableSorting: false,
        // Hide on mobile to save space
        meta: {
          className: isMobile ? 'hidden' : '',
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TenantAwareButton variant="ghost" className={cn(
                  'p-0',
                  isMobile ? 'h-6 w-6' : 'h-8 w-8'
                )}>
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className={cn(
                    isMobile ? 'h-3 w-3' : 'h-4 w-4'
                  )} />
                </TenantAwareButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={cn(
                isMobile ? 'w-48' : 'w-56'
              )}>
                {onView && (
                  <DropdownMenuCheckboxItem onClick={() => onView(user)}>
                    <Eye className={cn(
                      'mr-2',
                      isMobile ? 'h-3 w-3' : 'h-4 w-4'
                    )} />
                    View Details
                  </DropdownMenuCheckboxItem>
                )}
                {onEdit && (
                  <DropdownMenuCheckboxItem onClick={() => onEdit(user)}>
                    <Edit className={cn(
                      'mr-2',
                      isMobile ? 'h-3 w-3' : 'h-4 w-4'
                    )} />
                    Edit User
                  </DropdownMenuCheckboxItem>
                )}
                {onDelete && (
                  <DropdownMenuCheckboxItem
                    onClick={() => onDelete(user)}
                    className="text-red-600"
                  >
                    <Trash2 className={cn(
                      'mr-2',
                      isMobile ? 'h-3 w-3' : 'h-4 w-4'
                    )} />
                    Delete User
                  </DropdownMenuCheckboxItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onEdit, onDelete, onView, isMobile, isTablet]
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
            placeholder="Filter users..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={event =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className={cn(
              isMobile ? 'flex-1' : 'max-w-sm'
            )}
          />
          <Select
            value={(table.getColumn('role')?.getFilterValue() as string) ?? ''}
            onValueChange={value =>
              table
                .getColumn('role')
                ?.setFilterValue(value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className={cn(
              isMobile ? 'w-32' : 'w-[180px]'
            )}>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="OPERATOR">Operator</SelectItem>
              <SelectItem value="VIEWER">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn('status')?.getFilterValue() as string) ?? ''
            }
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
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className={cn(
          'flex items-center',
          isMobile ? 'w-full justify-between' : 'space-x-2'
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TenantAwareButton variant="outline" className={cn(
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
              </TenantAwareButton>
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
          <TenantAwareButton variant="outline" size={isMobile ? 'sm' : 'sm'}>
            <Download className={cn(
              'mr-2',
              isMobile ? 'h-3 w-3' : 'h-4 w-4'
            )} />
            {isMobile ? 'Export' : 'Export'}
          </TenantAwareButton>
          {onCreate && (
            <TenantAwareButton onClick={onCreate} size={isMobile ? 'sm' : 'default'}>
              <Plus className={cn(
                'mr-2',
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
              {isMobile ? 'Add' : 'Add User'}
            </TenantAwareButton>
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
                          header.column.columnDef.meta?.className || ''
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
                          cell.column.columnDef.meta?.className || '',
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
                    No users found.
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
            <TenantAwareButton
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
            </TenantAwareButton>
            <TenantAwareButton
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
            </TenantAwareButton>
            <TenantAwareButton
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
            </TenantAwareButton>
            <TenantAwareButton
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
            </TenantAwareButton>
          </div>
        </div>
      </div>
    </div>
  );
};
