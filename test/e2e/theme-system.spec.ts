// Documentation: /docs/comprehensive-theming-system/theme-system-e2e-tests.md

import { test, expect } from '@playwright/test';

test.describe('Theme System E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the application to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Theme Application', () => {
    test('should apply theme and update UI elements', async ({ page }) => {
      // Navigate to settings page
      await page.click('[data-testid="settings-link"]');
      await page.waitForLoadState('networkidle');

      // Navigate to branding settings
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Select a theme preset
      await page.click('[data-testid="theme-preset-corporate-blue"]');
      await page.waitForTimeout(500); // Wait for theme application

      // Verify theme is applied by checking CSS variables
      const primaryColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
          .trim();
      });

      expect(primaryColor).toBe('#3b82f6');

      // Verify UI elements are updated
      const button = page.locator('[data-testid="primary-button"]').first();
      const buttonColor = await button.evaluate((el) => {
        return getComputedStyle(el).backgroundColor;
      });

      expect(buttonColor).toBe('rgb(59, 130, 246)'); // #3b82f6 in RGB
    });

    test('should apply custom theme customizations', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Select a theme preset
      await page.click('[data-testid="theme-preset-corporate-blue"]');
      await page.waitForTimeout(500);

      // Navigate to customize tab
      await page.click('[data-testid="customize-tab"]');
      await page.waitForLoadState('networkidle');

      // Customize primary color
      await page.fill('[data-testid="primary-color-input"]', '#ff0000');
      await page.click('[data-testid="apply-customization"]');
      await page.waitForTimeout(500);

      // Verify customization is applied
      const primaryColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
          .trim();
      });

      expect(primaryColor).toBe('#ff0000');
    });

    test('should persist theme across page reloads', async ({ page }) => {
      // Apply a theme
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.click('[data-testid="theme-preset-creative-red"]');
      await page.waitForTimeout(500);

      // Verify theme is applied
      const primaryColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
          .trim();
      });

      expect(primaryColor).toBe('#ef4444');

      // Reload the page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Verify theme is still applied
      const primaryColorAfterReload = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
          .trim();
      });

      expect(primaryColorAfterReload).toBe('#ef4444');
    });
  });

  test.describe('Theme Validation', () => {
    test('should validate theme and show warnings', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Navigate to customize tab
      await page.click('[data-testid="customize-tab"]');
      await page.waitForLoadState('networkidle');

      // Set invalid color combination (low contrast)
      await page.fill('[data-testid="text-color-input"]', '#ffffff');
      await page.fill('[data-testid="background-color-input"]', '#ffffff');
      await page.click('[data-testid="validate-theme"]');

      // Verify validation warnings are shown
      const warningMessage = await page.textContent('[data-testid="validation-warning"]');
      expect(warningMessage).toContain('contrast');
    });

    test('should auto-fix theme issues when enabled', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Enable auto-fix
      await page.check('[data-testid="auto-fix-enabled"]');

      // Navigate to customize tab
      await page.click('[data-testid="customize-tab"]');
      await page.waitForLoadState('networkidle');

      // Set invalid color combination
      await page.fill('[data-testid="text-color-input"]', '#ffffff');
      await page.fill('[data-testid="background-color-input"]', '#ffffff');
      await page.click('[data-testid="apply-customization"]');
      await page.waitForTimeout(500);

      // Verify auto-fix was applied
      const textColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-text')
          .trim();
      });

      expect(textColor).not.toBe('#ffffff');
    });
  });

  test.describe('Accessibility Features', () => {
    test('should apply high contrast theme when enabled', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Enable high contrast
      await page.check('[data-testid="high-contrast-enabled"]');
      await page.waitForTimeout(500);

      // Verify high contrast is applied
      const textColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-text')
          .trim();
      });

      const backgroundColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-background')
          .trim();
      });

      expect(textColor).toBe('#000000');
      expect(backgroundColor).toBe('#ffffff');
    });

    test('should respect reduced motion preferences', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Enable reduced motion
      await page.check('[data-testid="reduced-motion-enabled"]');
      await page.waitForTimeout(500);

      // Verify reduced motion is applied
      const animationDuration = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--animation-duration-normal')
          .trim();
      });

      expect(animationDuration).toBe('0ms');
    });

    test('should scale font sizes when enabled', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Set font size scale
      await page.fill('[data-testid="font-size-scale"]', '1.5');
      await page.click('[data-testid="apply-font-scale"]');
      await page.waitForTimeout(500);

      // Verify font size is scaled
      const fontSize = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--font-size-base')
          .trim();
      });

      expect(fontSize).toBe('1.5rem');
    });
  });

  test.describe('Advanced Features', () => {
    test('should apply dark mode theme', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Enable dark mode
      await page.check('[data-testid="dark-mode-enabled"]');
      await page.waitForTimeout(500);

      // Verify dark mode is applied
      const backgroundColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-background')
          .trim();
      });

      expect(backgroundColor).toBe('#111827');
    });

    test('should apply responsive theme changes', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Enable responsive themes
      await page.check('[data-testid="responsive-themes-enabled"]');
      await page.waitForTimeout(500);

      // Change viewport to mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      // Verify responsive theme is applied
      const fontSize = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--font-size-base')
          .trim();
      });

      expect(fontSize).toBe('1rem'); // Mobile font size
    });

    test('should apply seasonal theme when enabled', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Enable seasonal themes
      await page.check('[data-testid="seasonal-themes-enabled"]');
      await page.waitForTimeout(500);

      // Select spring theme
      await page.selectOption('[data-testid="seasonal-theme-select"]', 'spring');
      await page.waitForTimeout(500);

      // Verify spring theme is applied
      const primaryColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
          .trim();
      });

      expect(primaryColor).toBe('#10b981');
    });
  });

  test.describe('Export/Import', () => {
    test('should export theme configuration', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Apply a theme
      await page.click('[data-testid="theme-preset-corporate-blue"]');
      await page.waitForTimeout(500);

      // Navigate to customize tab
      await page.click('[data-testid="customize-tab"]');
      await page.waitForLoadState('networkidle');

      // Make customizations
      await page.fill('[data-testid="primary-color-input"]', '#ff0000');
      await page.click('[data-testid="apply-customization"]');
      await page.waitForTimeout(500);

      // Export theme
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-testid="export-theme"]');
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toContain('theme');
    });

    test('should import theme configuration', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Import theme
      await page.setInputFiles('[data-testid="import-theme-input"]', 'test/fixtures/test-theme.json');
      await page.click('[data-testid="import-theme"]');
      await page.waitForTimeout(500);

      // Verify theme is imported and applied
      const primaryColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
          .trim();
      });

      expect(primaryColor).toBe('#ff0000');
    });
  });

  test.describe('Performance', () => {
    test('should apply theme within performance thresholds', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Measure theme application time
      const startTime = await page.evaluate(() => performance.now());

      await page.click('[data-testid="theme-preset-corporate-blue"]');
      await page.waitForTimeout(500);

      const endTime = await page.evaluate(() => performance.now());
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle multiple rapid theme changes', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Apply multiple themes rapidly
      const themes = [
        'theme-preset-corporate-blue',
        'theme-preset-creative-red',
        'theme-preset-modern-green',
        'theme-preset-elegant-purple',
      ];

      for (const theme of themes) {
        await page.click(`[data-testid="${theme}"]`);
        await page.waitForTimeout(100);
      }

      // Verify final theme is applied
      const primaryColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
          .trim();
      });

      expect(primaryColor).toBe('#8b5cf6'); // Elegant purple
    });
  });

  test.describe('Error Handling', () => {
    test('should handle theme application errors gracefully', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Mock network failure
      await page.route('**/api/themes/**', route => route.abort());

      // Try to apply theme
      await page.click('[data-testid="theme-preset-corporate-blue"]');
      await page.waitForTimeout(500);

      // Verify error message is shown
      const errorMessage = await page.textContent('[data-testid="theme-error"]');
      expect(errorMessage).toContain('error');
    });

    test('should recover from theme application errors', async ({ page }) => {
      // Navigate to branding settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Mock network failure
      await page.route('**/api/themes/**', route => route.abort());

      // Try to apply theme
      await page.click('[data-testid="theme-preset-corporate-blue"]');
      await page.waitForTimeout(500);

      // Restore network
      await page.unroute('**/api/themes/**');

      // Try to apply theme again
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

  test.describe('Multi-tenant Support', () => {
    test('should apply tenant-specific themes', async ({ page }) => {
      // Navigate to tenant selection
      await page.goto('/tenant-selection');
      await page.waitForLoadState('networkidle');

      // Select a tenant
      await page.click('[data-testid="tenant-company-a"]');
      await page.waitForLoadState('networkidle');

      // Navigate to settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

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

      // Switch to another tenant
      await page.goto('/tenant-selection');
      await page.click('[data-testid="tenant-company-b"]');
      await page.waitForLoadState('networkidle');

      // Navigate to settings
      await page.click('[data-testid="settings-link"]');
      await page.click('[data-testid="branding-settings-tab"]');
      await page.waitForLoadState('networkidle');

      // Apply different theme
      await page.click('[data-testid="theme-preset-creative-red"]');
      await page.waitForTimeout(500);

      // Verify different theme is applied
      const primaryColorB = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-primary')
          .trim();
      });

      expect(primaryColorB).toBe('#ef4444');
    });
  });
});
