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
import { useQuestions } from '@/hooks/Question/useQuestion';
import { CirclePlus, Pencil, Trash2 } from 'lucide-react';
import { SubjectBadge } from './SubjectBadge';

export const QuestionTable = () => {
  const { isPending, data } = useQuestions();
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
                {data?.data.data.question.map((question) => {
                  return (
                    <SelectItem key={question.id} value={question.subject}>
                      {question.subject}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Select Độ khó */}
            <Select defaultValue="all">
              <SelectTrigger className="h-11 min-w-37.5 rounded-2xl border-slate-200 bg-slate-50/50 px-4 text-xs font-medium text-slate-600 focus:ring-emerald-500">
                <SelectValue placeholder="Mọi độ khó" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {data?.data.data.question.map((question) => {
                  return (
                    question.level && (
                      <SelectItem key={question.id} value={question.level}>
                        {question.level}
                      </SelectItem>
                    )
                  );
                })}
              </SelectContent>
            </Select>

            {/* Select Thể loại */}
            <Select defaultValue="all">
              <SelectTrigger className="h-11 min-w-37.5 rounded-2xl border-slate-200 bg-slate-50/50 px-4 text-xs font-medium text-slate-600 focus:ring-emerald-500">
                <SelectValue placeholder="Mọi thể loại" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {data?.data.data.question.map((question) => {
                  return (
                    question.question_type && (
                      <SelectItem
                        key={question.id}
                        value={question.question_type}
                      >
                        {question.question_type}
                      </SelectItem>
                    )
                  );
                })}
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
              {isPending && (
                <TableRow>
                  <TableCell colSpan={5} className="py-4 text-center">
                    Đang tải dữ liệu câu hỏi...
                  </TableCell>
                </TableRow>
              )}
              {/* Row 1: Toán học - Tích phân */}
              {data?.data.data.question.map((question) => (
                <TableRow
                  key={question.id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
                >
                  <TableCell className="py-4 pr-4 pl-2">
                    <SubjectBadge
                      subject={question.subject}
                      topic={question.topic}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-4 font-medium text-slate-700">
                    {question.content}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center font-medium text-slate-600">
                    {question.question_type}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <Badge
                      variant="secondary"
                      className={`border-none bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100`}
                    >
                      {question.level}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default QuestionTable;
