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
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useState } from 'react';

function AddQuestionSheet() {
  const [difficulty, setDifficulty] = useState('Dễ');
  const [type, setType] = useState('Trắc nghiệm');

  return (
    <Sheet>
      {/* Nút bấm để mở Sheet */}
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600">
          <Plus className="h-5 w-5" />
          Thêm câu hỏi mới
        </Button>
      </SheetTrigger>

      {/* Nội dung Sheet trượt từ bên phải ra (side="right") */}
      <SheetContent
        side="right"
        className="w-112.5 overflow-y-auto sm:max-w-125"
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
        <div className="space-y-5 py-4">
          {/* Bộ môn học */}
          <div>
            <label className="mb-1 block text-xs font-bold tracking-wider text-gray-600 uppercase">
              Bộ môn học
            </label>
            <select className="w-full rounded-lg border bg-gray-50 p-2.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none">
              <option>Toán học</option>
              <option>Vật lý</option>
              <option>Hóa học</option>
            </select>
          </div>

          {/* Chủ đề / Nhãn Tag */}
          <div>
            <label className="mb-1 block text-xs font-bold tracking-wider text-gray-600 uppercase">
              Chủ đề / Nhãn tag
            </label>
            <Input
              placeholder="Ví dụ: Đạo hàm, Tích phân..."
              className="bg-gray-50 text-sm"
            />
          </div>

          {/* Độ khó câu hỏi */}
          <div>
            <label className="mb-1 block text-xs font-bold tracking-wider text-gray-600 uppercase">
              Độ khó câu hỏi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Dễ', 'Trung bình', 'Khó'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDifficulty(item)}
                  className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                    difficulty === item
                      ? 'border-emerald-400 bg-emerald-50 font-semibold text-emerald-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Thể loại câu hỏi */}
          <div>
            <label className="mb-1 block text-xs font-bold tracking-wider text-gray-600 uppercase">
              Thể loại câu hỏi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Trắc nghiệm', 'Đúng/Sai', 'Tự luận'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setType(item)}
                  className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                    type === item
                      ? 'border-emerald-400 bg-emerald-50 font-semibold text-emerald-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Nội dung đề bài */}
          <div>
            <label className="mb-1 block text-xs font-bold tracking-wider text-gray-600 uppercase">
              Nội dung đề bài (hỗ trợ ký hiệu toán bằng ...)
            </label>
            <Textarea
              rows={4}
              placeholder="Ví dụ: Tính đạo hàm hàm số $y = e^{2x}$ tại điểm $x = 0$?"
              className="resize-none bg-gray-50 text-sm"
            />
          </div>
        </div>

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
