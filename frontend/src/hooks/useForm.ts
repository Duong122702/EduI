// hooks/useForm.ts
import { useState } from 'react';
import * as Yup from 'yup';

interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: Yup.ObjectSchema<T> | Yup.AnyObjectSchema;
  // Cho phép biến đổi dữ liệu trước khi validate (nếu cần)
  transformData?: (values: T) => T;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  transformData,
  onSubmit,
}: UseFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Cập nhật giá trị input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    // Tùy chọn: Xóa lỗi của field đó ngay khi user gõ lại
    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Xử lý Submit chung & Parse lỗi Yup
  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    // Nếu có hàm transformData thì chạy nó trước, không thì lấy formData gốc
    const dataToValidate = transformData ? transformData(formData) : formData;

    try {
      if (validationSchema) {
        await validationSchema.validate(dataToValidate, { abortEarly: false });
      }

      setErrors({});
      // Call API thông qua hàm onSubmit truyền từ component vào
      await onSubmit(dataToValidate);
    } catch (yupError) {
      if (yupError instanceof Yup.ValidationError) {
        const newErrors: Partial<Record<keyof T, string>> = {};

        yupError.inner.forEach((validationError) => {
          if (validationError.path) {
            newErrors[validationError.path as keyof T] =
              validationError.message;
          }
        });

        setErrors(newErrors);

        // Tự động cuộn tới ô bị lỗi đầu tiên
        const firstErrorKey = Object.keys(newErrors)[0];
        if (firstErrorKey) {
          const errorElement = document.getElementsByName(firstErrorKey)[0];
          errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    handleChange,
    handleSubmit,
  };
}
