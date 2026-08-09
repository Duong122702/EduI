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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { QuestionFormAddValue } from '@/features/questionbank/Schemas/AddFormSchema';
import type { UseFormReturn } from 'react-hook-form';

interface FormDataAddProps {
  form: UseFormReturn<QuestionFormAddValue>;
  onSubmit: (data: QuestionFormAddValue) => void;
  options: Record<string, string>;
}

export const FormDataAdd = ({ form, onSubmit, options }: FormDataAddProps) => {
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
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
                Bộ môn học
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-50 text-sm">
                    <SelectValue placeholder="Chọn bộ môn" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Toán học">Toán học</SelectItem>
                  <SelectItem value="Vật lý">Vật lý</SelectItem>
                  <SelectItem value="Hóa học">Hóa học</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
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
                  className="bg-gray-50 text-sm"
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
                <div className="grid grid-cols-3 gap-2">
                  {['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'].map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => field.onChange(item)}
                        className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                          field.value === item
                            ? 'border-emerald-400 bg-emerald-50 font-semibold text-emerald-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {item}
                      </button>
                    )
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
                  <TabsList className="">
                    {['Trắc nghiệm', 'Đúng/Sai', 'Trả lời ngắn'].map((item) => (
                      <TabsTrigger key={item} value={item}>
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
