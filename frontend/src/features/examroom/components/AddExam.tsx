import { useRef, useState } from 'react';
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
  FileUp,
  Loader2,
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
import { useExtractPdf } from '@/hooks/Exam/useExtractPdf';
import type { ExtractedQuestion } from '@/api/exam/extractExamPdf.api';

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
  extraction_id: null,
};

export const AddExam = ({ isOpen, setIsOpen }: AddExamProps) => {
  const form = useForm<addExamFormSchemaType>({
    resolver: yupResolver(addExamFormSchema),
    defaultValues: defaultFormValues,
  });
  const { mutate: addExam, isPending } = useAddExam();
  const { mutate: extractPdf, isPending: isExtracting } = useExtractPdf();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [extractedQuestions, setExtractedQuestions] = useState<
    ExtractedQuestion[]
  >([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    extractPdf(file, {
      onSuccess: (res) => {
        const data = res.data.data;
        if (!data) return;

        form.setValue('title', data.examMetadata.examName);
        form.setValue('subject', data.examMetadata.subject);
        form.setValue('extraction_id', data.extractionId);
        form.setValue('question_ids', []);

        setExtractedQuestions(data.questions);
      },
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = (data: addExamFormSchemaType) => {
    addExam(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
        setExtractedQuestions([]);
      },
    });
  };

  const actualQuestions = extractedQuestions.filter((q) => !q.isPassage);
  const hasExtraction = !!form.watch('extraction_id');

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
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="rounded-lg border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            disabled={isExtracting}
            onClick={() => fileInputRef.current?.click()}
          >
            {isExtracting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang trích xuất...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Import từ PDF
              </>
            )}
          </Button>
          <Button
            variant={'orange'}
            size={'lg'}
            form="add-exam-form"
            type="submit"
            className="rounded-lg px-4 py-2 text-lg font-semibold text-white"
            disabled={isPending || isExtracting}
          >
            Lưu đề thi
          </Button>
        </div>
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
              {hasExtraction && extractedQuestions.length > 0 ? (
                <div>
                  <div className="flex items-center gap-3 rounded-2xl border-b border-slate-300 bg-white px-4 py-3 shadow-sm">
                    <CircleQuestionMark />
                    <span className="text-sm font-medium text-gray-700">
                      Câu hỏi trích xuất từ PDF: {actualQuestions.length}
                    </span>
                    <span className="ml-auto rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      Tự động
                    </span>
                  </div>
                  <div className="mt-3 max-h-[600px] space-y-3 overflow-y-auto rounded-xl border border-slate-200 p-3">
                    {actualQuestions.map((q, idx) => (
                      <div
                        key={q.tempId || idx}
                        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                            {idx + 1}
                          </span>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {q.questionType}
                          </span>
                        </div>
                        <p className="text-sm text-slate-800">{q.content}</p>
                        {q.options && (
                          <div className="mt-2 space-y-1 pl-4">
                            {Object.entries(q.options).map(([key, opt]) => (
                              <p key={key} className="text-xs text-slate-600">
                                <span className="font-semibold">{key}.</span>{' '}
                                {opt.content}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
