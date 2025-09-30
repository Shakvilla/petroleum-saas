import { test, expect } from '@playwright/test';

test.describe('Tenant Isolation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/tenants/tenant-a/**', async route => {
      const url = route.request().url();
      if (url.includes('/dashboard')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'tenant-a',
            name: 'Tenant A',
            data: { revenue: 100000, tanks: 5 },
          }),
        });
      } else if (url.includes('/inventory')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, name: 'Tank A1', level: 80, tenantId: 'tenant-a' },
            { id: 2, name: 'Tank A2', level: 60, tenantId: 'tenant-a' },
          ]),
        });
      }
    });

    await page.route('**/api/tenants/tenant-b/**', async route => {
      const url = route.request().url();
      if (url.includes('/dashboard')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'tenant-b',
            name: 'Tenant B',
            data: { revenue: 200000, tanks: 8 },
          }),
        });
      } else if (url.includes('/inventory')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 3, name: 'Tank B1', level: 90, tenantId: 'tenant-b' },
            { id: 4, name: 'Tank B2', level: 70, tenantId: 'tenant-b' },
          ]),
        });
      }
    });
  });

  test('should isolate data between tenants via subdomain', async ({
    page,
  }) => {
    // Visit tenant A subdomain
    await page.goto('http://tenant-a.localhost:3000/dashboard');

    // Verify tenant A data is displayed
    await expect(page.locator('h1')).toContainText('Tenant A');
    await expect(page.locator('text=Tank A1')).toBeVisible();
    await expect(page.locator('text=Tank A2')).toBeVisible();

    // Verify tenant B data is not visible
    await expect(page.locator('text=Tank B1')).not.toBeVisible();
    await expect(page.locator('text=Tank B2')).not.toBeVisible();

    // Navigate to tenant B subdomain
    await page.goto('http://tenant-b.localhost:3000/dashboard');

    // Verify tenant B data is displayed
    await expect(page.locator('h1')).toContainText('Tenant B');
    await expect(page.locator('text=Tank B1')).toBeVisible();
    await expect(page.locator('text=Tank B2')).toBeVisible();

    // Verify tenant A data is not visible
    await expect(page.locator('text=Tank A1')).not.toBeVisible();
    await expect(page.locator('text=Tank A2')).not.toBeVisible();
  });

  test('should isolate data between tenants via path', async ({ page }) => {
    // Visit tenant A path
    await page.goto('http://localhost:3000/tenant-a/dashboard');

    // Verify tenant A data is displayed
    await expect(page.locator('h1')).toContainText('Tenant A');
    await expect(page.locator('text=Tank A1')).toBeVisible();

    // Navigate to tenant B path
    await page.goto('http://localhost:3000/tenant-b/dashboard');

    // Verify tenant B data is displayed
    await expect(page.locator('h1')).toContainText('Tenant B');
    await expect(page.locator('text=Tank B1')).toBeVisible();

    // Verify tenant A data is not visible
    await expect(page.locator('text=Tank A1')).not.toBeVisible();
  });

  test('should prevent cross-tenant API access', async ({ page }) => {
    // Mock cross-tenant access attempt
    await page.route('**/api/tenants/tenant-a/inventory**', async route => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'CROSS_TENANT_ACCESS',
          message: 'Access denied: Cross-tenant data access detected',
        }),
      });
    });

    await page.goto('http://tenant-a.localhost:3000/inventory');

    // Verify error is displayed
    await expect(page.locator('text=Access denied')).toBeVisible();
  });

  test('should handle tenant not found', async ({ page }) => {
    // Mock tenant not found
    await page.route('**/api/tenants/nonexistent/**', async route => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'TENANT_NOT_FOUND',
          message: 'Tenant not found',
        }),
      });
    });

    await page.goto('http://nonexistent.localhost:3000/dashboard');

    // Verify error is displayed
    await expect(page.locator('text=Tenant Error')).toBeVisible();
    await expect(page.locator('text=Tenant not found')).toBeVisible();
  });

  test('should maintain tenant context during navigation', async ({ page }) => {
    // Start at tenant A dashboard
    await page.goto('http://tenant-a.localhost:3000/dashboard');
    await expect(page.locator('h1')).toContainText('Tenant A');

    // Navigate to inventory
    await page.click('text=Inventory');
    await expect(page.url()).toContain('/tenant-a/inventory');
    await expect(page.locator('text=Tank A1')).toBeVisible();

    // Navigate back to dashboard
    await page.click('text=Dashboard');
    await expect(page.url()).toContain('/tenant-a/dashboard');
    await expect(page.locator('h1')).toContainText('Tenant A');
  });

  test('should apply tenant-specific theming', async ({ page }) => {
    // Mock tenant A theming
    await page.route('**/api/tenants/tenant-a/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'tenant-a',
          name: 'Tenant A',
          theme: {
            primaryColor: '#ff0000',
            secondaryColor: '#00ff00',
          },
        }),
      });
    });

    // Mock tenant B theming
    await page.route('**/api/tenants/tenant-b/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'tenant-b',
          name: 'Tenant B',
          theme: {
            primaryColor: '#0000ff',
            secondaryColor: '#ffff00',
          },
        }),
      });
    });

    // Visit tenant A
    await page.goto('http://tenant-a.localhost:3000/dashboard');

    // Check for tenant A primary color
    const tenantAColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue(
        '--tenant-primary'
      );
    });
    expect(tenantAColor.trim()).toBe('#ff0000');

    // Visit tenant B
    await page.goto('http://tenant-b.localhost:3000/dashboard');

    // Check for tenant B primary color
    const tenantBColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue(
        '--tenant-primary'
      );
    });
    expect(tenantBColor.trim()).toBe('#0000ff');
  });

  test('should enforce permission-based access', async ({ page }) => {
    // Mock user with limited permissions
    await page.route('**/api/auth/user**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-1',
          role: 'USER',
          permissions: [{ resource: 'tanks', action: 'read' }],
        }),
      });
    });

    await page.goto('http://tenant-a.localhost:3000/dashboard');

    // Should see tanks (read permission)
    await expect(page.locator('text=Tank A1')).toBeVisible();

    // Should not see admin features
    await expect(page.locator('text=User Management')).not.toBeVisible();
    await expect(page.locator('text=System Settings')).not.toBeVisible();
  });

  test('should handle feature flags per tenant', async ({ page }) => {
    // Mock tenant A with predictive analytics
    await page.route('**/api/tenants/tenant-a/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'tenant-a',
          name: 'Tenant A',
          features: {
            predictive_analytics: true,
            iot_monitoring: true,
          },
        }),
      });
    });

    // Mock tenant B without predictive analytics
    await page.route('**/api/tenants/tenant-b/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'tenant-b',
          name: 'Tenant B',
          features: {
            predictive_analytics: false,
            iot_monitoring: true,
          },
        }),
      });
    });

    // Visit tenant A
    await page.goto('http://tenant-a.localhost:3000/dashboard');
    await expect(page.locator('text=Predictive Analytics')).toBeVisible();

    // Visit tenant B
    await page.goto('http://tenant-b.localhost:3000/dashboard');
    await expect(page.locator('text=Predictive Analytics')).not.toBeVisible();
    await expect(page.locator('text=Feature Not Available')).toBeVisible();
  });

  test('should cache data per tenant', async ({ page }) => {
    let apiCallCount = 0;

    await page.route('**/api/tenants/tenant-a/dashboard**', async route => {
      apiCallCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'tenant-a',
          name: 'Tenant A',
          data: { revenue: 100000 },
        }),
      });
    });

    // First visit to tenant A
    await page.goto('http://tenant-a.localhost:3000/dashboard');
    await expect(page.locator('h1')).toContainText('Tenant A');
    expect(apiCallCount).toBe(1);

    // Navigate away and back
    await page.goto('http://tenant-a.localhost:3000/inventory');
    await page.goto('http://tenant-a.localhost:3000/dashboard');

    // Should use cache, no additional API call
    expect(apiCallCount).toBe(1);
  });

  test('should clear cache when switching tenants', async ({ page }) => {
    let tenantACallCount = 0;
    let tenantBCallCount = 0;

    await page.route('**/api/tenants/tenant-a/dashboard**', async route => {
      tenantACallCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'tenant-a',
          name: 'Tenant A',
        }),
      });
    });

    await page.route('**/api/tenants/tenant-b/dashboard**', async route => {
      tenantBCallCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'tenant-b',
          name: 'Tenant B',
        }),
      });
    });

    // Visit tenant A
    await page.goto('http://tenant-a.localhost:3000/dashboard');
    expect(tenantACallCount).toBe(1);

    // Visit tenant B
    await page.goto('http://tenant-b.localhost:3000/dashboard');
    expect(tenantBCallCount).toBe(1);

    // Return to tenant A - should make new API call
    await page.goto('http://tenant-a.localhost:3000/dashboard');
    expect(tenantACallCount).toBe(2);
  });
});
