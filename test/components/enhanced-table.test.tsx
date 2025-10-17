// Documentation: /docs/responsive-design/enhanced-table-tests.md

import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  ResponsiveTableWrapper,
  MobileTableCard
} from '@/components/ui/table';

describe('Enhanced Table Components', () => {
  describe('Table', () => {
    it('should render with default props', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render with compact variant', () => {
      render(
        <Table variant="compact">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      
      const table = document.querySelector('table');
      expect(table).toHaveClass('text-xs');
    });

    it('should render with spacious variant', () => {
      render(
        <Table variant="spacious">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      
      const table = document.querySelector('table');
      expect(table).toHaveClass('text-base');
    });

    it('should disable responsive overflow', () => {
      render(
        <Table responsive={false}>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      
      const wrapper = document.querySelector('.relative.w-full');
      expect(wrapper).toHaveClass('overflow-hidden');
    });
  });

  describe('TableHead', () => {
    it('should render with small size', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead size="sm">Name</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      
      const th = document.querySelector('th');
      expect(th).toHaveClass('h-8', 'px-2', 'text-xs');
    });

    it('should render with large size', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead size="lg">Name</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      
      const th = document.querySelector('th');
      expect(th).toHaveClass('h-14', 'px-6', 'text-base');
    });

    it('should disable responsive padding', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead responsive={false}>Name</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      
      const th = document.querySelector('th');
      expect(th).not.toHaveClass('sm:px-4', 'md:px-6');
    });
  });

  describe('TableCell', () => {
    it('should render with small size', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell size="sm">John Doe</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const td = document.querySelector('td');
      expect(td).toHaveClass('p-2', 'text-xs');
    });

    it('should render with large size', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell size="lg">John Doe</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const td = document.querySelector('td');
      expect(td).toHaveClass('p-6', 'text-base');
    });

    it('should disable responsive padding', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell responsive={false}>John Doe</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const td = document.querySelector('td');
      expect(td).not.toHaveClass('sm:p-3', 'md:p-4');
    });
  });

  describe('TableRow', () => {
    it('should render with small size', () => {
      render(
        <Table>
          <TableBody>
            <TableRow size="sm">
              <TableCell>John Doe</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const tr = document.querySelector('tr');
      expect(tr).toHaveClass('h-8');
    });

    it('should render with large size', () => {
      render(
        <Table>
          <TableBody>
            <TableRow size="lg">
              <TableCell>John Doe</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const tr = document.querySelector('tr');
      expect(tr).toHaveClass('h-16');
    });

    it('should disable interactive hover', () => {
      render(
        <Table>
          <TableBody>
            <TableRow interactive={false}>
              <TableCell>John Doe</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      const tr = document.querySelector('tr');
      expect(tr).not.toHaveClass('hover:bg-muted/50');
    });
  });

  describe('ResponsiveTableWrapper', () => {
    it('should render with scroll variant', () => {
      render(
        <ResponsiveTableWrapper variant="scroll">
          <div>Table content</div>
        </ResponsiveTableWrapper>
      );
      
      const wrapper = document.querySelector('.relative.w-full');
      expect(wrapper).toHaveClass('overflow-x-auto');
    });

    it('should render with stack variant', () => {
      render(
        <ResponsiveTableWrapper variant="stack" breakpoint="md">
          <div>Table content</div>
        </ResponsiveTableWrapper>
      );
      
      const wrapper = document.querySelector('.relative.w-full');
      expect(wrapper).toHaveClass('overflow-hidden', 'hidden', 'md:block');
    });

    it('should render with card variant', () => {
      render(
        <ResponsiveTableWrapper variant="card">
          <div>Table content</div>
        </ResponsiveTableWrapper>
      );
      
      const wrapper = document.querySelector('.relative.w-full');
      expect(wrapper).toHaveClass('overflow-hidden');
    });
  });

  describe('MobileTableCard', () => {
    it('should render basic card', () => {
      render(
        <MobileTableCard>
          <div>Card content</div>
        </MobileTableCard>
      );
      
      expect(screen.getByText('Card content')).toBeInTheDocument();
      const card = document.querySelector('.block.md\\:hidden');
      expect(card).toBeInTheDocument();
    });

    it('should render card with title and subtitle', () => {
      render(
        <MobileTableCard title="John Doe" subtitle="john@example.com">
          <div>Card content</div>
        </MobileTableCard>
      );
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should render card with actions', () => {
      render(
        <MobileTableCard 
          title="John Doe" 
          actions={<button>Edit</button>}
        >
          <div>Card content</div>
        </MobileTableCard>
      );
      
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('should have proper mobile classes', () => {
      render(
        <MobileTableCard>
          <div>Card content</div>
        </MobileTableCard>
      );
      
      const card = document.querySelector('.block.md\\:hidden');
      expect(card).toHaveClass(
        'bg-white',
        'border',
        'border-gray-200',
        'rounded-lg',
        'p-4',
        'mb-3'
      );
    });
  });

  describe('TableCaption', () => {
    it('should render caption', () => {
      render(
        <Table>
          <TableCaption>User data table</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      
      expect(screen.getByText('User data table')).toBeInTheDocument();
    });
  });
});
