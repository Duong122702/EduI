import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import AddQuestionSheet from '@/features/questionbank/components/AddQuestioSheet/AddQuestionSheet';
import QuestionTable from '@/features/questionbank/components/QuestionTable';
import { useQuestions } from '@/hooks/Question/useQuestion';
import type { GetQuestionsParams } from '@/schemas/payload/questionParamPayload.type';
import { getListLevelQuestion } from '@/utils/getListLevelQuestion';
import { BarChart3, Database, Package } from 'lucide-react';
import { useEffect, useState } from 'react';

function QuestionBank() {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState<GetQuestionsParams>({
    page: 1,
    page_size: 10,
    subject: '',
    level: '',
    question_type: '',
    content: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((prev) => ({
        ...prev,
        content: searchTerm,
        page: 1,
      }));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { isPending, data, most_subject_data } = useQuestions(params);
  const totalQuestions = data?.data?.data?.total ?? 0;
  const questions = data?.data.data.questions ?? [];
  const { easyQuestions, hardQuestions, normalQuestions, veryHardQuestions } =
    getListLevelQuestion({ questions });
  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Ngân hàng câu hỏi
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kho lưu trữ câu hỏi dùng chung, phân loại độ khó tối ưu và tích hợp
            Trợ lý AI biên soạn thông minh.
          </p>
        </div>
        {/* Status indicator */}
        <div className="flex items-center space-x-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>
            Trạng thái đồng bộ:{' '}
            <strong className="font-semibold">Đám mây kết nối</strong>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Card 1: Tổng số câu hỏi */}
        <Card className="rounded-2xl border-slate-100 bg-white shadow-sm">
          <CardContent className="flex items-start justify-between p-6">
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                TỔNG SỐ CÂU HỎI
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900">
                {isPending ? '...' : totalQuestions}
              </h2>
              <p className="text-xs text-slate-500">
                Nạp nhiều nhất:{' '}
                <span className="font-semibold text-slate-700">
                  {most_subject_data?.data.data.subject}
                </span>
              </p>
            </div>
            <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
              <Database className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Phân bố độ khó */}
        <Card className="rounded-2xl border-slate-100 bg-white shadow-sm">
          <CardContent className="flex items-start justify-between p-6">
            <div className="space-y-3">
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                PHÂN BỐ ĐỘ KHÓ
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Badge
                  variant="secondary"
                  className="bg-sky-100/70 text-xs font-semibold text-emerald-700 hover:bg-sky-100"
                >
                  Nhận biết: {easyQuestions}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-emerald-100/70 text-xs font-semibold text-sky-700 hover:bg-emerald-100"
                >
                  Thông hiểu: {normalQuestions}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-amber-100/70 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                >
                  Vận dụng: {hardQuestions}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-rose-100/70 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Vận dụng cao: {veryHardQuestions}
                </Badge>
              </div>
              {/* <p className="text-xs text-slate-500">
                Tỷ lệ phân bổ ma trận đề (4 - 3 - 2 - 1)
              </p> */}
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-500">
              <BarChart3 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Chưa đưa vào đề */}
        <Card className="rounded-2xl border-slate-100 bg-white shadow-sm">
          <CardContent className="flex items-start justify-between p-6">
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                CHƯA ĐƯA VÀO ĐỀ
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900">3</h2>
              <p className="text-xs font-medium text-emerald-600">
                Sẵn sàng cho kỳ thi mới
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-500">
              <Package className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Hàng Công Cụ: AI Generation & Excel Import */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="flex min-h-55 items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-100 p-6 text-gray-500 shadow-sm lg:col-span-7 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <span className="text-base font-semibold tracking-wide">
              Đang phát triển...
            </span>
          </div>
        </Card>

        {/* Card Nhập Excel (Chiếm 5/12 cột trên màn hình lớn) */}
        <Card className="flex flex-col justify-between rounded-3xl border-slate-100 bg-white shadow-sm lg:col-span-5">
          <CardHeader className="space-y-2 pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
              {/* <FileSpreadsheet className="h-5 w-5 text-emerald-600" /> */}
              NHẬP CÂU HỎI TỪ EXCEL
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Tải lên danh sách câu hỏi hàng loạt bằng định dạng tệp Excel chuẩn
              của EduExam.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-colors hover:bg-slate-50">
              <div className="mb-3 rounded-full border border-slate-100 bg-white p-3 shadow-sm transition-transform group-hover:scale-110">
                {/* <Upload className="h-6 w-6 text-slate-400 transition-colors group-hover:text-emerald-600" /> */}
              </div>
              <p className="text-xs font-bold text-slate-700">
                Tải lên tệp Excel tại đây
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                Hỗ trợ .xlsx hoặc .csv dung lượng dưới 5MB
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <QuestionTable
        onClick={() => setIsOpen(true)}
        data={data}
        isPending={isPending}
        params={params}
        setParams={setParams}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <AddQuestionSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        questions={data?.data.data.questions}
      ></AddQuestionSheet>
    </div>
  );
}

export default QuestionBank;
