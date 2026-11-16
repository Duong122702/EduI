import { Button } from '@/components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  ChevronLeft,
  CircleQuestionMark,
  SlidersVertical,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  addExamFormSchema,
  type addExamFormSchemaType,
} from '../schemas/AddExamForm.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/ui/Input';
import { ListQuestionExam } from './ListQuestionExam';
import { SubjectCombobox } from './SubjectCombobox';
import { useAddExam } from '@/hooks/Exam/useAddExam';

interface AddExamProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultFormValues: addExamFormSchemaType = {
  title: '',
  description: '',
  duration: 50,
  subject: '',
  status: 'Uncompleted',
  question_ids: [],
};

export const AddExam = ({ isOpen, setIsOpen }: AddExamProps) => {
  const form = useForm<addExamFormSchemaType>({
    resolver: yupResolver(addExamFormSchema),
    defaultValues: defaultFormValues,
  });
  const { mutate: addExam, isPending } = useAddExam();

  const onSubmit = (data: addExamFormSchemaType) => {
    addExam(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      },
    });
  };
  return (
    <div className={`w-full space-y-6 p-6 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex flex-col gap-4 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant={'dark'}
            size={'lg'}
            className="cursor-pointer rounded-lg px-3 text-white hover:opacity-80"
            onClick={() => setIsOpen(false)}
          >
            <ChevronLeft />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Thêm đề thi mới
            </h2>
            <p className="text-xs text-slate-400">Cấu hình đề thi</p>
          </div>
        </div>
        <Button
          variant={'orange'}
          size={'lg'}
          form="add-exam-form"
          type="submit"
          className="rounded-lg px-4 py-2 text-lg font-semibold text-white"
          disabled={isPending}
        >
          Lưu đề thi
        </Button>
      </div>
      <div className="">
        <Form {...form}>
          <form
            id="add-exam-form"
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log('Form validation errors:', err);
            })}
            className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
          >
            <div className="space-y-6 rounded-lg border border-slate-300 bg-white p-6 shadow-sm lg:col-span-4">
              <div className="flex items-center font-bold tracking-wider uppercase">
                <SlidersVertical className="mr-2 h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-900">
                  Thông tin cấu trúc đề
                </span>
              </div>
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full space-y-2">
                    <FormLabel className="text-sm font-semibold text-slate-900">
                      Tên đề thi
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên đề thi"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full space-y-2">
                    <FormLabel className="text-sm font-semibold text-slate-900">
                      Mô tả đề thi
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập mô tả đề thi"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="w-full space-y-2">
                    <FormLabel className="text-sm font-semibold text-slate-900">
                      Thời gian làm bài (phút)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập thời gian làm bài"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
                      Bộ môn học
                    </FormLabel>
                    <FormControl>
                      <SubjectCombobox
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4 lg:col-span-8">
              <FormField
                control={form.control}
                name="question_ids"
                render={({ field }) => (
                  <div>
                    <div className="flex items-center gap-3 rounded-2xl border-b border-slate-300 bg-white px-4 py-3 shadow-sm">
                      <CircleQuestionMark />
                      <span className="text-sm font-medium text-gray-700">
                        Danh sách câu hỏi: {field.value?.length || 0}
                      </span>
                    </div>
                    <div className="rounded-xl border-slate-400 p-3 shadow-sm">
                      <ListQuestionExam
                        selectedIds={(field.value as string[]) || []}
                        onUpdateIds={field.onChange}
                        subject={form.watch('subject')}
                      />
                    </div>
                  </div>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
