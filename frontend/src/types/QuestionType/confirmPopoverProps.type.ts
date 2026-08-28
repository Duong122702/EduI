import type { buttonVariants } from '@/components/ui/Button';
import type { VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

export interface ConfirmPopoverProps {
  children: ReactNode;
  title?: ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: VariantProps<typeof buttonVariants>['variant'];
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  disabled?: boolean;
}
