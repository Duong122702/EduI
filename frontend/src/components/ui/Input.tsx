import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // 1. Layout & Sizing cơ bản (Dễ dàng ghi đè h-*, w-*, p-*, rounded-*)
        'border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm transition-colors outline-none',

        // 2. Màu chữ & Placeholder
        'text-foreground placeholder:text-muted-foreground',

        // 3. Style cho File Input (Đã làm sạch)
        'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',

        // 4. Trạng thái Focus (Dùng semantic token 'ring', bỏ teal-500 cứng và [3px])
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2',

        // 5. Trạng thái Disabled
        'disabled:cursor-not-allowed disabled:opacity-50',

        // 6. Trạng thái Validation Error (Rút gọn modifier)
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-2',

        className
      )}
      {...props}
    />
  );
}

export { Input };
