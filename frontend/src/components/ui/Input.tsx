import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';
const inputVariant = cva(
  'w-full bg-slate-50 text-slate-800 border border-slate-200 placeholder:text-slate-400 placeholder:font-normal transition-all duration-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      inputSize: {
        sm: 'h-8 px-2.5 py-1.5 text-xs rounded-lg',
        md: 'h-10 px-3.5 py-2.5 text-sm rounded-xl',
        lg: 'h-12 px-4 py-3.5 text-base rounded-2xl',
      },
      state: {
        default: '',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
      },
    },
    defaultVariants: {
      inputSize: 'md',
      state: 'default',
    },
  }
);

interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariant> {
  isError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ inputSize, isError, className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={twMerge(
          clsx(
            inputVariant({
              inputSize,
              state: isError ? 'error' : 'default',
            }),
            className
          )
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
