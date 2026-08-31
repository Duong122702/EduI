import type { OptionKey } from '@/features/questionbank/components/AddQuestioSheet/FormDataAdd';
import type { QuestionFormAddValue } from '@/features/questionbank/Schemas/AddFormSchema';
import { useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export const useHandleFile = (form: UseFormReturn<QuestionFormAddValue>) => {
  // Quản lý ref input file cho 4 lựa chọn A, B, C, D
  const fileInputRefs: Record<
    OptionKey,
    React.RefObject<HTMLInputElement | null>
  > = {
    A: useRef<HTMLInputElement>(null),
    B: useRef<HTMLInputElement>(null),
    C: useRef<HTMLInputElement>(null),
    D: useRef<HTMLInputElement>(null),
  };

  // Cập nhật File vào React Hook Form
  const handleFileChange = (key: OptionKey, file: File | null) => {
    form.setValue(`options.${key}.image_file`, file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  // Xóa ảnh đã chọn
  const handleRemoveImage = (key: OptionKey) => {
    handleFileChange(key, null);
    if (fileInputRefs[key].current) {
      fileInputRefs[key].current.value = '';
    }
  };
  return { handleFileChange, handleRemoveImage, fileInputRefs };
};
