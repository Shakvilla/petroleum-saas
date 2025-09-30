import { useCallback } from 'react';
import {
  sanitizeInput,
  sanitizeHtml,
  validateEmail,
  validatePassword,
  validateUrl,
  secureStorage,
  sanitizeFormData,
  validateFileUpload,
} from '@/lib/security';

export function useSecurity() {
  // Input sanitization
  const sanitize = useCallback((input: string): string => {
    return sanitizeInput(input);
  }, []);

  const sanitizeHtmlContent = useCallback((html: string): string => {
    return sanitizeHtml(html);
  }, []);

  // Form data sanitization
  const sanitizeForm = useCallback(
    (data: Record<string, any>): Record<string, any> => {
      return sanitizeFormData(data);
    },
    []
  );

  // Validation functions
  const validateEmailAddress = useCallback((email: string): boolean => {
    return validateEmail(email);
  }, []);

  const validatePasswordStrength = useCallback(
    (
      password: string
    ): {
      isValid: boolean;
      errors: string[];
    } => {
      return validatePassword(password);
    },
    []
  );

  const validateUrlAddress = useCallback((url: string): boolean => {
    return validateUrl(url);
  }, []);

  // File upload validation
  const validateFile = useCallback(
    (
      file: File
    ): {
      isValid: boolean;
      errors: string[];
    } => {
      return validateFileUpload(file);
    },
    []
  );

  // Secure storage
  const setSecureItem = useCallback((key: string, value: any): void => {
    secureStorage.setItem(key, value);
  }, []);

  const getSecureItem = useCallback((key: string): any => {
    return secureStorage.getItem(key);
  }, []);

  const removeSecureItem = useCallback((key: string): void => {
    secureStorage.removeItem(key);
  }, []);

  const clearSecureStorage = useCallback((): void => {
    secureStorage.clear();
  }, []);

  return {
    // Sanitization
    sanitize,
    sanitizeHtml: sanitizeHtmlContent,
    sanitizeForm,

    // Validation
    validateEmail: validateEmailAddress,
    validatePassword: validatePasswordStrength,
    validateUrl: validateUrlAddress,
    validateFile,

    // Secure storage
    setSecureItem,
    getSecureItem,
    removeSecureItem,
    clearSecureStorage,
  };
}

// Hook for form security
export function useFormSecurity() {
  const { sanitizeForm, validateEmail, validatePassword } = useSecurity();

  const processFormData = useCallback(
    (
      data: Record<string, any>
    ): {
      sanitized: Record<string, any>;
      errors: Record<string, string[]>;
      isValid: boolean;
    } => {
      const sanitized = sanitizeForm(data);
      const errors: Record<string, string[]> = {};
      let isValid = true;

      // Validate email fields
      Object.entries(sanitized).forEach(([key, value]) => {
        if (key.toLowerCase().includes('email') && typeof value === 'string') {
          if (!validateEmail(value)) {
            errors[key] = ['Please enter a valid email address'];
            isValid = false;
          }
        }
      });

      // Validate password fields
      Object.entries(sanitized).forEach(([key, value]) => {
        if (
          key.toLowerCase().includes('password') &&
          typeof value === 'string'
        ) {
          const passwordValidation = validatePassword(value);
          if (!passwordValidation.isValid) {
            errors[key] = passwordValidation.errors;
            isValid = false;
          }
        }
      });

      return {
        sanitized,
        errors,
        isValid,
      };
    },
    [sanitizeForm, validateEmail, validatePassword]
  );

  return {
    processFormData,
  };
}

// Hook for file upload security
export function useFileUploadSecurity() {
  const { validateFile } = useSecurity();

  const validateUpload = useCallback(
    (
      files: FileList | File[]
    ): {
      validFiles: File[];
      invalidFiles: Array<{ file: File; errors: string[] }>;
      isValid: boolean;
    } => {
      const validFiles: File[] = [];
      const invalidFiles: Array<{ file: File; errors: string[] }> = [];
      let isValid = true;

      Array.from(files).forEach(file => {
        const validation = validateFile(file);
        if (validation.isValid) {
          validFiles.push(file);
        } else {
          invalidFiles.push({ file, errors: validation.errors });
          isValid = false;
        }
      });

      return {
        validFiles,
        invalidFiles,
        isValid,
      };
    },
    [validateFile]
  );

  return {
    validateUpload,
  };
}
