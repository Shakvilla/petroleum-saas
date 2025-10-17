import * as React from "react"

import { cn } from "@/lib/utils"

// Responsive table variants
type TableVariant = 'default' | 'compact' | 'spacious'
type TableSize = 'sm' | 'md' | 'lg'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  variant?: TableVariant
  size?: TableSize
  responsive?: boolean
}

const Table = React.forwardRef<
  HTMLTableElement,
  TableProps
>(({ className, variant = 'default', size = 'md', responsive = true, ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'text-xs'
      case 'spacious':
        return 'text-base'
      default:
        return 'text-sm'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs'
      case 'lg':
        return 'text-base'
      default:
        return 'text-sm'
    }
  }

  return (
    <div className={cn(
      "relative w-full",
      responsive ? "overflow-auto" : "overflow-hidden"
    )}>
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom",
          getVariantClasses(),
          getSizeClasses(),
          className
        )}
        {...props}
      />
    </div>
  )
})
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  size?: TableSize
  interactive?: boolean
}

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  TableRowProps
>(({ className, size = 'md', interactive = true, ...props }, ref) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8'
      case 'lg':
        return 'h-16'
      default:
        return 'h-12'
    }
  }

  return (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors",
        interactive && "hover:bg-muted/50 data-[state=selected]:bg-muted",
        getSizeClasses(),
        className
      )}
      {...props}
    />
  )
})
TableRow.displayName = "TableRow"

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  size?: TableSize
  responsive?: boolean
}

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  TableHeadProps
>(({ className, size = 'md', responsive = true, ...props }, ref) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-2 text-xs'
      case 'lg':
        return 'h-14 px-6 text-base'
      default:
        return 'h-12 px-4 text-sm'
    }
  }

  return (
    <th
      ref={ref}
      className={cn(
        "text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        getSizeClasses(),
        responsive && "sm:px-4 md:px-6",
        className
      )}
      {...props}
    />
  )
})
TableHead.displayName = "TableHead"

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  size?: TableSize
  responsive?: boolean
}

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  TableCellProps
>(({ className, size = 'md', responsive = true, ...props }, ref) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-2 text-xs'
      case 'lg':
        return 'p-6 text-base'
      default:
        return 'p-4 text-sm'
    }
  }

  return (
    <td
      ref={ref}
      className={cn(
        "align-middle [&:has([role=checkbox])]:pr-0",
        getSizeClasses(),
        responsive && "sm:p-3 md:p-4",
        className
      )}
      {...props}
    />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

// Responsive table utilities
export const ResponsiveTableWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'scroll' | 'stack' | 'card'
    breakpoint?: 'sm' | 'md' | 'lg'
  }
>(({ className, variant = 'scroll', breakpoint = 'md', children, ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'scroll':
        return 'overflow-x-auto'
      case 'stack':
        return 'overflow-hidden'
      case 'card':
        return 'overflow-hidden'
      default:
        return 'overflow-x-auto'
    }
  }

  const getBreakpointClasses = () => {
    switch (breakpoint) {
      case 'sm':
        return 'sm:block'
      case 'md':
        return 'md:block'
      case 'lg':
        return 'lg:block'
      default:
        return 'md:block'
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full",
        getVariantClasses(),
        variant === 'stack' && `hidden ${getBreakpointClasses()}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
ResponsiveTableWrapper.displayName = "ResponsiveTableWrapper"

// Mobile card view for tables
export const MobileTableCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string
    subtitle?: string
    actions?: React.ReactNode
  }
>(({ className, title, subtitle, actions, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "block md:hidden bg-white border border-gray-200 rounded-lg p-4 mb-3",
      className
    )}
    {...props}
  >
    {(title || subtitle || actions) && (
      <div className="flex items-center justify-between mb-3">
        <div>
          {title && (
            <h3 className="font-medium text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    )}
    {children}
  </div>
))
MobileTableCard.displayName = "MobileTableCard"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
