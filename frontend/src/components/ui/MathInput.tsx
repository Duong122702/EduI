import React, { useEffect, useRef } from 'react';
import 'mathlive';
import type { MathfieldElement } from 'mathlive';

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

    mf.smartFence = true;
    mf.mathVirtualKeyboardPolicy = 'auto';

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

    // --- FIX ENTER SUBMIT FORM ---
    // Chặn sự kiện phím Enter trực tiếp từ core của math-field
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Chặn xuống dòng / submit form
        e.stopPropagation(); // Ngăn sự kiện nổi bọt lên <form>
      }
    };

    mf.addEventListener('input', handleInput);
    mf.addEventListener('keydown', handleKeyDown);

    return () => {
      mf.removeEventListener('input', handleInput);
      mf.removeEventListener('keydown', handleKeyDown);
    };
  }, [onChange]);

  useEffect(() => {
    const mf = mfRef.current;
    if (mf && mf.getValue('latex-expanded') !== value) {
      mf.setValue(value || '');
    }
  }, [value]);

  return (
    <div
      className="border-input bg-background ring-offset-background focus-within:ring-ring relative min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2"
      // --- FIX NÚT ENTER ---
      // Ngăn nút Enter làm submit form gây đóng form/sidebar
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
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
