// Documentation: /docs/authentication/registration.md

export interface RegistrationRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  tenantId?: string;
  companyName?: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    status: 'PENDING' | 'ACTIVE';
  };
}

export interface SocialRegistrationRequest {
  provider: string;
  accessToken: string;
  userInfo: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
  tenantId?: string;
  companyName?: string;
  phone?: string;
  acceptTerms: boolean;
}

export class RegistrationService {
  /**
   * Register a new user
   */
  static async registerUser(
    data: RegistrationRequest
  ): Promise<RegistrationResponse> {
    try {
      // TODO: Replace with actual API call
      // Issue: #AUTH-REGISTER-001
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: 'Registration failed',
          error: result.error || 'Unknown error',
        };
      }

      return {
        success: true,
        message:
          'Registration successful. Please check your email for verification.',
        user: result.user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Register with social provider
   */
  static async registerWithSocial(
    data: SocialRegistrationRequest
  ): Promise<RegistrationResponse> {
    try {
      // TODO: Replace with actual API call
      // Issue: #AUTH-SOCIAL-SIGNUP-001
      const response = await fetch('/api/auth/social-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: 'Social registration failed',
          error: result.error || 'Unknown error',
        };
      }

      return {
        success: true,
        message: 'Registration successful',
        user: result.user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Social registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<{
    success: boolean;
    message: string;
    error?: string;
  }> {
    try {
      // TODO: Replace with actual API call
      // Issue: #AUTH-REGISTER-001
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: 'Email verification failed',
          error: result.error || 'Unknown error',
        };
      }

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Email verification failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(email: string): Promise<{
    success: boolean;
    message: string;
    error?: string;
  }> {
    try {
      // TODO: Replace with actual API call
      // Issue: #AUTH-REGISTER-001
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: 'Failed to resend verification email',
          error: result.error || 'Unknown error',
        };
      }

      return {
        success: true,
        message: 'Verification email sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to resend verification email',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Hook for registration
export function useRegistration() {
  const registerUser = async (data: RegistrationRequest) => {
    return RegistrationService.registerUser(data);
  };

  const registerWithSocial = async (data: SocialRegistrationRequest) => {
    return RegistrationService.registerWithSocial(data);
  };

  const verifyEmail = async (token: string) => {
    return RegistrationService.verifyEmail(token);
  };

  const resendVerificationEmail = async (email: string) => {
    return RegistrationService.resendVerificationEmail(email);
  };

  return {
    registerUser,
    registerWithSocial,
    verifyEmail,
    resendVerificationEmail,
  };
}
