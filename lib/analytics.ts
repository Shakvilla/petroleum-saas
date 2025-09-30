// Analytics and monitoring utilities

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface ErrorEvent {
  message: string;
  stack?: string;
  url?: string;
  lineNumber?: number;
  columnNumber?: number;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

class Analytics {
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private errorEvents: ErrorEvent[] = [];
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initialize();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    // Initialize session
    this.sessionId =
      localStorage.getItem('analytics_session_id') || this.generateSessionId();
    localStorage.setItem('analytics_session_id', this.sessionId);

    // Get user ID from auth store if available
    try {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        const parsed = JSON.parse(authData);
        this.userId = parsed.state?.user?.id;
      }
    } catch (error) {
      console.warn('Failed to parse auth data for analytics:', error);
    }

    // Set up error tracking
    this.setupErrorTracking();

    // Set up performance tracking
    this.setupPerformanceTracking();

    // Set up page view tracking
    this.setupPageViewTracking();

    this.isInitialized = true;
  }

  private setupErrorTracking() {
    // Global error handler
    window.addEventListener('error', event => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        timestamp: Date.now(),
        userId: this.userId,
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', event => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: Date.now(),
        userId: this.userId,
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
      });
    });
  }

  private setupPerformanceTracking() {
    // Track page load performance
    if (window.performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType(
            'navigation'
          )[0] as PerformanceNavigationTiming;

          if (navigation) {
            this.trackPerformance(
              'page_load_time',
              navigation.loadEventEnd - navigation.fetchStart,
              'ms'
            );
            this.trackPerformance(
              'dom_content_loaded',
              navigation.domContentLoadedEventEnd - navigation.fetchStart,
              'ms'
            );
            this.trackPerformance(
              'first_byte',
              navigation.responseStart - navigation.fetchStart,
              'ms'
            );
          }

          // Track Core Web Vitals
          this.trackWebVitals();
        }, 0);
      });
    }
  }

  private async trackWebVitals() {
    try {
      // @ts-ignore
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import(
        'web-vitals'
      );

      getCLS((metric: { value: number }) => {
        this.trackPerformance('cumulative_layout_shift', metric.value, 'score');
      });

      getFID((metric: { value: number }) => {
        this.trackPerformance('first_input_delay', metric.value, 'ms');
      });

      getFCP((metric: { value: number }) => {
        this.trackPerformance('first_contentful_paint', metric.value, 'ms');
      });

      getLCP((metric: { value: number }) => {
        this.trackPerformance('largest_contentful_paint', metric.value, 'ms');
      });

      getTTFB((metric: { value: number }) => {
        this.trackPerformance('time_to_first_byte', metric.value, 'ms');
      });
    } catch (error) {
      console.warn('Failed to load web-vitals:', error);
    }
  }

  private setupPageViewTracking() {
    // Track initial page view
    this.trackPageView();

    // Track route changes (for SPA)
    if (typeof window !== 'undefined') {
      let currentPath = window.location.pathname;

      const observer = new MutationObserver(() => {
        if (window.location.pathname !== currentPath) {
          currentPath = window.location.pathname;
          this.trackPageView();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  // Public methods
  track(eventName: string, properties?: Record<string, any>) {
    if (!this.isInitialized) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  trackPageView(path?: string) {
    const currentPath =
      path || (typeof window !== 'undefined' ? window.location.pathname : '/');

    this.track('page_view', {
      path: currentPath,
      title: typeof document !== 'undefined' ? document.title : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    });
  }

  trackPerformance(
    name: string,
    value: number,
    unit: string,
    metadata?: Record<string, any>
  ) {
    if (!this.isInitialized) return;

    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      metadata,
    };

    this.performanceMetrics.push(metric);
    this.sendPerformanceMetric(metric);
  }

  trackError(error: ErrorEvent) {
    if (!this.isInitialized) return;

    this.errorEvents.push(error);
    this.sendError(error);
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  // Send methods (implement based on your analytics service)
  private async sendEvent(event: AnalyticsEvent) {
    try {
      // Send to your analytics service
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  private async sendPerformanceMetric(metric: PerformanceMetric) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  private async sendError(error: ErrorEvent) {
    try {
      await fetch('/api/analytics/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });
    } catch (error) {
      console.warn('Failed to send error event:', error);
    }
  }

  // Get methods for debugging
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  getErrorEvents(): ErrorEvent[] {
    return [...this.errorEvents];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getUserId(): string | undefined {
    return this.userId;
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Convenience functions
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  analytics.track(eventName, properties);
};

export const trackPageView = (path?: string) => {
  analytics.trackPageView(path);
};

export const trackPerformance = (
  name: string,
  value: number,
  unit: string,
  metadata?: Record<string, any>
) => {
  analytics.trackPerformance(name, value, unit, metadata);
};

export const trackError = (error: ErrorEvent) => {
  analytics.trackError(error);
};

export const setUserId = (userId: string) => {
  analytics.setUserId(userId);
};

// React hook for analytics
export const useAnalytics = () => {
  return {
    track: trackEvent,
    trackPageView,
    trackPerformance,
    trackError,
    setUserId,
    getSessionId: () => analytics.getSessionId(),
    getUserId: () => analytics.getUserId(),
  };
};
