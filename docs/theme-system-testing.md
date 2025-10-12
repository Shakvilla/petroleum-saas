# Theme System Testing Documentation

## Overview

This document provides comprehensive testing documentation for the unified theming system, including unit tests, integration tests, E2E tests, and performance tests.

## Testing Strategy

### 1. Unit Tests

Unit tests focus on testing individual components and functions in isolation.

#### Test Files
- `test/lib/unified-theme-manager.test.ts` - Tests for the main theme manager
- `test/lib/enhanced-theme-cache.test.ts` - Tests for the enhanced cache system
- `test/lib/theme-performance-monitor.test.ts` - Tests for performance monitoring

#### Key Test Areas
- **Theme Application**: Testing theme application logic
- **Cache Operations**: Testing cache set/get/delete operations
- **Performance Monitoring**: Testing performance metrics collection
- **Error Handling**: Testing error scenarios and recovery
- **Configuration**: Testing configuration management
- **Validation**: Testing theme validation logic

#### Example Test Structure
```typescript
describe('UnifiedThemeManager', () => {
  let themeManager: UnifiedThemeManager;
  let mockTheme: UnifiedTheme;

  beforeEach(() => {
    // Setup test environment
    themeManager = new UnifiedThemeManager();
    mockTheme = createMockTheme();
  });

  describe('Theme Application', () => {
    it('should apply theme successfully', async () => {
      const result = await themeManager.applyTheme(mockTheme);
      expect(result.success).toBe(true);
    });
  });
});
```

### 2. Integration Tests

Integration tests verify that different components work together correctly.

#### Test Files
- `test/lib/theme-system-integration.test.ts` - Tests for system integration

#### Key Test Areas
- **Theme Application Flow**: Testing complete theme application process
- **Component Interaction**: Testing how different managers interact
- **Error Recovery**: Testing system recovery from errors
- **Performance Integration**: Testing performance monitoring integration
- **Cache Integration**: Testing cache system integration

#### Example Test Structure
```typescript
describe('Theme System Integration Tests', () => {
  let themeManager: UnifiedThemeManager;
  let cacheManager: EnhancedThemeCacheManager;
  let performanceMonitor: ThemePerformanceMonitor;

  beforeEach(() => {
    // Initialize all managers
    themeManager = new UnifiedThemeManager();
    cacheManager = new EnhancedThemeCacheManager();
    performanceMonitor = new ThemePerformanceMonitor();
  });

  describe('Theme Application Flow', () => {
    it('should apply theme through complete system', async () => {
      const result = await themeManager.applyTheme(mockTheme);
      expect(result.success).toBe(true);
      
      // Verify CSS variables were injected
      expect(mockDocument.head.appendChild).toHaveBeenCalled();
      
      // Verify performance monitoring
      const metrics = performanceMonitor.getPerformanceMetrics();
      expect(metrics).toBeDefined();
    });
  });
});
```

### 3. E2E Tests

End-to-end tests verify the complete user experience from the browser perspective.

#### Test Files
- `test/e2e/theme-system.spec.ts` - E2E tests for theme system

#### Key Test Areas
- **Theme Application**: Testing theme application in browser
- **UI Updates**: Testing visual changes in UI
- **Persistence**: Testing theme persistence across reloads
- **Validation**: Testing theme validation in browser
- **Accessibility**: Testing accessibility features
- **Export/Import**: Testing theme export/import functionality
- **Performance**: Testing performance in browser
- **Error Handling**: Testing error handling in browser
- **Multi-tenant**: Testing tenant-specific themes

#### Example Test Structure
```typescript
test.describe('Theme System E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Theme Application', () => {
    test('should apply theme and update UI elements', async ({ page }) => {
      // Navigate to settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      
      // Apply theme
      await page.click('[data-testid="theme-preset-corporate-blue"]');
      await page.waitForTimeout(500);
      
      // Verify theme is applied
      const primaryColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
          .trim();
      });
      
      expect(primaryColor).toBe('#3b82f6');
    });
  });
});
```

### 4. Performance Tests

Performance tests verify that the system meets performance requirements.

#### Test Files
- `test/lib/theme-performance.test.ts` - Performance tests

#### Key Test Areas
- **Theme Application Performance**: Testing theme application speed
- **Cache Performance**: Testing cache operations speed
- **CSS Variable Performance**: Testing CSS variable injection speed
- **Tailwind Performance**: Testing Tailwind class generation speed
- **Memory Usage**: Testing memory consumption
- **Concurrent Operations**: Testing performance under load
- **Performance Thresholds**: Testing against performance requirements
- **Performance Regression**: Testing for performance regressions

