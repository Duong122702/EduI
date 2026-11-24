import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AddQuestionSheet from '@/features/questionbank/components/AddQuestioSheet/AddQuestionSheet';
import QuestionTable from '@/features/questionbank/components/QuestionTable';
import {
  useExtractQuestionsPdf,
  useConfirmImport,
} from '@/hooks/Question/useImportPdf';
import { useQuestions } from '@/hooks/Question/useQuestion';
import type { Question } from '@/Models/questions.model';
import type { ExtractedQuestion } from '@/api/exam/extractExamPdf.api';
import type { GetQuestionsParams } from '@/schemas/payload/questionParamPayload.type';
import { getListLevelQuestion } from '@/utils/getListLevelQuestion';
import {
  BarChart3,
  Check,
  CircleQuestionMark,
  Database,
  FileText,
  Loader2,
  Package,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function QuestionBank() {
  const [isOpen, setIsOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [params, setParams] = useState<GetQuestionsParams>({
    page: 1,
    page_size: 10,
    subject: '',
    level: '',
    question_type: '',
    content: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { mutate: extractPdf, isPending: isExtracting } =
    useExtractQuestionsPdf();
  const { mutate: confirmImport, isPending: isConfirming } =
    useConfirmImport();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [extractionId, setExtractionId] = useState<string | null>(null);
  const [extractedQuestions, setExtractedQuestions] = useState<
    ExtractedQuestion[]
  >([]);
  const [extractedSubject, setExtractedSubject] = useState('');

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

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    extractPdf(file, {
      onSuccess: (res) => {
        const data = res.data.data;
        if (!data) return;
        setExtractionId(data.extractionId);
        setExtractedQuestions(data.questions);
        setExtractedSubject(data.examMetadata.subject);
      },
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmImport = () => {
    if (!extractionId) return;
    confirmImport(extractionId, {
      onSuccess: () => {
        setExtractionId(null);
        setExtractedQuestions([]);
        setExtractedSubject('');
      },
    });
  };

  const handleCancelImport = () => {
    setExtractionId(null);
    setExtractedQuestions([]);
    setExtractedSubject('');
  };

  const isImporting = isExtracting;
  const actualQuestions = extractedQuestions.filter((q) => !q.isPassage);

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

      {extractionId && extractedQuestions.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <CircleQuestionMark className="h-5 w-5 text-blue-600" />
              <div>
                <span className="text-sm font-semibold text-slate-800">
                  Câu hỏi trích xuất từ PDF: {actualQuestions.length}
                </span>
                {extractedSubject && (
                  <Badge
                    variant="outline"
                    className="ml-2 text-xs text-blue-600"
                  >
                    {extractedSubject}
                  </Badge>
                )}
              </div>
              <Badge className="bg-blue-100 text-xs font-medium text-blue-700">
                Chờ xác nhận
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-100"
                onClick={handleCancelImport}
                disabled={isConfirming}
              >
                <X className="mr-1 h-4 w-4" />
                Hủy
              </Button>
              <Button
                size="sm"
                className="rounded-lg bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700"
                onClick={handleConfirmImport}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Xác nhận lưu {actualQuestions.length} câu
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="max-h-[600px] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
            {actualQuestions.map((q, idx) => (
              <div
                key={q.tempId || idx}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {q.questionType}
                  </span>
                  {q.scoreWeight > 0 && (
                    <span className="rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                      {q.scoreWeight} điểm
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-800">{q.content}</p>
                {q.options && (
                  <div className="mt-2 space-y-1 pl-4">
                    {Object.entries(q.options).map(([key, opt]) => (
                      <p key={key} className="text-xs text-slate-600">
                        <span className="font-semibold">{key}.</span>{' '}
                        {opt.content}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* 3. Hàng Công Cụ: AI Generation & Excel Import */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Card className="flex min-h-55 items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-100 p-6 text-gray-500 shadow-sm lg:col-span-7 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <span className="text-base font-semibold tracking-wide">
                  Đang phát triển...
                </span>
              </div>
            </Card>

            <Card className="flex flex-col justify-between rounded-3xl border-slate-100 bg-white shadow-sm lg:col-span-5">
              <CardHeader className="space-y-2 pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  NHẬP TỪ FILE PDF
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Tự động quét text và ảnh, nhận diện câu hỏi & đáp án.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-2">
                <div>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handlePdfUpload}
                  />
                  <div
                    onClick={() => {
                      if (!isImporting) fileInputRef.current?.click();
                    }}
                    className={`group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
                      isImporting
                        ? 'cursor-wait border-emerald-200 bg-emerald-50/50'
                        : 'cursor-pointer border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="mb-3 rounded-full border border-slate-100 bg-white p-3 shadow-sm transition-transform group-hover:scale-110">
                      {isImporting ? (
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                      ) : (
                        <FileText className="h-6 w-6 text-emerald-500 transition-colors group-hover:text-emerald-600" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-emerald-700">
                      {isImporting
                        ? 'Đang xử lý PDF...'
                        : 'Tải lên tệp PDF từ máy tính'}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Kích thước tối đa 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      <QuestionTable
        onClick={() => {
          setIsOpen(true);
          setEditQuestion(null);
        }}
        data={data}
        isPending={isPending}
        params={params}
        setParams={setParams}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={(question) => {
          setEditQuestion(question);
          setIsOpen(true);
        }}
      />
      <AddQuestionSheet
        open={isOpen}
        onOpenChange={(value) => {
          setIsOpen(value);
          if (!value) setEditQuestion(null);
        }}
        questions={data?.data.data.questions}
        editData={editQuestion}
      ></AddQuestionSheet>
    </div>
  );
}

export default QuestionBank;
