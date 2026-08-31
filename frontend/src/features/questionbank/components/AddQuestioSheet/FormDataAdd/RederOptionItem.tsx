import { Input } from '@/components/ui/Input';
import type { OptionKey } from '../FormDataAdd';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ImagePlus, X } from 'lucide-react';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { UseFormReturn } from 'react-hook-form';
import type { QuestionFormAddValue } from '@/features/questionbank/Schemas/AddFormSchema';
import { useHandleFile } from '@/hooks/Question/usehandleFile';

interface RederOptionItemProps {
  key: OptionKey;
  isTrueFalse: boolean;
  form: UseFormReturn<QuestionFormAddValue>;
}

export const RenderOptionItem = ({
  key,
  isTrueFalse,
  form,
}: RederOptionItemProps) => {
  const selectedFile = form.watch(`options.${key}.image_file`) as
    | File
    | null
    | undefined;
  const previewUrl =
    selectedFile instanceof File ? URL.createObjectURL(selectedFile) : null;
  const contentValue = form.watch(`options.${key}.content`) || '';

  const { handleFileChange, handleRemoveImage, fileInputRefs } =
    useHandleFile(form);

  return (
    <div
      key={key}
      className="space-y-2 rounded-xl border border-gray-100 bg-gray-50/60 p-3 transition-all hover:border-gray-200"
    >
      <div className="flex items-center gap-3">
        <span className="w-5 text-center text-sm font-bold text-gray-700">
          {key}
        </span>

        {/* Ô nhập nội dung chữ */}
        <div className="flex-1">
          <Input
            placeholder={`Lựa chọn ${key}`}
            value={contentValue}
            onChange={(e) =>
              form.setValue(`options.${key}.content`, e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            className="bg-white text-sm"
          />
        </div>

        {/* Input file ẩn */}
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          ref={fileInputRefs[key]}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            handleFileChange(key, file);
          }}
        />

        {/* Nút bấm tải ảnh */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Tải ảnh lên từ máy tính"
          className={cn(
            'h-9 w-9 shrink-0 transition-colors',
            selectedFile && 'border-teal-500 bg-teal-50 text-teal-600'
          )}
          onClick={() => fileInputRefs[key].current?.click()}
        >
          <ImagePlus className="h-4 w-4" />
        </Button>

        {/* Khối chọn Đúng / Sai hoặc Đáp án đúng */}
        {!isTrueFalse ? (
          <div className="flex items-center space-x-1.5 pl-1">
            <RadioGroupItem
              value={key}
              id={`option-${key}`}
              className="border-gray-300 text-emerald-600 focus:ring-emerald-500 data-[state=checked]:border-emerald-600 data-[state=checked]:text-emerald-600"
            />
            <Label
              htmlFor={`option-${key}`}
              className="cursor-pointer text-xs font-bold tracking-wider text-gray-500 uppercase"
            >
              Đúng
            </Label>
          </div>
        ) : (
          <div className="flex items-center space-x-2 pl-1">
            <div className="flex items-center space-x-1">
              <RadioGroupItem
                value={`${key}_TRUE`}
                id={`option-tf-${key}-true`}
                className="border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <Label
                htmlFor={`option-tf-${key}-true`}
                className="cursor-pointer text-xs font-bold text-gray-500 uppercase"
              >
                Đúng
              </Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem
                value={`${key}_FALSE`}
                id={`option-tf-${key}-false`}
                className="border-gray-300 text-rose-600 focus:ring-rose-500"
              />
              <Label
                htmlFor={`option-tf-${key}-false`}
                className="cursor-pointer text-xs font-bold text-gray-500 uppercase"
              >
                Sai
              </Label>
            </div>
          </div>
        )}
      </div>

      {/* Khung xem trước (Preview) ảnh đã tải lên */}
      {previewUrl && (
        <div className="ml-8 flex items-center gap-3 pt-1">
          <div className="relative inline-block overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            <img
              src={previewUrl}
              alt={`Preview ${key}`}
              className="h-20 max-w-xs rounded object-contain"
            />
            <button
              type="button"
              className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white transition-opacity hover:bg-black/80"
              onClick={() => handleRemoveImage(key)}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="max-w-xs truncate text-[11px] text-gray-500 italic">
            {selectedFile?.name} ({(selectedFile!.size / 1024).toFixed(1)} KB)
          </span>
        </div>
      )}
    </div>
  );
};
