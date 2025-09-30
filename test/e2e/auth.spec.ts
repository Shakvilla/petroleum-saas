import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/auth/login');
  });

  test('should display login form correctly', async ({ page }) => {
    // Check if the login form elements are present
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(
      page.getByText('Sign in to your petroleum management account')
    ).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Click submit without filling the form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for validation errors
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    // Enter invalid email
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for email validation error
    await expect(
      page.getByText('Please enter a valid email address')
    ).toBeVisible();
  });

  test('should successfully submit valid login form', async ({ page }) => {
    // Fill in valid credentials
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');

    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for loading state
    await expect(page.getByText('Loading...')).toBeVisible();

    // Wait for redirect (simulated)
    await page.waitForTimeout(2000);

    // Should redirect to tenant selection
    await expect(page).toHaveURL('/tenant-selection');
  });

  test('should navigate to registration page', async ({ page }) => {
    // Click on sign up link
    await page.getByText('Sign up').click();

    // Should navigate to registration page
    await expect(page).toHaveURL('/auth/register');
    await expect(page.getByText('Create your account')).toBeVisible();
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // Click on forgot password link
    await page.getByText('Forgot password?').click();

    // Should navigate to forgot password page
    await expect(page).toHaveURL('/auth/forgot-password');
    await expect(page.getByText('Forgot your password?')).toBeVisible();
  });

  test('should handle social login', async ({ page }) => {
    // Click on Google login button
    await page.getByText('Continue with Google').click();

    // Check for loading state
    await expect(page.getByText('Loading...')).toBeVisible();

    // Wait for redirect (simulated)
    await page.waitForTimeout(2000);

    // Should redirect to tenant selection
    await expect(page).toHaveURL('/tenant-selection');
  });

  test('should toggle remember me checkbox', async ({ page }) => {
    const rememberMeCheckbox = page.getByLabel('Remember me');

    // Initially unchecked
    await expect(rememberMeCheckbox).not.toBeChecked();

    // Click to check
    await rememberMeCheckbox.click();
    await expect(rememberMeCheckbox).toBeChecked();

    // Click to uncheck
    await rememberMeCheckbox.click();
    await expect(rememberMeCheckbox).not.toBeChecked();
  });
});

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the registration page
    await page.goto('/auth/register');
  });

  test('should display registration form correctly', async ({ page }) => {
    // Check if the registration form elements are present
    await expect(page.getByText('Create your account')).toBeVisible();
    await expect(
      page.getByText('Get started with your petroleum management platform')
    ).toBeVisible();
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(page.getByLabel('Last Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Company Name')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /create account/i })
    ).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Click submit without filling the form
    await page.getByRole('button', { name: /create account/i }).click();

    // Check for validation errors
    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Last name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Company name is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page.getByText('Please confirm your password')).toBeVisible();
    await expect(
      page.getByText('You must agree to the terms and conditions')
    ).toBeVisible();
  });

  test('should show password strength indicator', async ({ page }) => {
    // Enter a password
    await page.getByLabel('Password').fill('Password123!');

    // Check for password strength indicator
    await expect(page.getByText('Password strength')).toBeVisible();
    await expect(page.getByText('Strong')).toBeVisible();
  });

  test('should show validation error for password mismatch', async ({
    page,
  }) => {
    // Fill in different passwords
    await page.getByLabel('Password').fill('Password123!');
    await page.getByLabel('Confirm Password').fill('Different123!');

    // Submit the form
    await page.getByRole('button', { name: /create account/i }).click();

    // Check for password mismatch error
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should successfully submit valid registration form', async ({
    page,
  }) => {
    // Fill out the form
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Company Name').fill('Test Company');
    await page.getByLabel('Password').fill('Password123!');
    await page.getByLabel('Confirm Password').fill('Password123!');

    // Agree to terms
    await page.getByLabel(/I agree to the/).check();

    // Submit the form
    await page.getByRole('button', { name: /create account/i }).click();

    // Check for loading state
    await expect(page.getByText('Loading...')).toBeVisible();

    // Wait for redirect (simulated)
    await page.waitForTimeout(2000);

    // Should redirect to login page with success message
    await expect(page).toHaveURL('/auth/login?registered=true');
  });

  test('should navigate to login page', async ({ page }) => {
    // Click on sign in link
    await page.getByText('Sign in').click();

    // Should navigate to login page
    await expect(page).toHaveURL('/auth/login');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });
});

test.describe('Password Recovery Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the forgot password page
    await page.goto('/auth/forgot-password');
  });

  test('should display forgot password form correctly', async ({ page }) => {
    // Check if the forgot password form elements are present
    await expect(page.getByText('Forgot your password?')).toBeVisible();
    await expect(
      page.getByText(
        "Enter your email address and we'll send you a link to reset your password."
      )
    ).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /send reset link/i })
    ).toBeVisible();
  });

  test('should show validation error for empty email', async ({ page }) => {
    // Click submit without filling the email
    await page.getByRole('button', { name: /send reset link/i }).click();

    // Check for validation error
    await expect(page.getByText('Email is required')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    // Enter invalid email
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByRole('button', { name: /send reset link/i }).click();

    // Check for email validation error
    await expect(
      page.getByText('Please enter a valid email address')
    ).toBeVisible();
  });

  test('should successfully submit valid email', async ({ page }) => {
    // Enter valid email
    await page.getByLabel('Email').fill('test@example.com');

    // Submit the form
    await page.getByRole('button', { name: /send reset link/i }).click();

    // Check for loading state
    await expect(page.getByText('Loading...')).toBeVisible();

    // Wait for success state
    await page.waitForTimeout(2000);

    // Should show success message
    await expect(page.getByText('Check Your Email')).toBeVisible();
    await expect(
      page.getByText("We've sent a password reset link to your email address.")
    ).toBeVisible();
  });

  test('should navigate back to login page', async ({ page }) => {
    // Click on back to sign in link
    await page.getByText('Back to Sign In').click();

    // Should navigate to login page
    await expect(page).toHaveURL('/auth/login');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('should handle password reset with token', async ({ page }) => {
    // Navigate to password reset page with token
    await page.goto('/auth/forgot-password?token=reset-token-123');

    // Check if the reset form is displayed
    await expect(page.getByText('Reset your password')).toBeVisible();
    await expect(
      page.getByText('Enter your new password below.')
    ).toBeVisible();
    await expect(page.getByLabel('New Password')).toBeVisible();
    await expect(page.getByLabel('Confirm New Password')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /reset password/i })
    ).toBeVisible();
  });
});
