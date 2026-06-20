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
  arrowRight: (
    <>
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </>
  ),
  badgeDollarSign: (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path>
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
      <path d="M12 18V6"></path>
    </>
  ),
  badgeGearSgin: (
    <>
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
      <path d="M12 2v2"></path>
      <path d="M12 22v-2"></path>
      <path d="m17 20.66-1-1.73"></path>
      <path d="M11 10.27 7 3.34"></path>
      <path d="m20.66 17-1.73-1"></path>
      <path d="m3.34 7 1.73 1"></path>
      <path d="M14 12h8"></path>
      <path d="M2 12h2"></path>
      <path d="m20.66 7-1.73 1"></path>
      <path d="m3.34 17 1.73-1"></path>
      <path d="m17 3.34-1 1.73"></path>
      <path d="m11 13.73-4 6.93"></path>
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
