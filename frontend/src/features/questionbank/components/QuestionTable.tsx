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
import {
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react';
import { SubjectBadge } from './SubjectBadge';
import type { GetQuestionsParams } from '@/schemas/payload/questionParamPayload.type';
import type { QuestionTableProps } from '@/types/QuestionType/questionTableProps.type';
import { useQuestionOptions } from '@/hooks/Question/useQuestionOptions';
import { levelColorMap } from '@/constants/levelColor';
import { MathViewerKaTeX } from '@/components/ui/MathViewerKaTeX';

export const QuestionTable = ({
  onClick,
  data,
  isPending,
  params,
  setParams,
  searchTerm,
  setSearchTerm,
}: QuestionTableProps) => {
  const questions = data?.data?.data.questions ?? [];
  const total = data?.data?.data?.total ?? 0;

  const totalPages = Math.ceil(total / (params.page_size || 10)) || 1;

  const { uniqueLevels, uniqueSubjects, uniqueTypes } =
    useQuestionOptions(questions);
  // Handler cập nhật Select Filter
  const handleFilterChange = (key: keyof GetQuestionsParams, value: string) => {
    setParams((prev) => ({
      ...prev,
      [key]: value === 'all' ? '' : value,
      page: 1, // Reset về trang 1 khi đổi bộ lọc
    }));
  };

  // Handler chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setParams((prev) => ({ ...prev, page: newPage }));
    }
  };
  return (
    <>
      {/* 4. Danh sách câu hỏi & Bộ lọc */}
      <Card className="rounded-3xl border-slate-100 bg-white p-6 shadow-sm">
        {/* Thanh công cụ lọc & Tìm kiếm (Sử dụng Shadcn Input, Select, Button) */}
        <div className="flex gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* Tìm kiếm */}
            <div className="relative w-1/3 min-w-65">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm nội dung câu hỏi..."
                className="h-11 truncate rounded-2xl border-slate-200 bg-slate-50/50 pl-11 text-sm placeholder:text-slate-400 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="flex gap-3">
              {/* Select Môn học */}
              <Select
                value={params.subject}
                onValueChange={(val) => handleFilterChange('subject', val)}
              >
                <SelectTrigger className="h-11 min-w-37.5 rounded-2xl border-slate-200 bg-slate-50/50 px-4 text-xs font-medium text-slate-600 focus:ring-emerald-500">
                  <SelectValue placeholder="Tất cả môn học" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {uniqueSubjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Select Độ khó */}
              <Select
                value={params.level || ''}
                onValueChange={(val) => handleFilterChange('level', val)}
              >
                <SelectTrigger className="h-11 min-w-37.5 rounded-2xl border-slate-200 bg-slate-50/50 px-4 text-xs font-medium text-slate-600 focus:ring-emerald-500">
                  <SelectValue placeholder="Mọi độ khó" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {uniqueLevels.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Select Thể loại */}
              <Select
                value={params.question_type || ''}
                onValueChange={(val) =>
                  handleFilterChange('question_type', val)
                }
              >
                <SelectTrigger className="h-11 min-w-37.5 rounded-2xl border-slate-200 bg-slate-50/50 px-4 text-xs font-medium text-slate-600 focus:ring-emerald-500">
                  <SelectValue placeholder="Mọi thể loại" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Button Thêm câu hỏi */}
            <Button
              onClick={onClick}
              className="h-11 shrink-0 rounded-2xl bg-orange-500 px-5 font-bold text-white shadow-sm transition-all hover:bg-orange-600"
            >
              <CirclePlus className="mr-2 h-5 w-5" />
              Thêm câu hỏi mới
            </Button>
          </div>
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
              {questions.map((question) => (
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
                    <MathViewerKaTeX value={question.content} />
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center font-medium text-slate-600">
                    {question.questionType}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <Badge
                      variant="secondary"
                      className={`inline-flex max-w-28 items-center justify-center border px-3 py-1 text-xs font-semibold ${
                        (question.level && levelColorMap[question.level]) ||
                        'border-slate-300 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="truncate">
                        {question.level || 'Chưa xếp loại'}
                      </span>
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
        {!isPending && total > 0 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row">
            <div className="text-xs text-slate-500">
              Hiển thị{' '}
              <span className="font-semibold text-slate-700">
                {questions.length}
              </span>{' '}
              / <span className="font-semibold text-slate-700">{total}</span>{' '}
              câu hỏi
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
                disabled={(params.page || 1) <= 1}
                onClick={() => handlePageChange((params.page || 1) - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-xs font-medium text-slate-600">
                Trang {params.page || 1} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
                disabled={(params.page || 1) >= totalPages}
                onClick={() => handlePageChange((params.page || 1) + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default QuestionTable;
