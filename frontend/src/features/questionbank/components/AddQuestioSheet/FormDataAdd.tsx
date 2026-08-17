import { Button } from '@/components/ui/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { MathInput } from '@/components/ui/MathInput';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { levelColorMap } from '@/constants/levelColor';
import type { QuestionFormAddValue } from '@/features/questionbank/Schemas/AddFormSchema';
import { useQuestionOptions } from '@/hooks/Question/useQuestionOptions';
import { cn } from '@/lib/utils';
import type { Question } from '@/Models/questions.model';
import { Check, ChevronsUpDown, ImagePlus, Plus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface FormDataAddProps {
  form: UseFormReturn<QuestionFormAddValue>;
  onSubmit: (data: QuestionFormAddValue) => void;
  options?: QuestionFormAddValue['options'];
  questions?: Question[];
}

type OptionKey = 'A' | 'B' | 'C' | 'D';

export const FormDataAdd = ({
  form,
  onSubmit,
  questions,
}: FormDataAddProps) => {
  const { uniqueSubjects } = useQuestionOptions(questions);

  // Quản lý ref input file cho 4 lựa chọn A, B, C, D
  const fileInputRefs: Record<
    OptionKey,
    React.RefObject<HTMLInputElement | null>
  > = {
    A: useRef<HTMLInputElement>(null),
    B: useRef<HTMLInputElement>(null),
    C: useRef<HTMLInputElement>(null),
    D: useRef<HTMLInputElement>(null),
  };

  // Thêm 1 ref cho ảnh đề bài trong FormDataAdd:
  const questionImageRef = useRef<HTMLInputElement>(null);

  const questionImageFile = form.watch('question_image_file') as
    | File
    | null
    | undefined;
  const questionImagePreview =
    questionImageFile instanceof File
      ? URL.createObjectURL(questionImageFile)
      : null;

  // Cập nhật File vào React Hook Form
  const handleFileChange = (key: OptionKey, file: File | null) => {
    form.setValue(`options.${key}.image_file`, file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Xóa ảnh đã chọn
  const handleRemoveImage = (key: OptionKey) => {
    handleFileChange(key, null);
    if (fileInputRefs[key].current) {
      fileInputRefs[key].current.value = '';
    }
  };

  // Render từng dòng lựa chọn (A, B, C, D)
  const renderOptionItem = (key: OptionKey, isTrueFalse = false) => {
    const selectedFile = form.watch(`options.${key}.image_file`) as
      | File
      | null
      | undefined;
    const previewUrl =
      selectedFile instanceof File ? URL.createObjectURL(selectedFile) : null;
    const contentValue = form.watch(`options.${key}.content`) || '';

    return (
      <div
        key={key}
        className="space-y-2 rounded-xl border border-gray-100 bg-gray-50/60 p-3 transition-all hover:border-gray-200"
      >
        <div className="flex items-center gap-3">
          <span className="w-5 text-center text-sm font-bold text-gray-700">
            {key}
          </span>

          {/* Ô nhập nội dung chữ */}
          <div className="flex-1">
            <Input
              placeholder={`Lựa chọn ${key}`}
              value={contentValue}
              onChange={(e) =>
                form.setValue(`options.${key}.content`, e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className="bg-white text-sm"
            />
          </div>

          {/* Input file ẩn */}
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            ref={fileInputRefs[key]}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              handleFileChange(key, file);
            }}
          />

          {/* Nút bấm tải ảnh */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            title="Tải ảnh lên từ máy tính"
            className={cn(
              'h-9 w-9 shrink-0 transition-colors',
              selectedFile && 'border-teal-500 bg-teal-50 text-teal-600'
            )}
            onClick={() => fileInputRefs[key].current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>

          {/* Khối chọn Đúng / Sai hoặc Đáp án đúng */}
          {!isTrueFalse ? (
            <div className="flex items-center space-x-1.5 pl-1">
              <RadioGroupItem
                value={key}
                id={`option-${key}`}
                className="border-gray-300 text-emerald-600 focus:ring-emerald-500 data-[state=checked]:border-emerald-600 data-[state=checked]:text-emerald-600"
              />
              <Label
                htmlFor={`option-${key}`}
                className="cursor-pointer text-xs font-bold tracking-wider text-gray-500 uppercase"
              >
                Đúng
              </Label>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-1">
              <div className="flex items-center space-x-1">
                <RadioGroupItem
                  value={`${key}_TRUE`}
                  id={`option-tf-${key}-true`}
                  className="border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <Label
                  htmlFor={`option-tf-${key}-true`}
                  className="cursor-pointer text-xs font-bold text-gray-500 uppercase"
                >
                  Đúng
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem
                  value={`${key}_FALSE`}
                  id={`option-tf-${key}-false`}
                  className="border-gray-300 text-rose-600 focus:ring-rose-500"
                />
                <Label
                  htmlFor={`option-tf-${key}-false`}
                  className="cursor-pointer text-xs font-bold text-gray-500 uppercase"
                >
                  Sai
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Khung xem trước (Preview) ảnh đã tải lên */}
        {previewUrl && (
          <div className="ml-8 flex items-center gap-3 pt-1">
            <div className="relative inline-block overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
              <img
                src={previewUrl}
                alt={`Preview ${key}`}
                className="h-20 max-w-xs rounded object-contain"
              />
              <button
                type="button"
                className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white transition-opacity hover:bg-black/80"
                onClick={() => handleRemoveImage(key)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="max-w-xs truncate text-[11px] text-gray-500 italic">
              {selectedFile?.name} ({(selectedFile!.size / 1024).toFixed(1)} KB)
            </span>
          </div>
        )}
      </div>
    );
  };

  const onError = (errors: any) => {
    console.log('Form Validation Errors: ', errors);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-5 py-4"
        id="add-question-form"
      >
        {/* BỘ MÔN */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => {
            const [open, setOpen] = useState(false);
            const [searchValue, setSearchValue] = useState('');
            const handleSelect = (val: string) => {
              field.onChange(val);
              setOpen(false);
              setSearchValue('');
            };
            return (
              <FormItem>
                <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
                  Bộ môn học
                </FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                          'w-full justify-between bg-gray-50 text-xs font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value || 'Chọn bộ môn'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput
                        placeholder="Tìm hoặc gõ môn học"
                        value={searchValue}
                        onValueChange={setSearchValue}
                        className="text-xs"
                      />
                      <CommandList>
                        <CommandEmpty className="p-1">
                          {searchValue.trim() ? (
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
                              onClick={() => handleSelect(searchValue.trim())}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Thêm môn: "{searchValue.trim()}"
                            </button>
                          ) : (
                            <p className="py-2 text-center text-xs text-gray-500">
                              Không tìm thấy môn học
                            </p>
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {uniqueSubjects.map((sub) => (
                            <CommandItem
                              key={sub}
                              value={sub}
                              onSelect={() => handleSelect(sub)}
                              className="text-xs"
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-3.5 w-3.5',
                                  field.value === sub
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {sub}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* CHỦ ĐỀ */}
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
                Chủ đề / Nhãn tag
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Đạo hàm, Tích phân..."
                  className="rounded-xl bg-gray-50 text-xs focus-visible:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-300/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ĐỘ KHÓ */}
        <FormField
          control={form.control}
          name="level"
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

        {/* THỂ LOẠI CÂU HỎI VÀ ĐÁP ÁN */}
        <FormField
          control={form.control}
          name="questionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
                Thể loại câu hỏi
              </FormLabel>
              <FormControl>
                <Tabs value={field.value} onValueChange={field.onChange}>
                  <TabsList className="bg-transparent">
                    {['Trắc nghiệm', 'Đúng/Sai', 'Trả lời ngắn'].map((item) => (
                      <TabsTrigger
                        key={item}
                        value={item}
                        className="w-1/3 text-xs font-bold data-[state=active]:border data-[state=active]:border-teal-400 data-[state=active]:bg-teal-200/30 data-[state=active]:text-teal-800"
                      >
                        {item}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* TAB: TRẮC NGHIỆM */}
                  <TabsContent value="Trắc nghiệm">
                    <FormField
                      control={form.control}
                      name="correct_answer"
                      render={({ field: answerField }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                            Danh sách các lựa chọn và đáp án đúng
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              value={answerField.value}
                              onValueChange={answerField.onChange}
                              className="space-y-3"
                            >
                              {(['A', 'B', 'C', 'D'] as const).map((key) =>
                                renderOptionItem(key, false)
                              )}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* TAB: ĐÚNG / SAI */}
                  <TabsContent value="Đúng/Sai">
                    <FormField
                      control={form.control}
                      name="correct_answer"
                      render={({ field: answerField }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                            Danh sách các lựa chọn và đáp án đúng
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              value={answerField.value}
                              onValueChange={answerField.onChange}
                              className="space-y-3"
                            >
                              {(['A', 'B', 'C', 'D'] as const).map((key) =>
                                renderOptionItem(key, true)
                              )}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* TAB: TRẢ LỜI NGẮN */}
                  <TabsContent value="Trả lời ngắn">
                    <FormField
                      control={form.control}
                      name="correct_answer"
                      render={({ field: shortField }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                            Đáp án chính xác
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập đáp án chuẩn..."
                              value={shortField.value}
                              onChange={shortField.onChange}
                              className="bg-gray-50 text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NỘI DUNG ĐỀ BÀI */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
                  Nội dung đề bài
                </FormLabel>

                {/* Input file ẩn cho ảnh đề bài */}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  ref={questionImageRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    form.setValue('question_image_file', file, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />

                {/* Nút bấm thêm ảnh cho đề bài */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => questionImageRef.current?.click()}
                  className={cn(
                    'h-7 gap-1.5 rounded-lg px-2.5 text-xs text-gray-600',
                    questionImageFile &&
                      'border-teal-500 bg-teal-50 font-medium text-teal-600'
                  )}
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  {questionImageFile ? 'Đổi ảnh đề bài' : 'Thêm ảnh đề bài'}
                </Button>
              </div>

              <FormControl>
                <MathInput value={field.value} onChange={field.onChange} />
              </FormControl>

              {/* Preview ảnh của đề bài */}
              {questionImagePreview && (
                <div className="mt-2 flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-2.5">
                  <div className="relative inline-block overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <img
                      src={questionImagePreview}
                      alt="Ảnh đề bài"
                      className="h-28 max-w-sm rounded object-contain"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                      onClick={() => {
                        form.setValue('question_image_file', null, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        if (questionImageRef.current) {
                          questionImageRef.current.value = '';
                        }
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1 text-xs text-gray-500">
                    <p className="max-w-xs truncate font-medium text-gray-700">
                      {questionImageFile?.name}
                    </p>
                    <p>
                      {((questionImageFile?.size || 0) / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        {/* HƯỚNG DẪN GIẢI */}
        <FormField
          control={form.control}
          name="explanation"
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

        {/* SỐ THỨ TỰ & ĐIỂM SỐ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="sourceLabel"
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

          <FormField
            control={form.control}
            name="scoreWeight"
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
        </div>
      </form>
    </Form>
  );
};

export default FormDataAdd;
