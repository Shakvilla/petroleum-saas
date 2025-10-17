// Documentation: /docs/responsive-design/mobile-detection-tests.md

import { renderHook, act } from '@testing-library/react';
import { 
  useMobile, 
  useTouch, 
  useOrientation, 
  useViewport, 
  useSafeArea,
  useDeviceCapabilities,
  useNetworkStatus,
  usePWAStatus
} from '@/hooks/utils/use-mobile';

// Mock window methods
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockMatchMedia = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: mockRemoveEventListener,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
});

Object.defineProperty(navigator, 'maxTouchPoints', {
  writable: true,
  value: 5,
});

describe('Enhanced Mobile Detection Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    Object.defineProperty(window, 'innerHeight', { value: 768 });
  });

  describe('useMobile', () => {
    it('should detect mobile device correctly', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      
      const { result } = renderHook(() => useMobile());
      
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.breakpoint).toBe('mobile');
      expect(result.current.isTouchDevice).toBe(true);
      expect(result.current.isMobileOrTablet).toBe(true);
    });

    it('should detect tablet device correctly', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      
      const { result } = renderHook(() => useMobile());
      
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.breakpoint).toBe('tablet');
    });

    it('should detect desktop device correctly', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1200 });
      
      const { result } = renderHook(() => useMobile());
      
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.breakpoint).toBe('desktop');
    });

    it('should detect large desktop device correctly', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1440 });
      
      const { result } = renderHook(() => useMobile());
      
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.isLargeDesktop).toBe(true);
      expect(result.current.breakpoint).toBe('largeDesktop');
    });

    it('should handle resize events', () => {
      const { result } = renderHook(() => useMobile());
      
      expect(result.current.isDesktop).toBe(true);
      
      // Simulate resize to mobile
      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 375 });
        const resizeHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'resize'
        )?.[1];
        resizeHandler?.();
      });
      
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isDesktop).toBe(false);
    });
  });

  describe('useTouch', () => {
    it('should detect touch capabilities', () => {
      const { result } = renderHook(() => useTouch());
      
      expect(result.current.isTouch).toBe(true);
      expect(result.current.maxTouchPoints).toBe(5);
      expect(result.current.isTouchOnly).toBeDefined();
      expect(result.current.isMouseAndTouch).toBeDefined();
    });

    it('should handle hover media query changes', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });
      
      const { result } = renderHook(() => useTouch());
      
      expect(result.current.hasHover).toBe(false);
      expect(result.current.isTouchOnly).toBe(true);
    });
  });

  describe('useOrientation', () => {
    it('should detect portrait orientation', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      Object.defineProperty(window, 'innerHeight', { value: 667 });
      
      const { result } = renderHook(() => useOrientation());
      
      expect(result.current.orientation).toBe('portrait');
      expect(result.current.isPortrait).toBe(true);
      expect(result.current.isLandscape).toBe(false);
      expect(result.current.width).toBe(375);
      expect(result.current.height).toBe(667);
    });

    it('should detect landscape orientation', () => {
      Object.defineProperty(window, 'innerWidth', { value: 667 });
      Object.defineProperty(window, 'innerHeight', { value: 375 });
      
      const { result } = renderHook(() => useOrientation());
      
      expect(result.current.orientation).toBe('landscape');
      expect(result.current.isPortrait).toBe(false);
      expect(result.current.isLandscape).toBe(true);
    });

    it('should handle orientation changes', () => {
      const { result } = renderHook(() => useOrientation());
      
      expect(result.current.isPortrait).toBe(true);
      
      // Simulate orientation change
      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 667 });
        Object.defineProperty(window, 'innerHeight', { value: 375 });
        const orientationHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'orientationchange'
        )?.[1];
        orientationHandler?.();
      });
      
      expect(result.current.isLandscape).toBe(true);
    });
  });

  describe('useViewport', () => {
    it('should provide viewport dimensions and breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      Object.defineProperty(window, 'innerHeight', { value: 1024 });
      
      const { result } = renderHook(() => useViewport());
      
      expect(result.current.width).toBe(768);
      expect(result.current.height).toBe(1024);
      expect(result.current.aspectRatio).toBe(768 / 1024);
      expect(result.current.breakpoint).toBe('tablet');
      expect(result.current.isSmall).toBe(false);
      expect(result.current.isMedium).toBe(true);
      expect(result.current.isLarge).toBe(false);
    });

    it('should handle viewport changes', () => {
      const { result } = renderHook(() => useViewport());
      
      expect(result.current.isLarge).toBe(true);
      
      // Simulate resize to mobile
      act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 375 });
        Object.defineProperty(window, 'innerHeight', { value: 667 });
        const resizeHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'resize'
        )?.[1];
        resizeHandler?.();
      });
      
      expect(result.current.isSmall).toBe(true);
      expect(result.current.isLarge).toBe(false);
      expect(result.current.breakpoint).toBe('mobile');
    });
  });

  describe('useSafeArea', () => {
    it('should provide safe area insets', () => {
      const mockGetComputedStyle = jest.fn().mockReturnValue({
        getPropertyValue: jest.fn().mockImplementation((prop) => {
          const values = {
            '--safe-area-inset-top': '44px',
            '--safe-area-inset-right': '0px',
            '--safe-area-inset-bottom': '34px',
            '--safe-area-inset-left': '0px'
          };
          return values[prop] || '0px';
        })
      });
      
      Object.defineProperty(window, 'getComputedStyle', {
        value: mockGetComputedStyle
      });
      
      const { result } = renderHook(() => useSafeArea());
      
      expect(result.current.top).toBe(44);
      expect(result.current.right).toBe(0);
      expect(result.current.bottom).toBe(34);
      expect(result.current.left).toBe(0);
    });
  });

  describe('useDeviceCapabilities', () => {
    it('should detect device capabilities', () => {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: jest.fn()
        }
      });
      
      Object.defineProperty(navigator, 'geolocation', {
        value: {}
      });
      
      Object.defineProperty(window, 'Notification', {
        value: {}
      });
      
      Object.defineProperty(navigator, 'vibrate', {
        value: jest.fn()
      });
      
      Object.defineProperty(window, 'DeviceOrientationEvent', {
        value: {}
      });
      
      Object.defineProperty(window, 'DeviceMotionEvent', {
        value: {}
      });
      
      const { result } = renderHook(() => useDeviceCapabilities());
      
      expect(result.current.hasCamera).toBe(true);
      expect(result.current.hasMicrophone).toBe(true);
      expect(result.current.hasGeolocation).toBe(true);
      expect(result.current.hasNotifications).toBe(true);
      expect(result.current.hasVibration).toBe(true);
      expect(result.current.hasOrientation).toBe(true);
      expect(result.current.hasMotion).toBe(true);
    });
  });

  describe('useNetworkStatus', () => {
    it('should provide network status', () => {
      Object.defineProperty(navigator, 'onLine', {
        value: true
      });
      
      Object.defineProperty(navigator, 'connection', {
        value: {
          effectiveType: '4g',
          downlink: 10,
          rtt: 50,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn()
        }
      });
      
      const { result } = renderHook(() => useNetworkStatus());
      
      expect(result.current.isOnline).toBe(true);
      expect(result.current.effectiveType).toBe('4g');
      expect(result.current.downlink).toBe(10);
      expect(result.current.rtt).toBe(50);
    });
  });

  describe('usePWAStatus', () => {
    it('should detect PWA status', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });
      
      Object.defineProperty(navigator, 'serviceWorker', {
        value: {}
      });
      
      const { result } = renderHook(() => usePWAStatus());
      
      expect(result.current.isPWA).toBe(true);
      expect(result.current.isInstallable).toBe(true);
      expect(result.current.isStandalone).toBe(true);
    });
  });
});
