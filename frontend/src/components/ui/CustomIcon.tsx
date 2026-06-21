import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { ICON_PATHS } from '../../constants/iconPaths';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CustomIconName = keyof typeof ICON_PATHS;

const iconVariants = cva('', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface CustomIconProps
  extends React.SVGProps<SVGSVGElement>, VariantProps<typeof iconVariants> {
  name: CustomIconName;
}

export const CustomIcon = React.forwardRef<SVGSVGElement, CustomIconProps>(
  ({ name, size, className, ...props }, ref) => {
    const IconComponent = ICON_PATHS[name];

    if (!IconComponent) {
      console.error(`Icon with name "${name}" does not exist.`);
      return null;
    }
    return (
      <svg
        ref={ref}
        className={cn(iconVariants({ size }), className)}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        {...props}
      >
        {IconComponent}
      </svg>
    );
  }
);
