'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FormSeparatorProps {
  text: string;
  className?: string;
}

export const FormSeparator: React.FC<FormSeparatorProps> = ({
  text,
  className,
}) => {
  return (
    <div className={cn('relative flex items-center', className)}>
      <div className="flex-grow border-t border-gray-300" />
      <span className="flex-shrink mx-4 text-sm text-gray-500 bg-white px-2">
        {text}
      </span>
      <div className="flex-grow border-t border-gray-300" />
    </div>
  );
};
