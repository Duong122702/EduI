import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Định nghĩa các biến thể cho Button
const buttonVariant = cva(
  // Các lớp CSS cơ bản cho Button
  'inline-flex items-center justify-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        // Các biến thể cho kiểu Button
        primary:
          'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm rounded-4xl',
        secondary:
          'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary shadow-sm',
        dark: 'bg-primary-dark/90 text-white hover:bg-primary-dark focus:ring-primary-dark shadow-sm rounded-4xl',
        outline:
          'border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900',
      },
      size: {
        small: 'px-3 py-1.5',
        medium: 'px-4 py-2',
        large: 'px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariant> {
  isLoading?: boolean;
}
function Button({
  className,
  variant,
  size,
  isLoading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(clsx(buttonVariant({ variant, size }), className))}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}

export default Button;
