// Performance optimization utilities for authentication

// Debounce function for form inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for API calls
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoized password strength calculation
const passwordStrengthCache = new Map<
  string,
  { score: number; feedback: string[] }
>();

export const memoizedPasswordStrength = (password: string) => {
  if (passwordStrengthCache.has(password)) {
    return passwordStrengthCache.get(password)!;
  }

  const result = calculatePasswordStrength(password);
  passwordStrengthCache.set(password, result);

  // Limit cache size
  if (passwordStrengthCache.size > 100) {
    const firstKey = passwordStrengthCache.keys().next().value;
    if (firstKey) {
      passwordStrengthCache.delete(firstKey);
    }
  }

  return result;
};

// Simple password strength calculation (moved from auth-validation.ts for performance)
const calculatePasswordStrength = (
  password: string
): { score: number; feedback: string[] } => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Add numbers');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Add special characters');

  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    feedback.push('Avoid repeating characters');
  }

  if (/123|abc|qwe/i.test(password)) {
    score -= 1;
    feedback.push('Avoid common sequences');
  }

  return { score: Math.max(0, Math.min(5, score)), feedback };
};

// Form validation cache
const validationCache = new Map<string, boolean>();

export const memoizedValidation = (
  value: string,
  validator: (val: string) => boolean
) => {
  const cacheKey = `${value}-${validator.toString()}`;

  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)!;
  }

  const result = validator(value);
  validationCache.set(cacheKey, result);

  // Limit cache size
  if (validationCache.size > 200) {
    const firstKey = validationCache.keys().next().value;
    if (firstKey) {
      validationCache.delete(firstKey);
    }
  }

  return result;
};

// Preload authentication components
export const preloadAuthComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload login page
    import('@/components/auth/login-page');

    // Preload register page
    import('@/components/auth/register-page');

    // Preload forgot password page
    import('@/components/auth/forgot-password-page');
  }
};

// Optimize form re-renders
export const createOptimizedFormHandler = <T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  debounceMs: number = 300
) => {
  return debounce((updates: Partial<T>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, debounceMs);
};

// Image optimization for tenant logos
export const optimizeImage = (
  src: string,
  width: number = 32,
  height: number = 32
) => {
  // In a real implementation, this would use a CDN or image optimization service
  return `${src}?w=${width}&h=${height}&q=80&f=webp`;
};

// Bundle size optimization
export const loadAuthComponentsOnDemand = async (componentName: string) => {
  switch (componentName) {
    case 'login':
      return import('@/components/auth/login-page');
    case 'register':
      return import('@/components/auth/register-page');
    case 'forgot-password':
      return import('@/components/auth/forgot-password-page');
    case 'visual-marketing':
      return import('@/components/auth/visual-marketing-section');
    default:
      throw new Error(`Unknown component: ${componentName}`);
  }
};

// Performance monitoring for authentication
export const trackAuthPerformance = (action: string, startTime: number) => {
  const endTime = performance.now();
  const duration = endTime - startTime;

  // Log performance metrics
  console.log(`Auth ${action} took ${duration.toFixed(2)}ms`);

  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    // analytics.track('auth_performance', { action, duration });
  }
};

// Memory cleanup for authentication components
export const cleanupAuthCache = () => {
  passwordStrengthCache.clear();
  validationCache.clear();
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  if (typeof window === 'undefined') return null;

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
};

// Virtual scrolling for large lists (if needed)
export const createVirtualScroll = (
  itemHeight: number,
  containerHeight: number,
  totalItems: number
) => {
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const buffer = Math.ceil(visibleItems / 2);

  return {
    getVisibleRange: (scrollTop: number) => {
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
      const end = Math.min(totalItems, start + visibleItems + buffer * 2);
      return { start, end };
    },
    getTotalHeight: () => totalItems * itemHeight,
    getOffsetY: (index: number) => index * itemHeight,
  };
};
