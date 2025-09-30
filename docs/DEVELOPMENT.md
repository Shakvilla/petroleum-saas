# Development Guide

This guide provides detailed information for developers working on the Petroleum Management System frontend.

## Table of Contents

- [Development Environment Setup](#development-environment-setup)
- [Code Organization](#code-organization)
- [Component Development](#component-development)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Testing Strategy](#testing-strategy)
- [Performance Optimization](#performance-optimization)
- [Debugging](#debugging)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Development Environment Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or pnpm/yarn)
- Git 2.30.0 or higher
- VS Code (recommended) with extensions:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint

### Initial Setup

1. **Clone and Install**

```bash
git clone <repository-url>
cd petroleum-saas
npm install
```

2. **Environment Configuration**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3001

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Security
NEXT_PUBLIC_STORAGE_SECRET_KEY=your-secret-key

# Development
NODE_ENV=development
```

3. **Start Development Server**

```bash
npm run dev
```

### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

## Code Organization

### File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `User.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Import Organization

```typescript
// 1. React and Next.js imports
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { z } from 'zod';
import { toast } from 'sonner';

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/api/use-auth';

// 4. Relative imports
import './component.css';
```

### Component Structure

```typescript
// 1. Imports
import React from 'react';
import { Button } from '@/components/ui/button';

// 2. Types and interfaces
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component definition
export function Component({ title, onAction }: ComponentProps) {
  // 4. Hooks
  const [isLoading, setIsLoading] = useState(false);

  // 5. Event handlers
  const handleClick = () => {
    setIsLoading(true);
    onAction();
  };

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick} disabled={isLoading}>
        Action
      </Button>
    </div>
  );
}
```

## Component Development

### Component Guidelines

1. **Functional Components**: Always use functional components with hooks
2. **TypeScript**: Provide proper types for all props and state
3. **Accessibility**: Include ARIA labels and keyboard support
4. **Performance**: Use React.memo for expensive components
5. **Testing**: Write tests for all components

### Creating a New Component

1. **Create the component file**

```bash
touch components/feature/NewComponent.tsx
```

2. **Basic component structure**

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface NewComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export function NewComponent({ className, children }: NewComponentProps) {
  return (
    <div className={cn('base-styles', className)}>
      {children}
    </div>
  );
}
```

3. **Add to index file**

```typescript
// components/feature/index.ts
export { NewComponent } from './NewComponent';
```

### Accessible Components

Always include accessibility features:

```typescript
export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  ariaLabel
}: AccessibleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </button>
  );
}
```

### Mobile-First Components

Design components for mobile first:

```typescript
export function ResponsiveCard({ children }: CardProps) {
  return (
    <div className="
      w-full
      p-4
      md:p-6
      lg:p-8
      rounded-lg
      shadow-sm
      border
      bg-white
    ">
      {children}
    </div>
  );
}
```

## State Management

### Zustand Stores

Create stores for global state:

```typescript
// stores/feature-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FeatureState {
  data: FeatureData[];
  isLoading: boolean;
  error: string | null;
  setData: (data: FeatureData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFeatureStore = create<FeatureState>()(
  persist(
    set => ({
      data: [],
      isLoading: false,
      error: null,
      setData: data => set({ data }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),
    }),
    {
      name: 'feature-storage',
    }
  )
);
```

### React Query Integration

Use React Query for server state:

```typescript
// hooks/api/use-feature.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';

export function useFeatureData() {
  return useQuery({
    queryKey: queryKeys.feature.all,
    queryFn: fetchFeatureData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feature.all });
    },
  });
}
```

## API Integration

### API Client Setup

```typescript
// lib/api-client.ts
import { queryClient } from '@/lib/query-client';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL!);
```

### Error Handling

```typescript
// hooks/api/use-api.ts
import { useErrorHandler } from '@/hooks/utils/use-error-handler';

