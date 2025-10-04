import { useCallback } from 'react';
import { useNotifications } from '@/components/toast-manager';
import { ErrorReportingService } from '@/lib/error-reporting';
import { ErrorLoggingService } from '@/lib/error-logging';
import { ErrorType, type ErrorContext } from '@/types';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export function useErrorHandler() {
  const { showError } = useNotifications();

  const handleError = useCallback(
    (
      error: Error | string,
      context?: Partial<ErrorContext>,
      options: ErrorHandlerOptions = {}
    ) => {
      const {
        showToast = true,
        logError = true,
        fallbackMessage = 'An unexpected error occurred',
      } = options;

      const errorMessage = typeof error === 'string' ? error : error.message;
      const errorType = context?.type || ErrorType.SYSTEM;

      // Log error for debugging
      if (logError) {
        console.error('Error handled:', {
          message: errorMessage,
          type: errorType,
          context,
          stack: typeof error === 'object' ? error.stack : undefined,
          timestamp: new Date().toISOString(),
        });
      }

      // Show user-friendly error message
      if (showToast) {
        let title = 'Error';
        let description = errorMessage || fallbackMessage;

        switch (errorType) {
          case ErrorType.NETWORK:
            title = 'Connection Error';
            description =
              'Please check your internet connection and try again.';
            break;
          case ErrorType.AUTHENTICATION:
            title = 'Authentication Error';
            description = 'Please log in again to continue.';
            break;
          case ErrorType.AUTHORIZATION:
            title = 'Access Denied';
            description = "You don't have permission to perform this action.";
            break;
          case ErrorType.VALIDATION:
            title = 'Validation Error';
            description =
              errorMessage || 'Please check your input and try again.';
            break;
          case ErrorType.BUSINESS_LOGIC:
            title = 'Operation Failed';
            description =
              errorMessage || 'The operation could not be completed.';
            break;
          default:
            title = 'Unexpected Error';
            description = errorMessage || fallbackMessage;
        }

        showError(title, description);
      }

      // Report error to error reporting service
      ErrorReportingService.reportError(
        typeof error === 'string' ? new Error(error) : error,
        {
          component: context?.component || 'useErrorHandler',
          action: context?.action || 'handleError',
          userId: context?.userId,
          tenantId: context?.tenantId,
        },
        {
          errorType,
          context,
        }
      );

      // Log error to error logging service
      ErrorLoggingService.error(
        typeof error === 'string' ? new Error(error) : error,
        {
          component: context?.component || 'useErrorHandler',
          action: context?.action || 'handleError',
          userId: context?.userId,
          tenantId: context?.tenantId,
        },
        {
          errorType,
          context,
        }
      );
    },
    [showError]
  );

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      context?: Partial<ErrorContext>,
      options?: ErrorHandlerOptions
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(
          error instanceof Error ? error : new Error(String(error)),
          context,
          options
        );
        return null;
      }
    },
    [handleError]
  );

  const withErrorHandling = useCallback(
    <T extends any[], R>(
      fn: (...args: T) => R | Promise<R>,
      context?: Partial<ErrorContext>,
      options?: ErrorHandlerOptions
    ) => {
      return async (...args: T): Promise<R | null> => {
        try {
          const result = await fn(...args);
          return result;
        } catch (error) {
          handleError(
            error instanceof Error ? error : new Error(String(error)),
            context,
            options
          );
          return null;
        }
      };
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
    withErrorHandling,
  };
}

// Hook for retry logic with exponential backoff
export function useRetry() {
  const { handleError } = useErrorHandler();

  const retry = useCallback(
    async <T>(
      fn: () => Promise<T>,
      maxRetries: number = 3,
      baseDelay: number = 1000,
      context?: Partial<ErrorContext>
    ): Promise<T | null> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await fn();
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          if (attempt === maxRetries) {
            // Final attempt failed
            handleError(lastError, {
              ...context,
              type: ErrorType.SYSTEM,
            });
            return null;
          }

          // Wait before retrying with exponential backoff
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      return null;
    },
    [handleError]
  );

  return { retry };
}

// Hook for error recovery
export function useErrorRecovery() {
  const { handleError } = useErrorHandler();

  const recoverFromError = useCallback(
    (
      error: Error,
      recoveryActions: Array<{
        condition: (error: Error) => boolean;
        action: () => void | Promise<void>;
        description: string;
      }>
    ) => {
      for (const { condition, action, description } of recoveryActions) {
        if (condition(error)) {
          try {
            action();
            return true;
          } catch (recoveryError) {
            handleError(
              recoveryError instanceof Error
                ? recoveryError
                : new Error(String(recoveryError)),
              {
                type: ErrorType.SYSTEM,
              }
            );
          }
        }
      }

      return false;
    },
    [handleError]
  );

  return { recoverFromError };
}
