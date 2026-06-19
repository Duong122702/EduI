import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ICON_PATHS = {
  logo: (
    <>
      <path d="M12 7v14"></path>
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
    </>
  ),
};

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
