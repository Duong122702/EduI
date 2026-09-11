import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  SUBJECTS_WITH_SHORT_ANSWER,
  SUBJECTS_WITH_TRUE_FALSE,
} from '@/constants/typeQuestionSubject';
import type { Question } from '@/Models/questions.model';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ListQuestion } from './ListQuestion';

interface ListQuestionExamProps {
  selectedIds?: string[]; // Mảng ID câu hỏi từ form
  onUpdateIds: (ids: string[]) => void;
  subject: string; // Thêm prop subject
}

export const ListQuestionExam = ({
  onUpdateIds,
  subject,
}: ListQuestionExamProps) => {
  const [openAddQuestionDialog, setOpenAddQuestionDialog] = useState(false);
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState<
    Question[] | null
  >(null);
  const [trueFalseQuestions, setTrueFalseQuestions] = useState<
    Question[] | null
  >(null);
  const [shortAnswerQuestions, setShortAnswerQuestions] = useState<
    Question[] | null
  >(null);

  useEffect(() => {
    const allQuestions = [
      ...(multipleChoiceQuestions || []),
      ...(trueFalseQuestions || []),
      ...(shortAnswerQuestions || []),
    ];
    onUpdateIds(allQuestions.map((q) => q.id));
  }, [
    multipleChoiceQuestions,
    trueFalseQuestions,
    shortAnswerQuestions,
    onUpdateIds,
  ]);

  const openAddQuestionDialogHandler = (questionType: string) => {
    setOpenAddQuestionDialog(true);
    setQuestionType(questionType);
  };

  // 2. Hàm helper để lấy đúng mảng câu hỏi dựa vào type hiện tại
  const getCurrentSelectedQuestions = () => {
    switch (questionType) {
      case 'true-false':
        return trueFalseQuestions || [];
      case 'short-answer':
        return shortAnswerQuestions || [];
      case 'multiple-choice':
      default:
        return multipleChoiceQuestions || [];
    }
  };

  // 3. Hàm helper để lấy đúng hàm set state dựa vào type hiện tại
  const getCurrentSetSelectedQuestions = () => {
    switch (questionType) {
      case 'true-false':
        return setTrueFalseQuestions;
      case 'short-answer':
        return setShortAnswerQuestions;
      case 'multiple-choice':
      default:
        return setMultipleChoiceQuestions;
    }
  };

  return (
    <>
      <div className="lg:col-spans-8 space-y-4">
        {/* Danh sách câu hỏi trắc nghiệm */}
        <div className="rounded-2xl border-b border-slate-300 bg-white px-4 py-2 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">
              Danh sách câu hỏi trắc nghiệm:{' '}
              {multipleChoiceQuestions?.length || 0}
            </h3>
            <Button
              type="button"
              variant="default"
              size="lg"
              className="hover:bg-dark text-white"
              onClick={() => openAddQuestionDialogHandler('multiple-choice')}
            >
              Thêm câu hỏi
            </Button>
          </div>
          <div className="custom-scrollbar max-h-150 space-y-2 overflow-y-auto pr-2">
            <Card className="mx-auto mb-4 w-full max-w-3xl transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="border-transparent bg-transparent text-base text-slate-900"
                  >
                    'topic'
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="border-transparent bg-orange-100 text-base text-slate-900 hover:bg-orange-100"
                  >
                    'level'
                  </Badge>
                </div>
                <Trash className="h-4 w-4 cursor-pointer text-red-500 transition-all hover:scale-110 hover:text-red-600" />
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-5 text-center">
                <p className="text-foreground text-base leading-relaxed sm:text-lg">
                  'content'
                </p>

                {/* {imageUrl && (
          <div className="relative w-full flex justify-center mt-2">
            <img 
              src={imageUrl} 
              alt="Hình ảnh minh họa" 
              className="max-w-full max-h-64 object-contain rounded-md border border-border shadow-sm"
            />
          </div>
        )} */}
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Danh sách câu hỏi đúng sai */}
        {SUBJECTS_WITH_TRUE_FALSE.includes(subject) && (
          <div className="rounded-2xl border-b border-slate-300 bg-white px-4 py-2 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">
                Danh sách câu hỏi trắc nghiệm:{' '}
                {multipleChoiceQuestions?.length || 0}
              </h3>
              <Button
                type="button"
                variant="default"
                size="lg"
                className="hover:bg-dark text-white"
                onClick={() => openAddQuestionDialogHandler('true-false')}
              >
                Thêm câu hỏi
              </Button>
            </div>
            <div className="custom-scrollbar max-h-150 space-y-2 overflow-y-auto pr-2">
              <Card className="mx-auto mb-4 w-full max-w-3xl transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="border-transparent bg-transparent text-base text-slate-900"
                    >
                      'topic'
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="border-transparent bg-orange-100 text-base text-slate-900 hover:bg-orange-100"
                    >
                      'level'
                    </Badge>
                  </div>
                  <Trash className="h-4 w-4 cursor-pointer text-red-500 transition-all hover:scale-110 hover:text-red-600" />
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-5 text-center">
                  <p className="text-foreground text-base leading-relaxed sm:text-lg">
                    'content'
                  </p>

                  {/* {imageUrl && (
          <div className="relative w-full flex justify-center mt-2">
            <img 
              src={imageUrl} 
              alt="Hình ảnh minh họa" 
              className="max-w-full max-h-64 object-contain rounded-md border border-border shadow-sm"
            />
          </div>
        )} */}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Danh sách câu hỏi trả lời ngắn */}
        {SUBJECTS_WITH_SHORT_ANSWER.includes(subject) && (
          <div className="rounded-2xl border-b border-slate-300 bg-white px-4 py-2 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">
                Danh sách câu hỏi trắc nghiệm:{' '}
                {multipleChoiceQuestions?.length || 0}
              </h3>
              <Button
                type="button"
                variant="default"
                size="lg"
                className="hover:bg-dark text-white"
                onClick={() => openAddQuestionDialogHandler('short-answer')}
              >
                Thêm câu hỏi
              </Button>
            </div>
            <div className="custom-scrollbar max-h-150 space-y-2 overflow-y-auto pr-2">
              <Card className="mx-auto mb-4 w-full max-w-3xl transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="border-transparent bg-transparent text-base text-slate-900"
                    >
                      'topic'
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="border-transparent bg-orange-100 text-base text-slate-900 hover:bg-orange-100"
                    >
                      'level'
                    </Badge>
                  </div>
                  <Trash className="h-4 w-4 cursor-pointer text-red-500 transition-all hover:scale-110 hover:text-red-600" />
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-5 text-center">
                  <p className="text-foreground text-base leading-relaxed sm:text-lg">
                    'content'
                  </p>

                  {/* {imageUrl && (
          <div className="relative w-full flex justify-center mt-2">
            <img 
              src={imageUrl} 
              alt="Hình ảnh minh họa" 
              className="max-w-full max-h-64 object-contain rounded-md border border-border shadow-sm"
            />
          </div>
        )} */}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <ListQuestion
        open={openAddQuestionDialog}
        onOpenChange={setOpenAddQuestionDialog}
        subject={subject}
        questionType={questionType}
        selectedQuestions={getCurrentSelectedQuestions()}
        setSelectedQuestions={getCurrentSetSelectedQuestions()}
      />
    </>
  );
};
