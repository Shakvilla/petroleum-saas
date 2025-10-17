// Documentation: /docs/responsive-design/responsive-form-components-tests.md

import { render, screen, fireEvent } from '@testing-library/react';
import {
  ResponsiveFormField,
  ResponsiveInput,
  ResponsiveTextarea,
  ResponsiveSelect,
  ResponsiveCheckbox,
  ResponsiveRadioGroup,
  ResponsiveFormActions,
  ResponsiveFormSection
} from '@/components/responsive-form-components';
import { ResponsiveProvider } from '@/components/responsive-provider';

// Mock responsive provider with different breakpoints
const MockResponsiveProvider = ({ 
  children, 
  breakpoint = 'desktop' 
}: { 
  children: React.ReactNode;
  breakpoint?: string;
}) => {
  const mockState = {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isLargeDesktop: breakpoint === 'largeDesktop',
    orientation: 'portrait' as const,
    viewportWidth: breakpoint === 'mobile' ? 375 : breakpoint === 'tablet' ? 768 : 1024,
    viewportHeight: breakpoint === 'mobile' ? 667 : breakpoint === 'tablet' ? 1024 : 768,
    safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 }
  };

  return (
    <ResponsiveProvider initialState={mockState}>
      {children}
    </ResponsiveProvider>
  );
};

describe('ResponsiveFormField', () => {
  it('should render with label and description', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveFormField label="Test Field" description="Test description">
          <input />
        </ResponsiveFormField>
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('Test Field')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should show required indicator', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveFormField label="Required Field" required>
          <input />
        </ResponsiveFormField>
      </MockResponsiveProvider>
    );
    
    const label = screen.getByText('Required Field');
    expect(label).toHaveClass('after:content-["*"]');
  });

  it('should show error message', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveFormField label="Test Field" error="This field is required">
          <input />
        </ResponsiveFormField>
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should have smaller text on mobile', () => {
    render(
      <MockResponsiveProvider breakpoint="mobile">
        <ResponsiveFormField label="Test Field" size="lg">
          <input />
        </ResponsiveFormField>
      </MockResponsiveProvider>
    );
    
    const label = screen.getByText('Test Field');
    expect(label).toHaveClass('text-sm');
  });
});

describe('ResponsiveInput', () => {
  const defaultProps = {
    label: 'Test Input',
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render input with label', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveInput {...defaultProps} />
      </MockResponsiveProvider>
    );
    
    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
  });

  it('should handle value changes', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveInput {...defaultProps} />
      </MockResponsiveProvider>
    );
    
    const input = screen.getByLabelText('Test Input');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('test value');
  });

  it('should show password toggle for password type', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveInput {...defaultProps} type="password" showPasswordToggle />
      </MockResponsiveProvider>
    );
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('should toggle password visibility', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveInput {...defaultProps} type="password" showPasswordToggle />
      </MockResponsiveProvider>
    );
    
    const input = screen.getByLabelText('Test Input');
    const toggleButton = screen.getByRole('button');
    
    expect(input).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should have smaller height on mobile', () => {
    render(
      <MockResponsiveProvider breakpoint="mobile">
        <ResponsiveInput {...defaultProps} />
      </MockResponsiveProvider>
    );
    
    const input = screen.getByLabelText('Test Input');
    expect(input).toHaveClass('h-10', 'text-sm');
  });
});

describe('ResponsiveTextarea', () => {
  const defaultProps = {
    label: 'Test Textarea',
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render textarea with label', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveTextarea {...defaultProps} />
      </MockResponsiveProvider>
    );
    
    expect(screen.getByLabelText('Test Textarea')).toBeInTheDocument();
  });

  it('should handle value changes', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveTextarea {...defaultProps} />
      </MockResponsiveProvider>
    );
    
    const textarea = screen.getByLabelText('Test Textarea');
    fireEvent.change(textarea, { target: { value: 'test content' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('test content');
  });

  it('should respect resize prop', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveTextarea {...defaultProps} resize="none" />
      </MockResponsiveProvider>
    );
    
    const textarea = screen.getByLabelText('Test Textarea');
    expect(textarea).toHaveClass('resize-none');
  });
});

