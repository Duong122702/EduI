import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/Input';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface SourceFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export const SourceFormField = <T extends FieldValues>({
  control,
  name,
}: SourceFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
            Tên đề và số thứ tự câu gốc:
          </FormLabel>
          <FormControl>
            <Input
              type="text"
              className="rounded-xl bg-gray-50 text-xs focus-visible:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-300/50"
              placeholder="Tên đề - Số thứ tự câu"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
