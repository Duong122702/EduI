import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface IsPassageFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export const IsPassageField = <T extends FieldValues>({
  control,
  name,
}: IsPassageFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="bg-muted/20 flex flex-row items-center space-y-0 space-x-3 rounded-md border p-4 shadow-sm">
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onChange={field.onChange}
            ></Checkbox>
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer">
              Đây là câu hỏi chùm (Passage)
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};
