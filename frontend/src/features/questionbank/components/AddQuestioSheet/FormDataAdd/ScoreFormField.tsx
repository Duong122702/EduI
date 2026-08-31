import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/Input';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface ScoreFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export const ScoreFormField = <T extends FieldValues>({
  control,
  name,
}: ScoreFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
            Điểm cho câu hỏi:
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.05"
              placeholder="VD: 0.25"
              className="rounded-xl bg-gray-50 text-xs focus-visible:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-300/50"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
