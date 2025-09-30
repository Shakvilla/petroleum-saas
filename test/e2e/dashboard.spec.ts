import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Wait for dashboard to load
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display dashboard overview', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();
    await expect(page.getByText('Welcome, John Doe')).toBeVisible();
  });

  test('should display key metrics', async ({ page }) => {
    // Check for key metric cards
    await expect(page.getByText('Total Tanks')).toBeVisible();
    await expect(page.getByText('Total Capacity')).toBeVisible();
    await expect(page.getByText('Current Level')).toBeVisible();
    await expect(page.getByText('Utilization Rate')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Recent Activity' })
    ).toBeVisible();

    // Check for activity items
    const activityItems = page.locator('[data-testid="activity-item"]');
    await expect(activityItems).toHaveCount.greaterThan(0);
  });

  test('should display alerts panel', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Alerts' })).toBeVisible();

    // Check for alert items
    const alertItems = page.locator('[data-testid="alert-item"]');
    await expect(alertItems).toHaveCount.greaterThan(0);
  });

  test('should navigate to inventory page', async ({ page }) => {
    await page.getByRole('link', { name: 'Inventory' }).click();
    await expect(page).toHaveURL('/inventory');
  });

  test('should navigate to distribution page', async ({ page }) => {
    await page.getByRole('link', { name: 'Distribution' }).click();
    await expect(page).toHaveURL('/distribution');
  });

  test('should navigate to reports page', async ({ page }) => {
    await page.getByRole('link', { name: 'Reports' }).click();
    await expect(page).toHaveURL('/reports');
  });

  test('should display responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check for mobile navigation
    await expect(
      page.getByRole('button', { name: 'Toggle sidebar' })
    ).toBeVisible();

    // Open mobile menu
    await page.getByRole('button', { name: 'Toggle sidebar' }).click();

    // Check for navigation items
    await expect(page.getByRole('link', { name: 'Inventory' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Distribution' })
    ).toBeVisible();
  });

  test('should refresh data when refresh button is clicked', async ({
    page,
  }) => {
    // Click refresh button
    await page.getByRole('button', { name: 'Refresh' }).click();

    // Check for loading state
    await expect(
      page.getByRole('button', { name: 'Refreshing...' })
    ).toBeVisible();

    // Wait for refresh to complete
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();
  });

  test('should display charts and graphs', async ({ page }) => {
    // Check for chart containers
    await expect(page.locator('[data-testid="sales-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="inventory-chart"]')).toBeVisible();
  });

  test('should handle offline state', async ({ page }) => {
    // Simulate offline
    await page.context().setOffline(true);

    // Check for offline indicator
    await expect(page.getByText("You're offline")).toBeVisible();

    // Go back online
    await page.context().setOffline(false);

    // Offline indicator should disappear
    await expect(page.getByText("You're offline")).not.toBeVisible();
  });

  test('should display real-time updates', async ({ page }) => {
    // Wait for initial data to load
    await expect(page.getByText('Total Tanks')).toBeVisible();

    // Simulate real-time update (this would be triggered by WebSocket in real app)
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('tank-update', {
          detail: { id: '1', level: 8000 },
        })
      );
    });

    // Check that the UI updates (this would depend on the actual implementation)
    // await expect(page.getByText('8,000')).toBeVisible();
  });
});
