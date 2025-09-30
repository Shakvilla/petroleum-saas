import React, { forwardRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface AccessibleTableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {
  caption?: string;
  captionPosition?: 'top' | 'bottom';
  children: React.ReactNode;
}

export const AccessibleTable = forwardRef<
  HTMLTableElement,
  AccessibleTableProps
>(
  (
    { className, caption, captionPosition = 'top', children, ...props },
    ref
  ) => {
    return (
      <div className="overflow-x-auto">
        <Table
          ref={ref}
          className={cn('w-full', className)}
          role="table"
          {...props}
        >
          {caption && captionPosition === 'top' && (
            <caption className="text-left font-medium text-gray-900 mb-2">
              {caption}
            </caption>
          )}

          {children}

          {caption && captionPosition === 'bottom' && (
            <caption className="text-left font-medium text-gray-900 mt-2">
              {caption}
            </caption>
          )}
        </Table>
      </div>
    );
  }
);

AccessibleTable.displayName = 'AccessibleTable';

interface AccessibleTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function AccessibleTableHeader({
  children,
  className,
}: AccessibleTableHeaderProps) {
  return (
    <TableHeader className={cn('bg-gray-50', className)}>
      {children}
    </TableHeader>
  );
}

interface AccessibleTableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | 'none';
  onSort?: () => void;
}

export function AccessibleTableHead({
  children,
  className,
  sortable = false,
  sortDirection = 'none',
  onSort,
  ...props
}: AccessibleTableHeadProps) {
  const handleClick = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (sortable && onSort && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onSort();
    }
  };

  return (
    <TableHead
      className={cn(
        'text-left font-medium text-gray-900',
        sortable && 'cursor-pointer hover:bg-gray-100 focus:bg-gray-100',
        className
      )}
      tabIndex={sortable ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-sort={sortable ? sortDirection : undefined}
      role={sortable ? 'columnheader' : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <span className="text-gray-400" aria-hidden="true">
            {sortDirection === 'asc'
              ? '↑'
              : sortDirection === 'desc'
                ? '↓'
                : '↕'}
          </span>
        )}
      </div>
    </TableHead>
  );
}

interface AccessibleTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function AccessibleTableBody({
  children,
  className,
}: AccessibleTableBodyProps) {
  return <TableBody className={className}>{children}</TableBody>;
}

interface AccessibleTableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  selected?: boolean;
  hoverable?: boolean;
}

export function AccessibleTableRow({
  children,
  className,
  selected = false,
  hoverable = true,
  ...props
}: AccessibleTableRowProps) {
  return (
    <TableRow
      className={cn(
        'border-b border-gray-200',
        hoverable && 'hover:bg-gray-50',
        selected && 'bg-blue-50',
        className
      )}
      aria-selected={selected}
      {...props}
    >
      {children}
    </TableRow>
  );
}

interface AccessibleTableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  numeric?: boolean;
}

export function AccessibleTableCell({
  children,
  className,
  numeric = false,
  ...props
}: AccessibleTableCellProps) {
  return (
    <TableCell
      className={cn(
        'text-sm text-gray-900',
        numeric && 'text-right font-mono',
        className
      )}
      {...props}
    >
      {children}
    </TableCell>
  );
}
