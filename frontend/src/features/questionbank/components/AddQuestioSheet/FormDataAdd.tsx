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
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface FormDataAddProps {
  form: UseFormReturn<QuestionFormAddValue>;
  onSubmit: (data: QuestionFormAddValue) => void;
  options: Record<string, string>;
  questions?: Question[];
}

export const FormDataAdd = ({
  form,
  onSubmit,
  options,
  questions,
}: FormDataAddProps) => {
  const { uniqueSubjects } = useQuestionOptions(questions);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 py-4"
        id="add-question-form"
      >
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
        <FormField
          control={form.control}
          name="type"
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
                              {(['A', 'B', 'C', 'D'] as const).map((key) => (
                                <div
                                  key={key}
                                  className="flex items-center gap-3"
                                >
                                  <span className="w-4 text-sm font-bold text-gray-500">
                                    {key}
                                  </span>
                                  <div className="flex-1">
                                    <Input
                                      placeholder={`Lựa chọn ${key}`}
                                      value={options?.[key] ?? ''}
                                      onChange={(e) =>
                                        form.setValue(
                                          `options.${key}`,
                                          e.target.value,
                                          {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                          }
                                        )
                                      }
                                      className="bg-gray-50 text-sm"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-1.5 pl-1">
                                    <RadioGroupItem
                                      value={key}
                                      id={`option-${key}`}
                                      className="border-gray-300 text-emerald-600 focus:ring-emerald-500 data-[state=checked]:border-emerald-600 data-[state=checked]:text-emerald-600"
                                    >
                                      <Label
                                        htmlFor={`option-${key}`}
                                        className="cursor-pointer text-xs font-bold tracking-wider text-gray-500 uppercase"
                                      >
                                        Đúng
                                      </Label>
                                    </RadioGroupItem>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
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
                              {(['A', 'B', 'C', 'D'] as const).map((key) => (
                                <div
                                  className="flex items-center gap-3"
                                  key={key}
                                >
                                  <span className="w-4 text-sm font-bold text-gray-500">
                                    {key}
                                  </span>
                                  <div className="flex-1">
                                    <Input
                                      placeholder={`Lựa chọn ${key}`}
                                      value={options?.[key] ?? ''}
                                      onChange={(e) =>
                                        form.setValue(
                                          `options.${key}`,
                                          e.target.value,
                                          {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                          }
                                        )
                                      }
                                      className="bg-gray-50 text-sm"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-1.5 pl-1">
                                    <RadioGroupItem
                                      value={`${key}_TRUE`}
                                      id={`option-tf-${key}-true`}
                                      className="border-gray-300 text-emerald-600 focus:ring-emerald-500 data-[state=checked]:border-emerald-600 data-[state=checked]:text-emerald-600"
                                    >
                                      <Label
                                        htmlFor={`option-tf-${key}-true`}
                                        className="cursor-pointer text-xs font-bold tracking-wider text-gray-500 uppercase"
                                      >
                                        Đúng
                                      </Label>
                                    </RadioGroupItem>
                                    <RadioGroupItem
                                      value={`${key}_FALSE`}
                                      id={`option-tf-${key}-false`}
                                      className="border-gray-300 text-emerald-600 focus:ring-emerald-500 data-[state=checked]:border-emerald-600 data-[state=checked]:text-emerald-600"
                                    >
                                      <Label
                                        htmlFor={`option-tf-${key}-false`}
                                        className="cursor-pointer text-xs font-bold tracking-wider text-gray-500 uppercase"
                                      >
                                        Sai
                                      </Label>
                                    </RadioGroupItem>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </TabsContent>
                  <TabsContent value="Trả lời ngắn">
                    <FormField
                      control={form.control}
                      name="correct_answer"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                            Danh sách các lựa chọn và đáp án đúng
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Đáp án"
                              value={field.value}
                              onChange={field.onChange}
                              className="bg-gray-50 text-sm"
                            />
                          </FormControl>
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
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
                Nội dung đề bài (hỗ trợ ký hiệu toán bằng ...)
              </FormLabel>
              <FormControl>
                <MathInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
      </form>
    </Form>
  );
};

export default FormDataAdd;
