import { z } from 'zod';

// Common validation schemas
export const tenantIdSchema = z
  .string()
  .min(1, 'Tenant ID is required')
  .max(50, 'Tenant ID too long');

export const userIdSchema = z.string().uuid('Invalid user ID format');

export const emailSchema = z.string().email('Invalid email format');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  );

// User validation schemas
export const userRoleSchema = z.enum([
  'ADMIN',
  'MANAGER',
  'OPERATOR',
  'VIEWER',
]);

export const userStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'SUSPENDED',
]);

export const permissionSchema = z.object({
  resource: z.string().min(1, 'Resource is required'),
  action: z.string().min(1, 'Action is required'),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: emailSchema,
  role: userRoleSchema,
  password: passwordSchema,
  permissions: z.array(permissionSchema).optional(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .optional(),
  email: emailSchema.optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  permissions: z.array(permissionSchema).optional(),
});

// Tank validation schemas
export const tankTypeSchema = z.enum([
  'GASOLINE',
  'DIESEL',
  'KEROSENE',
  'JET_FUEL',
  'LUBRICANT',
]);

export const tankStatusSchema = z.enum([
  'ACTIVE',
  'MAINTENANCE',
  'INACTIVE',
  'DECOMMISSIONED',
]);

export const createTankSchema = z.object({
  name: z
    .string()
    .min(1, 'Tank name is required')
    .max(100, 'Tank name too long'),
  type: tankTypeSchema,
  capacity: z.number().positive('Capacity must be positive'),
  currentLevel: z.number().min(0, 'Current level cannot be negative'),
  status: tankStatusSchema,
  location: z
    .string()
    .min(1, 'Location is required')
    .max(200, 'Location too long'),
});

export const updateTankSchema = z.object({
  name: z
    .string()
    .min(1, 'Tank name is required')
    .max(100, 'Tank name too long')
    .optional(),
  type: tankTypeSchema.optional(),
  capacity: z.number().positive('Capacity must be positive').optional(),
  currentLevel: z
    .number()
    .min(0, 'Current level cannot be negative')
    .optional(),
  status: tankStatusSchema.optional(),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(200, 'Location too long')
    .optional(),
});

// Delivery validation schemas
export const deliveryStatusSchema = z.enum([
  'SCHEDULED',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED',
  'DELAYED',
]);

export const createDeliverySchema = z.object({
  tankId: userIdSchema,
  quantity: z.number().positive('Quantity must be positive'),
  scheduledDate: z.string().datetime('Invalid date format'),
  driverId: userIdSchema.optional(),
  vehicleId: z.string().min(1, 'Vehicle ID is required').optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
});

export const updateDeliverySchema = z.object({
  quantity: z.number().positive('Quantity must be positive').optional(),
  scheduledDate: z.string().datetime('Invalid date format').optional(),
  status: deliveryStatusSchema.optional(),
  driverId: userIdSchema.optional(),
  vehicleId: z.string().min(1, 'Vehicle ID is required').optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
});

// Query parameter validation schemas
export const paginationSchema = z.object({
  page: z
    .string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'Page must be positive')
    .optional(),
  limit: z
    .string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
    .optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const searchSchema = z.object({
  q: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query too long')
    .optional(),
  status: z.string().optional(),
  role: z.string().optional(),
  type: z.string().optional(),
});

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    tenantId: tenantIdSchema.optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Settings validation schemas
export const tenantSettingsSchema = z.object({
  timezone: z.string().min(1, 'Timezone is required'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  dateFormat: z.string().min(1, 'Date format is required'),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
});

export const brandingSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  logo: z.string().url('Invalid logo URL').optional(),
  favicon: z.string().url('Invalid favicon URL').optional(),
});

// Utility function to validate request body
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(
          err => `${err.path.join('.')}: ${err.message}`
        ),
      };
    }
    return {
      success: false,
      errors: ['Invalid request data'],
    };
  }
}

// Utility function to validate query parameters
export function validateQueryParams<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const params = Object.fromEntries(searchParams.entries());
    const validatedData = schema.parse(params);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(
          err => `${err.path.join('.')}: ${err.message}`
        ),
      };
    }
    return {
      success: false,
      errors: ['Invalid query parameters'],
    };
  }
}
