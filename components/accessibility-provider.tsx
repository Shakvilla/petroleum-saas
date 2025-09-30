'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  useReducedMotion,
  useHighContrast,
  useScreenReader,
} from '@/hooks/utils/use-accessibility';

interface AccessibilityContextType {
  prefersReducedMotion: boolean;
  isHighContrast: boolean;
  isScreenReaderActive: boolean;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      'useAccessibility must be used within an AccessibilityProvider'
    );
  }
  return context;
}

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  const prefersReducedMotion = useReducedMotion();
  const isHighContrast = useHighContrast();
  const { isScreenReaderActive } = useScreenReader();

  const [customHighContrast, setCustomHighContrast] = useState(false);
  const [customReducedMotion, setCustomReducedMotion] = useState(false);

  // Apply accessibility preferences to document
  useEffect(() => {
    const root = document.documentElement;

    if (prefersReducedMotion || customReducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (isHighContrast || customHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [
    prefersReducedMotion,
    customReducedMotion,
    isHighContrast,
    customHighContrast,
  ]);

  const value: AccessibilityContextType = {
    prefersReducedMotion: prefersReducedMotion || customReducedMotion,
    isHighContrast: isHighContrast || customHighContrast,
    isScreenReaderActive,
    setHighContrast: setCustomHighContrast,
    setReducedMotion: setCustomReducedMotion,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Accessibility utilities component
export function AccessibilityUtilities() {
  const {
    setHighContrast,
    setReducedMotion,
    isHighContrast,
    prefersReducedMotion,
  } = useAccessibility();

  return (
    <div className="accessibility-utilities">
      <button
        onClick={() => setHighContrast(!isHighContrast)}
        className="accessibility-toggle"
        aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
      >
        {isHighContrast ? '🔆' : '🌙'} High Contrast
      </button>

      <button
        onClick={() => setReducedMotion(!prefersReducedMotion)}
        className="accessibility-toggle"
        aria-label={`${prefersReducedMotion ? 'Enable' : 'Disable'} animations`}
      >
        {prefersReducedMotion ? '▶️' : '⏸️'} Animations
      </button>
    </div>
  );
}

// Skip to main content link
export function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-main"
      onFocus={e => {
        e.target.style.position = 'absolute';
        e.target.style.top = '0';
        e.target.style.left = '0';
        e.target.style.zIndex = '9999';
        e.target.style.padding = '8px 16px';
        e.target.style.backgroundColor = '#000';
        e.target.style.color = '#fff';
        e.target.style.textDecoration = 'none';
      }}
      onBlur={e => {
        e.target.style.position = 'absolute';
        e.target.style.top = '-9999px';
        e.target.style.left = '-9999px';
      }}
    >
      Skip to main content
    </a>
  );
}

// Screen reader only text
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

// Focus indicator component
export function FocusIndicator({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`focus-indicator ${className}`}>{children}</div>;
}
