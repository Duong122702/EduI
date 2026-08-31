import { Button } from '@/components/ui/Button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MathInput } from '@/components/ui/MathInput';
import { cn } from '@/lib/utils';
import { ImagePlus, X } from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface ContentFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  handleFileContentChange: (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>
  ) => void;
  questionImageRef: RefObject<HTMLInputElement | null>;
  questionImagePreview: string | null;
  handleDelete: () => void;
  questionImageFile: File | null | undefined;
}

export const ContentFormField = <T extends FieldValues>({
  control,
  name,
  handleFileContentChange,
  questionImagePreview,
  questionImageRef,
  handleDelete,
  questionImageFile,
}: ContentFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <div className="flex items-center justify-between">
            <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
              Nội dung đề bài
            </FormLabel>

            {/* Input file ẩn cho ảnh đề bài */}
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              ref={questionImageRef}
              className="hidden"
              onChange={(e) => {
                handleFileContentChange(e);
              }}
            />

            {/* Nút bấm thêm ảnh cho đề bài */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => questionImageRef.current?.click()}
              className={cn(
                'h-7 gap-1.5 rounded-lg px-2.5 text-xs text-gray-600',
                questionImageFile &&
                  'border-teal-500 bg-teal-50 font-medium text-teal-600'
              )}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              {questionImageFile ? 'Đổi ảnh đề bài' : 'Thêm ảnh đề bài'}
            </Button>
          </div>

          <FormControl>
            <MathInput value={field.value} onChange={field.onChange} />
          </FormControl>

          {/* Preview ảnh của đề bài */}
          {questionImagePreview && (
            <div className="mt-2 flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-2.5">
              <div className="relative inline-block overflow-hidden rounded-lg border border-gray-200 bg-white">
                <img
                  src={questionImagePreview}
                  alt="Ảnh đề bài"
                  className="h-28 max-w-sm rounded object-contain"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  onClick={handleDelete}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <p className="max-w-xs truncate font-medium text-gray-700">
                  {questionImageFile?.name}
                </p>
                <p>{((questionImageFile?.size || 0) / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
