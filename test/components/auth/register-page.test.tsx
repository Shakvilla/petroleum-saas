import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { RegisterPage } from '@/components/auth/register-page';
import { useTenant } from '@/components/tenant-provider';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock tenant provider
jest.mock('@/components/tenant-provider', () => ({
  useTenant: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseTenant = useTenant as jest.MockedFunction<typeof useTenant>;

describe('RegisterPage', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });

    mockUseTenant.mockReturnValue({
      tenant: null,
      tenantData: null,
      isLoading: false,
      error: null,
    });

    mockPush.mockClear();
  });

  it('renders registration form correctly', () => {
    render(<RegisterPage />);

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(
      screen.getByText('Get started with your petroleum management platform')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<RegisterPage />);

    const submitButton = screen.getByRole('button', {
      name: /create account/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Company name is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(
        screen.getByText('Please confirm your password')
      ).toBeInTheDocument();
      expect(
        screen.getByText('You must agree to the terms and conditions')
      ).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    render(<RegisterPage />);

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByRole('button', {
      name: /create account/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeInTheDocument();
    });
  });

  it('shows validation error for weak password', async () => {
    render(<RegisterPage />);

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'weak' } });

    const submitButton = screen.getByRole('button', {
      name: /create account/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Password must be at least 8 characters')
      ).toBeInTheDocument();
    });
  });

  it('shows validation error for password mismatch', async () => {
    render(<RegisterPage />);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Different123!' },
    });

    const submitButton = screen.getByRole('button', {
      name: /create account/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<RegisterPage />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Company Name'), {
      target: { value: 'Test Company' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    const termsCheckbox = screen.getByLabelText(/I agree to the/);
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByRole('button', {
      name: /create account/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login?registered=true');
    });
  });

  it('handles social signup', async () => {
    render(<RegisterPage />);

    const googleButton = screen.getByText('Continue with Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/tenant-selection');
    });
  });

  it('shows password strength indicator', () => {
    render(<RegisterPage />);

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    expect(screen.getByText('Password strength')).toBeInTheDocument();
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('navigates to login page', () => {
    render(<RegisterPage />);

    const signInLink = screen.getByText('Sign in');
    expect(signInLink).toHaveAttribute('href', '/auth/login');
  });

  it('clears field errors when user starts typing', async () => {
    render(<RegisterPage />);

    const submitButton = screen.getByRole('button', {
      name: /create account/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(
        screen.queryByText('First name is required')
      ).not.toBeInTheDocument();
    });
  });
});
