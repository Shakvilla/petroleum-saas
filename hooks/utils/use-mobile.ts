import { useEffect, useState } from 'react';
import { getBreakpoint, isMobile, isTablet, isDesktop, isLargeDesktop } from '@/lib/responsive-config';

// Enhanced hook to detect mobile devices with responsive system integration
export function useMobile() {
  const [deviceState, setDeviceState] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    breakpoint: 'desktop' as string,
    userAgent: '',
    isTouchDevice: false
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      const breakpoint = getBreakpoint(width);
      
      // Enhanced mobile detection combining viewport and user agent
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent) || width < 768;
      
      // Use responsive system for breakpoint detection
      const isTabletDevice = isTablet(width);
      const isDesktopDevice = isDesktop(width);
      const isLargeDesktopDevice = isLargeDesktop(width);
      
      // Touch device detection
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setDeviceState({
        isMobile: isMobileDevice,
        isTablet: isTabletDevice,
        isDesktop: isDesktopDevice,
        isLargeDesktop: isLargeDesktopDevice,
        breakpoint,
        userAgent,
        isTouchDevice
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return {
    isMobile: deviceState.isMobile,
    isTablet: deviceState.isTablet,
    isDesktop: deviceState.isDesktop,
    isLargeDesktop: deviceState.isLargeDesktop,
    breakpoint: deviceState.breakpoint,
    userAgent: deviceState.userAgent,
    isTouchDevice: deviceState.isTouchDevice,
    // Convenience methods
    isMobileOrTablet: deviceState.isMobile || deviceState.isTablet,
    isDesktopOrLarger: deviceState.isDesktop || deviceState.isLargeDesktop
  };
}

// Enhanced hook to detect touch devices with capabilities
export function useTouch() {
  const [touchState, setTouchState] = useState({
    isTouch: false,
    maxTouchPoints: 0,
    hasHover: false,
    hasPointer: false
  });

  useEffect(() => {
    const checkTouch = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const maxTouchPoints = navigator.maxTouchPoints || 0;
      const hasHover = window.matchMedia('(hover: hover)').matches;
      const hasPointer = window.matchMedia('(pointer: fine)').matches;

      setTouchState({
        isTouch,
        maxTouchPoints,
        hasHover,
        hasPointer
      });
    };

    checkTouch();
    
    // Listen for changes in media queries
    const hoverMediaQuery = window.matchMedia('(hover: hover)');
    const pointerMediaQuery = window.matchMedia('(pointer: fine)');
    
    hoverMediaQuery.addEventListener('change', checkTouch);
    pointerMediaQuery.addEventListener('change', checkTouch);

    return () => {
      hoverMediaQuery.removeEventListener('change', checkTouch);
      pointerMediaQuery.removeEventListener('change', checkTouch);
    };
  }, []);

  return {
    isTouch: touchState.isTouch,
    maxTouchPoints: touchState.maxTouchPoints,
    hasHover: touchState.hasHover,
    hasPointer: touchState.hasPointer,
    // Convenience methods
    isTouchOnly: touchState.isTouch && !touchState.hasHover,
    isMouseAndTouch: touchState.isTouch && touchState.hasHover
  };
}

// Enhanced hook to detect device orientation with responsive integration
export function useOrientation() {
  const [orientationState, setOrientationState] = useState({
    orientation: 'portrait' as 'portrait' | 'landscape',
    angle: 0,
    isPortrait: true,
    isLandscape: false,
    width: 0,
    height: 0
  });

  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = height > width ? 'portrait' : 'landscape';
      const angle = window.screen?.orientation?.angle || 0;
      
      setOrientationState({
        orientation,
        angle,
        isPortrait: orientation === 'portrait',
        isLandscape: orientation === 'landscape',
        width,
        height
      });
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Listen for screen orientation changes if available
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', checkOrientation);
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', checkOrientation);
      }
    };
  }, []);

  return {
    orientation: orientationState.orientation,
    angle: orientationState.angle,
    isPortrait: orientationState.isPortrait,
    isLandscape: orientationState.isLandscape,
    width: orientationState.width,
    height: orientationState.height
  };
}

// Enhanced hook to detect viewport size with responsive integration
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    aspectRatio: 0,
    breakpoint: 'desktop' as string,
    isSmall: false,
    isMedium: false,
    isLarge: false
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      const breakpoint = getBreakpoint(width);
      
      setViewport({
        width,
        height,
        aspectRatio,
        breakpoint,
        isSmall: width < 768,
        isMedium: width >= 768 && width < 1024,
        isLarge: width >= 1024
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  return viewport;
}

// Hook to detect safe area insets
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
    };
  }, []);

  return safeArea;
}

// Hook to detect device capabilities
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    hasCamera: false,
    hasMicrophone: false,
    hasGeolocation: false,
    hasNotifications: false,
    hasVibration: false,
    hasOrientation: false,
    hasMotion: false,
  });

  useEffect(() => {
    const checkCapabilities = async () => {
      const newCapabilities = {
        hasCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
        hasMicrophone: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
        hasGeolocation: 'geolocation' in navigator,
        hasNotifications: 'Notification' in window,
        hasVibration: 'vibrate' in navigator,
        hasOrientation: 'DeviceOrientationEvent' in window,
        hasMotion: 'DeviceMotionEvent' in window,
      };

      setCapabilities(newCapabilities);
    };

    checkCapabilities();
  }, []);

  return capabilities;
}

// Hook to detect network status
export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: navigator.onLine,
    effectiveType: '4g' as 'slow-2g' | '2g' | '3g' | '4g',
    downlink: 0,
    rtt: 0,
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      if (connection) {
        setNetworkStatus({
          isOnline: navigator.onLine,
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
        });
      } else {
        setNetworkStatus(prev => ({
          ...prev,
          isOnline: navigator.onLine,
        }));
      }
    };

    updateNetworkStatus();
    
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return networkStatus;
}

// Hook to detect PWA status
export function usePWAStatus() {
  const [pwaStatus, setPwaStatus] = useState({
    isPWA: false,
    isInstallable: false,
    isStandalone: false,
  });

  useEffect(() => {
    const checkPWAStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true;
      
      setPwaStatus({
        isPWA: isStandalone,
        isInstallable: 'serviceWorker' in navigator,
        isStandalone,
      });
    };

    checkPWAStatus();
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkPWAStatus);

    return () => {
      mediaQuery.removeEventListener('change', checkPWAStatus);
    };
  }, []);

  return pwaStatus;
}
