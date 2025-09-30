'use client';

import React, { useState, useMemo } from 'react';
import { useTenant } from '@/components/tenant-provider';
import { useTenantAPI } from '@/lib/tenant-aware-api-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';

interface TenantSafeDataListProps<T> {
  resource: string;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
  }>;
  filters?: Record<string, any>;
  searchFields?: string[];
  onItemClick?: (item: T) => void;
  onItemEdit?: (item: T) => void;
  onItemDelete?: (item: T) => void;
  exportable?: boolean;
  refreshable?: boolean;
  className?: string;
}

export function TenantSafeDataList<
  T extends { id: string; tenantId?: string },
>({
  resource,
  columns,
  filters = {},
  searchFields = [],
  onItemClick,
  onItemEdit,
  onItemDelete,
  exportable = false,
  refreshable = true,
  className = '',
}: TenantSafeDataListProps<T>) {
  const { tenant } = useTenant();
  const apiClient = useTenantAPI();

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentFilters, setCurrentFilters] = useState(filters);

  // Validate tenant context
  if (!tenant) {
    throw new Error('TenantSafeDataList must be used within a tenant context');
  }

  // Load data
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.findMany(resource, currentFilters);

      // Validate tenant ownership
      const validatedData = response.filter(item => {
        if (item.tenantId && item.tenantId !== tenant.id) {
          console.warn('Filtering out cross-tenant data:', item);
          return false;
        }
        return true;
      });

      setData(validatedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when filters change
  React.useEffect(() => {
    loadData();
  }, [currentFilters]);

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchTerm && searchFields.length > 0) {
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = getNestedValue(item, field);
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
    }

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = getNestedValue(a, sortField);
        const bValue = getNestedValue(b, sortField);

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, searchFields, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const response = await apiClient.request(`/${resource}/export`, {
        method: 'POST',
        body: JSON.stringify({
          filters: currentFilters,
          searchTerm,
          sortField,
          sortDirection,
        }),
      });

      // Create download link
      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resource}-${tenant.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  // Get nested value from object
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={loadData} className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="capitalize">{resource}</CardTitle>
          <div className="flex items-center space-x-2">
            {refreshable && (
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                />
              </Button>
            )}
            {exportable && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={loading}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-4">
          {searchFields.length > 0 && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${resource}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <Badge variant="secondary">
            {filteredData.length} {filteredData.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(column => (
                  <TableHead
                    key={column.key}
                    className={
                      column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''
                    }
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && sortField === column.key && (
                        <span className="text-xs">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
                {(onItemEdit || onItemDelete) && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map(item => (
                <TableRow
                  key={item.id}
                  className={
                    onItemClick ? 'cursor-pointer hover:bg-gray-50' : ''
                  }
                  onClick={() => onItemClick?.(item)}
                >
                  {columns.map(column => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(getNestedValue(item, column.key), item)
                        : getNestedValue(item, column.key)}
                    </TableCell>
                  ))}
                  {(onItemEdit || onItemDelete) && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {onItemEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              onItemEdit(item);
                            }}
                          >
                            Edit
                          </Button>
                        )}
                        {onItemDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              onItemDelete(item);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No {resource} found
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Utility component for tenant-safe search
export function TenantSafeSearch({
  placeholder = 'Search...',
  onSearch,
  className = '',
}: {
  placeholder?: string;
  onSearch: (term: string) => void;
  className?: string;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const { tenant } = useTenant();

  const handleSearch = (term: string) => {
    if (!tenant) {
      console.warn('Search attempted without tenant context');
      return;
    }

    onSearch(term);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
        className="pl-10"
      />
    </div>
  );
}