describe('ResponsiveSelect', () => {
  const defaultProps = {
    label: 'Test Select',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ],
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render select with label', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveSelect {...defaultProps} />
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('Test Select')).toBeInTheDocument();
  });

  it('should render options', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveSelect {...defaultProps} />
      </MockResponsiveProvider>
    );
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
});

describe('ResponsiveCheckbox', () => {
  const defaultProps = {
    label: 'Test Checkbox',
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render checkbox with label', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveCheckbox {...defaultProps} />
      </MockResponsiveProvider>
    );
    
    expect(screen.getByLabelText('Test Checkbox')).toBeInTheDocument();
  });

  it('should handle checked changes', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveCheckbox {...defaultProps} />
      </MockResponsiveProvider>
    );
    
    const checkbox = screen.getByLabelText('Test Checkbox');
    fireEvent.click(checkbox);
    
    expect(defaultProps.onChange).toHaveBeenCalledWith(true);
  });
});

describe('ResponsiveRadioGroup', () => {
  const defaultProps = {
    label: 'Test Radio Group',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ],
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render radio group with label', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveRadioGroup {...defaultProps} />
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('Test Radio Group')).toBeInTheDocument();
  });

  it('should render radio options', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveRadioGroup {...defaultProps} />
      </MockResponsiveProvider>
    );
    
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
  });

  it('should handle value changes', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveRadioGroup {...defaultProps} />
      </MockResponsiveProvider>
    );
    
    const option1 = screen.getByLabelText('Option 1');
    fireEvent.click(option1);
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('option1');
  });
});

describe('ResponsiveFormActions', () => {
  it('should render actions in a row on desktop', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveFormActions>
          <button>Cancel</button>
          <button>Save</button>
        </ResponsiveFormActions>
      </MockResponsiveProvider>
    );
    
    const container = document.querySelector('.flex.items-center');
    expect(container).toHaveClass('flex-row');
  });

  it('should render actions in a column on mobile', () => {
    render(
      <MockResponsiveProvider breakpoint="mobile">
        <ResponsiveFormActions>
          <button>Cancel</button>
          <button>Save</button>
        </ResponsiveFormActions>
      </MockResponsiveProvider>
    );
    
    const container = document.querySelector('.flex.items-center');
    expect(container).toHaveClass('flex-col');
  });

  it('should align actions to the right by default', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveFormActions>
          <button>Cancel</button>
          <button>Save</button>
        </ResponsiveFormActions>
      </MockResponsiveProvider>
    );
    
    const container = document.querySelector('.flex.items-center');
    expect(container).toHaveClass('justify-end');
  });
});

describe('ResponsiveFormSection', () => {
  it('should render section with title and description', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveFormSection title="Test Section" description="Test description">
          <div>Section content</div>
        </ResponsiveFormSection>
      </MockResponsiveProvider>
    );
    
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('should be collapsible when collapsible prop is true', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveFormSection title="Test Section" collapsible>
          <div>Section content</div>
        </ResponsiveFormSection>
      </MockResponsiveProvider>
    );
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('should toggle content visibility when collapsible', () => {
    render(
      <MockResponsiveProvider breakpoint="desktop">
        <ResponsiveFormSection title="Test Section" collapsible defaultExpanded={false}>
          <div>Section content</div>
        </ResponsiveFormSection>
      </MockResponsiveProvider>
    );
    
    expect(screen.queryByText('Section content')).not.toBeInTheDocument();
    
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('should have smaller padding on mobile', () => {
    render(
      <MockResponsiveProvider breakpoint="mobile">
        <ResponsiveFormSection title="Test Section">
          <div>Section content</div>
        </ResponsiveFormSection>
      </MockResponsiveProvider>
    );
    
    const section = document.querySelector('.border.border-gray-200.rounded-lg');
    expect(section).toHaveClass('p-4');
  });
});
