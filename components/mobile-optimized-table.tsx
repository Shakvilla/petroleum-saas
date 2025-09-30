'use client';

import React, { useState, useMemo } from 'react';
import { useMobile } from '@/hooks/utils/use-mobile';
import { ChevronDown, ChevronUp, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface MobileOptimizedTableProps {
  data: any[];
  columns: Column[];
  title?: string;
  className?: string;
  onRowClick?: (row: any) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  loading?: boolean;
  emptyMessage?: string;
}

export function MobileOptimizedTable({
  data,
  columns,
  title,
  className,
  onRowClick,
  onSort,
  sortKey,
  sortDirection,
  loading = false,
  emptyMessage = 'No data available',
}: MobileOptimizedTableProps) {
  const { isMobile } = useMobile();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const handleSort = (key: string) => {
    if (!onSort) return;

    const newDirection =
      sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  if (isMobile) {
    // Mobile card layout
    return (
      <div className={cn('space-y-4', className)}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        )}

        {data.map((row, index) => {
          const rowId = row.id || index.toString();
          const isExpanded = expandedRows.has(rowId);
          const primaryColumn = columns[0];
          const secondaryColumns = columns.slice(1, 3);
          const remainingColumns = columns.slice(3);

          return (
            <Card key={rowId} className="overflow-hidden">
              <CardHeader
                className="pb-3 cursor-pointer"
                onClick={() => toggleRowExpansion(rowId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {primaryColumn.render
                        ? primaryColumn.render(row[primaryColumn.key], row)
                        : row[primaryColumn.key]}
                    </CardTitle>
                    {secondaryColumns.length > 0 && (
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        {secondaryColumns.map(column => (
                          <div key={column.key}>
                            <span className="font-medium">{column.label}:</span>{' '}
                            {column.render
                              ? column.render(row[column.key], row)
                              : row[column.key]}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {isExpanded && remainingColumns.length > 0 && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {remainingColumns.map(column => (
                      <div key={column.key} className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          {column.label}:
                        </span>
                        <span className="text-right">
                          {column.render
                            ? column.render(row[column.key], row)
                            : row[column.key]}
                        </span>
                      </div>
                    ))}
                  </div>

                  {onRowClick && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRowClick(row)}
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    );
  }

  // Desktop table layout
  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map(column => (
                <th
                  key={column.key}
                  className={cn(
                    'text-left py-3 px-4 font-medium text-gray-900',
                    column.sortable && 'cursor-pointer hover:bg-gray-50'
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {onRowClick && (
                <th className="text-right py-3 px-4 font-medium text-gray-900">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                className={cn(
                  'border-b border-gray-100 hover:bg-gray-50',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(column => (
                  <td key={column.key} className="py-3 px-4">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
                {onRowClick && (
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        onRowClick(row);
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Mobile-optimized data grid
interface MobileDataGridProps {
  data: any[];
  columns: Column[];
  title?: string;
  className?: string;
  onItemClick?: (item: any) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function MobileDataGrid({
  data,
  columns,
  title,
  className,
  onItemClick,
  loading = false,
  emptyMessage = 'No data available',
}: MobileDataGridProps) {
  const { isMobile } = useMobile();

  if (loading) {
    return (
      <div className={cn('grid gap-4', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  const gridCols = isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3';

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}

      <div className={cn('grid gap-4', gridCols)}>
        {data.map((item, index) => (
          <Card
            key={item.id || index}
            className={cn(
              'cursor-pointer transition-shadow hover:shadow-md',
              onItemClick && 'hover:shadow-lg'
            )}
            onClick={() => onItemClick?.(item)}
          >
            <CardContent className="p-4">
              {columns.map(column => (
                <div key={column.key} className="mb-2 last:mb-0">
                  <div className="text-sm font-medium text-gray-600">
                    {column.label}
                  </div>
                  <div className="text-sm text-gray-900">
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
