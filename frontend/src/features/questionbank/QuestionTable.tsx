import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calculator, CirclePlus, Pencil, Trash2 } from 'lucide-react';

export const QuestionTable = () => {
  return (
    <>
      {/* 4. Danh sách câu hỏi & Bộ lọc */}
      <Card className="rounded-3xl border-slate-100 bg-white p-6 shadow-sm">
        {/* Thanh công cụ lọc & Tìm kiếm (Sử dụng Shadcn Input, Select, Button) */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* Tìm kiếm */}
            <div className="relative min-w-65 flex-1">
              {/* <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /> */}
              <Input
                placeholder="Tìm kiếm nội dung câu hỏi..."
                className="h-11 rounded-2xl border-slate-200 bg-slate-50/50 pl-11 text-sm placeholder:text-slate-400 focus-visible:ring-emerald-500"
              />
            </div>

            {/* Select Môn học */}
            <Select defaultValue="all">
              <SelectTrigger className="h-11 min-w-37.5 rounded-2xl border-slate-200 bg-slate-50/50 px-4 text-xs font-medium text-slate-600 focus:ring-emerald-500">
                <SelectValue placeholder="Tất cả môn học" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Tất cả môn học</SelectItem>
                <SelectItem value="math">Toán học</SelectItem>
                <SelectItem value="english">Tiếng Anh</SelectItem>
                <SelectItem value="it">Tin học</SelectItem>
              </SelectContent>
            </Select>

            {/* Select Độ khó */}
            <Select defaultValue="all">
              <SelectTrigger className="h-11 min-w-37.5 rounded-2xl border-slate-200 bg-slate-50/50 px-4 text-xs font-medium text-slate-600 focus:ring-emerald-500">
                <SelectValue placeholder="Mọi độ khó" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Mọi độ khó</SelectItem>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>

            {/* Select Thể loại */}
            <Select defaultValue="all">
              <SelectTrigger className="h-11 min-w-37.5 rounded-2xl border-slate-200 bg-slate-50/50 px-4 text-xs font-medium text-slate-600 focus:ring-emerald-500">
                <SelectValue placeholder="Mọi thể loại" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Mọi thể loại</SelectItem>
                <SelectItem value="mcq">Trắc nghiệm</SelectItem>
                <SelectItem value="tf">Đúng / Sai</SelectItem>
                <SelectItem value="essay">Tự luận</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Button Thêm câu hỏi */}
          <Button className="h-11 shrink-0 rounded-2xl bg-orange-500 px-5 font-bold text-white shadow-sm transition-all hover:bg-orange-600">
            <CirclePlus className="mr-2 h-5 w-5" />
            Thêm câu hỏi mới
          </Button>
        </div>

        {/* Bảng danh sách câu hỏi (Sử dụng Shadcn Table) */}
        <div className="mt-6 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="pr-4 pb-4 pl-2 text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  MÔN / CHỦ ĐỀ
                </TableHead>
                <TableHead className="px-4 pb-4 text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  NỘI DUNG CÂU HỎI (LATEX)
                </TableHead>
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  THỂ LOẠI
                </TableHead>
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  ĐỘ KHÓ
                </TableHead>
                <TableHead className="pr-2 pb-4 pl-4 text-right text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  TÁC VỤ QUẢN LÝ
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Row 1: Toán học - Tích phân */}
              <TableRow className="border-b border-slate-100 transition-colors hover:bg-slate-50/50">
                <TableCell className="py-4 pr-4 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">Toán học</p>
                      <Badge
                        variant="outline"
                        className="border-emerald-200/60 bg-emerald-50 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50"
                      >
                        TÍCH PHÂN
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 font-medium text-slate-700">
                  Tính tích phân hình phẳng giới hạn bởi đường cong $y = x^2$
                  trên đoạn $[0, 2]$?
                </TableCell>
                <TableCell className="px-4 py-4 text-center font-medium text-slate-600">
                  Trắc nghiệm
                </TableCell>
                <TableCell className="px-4 py-4 text-center">
                  <Badge
                    variant="secondary"
                    className="border-none bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                  >
                    Trung bình
                  </Badge>
                </TableCell>
                <TableCell className="py-4 pr-2 pl-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {/* Row 2: Toán học - Đạo hàm */}
              {/* <TableRow className="border-b border-slate-100 transition-colors hover:bg-slate-50/50">
                <TableCell className="py-4 pl-2 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">Toán học</p>
                      <Badge
                        variant="outline"
                        className="border-emerald-200/60 bg-emerald-50 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50"
                      >
                        ĐẠO HÀM
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4 font-medium text-slate-700">
                  Đạo hàm cấp 1 của hàm số $y = e^{2x}$ tại điểm $x = 0$ bằng bao nhiêu?
                </TableCell>
                <TableCell className="py-4 px-4 text-center font-medium text-slate-600">
                  Trắc nghiệm
                </TableCell>
                <TableCell className="py-4 px-4 text-center">
                  <Badge
                    variant="secondary"
                    className="border-none bg-rose-100/80 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Khó
                  </Badge>
                </TableCell>
                <TableCell className="py-4 pl-4 pr-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow> */}

              {/* Row 3: Tiếng Anh - Grammar */}
              {/* <TableRow className="border-b border-slate-100 transition-colors hover:bg-slate-50/50">
                <TableCell className="py-4 pl-2 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
                      <Languages className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">Tiếng Anh</p>
                      <Badge
                        variant="outline"
                        className="border-emerald-200/60 bg-emerald-50 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50"
                      >
                        GRAMMAR
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4 font-medium text-slate-700">
                  The correct preposition in the sentence &apos;She has been working here ________ 2018&apos; is &apos;since&apos;.
                </TableCell>
                <TableCell className="py-4 px-4 text-center font-medium text-slate-600">
                  Đúng / Sai
                </TableCell>
                <TableCell className="py-4 px-4 text-center">
                  <Badge
                    variant="secondary"
                    className="border-none bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    Dễ
                  </Badge>
                </TableCell>
                <TableCell className="py-4 pl-4 pr-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow> */}

              {/* Row 4: Tin học - Lập trình */}
              {/* <TableRow className="border-b border-slate-100 transition-colors hover:bg-slate-50/50">
                <TableCell className="py-4 pl-2 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">Tin học</p>
                      <Badge
                        variant="outline"
                        className="border-emerald-200/60 bg-emerald-50 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50"
                      >
                        LẬP TRÌNH
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4 font-medium text-slate-700">
                  Hãy chỉ ra độ phức tạp thời gian (Big O) của thuật toán Tìm kiếm nhị phân?
                </TableCell>
                <TableCell className="py-4 px-4 text-center font-medium text-slate-600">
                  Tự luận
                </TableCell>
                <TableCell className="py-4 px-4 text-center">
                  <Badge
                    variant="secondary"
                    className="border-none bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                  >
                    Trung bình
                  </Badge>
                </TableCell>
                <TableCell className="py-4 pl-4 pr-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default QuestionTable;
