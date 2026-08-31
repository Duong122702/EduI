import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import type { QuestionFormAddValue } from '@/features/questionbank/Schemas/AddFormSchema';
import { RenderOptionItem } from './RederOptionItem';

interface TypeFormFieldProps {
  form: UseFormReturn<QuestionFormAddValue>;
}

export const TypeFormField = ({ form }: TypeFormFieldProps) => {
  return (
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
                          {(['A', 'B', 'C', 'D'] as const).map((key) => (
                            <RenderOptionItem
                              key={key}
                              isTrueFalse={false}
                              form={form}
                            />
                          ))}
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
                          {(['A', 'B', 'C', 'D'] as const).map((key) => (
                            <RenderOptionItem
                              key={key}
                              isTrueFalse={true}
                              form={form}
                            />
                          ))}
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
  );
};