#### Example Test Structure
```typescript
describe('Theme System Performance Tests', () => {
  describe('Theme Application Performance', () => {
    test('should apply theme within performance threshold', async () => {
      const startTime = performance.now();
      
      const result = await themeManager.applyTheme(mockTheme);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});
```

## Test Configuration

### Jest Configuration

The project uses Jest for unit and integration tests with the following configuration:

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'stores/**/*.{js,jsx,ts,tsx}',
    'services/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/test/e2e/'],
};

module.exports = createJestConfig(customJestConfig);
```

### Playwright Configuration

The project uses Playwright for E2E tests with the following configuration:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Data

### Mock Themes

Test themes are created using a consistent structure:

```typescript
const mockTheme: UnifiedTheme = {
  id: 'test-theme',
  name: 'Test Theme',
  description: 'A test theme for unit testing',
  version: '1.0.0',
  metadata: {
    author: 'Test Author',
    license: 'MIT',
    tags: ['test', 'unit'],
    category: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  colors: {
    primary: '#3b82f6',
    secondary: '#1f2937',
    accent: '#06b6d4',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',
  },
  // ... other theme properties
};
```

### Mock DOM Environment

Tests use a mocked DOM environment:

```typescript
const mockDocument = {
  head: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  },
  documentElement: {
    style: {
      setProperty: jest.fn(),
    },
  },
  querySelectorAll: jest.fn().mockReturnValue([]),
};

Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true,
});
```

## Running Tests

### Unit and Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test unified-theme-manager.test.ts
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run E2E tests for specific browser
npm run test:e2e:chromium
```

### Performance Tests

```bash
# Run performance tests
npm run test:performance

# Run performance tests with profiling
npm run test:performance:profile
```

## Test Coverage

### Coverage Requirements

The project maintains the following coverage thresholds:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Coverage Reports

Coverage reports are generated in multiple formats:

- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Report**: `coverage/lcov.info`
- **JSON Report**: `coverage/coverage-final.json`
- **Clover Report**: `coverage/clover.xml`

### Coverage Analysis

To analyze coverage:

1. Run tests with coverage: `npm run test:coverage`
2. Open HTML report: `open coverage/lcov-report/index.html`
3. Review coverage by file and function
4. Identify areas needing additional tests

## Test Best Practices

### 1. Test Structure

- Use descriptive test names
- Group related tests in `describe` blocks
- Use `beforeEach` and `afterEach` for setup/cleanup
- Keep tests focused and atomic

### 2. Mocking

- Mock external dependencies
- Use consistent mock data
- Reset mocks between tests
- Mock at the appropriate level

### 3. Assertions

- Use specific assertions
- Test both success and failure cases
- Verify side effects
- Check error messages and types

### 4. Performance Testing

- Set realistic performance thresholds
- Test under various load conditions
- Monitor memory usage
- Test for performance regressions

### 5. E2E Testing

- Test user workflows
- Use data-testid attributes
- Wait for elements to be ready
- Test error scenarios

## Continuous Integration

### GitHub Actions

Tests are automatically run on every pull request:

```yaml
# .github/workflows/test.yml
name: Tests

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
      
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Test Reports

Test results are published to:

- **Coverage**: Codecov
- **E2E Tests**: GitHub Actions artifacts
- **Performance**: Performance monitoring dashboard

## Troubleshooting

### Common Issues

1. **Tests failing due to DOM methods**
   - Ensure DOM mocks are properly set up
   - Check for missing global objects

2. **Performance tests failing**
   - Adjust performance thresholds
   - Check for system resource constraints
   - Verify mock implementations

3. **E2E tests flaky**
   - Increase wait times
   - Use more specific selectors
   - Check for race conditions

4. **Coverage not meeting thresholds**
   - Add tests for uncovered code
   - Review test quality
   - Consider excluding non-testable code

### Debugging

1. **Unit Tests**: Use `console.log` and Jest debugging
2. **E2E Tests**: Use Playwright debugging tools
3. **Performance Tests**: Use performance profiling
4. **Coverage**: Review coverage reports for gaps

## Future Improvements

### Planned Enhancements

1. **Visual Regression Testing**: Add visual diff testing
2. **Accessibility Testing**: Automated accessibility testing
3. **Load Testing**: Stress testing under high load
4. **Cross-browser Testing**: Expanded browser coverage
5. **Mobile Testing**: Mobile-specific test scenarios

### Test Automation

1. **Auto-test Generation**: Generate tests from specifications
2. **Test Data Management**: Centralized test data management
3. **Test Environment Management**: Automated test environment setup
4. **Test Result Analysis**: Automated test result analysis

## Conclusion

The theme system testing strategy provides comprehensive coverage across unit, integration, E2E, and performance testing. This ensures the reliability, performance, and maintainability of the theming system while supporting continuous development and deployment.

For questions or issues with testing, please refer to the troubleshooting section or contact the development team.
