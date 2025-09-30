# Contributing Guide

Thank you for your interest in contributing to the Petroleum Management System! This guide will help you get started with contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Code of Conduct](#code-of-conduct)

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git 2.30.0 or higher
- VS Code (recommended)

### Setup

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally

2. **Clone your fork**

   ```bash
   git clone https://github.com/your-username/petroleum-saas.git
   cd petroleum-saas
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Critical fixes

### Creating a Feature

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following our standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**

   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Request review from maintainers

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Provide types for all functions and variables
- Use interfaces for object shapes
- Prefer type unions over any

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // implementation
}

// Bad
function getUser(id: any): any {
  // implementation
}
```

### React Components

- Use functional components with hooks
- Include proper TypeScript types
- Add accessibility attributes
- Use meaningful component names

```typescript
// Good
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### Styling

- Use Tailwind CSS classes
- Follow mobile-first approach
- Use semantic class names
- Avoid inline styles

```typescript
// Good
<div className="flex flex-col space-y-4 p-4 md:flex-row md:space-x-4 md:space-y-0">
  <div className="w-full md:w-1/2">Content</div>
</div>

// Bad
<div style={{ display: 'flex', padding: '16px' }}>
  <div style={{ width: '50%' }}>Content</div>
</div>
```

### File Organization

- Use PascalCase for components
- Use camelCase for utilities
- Group related files in folders
- Use index files for exports

```
components/
  ui/
    Button.tsx
    Input.tsx
    index.ts
  features/
    TankManagement/
      TankList.tsx
      TankForm.tsx
      index.ts
```

## Testing

### Unit Tests

Write tests for all components and utilities:

```typescript
// test/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

Test component interactions:

```typescript
// test/components/TankForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TankForm } from '@/components/TankForm';

describe('TankForm', () => {
  it('submits form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<TankForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Tank Name'), {
      target: { value: 'Test Tank' }
    });
    fireEvent.change(screen.getByLabelText('Capacity'), {
      target: { value: '50000' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Tank' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Test Tank',
        capacity: 50000
      });
    });
  });
});
```

### E2E Tests

Test user workflows:

```typescript
// test/e2e/tank-management.spec.ts
import { test, expect } from '@playwright/test';

test('user can create a new tank', async ({ page }) => {
  await page.goto('/tanks');

  await page.click('[data-testid="create-tank-button"]');
  await page.fill('[data-testid="tank-name"]', 'New Tank');
  await page.fill('[data-testid="tank-capacity"]', '50000');
  await page.click('[data-testid="submit-button"]');

  await expect(page.getByText('Tank created successfully')).toBeVisible();
  await expect(page.getByText('New Tank')).toBeVisible();
});
```

## Pull Request Process

### PR Template

When creating a PR, include:

- **Description**: What changes were made and why
- **Type**: feat, fix, docs, style, refactor, test, chore
- **Breaking Changes**: Any breaking changes
- **Testing**: How the changes were tested
- **Screenshots**: If UI changes were made

### Review Process

1. **Automated Checks**: CI/CD pipeline runs
2. **Code Review**: At least one maintainer reviews
3. **Testing**: All tests must pass
4. **Documentation**: Update docs if needed
5. **Approval**: Maintainer approves the PR
6. **Merge**: PR is merged to main branch

### PR Guidelines

- Keep PRs focused and small
- Write clear commit messages
- Update documentation
- Add tests for new features
- Ensure all tests pass
- Follow code style guidelines

## Issue Reporting

### Bug Reports

When reporting bugs, include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, version
- **Screenshots**: If applicable

### Feature Requests

When requesting features, include:

- **Description**: What feature you'd like
- **Use Case**: Why this feature is needed
- **Proposed Solution**: How you think it should work
- **Alternatives**: Other solutions considered

### Issue Templates

Use the provided issue templates:

- Bug report template
- Feature request template
- Documentation issue template

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards others
- Accept constructive criticism gracefully

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or inflammatory comments
- Personal attacks or insults
- Public or private harassment
- Publishing private information

### Enforcement

- Maintainers will enforce the code of conduct
- Violations may result in warnings or bans
- Report violations to maintainers privately

## Getting Help

### Resources

- **Documentation**: Check the docs folder
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub discussions
- **Community**: Join our community channels

### Contact

- **Maintainers**: @maintainer-username
- **Email**: maintainers@petroleum-saas.com
- **Discord**: [Join our Discord server](https://discord.gg/petroleum-saas)

## Recognition

### Contributors

We recognize all contributors:

- **Code Contributors**: Listed in CONTRIBUTORS.md
- **Documentation**: Listed in docs
- **Bug Reports**: Listed in issue comments
- **Feature Ideas**: Listed in PR descriptions

### Hall of Fame

Special recognition for:

- **Major Contributors**: Significant code contributions
- **Documentation Heroes**: Excellent documentation
- **Bug Hunters**: Finding critical bugs
- **Community Builders**: Helping others

Thank you for contributing to the Petroleum Management System! Your contributions help make this project better for everyone.
