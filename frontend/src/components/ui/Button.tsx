import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        outline:
          'border border-border bg-input/30 hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted hover:text-foreground aria-expanded:bg-muted',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20',
        link: 'text-primary underline-offset-4 hover:underline',
        dark: 'bg-primary-dark/90 text-white hover:bg-primary-dark',
        orange: 'bg-button-orange text-white hover:bg-button-orange/90',
        tabPill:
          'flex-1 cursor-pointer rounded-full bg-white data-[state=active]:bg-primary-dark data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500',
        tabGrayBox:
          'rounded-xl w-1/2 bg-slate-200/70 data-[state=active]:bg-white data-[state=active]:text-gray-800',
      },
      size: {
        default: 'h-9 px-4 gap-2',
        xs: "h-6 px-2 text-xs gap-1 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 px-3 gap-1.5',
        lg: 'h-10 px-6 gap-2',
        xl: 'h-12 px-8 text-base gap-2.5',
        icon: 'size-9 p-0',
        'icon-xs': "size-6 p-0 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8 p-0',
        'icon-lg': 'size-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
