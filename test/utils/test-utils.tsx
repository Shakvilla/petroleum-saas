import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { AccessibilityProvider } from '@/components/accessibility-provider';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const mockTank = {
  id: '1',
  name: 'Test Tank',
  capacity: 10000,
  currentLevel: 7500,
  product: 'Gasoline',
  location: 'Test Station',
  status: 'active' as const,
  lastUpdated: '2024-01-15T10:30:00Z',
};

export const mockDelivery = {
  id: '1',
  tankId: '1',
  supplier: 'Test Supplier',
  amount: 1000,
  scheduledDate: '2024-01-16T08:00:00Z',
  status: 'scheduled' as const,
  driver: 'Test Driver',
  vehicle: 'Test Vehicle',
};

export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  roles: ['admin'],
  permissions: [
    { resource: 'tanks', action: 'read' },
    { resource: 'tanks', action: 'write' },
  ],
};

// Test utilities
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

export const createMockQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

// Mock functions
export const mockFetch = jest.fn();
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock WebSocket
export const mockWebSocket = {
  close: jest.fn(),
  send: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: WebSocket.OPEN,
};

// Mock IntersectionObserver
export const mockIntersectionObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
};

// Mock ResizeObserver
export const mockResizeObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
};

// Mock matchMedia
export const mockMatchMedia = (matches: boolean = false) => {
  return jest.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

// Mock performance
export const mockPerformance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
};

// Mock crypto
export const mockCrypto = {
  randomUUID: jest.fn(() => 'mock-uuid'),
  getRandomValues: jest.fn(arr =>
    arr.map(() => Math.floor(Math.random() * 256))
  ),
};

// Mock console methods
export const mockConsole = {
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock window methods
export const mockWindow = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  scrollTo: jest.fn(),
  matchMedia: mockMatchMedia(),
};

// Mock document methods
export const mockDocument = {
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => []),
  getElementById: jest.fn(),
  createElement: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Mock navigator
export const mockNavigator = {
  userAgent: 'Mozilla/5.0 (compatible; Test Browser)',
  onLine: true,
  geolocation: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  },
  mediaDevices: {
    getUserMedia: jest.fn(),
  },
  vibrate: jest.fn(),
};

// Mock location
export const mockLocation = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

// Mock history
export const mockHistory = {
  pushState: jest.fn(),
  replaceState: jest.fn(),
  go: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  length: 1,
  state: null,
};

// Mock storage
export const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

// Mock fetch response
export const createMockResponse = (data: any, status: number = 200) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(JSON.stringify(data)),
    blob: jest.fn().mockResolvedValue(new Blob([JSON.stringify(data)])),
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    formData: jest.fn().mockResolvedValue(new FormData()),
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    headers: new Headers(),
    type: 'basic' as ResponseType,
    url: 'http://localhost:3000/api/test',
  };
};

// Mock fetch
export const mockFetchResponse = (data: any, status: number = 200) => {
  const response = createMockResponse(data, status);
  mockFetch.mockResolvedValue(response);
  return response;
};

// Mock fetch error
export const mockFetchError = (error: Error) => {
  mockFetch.mockRejectedValue(error);
};

// Mock WebSocket events
export const mockWebSocketEvents = {
  open: new Event('open'),
  close: new Event('close'),
  error: new Event('error'),
  message: new MessageEvent('message', { data: 'test message' }),
};

// Mock touch events
export const mockTouchEvent = (clientX: number, clientY: number) => {
  return {
    touches: [{ clientX, clientY }],
    changedTouches: [{ clientX, clientY }],
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as any;
};

// Mock keyboard events
export const mockKeyboardEvent = (key: string, code: string = key) => {
  return {
    key,
    code,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as any;
};

// Mock mouse events
export const mockMouseEvent = (clientX: number, clientY: number) => {
  return {
    clientX,
    clientY,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as any;
};

// Mock form events
export const mockFormEvent = (target: any) => {
  return {
    target,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as any;
};

// Mock change events
export const mockChangeEvent = (value: string) => {
  return {
    target: { value },
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as any;
};

// Mock focus events
export const mockFocusEvent = () => {
  return {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as any;
};

// Mock blur events
export const mockBlurEvent = () => {
  return {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as any;
};
