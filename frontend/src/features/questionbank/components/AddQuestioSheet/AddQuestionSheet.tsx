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

interface OpenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AddQuestionSheet({ open, onOpenChange }: OpenProps) {
  const form = useForm<QuestionFormAddValue>({
    resolver: yupResolver(addFormSchema),
    defaultValues: {
      subject: '',
      topic: '',
      level: 'Dễ',
      type: 'Trắc nghiệm',
      content: '',
      correct_answer: '',
      options: {
        A: '',
        B: '',
        C: '',
        D: '',
      },
    },
  });

  const onSubmit = (data: QuestionFormAddValue) => {
    console.log('data', data);
  };
  const options = form.watch('options') as Record<string, string>;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Nội dung Sheet trượt từ bên phải ra (side="right") */}
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-4 sm:max-w-125"
      >
        <SheetHeader className="border-b pb-4 text-left">
          <SheetTitle className="text-lg font-bold tracking-wide text-gray-800 uppercase">
            Thêm câu hỏi mới
          </SheetTitle>
          <SheetDescription className="text-xs text-gray-500">
            Thiết lập tham số và nội dung đáp án chuẩn.
          </SheetDescription>
        </SheetHeader>

        {/* Form nhập liệu */}
        <FormDataAdd form={form} onSubmit={onSubmit} options={options} />
        {/* Footer chứa nút thao tác */}
        <SheetFooter className="flex gap-2 border-t pt-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Hủy bỏ
            </Button>
          </SheetClose>
          <Button
            type="submit"
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
            form="add-question-form"
          >
            Lưu vào ngân hàng
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default AddQuestionSheet;