export function useApiCall() {
  const { handleError } = useErrorHandler();

  const makeRequest = async (endpoint: string) => {
    try {
      const response = await apiClient.request(endpoint);
      return response;
    } catch (error) {
      handleError(error, {
        component: 'useApiCall',
        action: 'makeRequest',
        type: ErrorType.NETWORK,
      });
      throw error;
    }
  };

  return { makeRequest };
}
```

## Testing Strategy

### Unit Testing

```typescript
// test/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Integration Testing

```typescript
// test/components/UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProfile } from '@/components/UserProfile';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('UserProfile', () => {
  it('displays user information', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile userId="123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

### E2E Testing

```typescript
// test/e2e/user-flow.spec.ts
import { test, expect } from '@playwright/test';

test('user can login and view dashboard', async ({ page }) => {
  await page.goto('/login');

  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Memoization

```typescript
// Memoize expensive calculations
const ExpensiveComponent = memo(({ data }: Props) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveCalculation(item));
  }, [data]);

  return <div>{/* render processedData */}</div>;
});
```

### Image Optimization

```typescript
import Image from 'next/image';

export function OptimizedImage({ src, alt }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      priority={false}
    />
  );
}
```

## Debugging

### React Developer Tools

1. Install React Developer Tools browser extension
2. Use Profiler to identify performance issues
3. Use Components tab to inspect component state

### Debugging Hooks

```typescript
// Custom debug hook
export function useDebug(value: any, label?: string) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${label || 'Debug'}:`, value);
    }
  }, [value, label]);
}

// Usage
function MyComponent() {
  const [state, setState] = useState(0);
  useDebug(state, 'MyComponent state');

  return <div>{state}</div>;
}
```

### Error Boundaries

```typescript
// components/ErrorBoundary.tsx
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

## Common Patterns

### Custom Hooks

```typescript
// hooks/use-local-storage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### Form Handling

```typescript
// hooks/use-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function useLoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await login(data);
    } catch (error) {
      form.setError('root', { message: 'Login failed' });
    }
  };

  return { form, onSubmit };
}
```

### Loading States

```typescript
// components/LoadingState.tsx
export function LoadingState({ isLoading, children }: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
}
```

## Troubleshooting

### Common Issues

1. **Hydration Mismatch**
   - Ensure server and client render the same content
   - Use `useEffect` for client-only code
   - Check for browser-specific APIs

2. **TypeScript Errors**
   - Run `npm run type-check` to identify issues
   - Check import paths and type definitions
   - Ensure all props are properly typed

3. **Build Failures**
   - Check for unused imports
   - Verify all environment variables are set
   - Run `npm run lint` to catch issues

4. **Performance Issues**
   - Use React DevTools Profiler
   - Check for unnecessary re-renders
   - Implement proper memoization

### Debugging Commands

```bash
# Check for TypeScript errors
npm run type-check

# Run linter
npm run lint

# Check bundle size
npm run analyze

# Run tests
npm run test

# Check test coverage
npm run test:coverage
```

### Getting Help

1. Check the documentation first
2. Search existing issues on GitHub
3. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots if applicable

## Best Practices

### Code Quality

1. **Write Clean Code**: Follow SOLID principles
2. **Use TypeScript**: Leverage type safety
3. **Test Everything**: Write comprehensive tests
4. **Document Code**: Add meaningful comments
5. **Follow Conventions**: Use established patterns

### Performance

1. **Optimize Images**: Use Next.js Image component
2. **Code Splitting**: Split code by routes and features
3. **Lazy Loading**: Load components on demand
4. **Memoization**: Use React.memo and useMemo
5. **Bundle Analysis**: Monitor bundle size

### Security

1. **Input Validation**: Validate all user inputs
2. **XSS Prevention**: Sanitize HTML content
3. **CSRF Protection**: Implement CSRF tokens
4. **Secure Storage**: Encrypt sensitive data
5. **Dependency Updates**: Keep dependencies updated

### Accessibility

1. **ARIA Labels**: Include proper ARIA attributes
2. **Keyboard Navigation**: Ensure keyboard accessibility
3. **Color Contrast**: Maintain proper contrast ratios
4. **Screen Readers**: Test with screen readers
5. **Focus Management**: Implement proper focus handling
