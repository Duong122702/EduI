import React, { useEffect, useRef } from 'react';
import 'mathlive';
import type { MathfieldElement } from 'mathlive';

// Khai báo kiểu dữ liệu cho <math-field> chuẩn React 18/19
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement> & {
          'math-virtual-keyboard-policy'?: string;
          'smart-fence'?: boolean | string;
        },
        MathfieldElement
      >;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement> & {
          'math-virtual-keyboard-policy'?: string;
          'smart-fence'?: boolean | string;
        },
        MathfieldElement
      >;
    }
  }
}

interface MathInputProps {
  value?: string;
  onChange: (latex: string) => void;
}

export function MathInput({ value, onChange }: MathInputProps) {
  const mfRef = useRef<MathfieldElement | null>(null);

  useEffect(() => {
    const mf = mfRef.current;
    if (!mf) return;

    // 1. Cấu hình tính năng trên ô nhập
    mf.smartFence = true;
    mf.mathVirtualKeyboardPolicy = 'auto'; // 'auto' tự mở khi focus, 'manual' hiện nút bấm mở bàn phím

    // 2. Cấu hình các bộ bàn phím ảo toàn cục
    if (typeof window !== 'undefined' && window.mathVirtualKeyboard) {
      window.mathVirtualKeyboard.layouts = [
        'numeric',
        'symbols',
        'alphabetic',
        'greek',
      ];
    }

    const handleInput = () => {
      const latexOutput = mf.getValue('latex-expanded');
      onChange(latexOutput);
    };

    mf.addEventListener('input', handleInput);
    return () => mf.removeEventListener('input', handleInput);
  }, [onChange]);

  // Cập nhật giá trị nếu value từ bên ngoài Form thay đổi
  useEffect(() => {
    const mf = mfRef.current;
    if (mf && mf.getValue('latex-expanded') !== value) {
      mf.setValue(value || '');
    }
  }, [value]);

  return (
    <div className="border-input bg-background ring-offset-background focus-within:ring-ring relative min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2">
      <math-field
        ref={mfRef}
        style={
          {
            width: '100%',
            minHeight: '60px',
            outline: 'none',
            background: 'transparent',
            fontSize: '1rem',
          } as React.CSSProperties
        }
      />
    </div>
  );
}
