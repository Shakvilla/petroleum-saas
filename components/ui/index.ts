/**
 * Enhanced UI Components Index
 *
 * Centralized export for all enhanced UI components that extend
 * the existing shadcn/ui foundation with consistent design patterns.
 */

// Enhanced components
export { EnhancedButton, enhancedButtonVariants } from './enhanced-button';
export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardFooter,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  enhancedCardVariants,
} from './enhanced-card';
export {
  EnhancedBadge,
  enhancedBadgeVariants,
  getBadgeVariantFromStatus,
  getBadgeVariantFromRole,
} from './enhanced-badge';

// Tenant-aware components
export {
  TenantAwareButton,
  TenantPrimaryButton,
  TenantSecondaryButton,
  TenantOutlineButton,
  TenantGhostButton,
  tenantAwareButtonVariants,
} from './tenant-aware-button';
export {
  TenantAwareCard,
  TenantAwareCardHeader,
  TenantAwareCardFooter,
  TenantAwareCardTitle,
  TenantAwareCardDescription,
  TenantAwareCardContent,
  TenantBrandedCard,
  TenantPrimaryCard,
  TenantOutlinedCard,
  TenantElevatedCard,
  tenantAwareCardVariants,
} from './tenant-aware-card';
export {
  TenantAwareBadge,
  TenantPrimaryBadge,
  TenantSecondaryBadge,
  TenantOutlineBadge,
  TenantSolidBadge,
  tenantAwareBadgeVariants,
  getTenantAwareBadgeVariantFromStatus,
  getTenantAwareBadgeVariantFromRole,
} from './tenant-aware-badge';
export {
  LoadingSkeleton,
  CardSkeleton,
  TableSkeleton,
  AvatarSkeleton,
  ButtonSkeleton,
  ChartSkeleton,
  skeletonVariants,
} from './loading-skeleton';
export {
  StatusIndicator,
  UserStatusIndicator,
  SystemStatusIndicator,
  statusIndicatorVariants,
  getStatusVariant,
  getStatusLabel,
} from './status-indicator';
export {
  EnhancedEmptyState,
  NoDataEmptyState,
  NoSearchResultsEmptyState,
  ErrorEmptyState,
  NoPermissionsEmptyState,
  emptyStateVariants,
} from './enhanced-empty-state';
export {
  MobileOptimized,
  MobileButton,
  MobileInput,
  MobileCard,
  MobileList,
  MobileGrid,
  mobileOptimizedVariants,
} from './mobile-optimized';

// Design system
export {
  designSystem,
  colors,
  typography,
  spacing,
  componentVariants,
} from '@/lib/design-system';

// Tenant-aware design system
export {
  tenantAwareDesignSystem,
  useTenantAwareDesignSystem,
  withTenantAwareStyling,
  tenantAwareCn,
} from '@/lib/tenant-aware-design-system';

// Re-export existing shadcn/ui components for convenience
export { Button, buttonVariants } from './button';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';
export { Badge, badgeVariants } from './badge';
export { Input } from './input';
export { Label } from './label';
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
export { Textarea } from './textarea';
export { Switch } from './switch';
export { Checkbox } from './checkbox';
export { RadioGroup, RadioGroupItem } from './radio-group';
export { Toggle, toggleVariants } from './toggle';
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
export {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
export { Avatar, AvatarFallback, AvatarImage } from './avatar';
export { Alert, AlertDescription, AlertTitle } from './alert';
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
export { Popover, PopoverContent, PopoverTrigger } from './popover';
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';
export { Calendar } from './calendar';
export { DatePicker } from './date-picker';
export { Progress } from './progress';
export { Skeleton } from './skeleton';
export { Separator } from './separator';
export { ScrollArea, ScrollBar } from './scroll-area';
export { Slider } from './slider';
export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';
export { Toaster } from './toaster';
export { useToast } from './use-toast';
export { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
export {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from './menubar';
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from './navigation-menu';
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './sidebar';
export { useIsMobile } from './use-mobile';
