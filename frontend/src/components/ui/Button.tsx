import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Định nghĩa các biến thể cho Button
const buttonVariant = cva(
  // Các lớp CSS cơ bản cho Button
  'inline-flex items-center justify-center font-medium transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        // Các biến thể cho kiểu Button
        primary:
          'bg-primary text-white hover:bg-primary/90  shadow-sm rounded-4xl',
        secondary: 'bg-secondary text-white hover:bg-secondary/90  shadow-sm',
        dark: 'bg-primary-dark/90 text-white hover:bg-primary-dark  ',
        outline:
          'border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900',
        orange: 'bg-button-orange text-white hover:bg-button-orange/90 ',
        tabPill:
          'flex-1 cursor-pointer rounded-full px-6 py-3 text-sm font-semibold  duration-200 bg-white',
        tabGrayBox:
          'rounded-xl px-8 w-1/2 font-semibold duration-300 ease-in-out',
      },
      size: {
        small: 'px-3 py-1.5',
        medium: 'px-4 py-2 text-sm',
        large: 'px-6 py-3',
        extralarge: 'px-8 py-4 text-xl',
      },
      isActive: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'tabPill',
        isActive: true,
        className:
          'bg-primary-dark text-white shadow-md hover:bg-primary-dark/90',
      },
      {
        variant: 'tabPill',
        isActive: false,
        className:
          'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900 shadow-none',
      },
      // 2. Kiểu tabGrayBox (Khung xám nút trắng)
      {
        variant: 'tabGrayBox',
        isActive: true,
        className: 'bg-white text-gray-800 shadow-sm hover:bg-white/90',
      },
      {
        variant: 'tabGrayBox',
        isActive: false,
        className: 'bg-gray text-stale-200 hover:bg-white/10 shadow-none',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
      isActive: false,
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
  isActive,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(buttonVariant({ variant, size, isActive }), className)
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}

export default Button;
