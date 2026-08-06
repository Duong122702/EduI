import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { addFormSchema, type UserFormAddValue } from '../Schemas/AddFormSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface OpenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AddQuestionSheet({ open, onOpenChange }: OpenProps) {
  const form = useForm<UserFormAddValue>({
    resolver: yupResolver(addFormSchema),
    defaultValues: {
      subject: 'Toán',
      topic: '',
      difficulty: 'Dễ',
      type: 'Trắc nghiệm',
      content: '',
    },
  });

  const onSubmit = (data: UserFormAddValue) => {
    console.log('data', data);
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Nội dung Sheet trượt từ bên phải ra (side="right") */}
      <SheetContent
        side="right"
        className="w-112.5 overflow-y-auto p-4 sm:max-w-125"
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-4"
          >
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
                    Bộ môn học
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
                    Độ khó câu hỏi
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        'Nhận biết',
                        'Thông hiểu',
                        'Vận dụng',
                        'Vận dụng cao',
                      ].map((item) => (
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
                      ))}
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
                    <div className="grid grid-cols-3 gap-2">
                      {['Trắc nghiệm', 'Đúng/Sai', 'Tự luận'].map((item) => (
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
                      ))}
                    </div>
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
                    <Textarea
                      rows={4}
                      placeholder="Ví dụ: Tính đạo hàm hàm số $y = e^{2x}$ tại điểm $x = 0$?"
                      className="resize-none bg-gray-50 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Lưu câu hỏi
            </Button>
          </form>
        </Form>

        {/* Footer chứa nút thao tác */}
        <SheetFooter className="flex gap-2 border-t pt-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Hủy bỏ
            </Button>
          </SheetClose>
          <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
            Lưu vào ngân hàng
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default AddQuestionSheet;
