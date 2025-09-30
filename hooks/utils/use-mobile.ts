import { useEffect, useState } from 'react';

// Hook to detect mobile devices
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      
      // Check for mobile devices
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent) || width < 768;
      
      // Check for tablet devices
      const isTabletDevice = width >= 768 && width < 1024;
      
      // Check for desktop devices
      const isDesktopDevice = width >= 1024;
      
      setIsMobile(isMobileDevice);
      setIsTablet(isTabletDevice);
      setIsDesktop(isDesktopDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
}

// Hook to detect touch devices
export function useTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
  }, []);

  return isTouch;
}

// Hook to detect device orientation
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return orientation;
}

// Hook to detect viewport size
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
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
