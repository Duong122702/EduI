import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface LevelFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  levelColorMap: Record<string, string>;
}

export const LevelFormField = <T extends FieldValues>({
  control,
  name,
  levelColorMap,
}: LevelFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
            Độ khó câu hỏi
          </FormLabel>
          <FormControl>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'].map(
                (item) => {
                  const isSelected = field.value === item;
                  const activeClass = levelColorMap[item];
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => field.onChange(item)}
                      className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                        isSelected
                          ? `${activeClass} font-semibold shadow-sm`
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {item}
                    </button>
                  );
                }
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
