// Documentation: /docs/comprehensive-theming-system/theme-variable-injector.md

'use client';

import React, { useEffect } from 'react';
import { useThemeApplication } from './theme-application-provider';

/**
 * Theme Variable Injector
 * 
 * Automatically injects CSS variables into the document head
 * when theme changes occur.
 */
export function ThemeVariableInjector() {
  const { currentTheme } = useThemeApplication();

  useEffect(() => {
    if (currentTheme && typeof window !== 'undefined') {
      // CSS variables are already injected by the ThemeApplicationProvider
      // This component serves as a placeholder for additional injection logic
      console.log('Theme variables injected for theme:', currentTheme.name);
    }
  }, [currentTheme]);

  // This component doesn't render anything
  return null;
}

/**
 * Dynamic Tailwind Injector
 * 
 * Injects dynamic Tailwind classes based on the current theme.
 */
export function DynamicTailwindInjector() {
  const { currentTheme } = useThemeApplication();

  useEffect(() => {
    if (currentTheme && typeof window !== 'undefined') {
      // Generate dynamic Tailwind classes based on theme
      const dynamicClasses = generateDynamicTailwindClasses(currentTheme);
      
      // Inject classes into document
      injectDynamicClasses(dynamicClasses);
    }
  }, [currentTheme]);

  // This component doesn't render anything
  return null;
}

/**
 * Generate dynamic Tailwind classes from theme
 */
function generateDynamicTailwindClasses(theme: any): string {
  const classes: string[] = [];

  // Color classes
  Object.entries(theme.colors).forEach(([key, value]) => {
    classes.push(`.text-${key} { color: ${value}; }`);
    classes.push(`.bg-${key} { background-color: ${value}; }`);
    classes.push(`.border-${key} { border-color: ${value}; }`);
  });

  // Typography classes
  Object.entries(theme.typography.fontSizes).forEach(([key, value]) => {
    classes.push(`.text-${key} { font-size: ${value}; }`);
  });

  // Spacing classes
  Object.entries(theme.spacing).forEach(([key, value]) => {
    classes.push(`.p-${key} { padding: ${value}; }`);
    classes.push(`.m-${key} { margin: ${value}; }`);
  });

  return classes.join('\n');
}

/**
 * Inject dynamic classes into document
 */
function injectDynamicClasses(classes: string): void {
  if (typeof window === 'undefined') return;

  // Remove existing dynamic style element
  const existingElement = document.getElementById('dynamic-tailwind-classes');
  if (existingElement) {
    document.head.removeChild(existingElement);
  }

  // Create new style element
  const styleElement = document.createElement('style');
  styleElement.id = 'dynamic-tailwind-classes';
  styleElement.textContent = classes;

  // Inject into document head
  document.head.appendChild(styleElement);
}
