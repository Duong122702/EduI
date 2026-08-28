import type { ConfirmPopoverProps } from '@/types/QuestionType/confirmPopoverProps.type';
import { useState, type MouseEvent } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/Button';

export const ConfirmPopover = ({
  children,
  onConfirm,
  onCancel,
  disabled,
  side,
  align,
  icon,
  title,
  description,
  cancelText,
  confirmText,
  confirmVariant,
}: ConfirmPopoverProps) => {
  const [open, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = (e: MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      onConfirm();
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = (e: MouseEvent) => {
    e.stopPropagation();
    onCancel?.();
    setIsOpen(false);
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Popover open={open} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className="w-72 p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2.5">
          {icon}
          <div className="space-y-1">
            <h4 className="text-sm leading-none font-semibold">{title}</h4>
            {description && (
              <p className="text-muted-foreground text-xs leading-snug">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2.5 text-xs"
            disabled={isLoading}
            onClick={handleCancel}
          >
            {cancelText}
          </Button>
          <Button
            size="sm"
            variant={confirmVariant}
            className="h-7 px-2.5 text-xs"
            disabled={isLoading}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
