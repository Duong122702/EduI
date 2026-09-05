import { ConfirmPopover } from '@/components/shared/confirmPopover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Exam } from '@/Models/exams.model';
import type { ExamParamPayload } from '@/schemas/payload/examParamPayload.type';
import {
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react';

interface ExamRoomTableProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  params: ExamParamPayload;
  setParams: React.Dispatch<React.SetStateAction<ExamParamPayload>>;
  exams: Exam[];
  totalExams: number;
  isPending: boolean;
}

export const ExamRoomTable = ({
  searchQuery,
  setSearchQuery,
  exams,
  totalExams,
  isPending,
  params,
  setParams,
}: ExamRoomTableProps) => {
  const totalPages = Math.ceil(totalExams / (params.page_size || 10)) || 1;
  const handleChangePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setParams((prev) => ({ ...prev, page: newPage }));
    }
  };
  return (
    <>
      <Card className="rounded-2xl border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative w-1/3 min-w-65">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery && setSearchQuery(e.target.value)
                }
                placeholder="Tìm kiếm tên phòng thi"
                className="h-11 truncate rounded-2xl border-slate-200 bg-slate-50/50 pl-11 text-sm placeholder:text-slate-400 focus-visible:ring-emerald-500"
              />
            </div>
            {/* Tabs */}
            <div className="flex">
              <Tabs
                defaultValue="all"
                value={params.status || 'all'}
                onValueChange={(value) => {
                  setParams({ ...params, status: value, page: 1 });
                }}
                className="w-full"
              >
                <TabsList className="w-full rounded-lg bg-transparent p-2">
                  {['all', 'Chốt đề', 'Bản nháp'].map((item) => (
                    <TabsTrigger
                      value={item}
                      className="w-1/3 text-xs font-bold data-[state=active]:border data-[state=active]:border-teal-400 data-[state=active]:bg-teal-200/30 data-[state=active]:text-teal-800"
                    >
                      {item === 'all' && 'Tất cả đề thi'}
                      {item === 'Chốt đề' && 'Đề thi đang hoạt động'}
                      {item === 'Bản nháp' && 'Đề thi không hoạt động'}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <Button
              onClick={() => {}}
              className="h-11 shrink-0 rounded-2xl bg-orange-500 px-5 font-bold text-white shadow-sm transition-all hover:bg-orange-600"
            >
              <CirclePlus className="mr-2 h-5 w-5" />
              Thêm câu hỏi mới
            </Button>
          </div>
        </div>
        {/* Table */}
        <div className="mt-6 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200 hover:bg-transparent">
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Đề thi/Môn học
                </TableHead>
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Thời lượng
                </TableHead>
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Số câu hỏi
                </TableHead>
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Trạng thái
                </TableHead>
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Các phòng thi đang sử dụng
                </TableHead>
                <TableHead className="px-4 pb-4 text-center text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Tác vụ quản lý
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 py-4 text-center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              )}
              {exams.map((exam) => (
                <TableRow
                  key={exam.id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
                >
                  <TableCell className="py-4 pr-4 pl-2 text-center text-sm font-medium text-slate-700">
                    <h2 className="font-bold">{exam.title}</h2>
                    <Badge
                      variant="outline"
                      className="mt-1 text-xs text-slate-300/70"
                    >
                      {exam.subject}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center text-sm font-medium text-slate-300/70">
                    {exam.createdAt}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center text-sm font-medium text-slate-600">
                    {exam.duration} phút
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center text-sm font-medium text-slate-700">
                    {exam.status === 'Chốt đề' ? 'Chốt đề' : 'Bản nháp'}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center text-sm font-medium text-slate-700">
                    {exam.roomUsed?.length === 0
                      ? 'Chưa có phòng thi nào sử dụng'
                      : exam.roomUsed.join(', ')}
                  </TableCell>
                  <TableCell className="py-4 pr-2 pl-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        onClick={() => {}}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <ConfirmPopover
                        title="Delete this question?"
                        description="This action cannot be undone"
                        onConfirm={() => {}}
                        confirmText="Yes, delete"
                        confirmVariant="destructive"
                        cancelText="No"
                        side="left"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </ConfirmPopover>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {!isPending && totalExams > 0 && (
          // Pagination and total exams display
          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-b border-slate-100 pt-4 sm:flex-row">
            <div className="text-xs text-slate-500">
              Hiển thị{' '}
              <span className="font-semibold text-slate-700">
                {exams.length}
              </span>{' '}
              /
              <span className="font-semibold text-slate-700">{totalExams}</span>{' '}
              đề thi
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 rounded-lg"
                disabled={(params.page || 1) <= 1}
                onClick={() => handleChangePage((params.page || 1) - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium text-slate-600">
                Trang {params.page || 1} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 rounded-lg"
                disabled={(params.page || 1) >= totalPages}
                onClick={() => handleChangePage((params.page || 1) + 1)}
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
};
