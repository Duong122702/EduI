import { Button } from '@/components/ui/Button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useForm } from 'react-hook-form';
import {
  addFormSchema,
  type QuestionFormAddValue,
} from '../../Schemas/AddFormSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import FormDataAdd from './FormDataAdd';
import type { Question } from '@/Models/questions.model';
import { useAddQuestion } from '@/hooks/Question/useAddQuestion';
import { Loader2 } from 'lucide-react';
import { useUpdateQuestion } from '@/hooks/Question/useUpdateQuestion';
import { useEffect } from 'react';

interface OpenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions?: Question[];
  editData?: Question | null;
}

const defaultFormValues: QuestionFormAddValue = {
  subject: '',
  topic: '',
  level: 'Nhận biết',
  questionType: 'Trắc nghiệm',
  content: '',
  question_image_file: null,
  correct_answer: '',
  explanation: '',
  sourceLabel: '',
  scoreWeight: 0.25,
  options: {
    A: { content: '', image_file: null },
    B: { content: '', image_file: null },
    C: { content: '', image_file: null },
    D: { content: '', image_file: null },
  },
};

function AddQuestionSheet({
  open,
  onOpenChange,
  questions,
  editData,
}: OpenProps) {
  const form = useForm<QuestionFormAddValue>({
    resolver: yupResolver(addFormSchema),
    defaultValues: defaultFormValues,
  });

  const { mutate: addQuestion, isPending: isAdding } = useAddQuestion();
  const { mutate: updateQuestion, isPending: isUpdating } = useUpdateQuestion();

  const isPending = isAdding || isUpdating;

  useEffect(() => {
    if (open) {
      if (editData) {
        form.reset({
          subject: editData.subject || '',
          topic: editData.topic || '',
          level: editData.level || 'Nhận biết',
          questionType: editData.questionType || 'Trắc nghiệm',
          content: editData.content || '',
          correct_answer: editData.correct_answer || '',
          explanation: editData.explanation || '',
          sourceLabel: editData.sourceLabel || '',
          scoreWeight: editData.score_weight || 0.25,
          question_image_file: null, // Ảnh cũ giữ nguyên trên backend nếu không chọn file mới
          options: {
            A: {
              content:
                editData.options?.find((o) => o.key === 'A')?.content || '',
              image_file: null,
            },
            B: {
              content:
                editData.options?.find((o) => o.key === 'B')?.content || '',
              image_file: null,
            },
            C: {
              content:
                editData.options?.find((o) => o.key === 'C')?.content || '',
              image_file: null,
            },
            D: {
              content:
                editData.options?.find((o) => o.key === 'D')?.content || '',
              image_file: null,
            },
          },
        });
      } else {
        form.reset(defaultFormValues);
      }
    }
  }, [open, editData, form]);

  const onSubmit = (data: QuestionFormAddValue) => {
    if (editData) {
      updateQuestion(
        { id: editData.id, data },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      addQuestion(data, {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      });
    }
  };
  const options = form.watch('options');
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Nội dung Sheet trượt từ bên phải ra (side="right") */}
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-4 sm:max-w-125"
      >
        <SheetHeader className="border-b pb-4 text-left">
          <SheetTitle className="text-lg font-bold tracking-wide text-gray-800 uppercase">
            {editData ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
          </SheetTitle>
          <SheetDescription className="text-xs text-gray-500">
            Thiết lập tham số và nội dung đáp án chuẩn.
          </SheetDescription>
        </SheetHeader>

        {/* Form nhập liệu */}
        <FormDataAdd
          form={form}
          onSubmit={onSubmit}
          options={options}
          questions={questions}
        />
        {/* Footer chứa nút thao tác */}
        <SheetFooter className="flex gap-2 border-t pt-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-1/2">
              Hủy bỏ
            </Button>
          </SheetClose>
          <Button
            type="submit"
            className="w-1/2 bg-emerald-600 text-white hover:bg-emerald-700"
            form="add-question-form"
            disabled={isPending}
          >
            {isPending ? (
              <span>
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </span>
              </span>
            ) : (
              'Lưu vào ngân hàng'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default AddQuestionSheet;
