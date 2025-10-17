// Documentation: /docs/responsive-design/responsive-utils-tests.md

import {
  getResponsiveClasses,
  getResponsiveSpacing,
  getResponsiveFontSize,
  getDeviceConfig,
  getTouchTargetClass,
  getResponsiveGridCols,
  getResponsiveContainerClass,
  getResponsiveVisibility,
  getResponsiveImageSizes,
  isBreakpointUp,
  isBreakpointDown,
  getResponsiveValue,
  getResponsiveArrayValue,
  getResponsiveMediaQuery,
  getResponsiveAnimation,
  getResponsiveZIndex,
  getResponsiveShadow,
  getResponsiveBorderRadius
} from '@/lib/responsive-utils';

describe('Responsive Utility Functions', () => {
  describe('getResponsiveClasses', () => {
    it('should generate responsive classes correctly', () => {
      const result = getResponsiveClasses(
        'base-class',
        'mobile-class',
        'tablet-class',
        'desktop-class',
        'large-desktop-class'
      );
      
      expect(result).toBe('base-class sm:mobile-class md:tablet-class lg:desktop-class xl:large-desktop-class');
    });

    it('should handle missing classes', () => {
      const result = getResponsiveClasses('base-class', 'mobile-class');
      
      expect(result).toBe('base-class sm:mobile-class');
    });
  });

  describe('getResponsiveSpacing', () => {
    it('should return correct spacing for mobile', () => {
      const result = getResponsiveSpacing(375, 'md');
      expect(result).toBe(16);
    });

    it('should return correct spacing for tablet', () => {
      const result = getResponsiveSpacing(768, 'md');
      expect(result).toBe(24);
    });

    it('should return correct spacing for desktop', () => {
      const result = getResponsiveSpacing(1024, 'md');
      expect(result).toBe(32);
    });
  });

  describe('getResponsiveFontSize', () => {
    it('should scale font size for mobile', () => {
      const result = getResponsiveFontSize(375, 16);
      expect(result).toBe(18); // 16 * 1.125
    });

    it('should scale font size for tablet', () => {
      const result = getResponsiveFontSize(768, 16);
      expect(result).toBe(19.2); // 16 * 1.2
    });

    it('should scale font size for desktop', () => {
      const result = getResponsiveFontSize(1024, 16);
      expect(result).toBe(20); // 16 * 1.25
    });
  });

  describe('getDeviceConfig', () => {
    it('should return mobile config', () => {
      const result = getDeviceConfig(375);
      expect(result.name).toBe('mobile');
      expect(result.minWidth).toBe(320);
      expect(result.maxWidth).toBe(767);
    });

    it('should return tablet config', () => {
      const result = getDeviceConfig(768);
      expect(result.name).toBe('tablet');
      expect(result.minWidth).toBe(768);
      expect(result.maxWidth).toBe(1023);
    });

    it('should return desktop config', () => {
      const result = getDeviceConfig(1024);
      expect(result.name).toBe('desktop');
      expect(result.minWidth).toBe(1024);
      expect(result.maxWidth).toBe(1439);
    });
  });

  describe('getTouchTargetClass', () => {
    it('should return minimum touch target class', () => {
      const result = getTouchTargetClass('minimum');
      expect(result).toBe('min-h-[44px] min-w-[44px]');
    });

    it('should return comfortable touch target class', () => {
      const result = getTouchTargetClass('comfortable');
      expect(result).toBe('min-h-[48px] min-w-[48px]');
    });

    it('should return large touch target class', () => {
      const result = getTouchTargetClass('large');
      expect(result).toBe('min-h-[56px] min-w-[56px]');
    });
  });

  describe('getResponsiveGridCols', () => {
    it('should return mobile grid columns', () => {
      const result = getResponsiveGridCols(375, 1, 2, 3);
      expect(result).toBe('grid-cols-1');
    });

    it('should return tablet grid columns', () => {
      const result = getResponsiveGridCols(768, 1, 2, 3);
      expect(result).toBe('grid-cols-2');
    });

    it('should return desktop grid columns', () => {
      const result = getResponsiveGridCols(1024, 1, 2, 3);
      expect(result).toBe('grid-cols-3');
    });
  });

  describe('getResponsiveContainerClass', () => {
    it('should return mobile container class', () => {
      const result = getResponsiveContainerClass(375);
      expect(result).toBe('w-full px-4');
    });

    it('should return desktop container class', () => {
      const result = getResponsiveContainerClass(1024);
      expect(result).toBe('max-w-1200 mx-auto px-4');
    });
  });

  describe('getResponsiveVisibility', () => {
    it('should hide on mobile when specified', () => {
      const result = getResponsiveVisibility(375, true, false, false);
      expect(result).toBe('hidden');
    });

    it('should hide on tablet when specified', () => {
      const result = getResponsiveVisibility(768, false, true, false);
      expect(result).toBe('hidden');
    });

    it('should hide on desktop when specified', () => {
      const result = getResponsiveVisibility(1024, false, false, true);
      expect(result).toBe('hidden');
    });

    it('should not hide when not specified', () => {
      const result = getResponsiveVisibility(375, false, false, false);
      expect(result).toBe('');
    });
  });

  describe('getResponsiveImageSizes', () => {
    it('should return mobile image sizes', () => {
      const result = getResponsiveImageSizes(375);
      expect(result).toBe('(max-width: 768px) 100vw, 50vw');
    });

    it('should return tablet image sizes', () => {
      const result = getResponsiveImageSizes(768);
      expect(result).toBe('(max-width: 1024px) 50vw, 33vw');
    });

    it('should return desktop image sizes', () => {
      const result = getResponsiveImageSizes(1024);
      expect(result).toBe('33vw');
    });
  });

  describe('isBreakpointUp', () => {
    it('should return true for larger breakpoints', () => {
      expect(isBreakpointUp(1024, 'mobile')).toBe(true);
      expect(isBreakpointUp(1024, 'tablet')).toBe(true);
      expect(isBreakpointUp(1024, 'desktop')).toBe(true);
    });

    it('should return false for smaller breakpoints', () => {
      expect(isBreakpointUp(375, 'tablet')).toBe(false);
      expect(isBreakpointUp(375, 'desktop')).toBe(false);
    });
  });

  describe('isBreakpointDown', () => {
    it('should return true for smaller breakpoints', () => {
      expect(isBreakpointDown(375, 'tablet')).toBe(true);
      expect(isBreakpointDown(375, 'desktop')).toBe(true);
    });

    it('should return false for larger breakpoints', () => {
      expect(isBreakpointDown(1024, 'mobile')).toBe(false);
      expect(isBreakpointDown(1024, 'tablet')).toBe(false);
    });
  });

  describe('getResponsiveValue', () => {
    it('should return mobile value', () => {
      const result = getResponsiveValue(375, 'mobile', 'tablet', 'desktop');
      expect(result).toBe('mobile');
    });

    it('should return tablet value', () => {
      const result = getResponsiveValue(768, 'mobile', 'tablet', 'desktop');
      expect(result).toBe('tablet');
    });

    it('should return desktop value', () => {
      const result = getResponsiveValue(1024, 'mobile', 'tablet', 'desktop');
      expect(result).toBe('desktop');
    });

    it('should return large desktop value when provided', () => {
      const result = getResponsiveValue(1440, 'mobile', 'tablet', 'desktop', 'large-desktop');
      expect(result).toBe('large-desktop');
    });
  });

  describe('getResponsiveArrayValue', () => {
    it('should return correct array value for each breakpoint', () => {
      const values = ['mobile', 'tablet', 'desktop', 'large-desktop'] as const;
      
      expect(getResponsiveArrayValue(375, values)).toBe('mobile');
      expect(getResponsiveArrayValue(768, values)).toBe('tablet');
      expect(getResponsiveArrayValue(1024, values)).toBe('desktop');
      expect(getResponsiveArrayValue(1440, values)).toBe('large-desktop');
    });

    it('should fallback to desktop value for large desktop when not provided', () => {
      const values = ['mobile', 'tablet', 'desktop'] as const;
      expect(getResponsiveArrayValue(1440, values)).toBe('desktop');
    });
  });

  describe('getResponsiveMediaQuery', () => {
    it('should return correct media query for mobile', () => {
      const result = getResponsiveMediaQuery('mobile');
      expect(result).toBe('(min-width: 320px) and (max-width: 767px)');
    });

    it('should return correct media query for tablet', () => {
      const result = getResponsiveMediaQuery('tablet');
      expect(result).toBe('(min-width: 768px) and (max-width: 1023px)');
    });
  });

  describe('getResponsiveAnimation', () => {
    it('should return no animation for reduced motion', () => {
      const result = getResponsiveAnimation(375, true);
      expect(result).toBe('transition-none');
    });

    it('should return mobile animation', () => {
      const result = getResponsiveAnimation(375, false);
      expect(result).toBe('transition-all duration-200 ease-out');
    });

    it('should return desktop animation', () => {
      const result = getResponsiveAnimation(1024, false);
      expect(result).toBe('transition-all duration-300 ease-out');
    });
  });

  describe('getResponsiveZIndex', () => {
    it('should return higher z-index for mobile', () => {
      const result = getResponsiveZIndex(375, 10);
      expect(result).toBe(15);
    });

    it('should return standard z-index for desktop', () => {
      const result = getResponsiveZIndex(1024, 10);
      expect(result).toBe(10);
    });
  });

  describe('getResponsiveShadow', () => {
    it('should return enhanced shadow for mobile', () => {
      const result = getResponsiveShadow(375, 'sm');
      expect(result).toBe('shadow-md');
    });

    it('should return standard shadow for desktop', () => {
      const result = getResponsiveShadow(1024, 'sm');
      expect(result).toBe('shadow-sm');
    });
  });

  describe('getResponsiveBorderRadius', () => {
    it('should return enhanced border radius for mobile', () => {
      const result = getResponsiveBorderRadius(375, 'sm');
      expect(result).toBe('rounded-md');
    });

    it('should return standard border radius for desktop', () => {
      const result = getResponsiveBorderRadius(1024, 'sm');
      expect(result).toBe('rounded-sm');
    });
  });
});
