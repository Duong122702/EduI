import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface ExplanationFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export const ExplanationFormField = <T extends FieldValues>({
  control,
  name,
}: ExplanationFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
            Hướng dẫn giải
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="Nhập hướng dẫn giải..."
              value={field.value || ''}
              onChange={field.onChange}
              className="bg-gray-50 text-sm"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
