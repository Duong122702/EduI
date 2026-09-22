import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import type { Question } from '@/Models/questions.model';
import { Plus, X } from 'lucide-react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface SubQuestionFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  questions: Question[];
  onAddQuestion?: () => void;
  setSelectedQuestions?: React.Dispatch<
    React.SetStateAction<Question[] | null>
  >;
}

export const SubQuestionField = <T extends FieldValues>({
  control,
  name,
  questions,
  onAddQuestion,
  setSelectedQuestions,
}: SubQuestionFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel>Các câu hỏi con thuộc chùm này</FormLabel>
          <div className="space-y-2">
            {(field.value || []).map((id: string) => {
              const questionData = questions.find((q) => q.id === id);
              return (
                <div
                  key={id}
                  className="bg-background flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm shadow-sm"
                >
                  <span className="truncate">
                    {questionData?.content ||
                      `Đang tải nội dung câu hỏi... (${id})`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedValues = (field.value || []).filter(
                        (val: string) => val !== id
                      );
                      field.onChange(updatedValues);
                      setSelectedQuestions?.((prev) =>
                        prev ? prev.filter((q) => q.id !== id) : null
                      );
                    }}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
            <div
              onClick={onAddQuestion}
              className="text-muted-foreground hover:bg-muted/50 hover:text-foreground flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-3 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Thêm câu hỏi
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};
