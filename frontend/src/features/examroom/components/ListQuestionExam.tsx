import { Button } from '@/components/ui/Button';

import {
  SUBJECTS_WITH_SHORT_ANSWER,
  SUBJECTS_WITH_TRUE_FALSE,
} from '@/constants/typeQuestionSubject';
import type { Question } from '@/Models/questions.model';
import { PlusCircle, FileQuestion } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ListQuestion } from './ListQuestion';
import { checkLimit } from '@/utils/checkLimit';
import { QuestionCard } from './QuestionCard';

interface ListQuestionExamProps {
  selectedIds?: string[];
  onUpdateIds: (ids: string[]) => void;
  subject: string;
}

export const ListQuestionExam = ({
  onUpdateIds,
  subject,
}: ListQuestionExamProps) => {
  const [openAddQuestionDialog, setOpenAddQuestionDialog] = useState(false);
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [activeParentId, setActiveParentId] = useState<string | undefined>(
    undefined
  );

  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState<
    Question[] | null
  >(null);
  const [trueFalseQuestions, setTrueFalseQuestions] = useState<
    Question[] | null
  >(null);
  const [shortAnswerQuestions, setShortAnswerQuestions] = useState<
    Question[] | null
  >(null);
  const [passageQuestions, setPassageQuestions] = useState<Question[] | null>(
    null
  );

  useEffect(() => {
    const allQuestions = [
      ...(multipleChoiceQuestions || []),
      ...(trueFalseQuestions || []),
      ...(shortAnswerQuestions || []),
      ...(passageQuestions || []),
    ];
    onUpdateIds(allQuestions.map((q) => q.id));
  }, [
    multipleChoiceQuestions,
    trueFalseQuestions,
    shortAnswerQuestions,
    passageQuestions,
    onUpdateIds,
  ]);

  // const openAddQuestionDialogHandler = (questionType: string) => {
  //   setOpenAddQuestionDialog(true);
  //   setQuestionType(questionType);
  // };

  const getCurrentSelectedQuestions = () => {
    switch (questionType) {
      case 'true-false':
        return trueFalseQuestions || [];
      case 'short-answer':
        return shortAnswerQuestions || [];
      case 'passage':
        return passageQuestions || [];
      case 'multiple-choice':
      default:
        return multipleChoiceQuestions || [];
    }
  };

  const getCurrentSetSelectedQuestions = () => {
    switch (questionType) {
      case 'true-false':
        return setTrueFalseQuestions;
      case 'short-answer':
        return setShortAnswerQuestions;
      case 'passage':
        return setPassageQuestions;
      case 'multiple-choice':
      default:
        return setMultipleChoiceQuestions;
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    const currentQuestions = getCurrentSelectedQuestions();
    const updatedQuestions = currentQuestions.filter(
      (q) => q.id !== questionId
    );
    const setQuestions = getCurrentSetSelectedQuestions();
    setQuestions(updatedQuestions);
  };

  // --- HÀM RENDER UI CHUNG CHO CÁC NHÓM CÂU HỎI ---
  const renderQuestionSection = (
    title: string,
    type: string,
    questions: Question[] | null,
    isVisible: boolean
  ) => {
    if (!isVisible) return null;
    const { isLimitReached, maxLimit } = checkLimit(type, questions, subject);
    // LỌC RENDER: Chỉ render các câu hỏi KHÔNG PHẢI LÀ CÂU CON (không có parent_id)
    const displayQuestions =
      type === 'passage' ? questions : questions?.filter((q) => !q.parent_id);
    return (
      <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header của từng Section */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div>
            <h3 className="text-sm font-bold tracking-wide text-slate-800 uppercase">
              {title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Đã chọn:{' '}
              <span
                className={`font-bold ${isLimitReached ? 'text-red-600' : 'text-blue-600'}`}
              >
                {questions?.length || 0}
              </span>{' '}
              {maxLimit !== undefined ? `/ ${maxLimit}` : ``}câu
            </p>
          </div>
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={isLimitReached}
            className={`flex items-center gap-2 ${
              isLimitReached
                ? 'cursor-not-allowed bg-slate-300 text-slate-500 hover:bg-slate-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={() => {
              setOpenAddQuestionDialog(true);
              setQuestionType(type);
              setActiveParentId(undefined); // Reset active parent ID khi thêm câu hỏi mới
            }}
          >
            <PlusCircle className="h-4 w-4" />
            {isLimitReached ? 'Đã đạt giới hạn' : 'Thêm câu hỏi'}
          </Button>
        </div>

        {/* Danh sách câu hỏi */}
        <div className="bg-slate-50/50 p-4">
          {!displayQuestions || displayQuestions.length === 0 ? (
            // Trạng thái trống (Empty state)
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 py-10 text-slate-400">
              <FileQuestion className="mb-2 h-10 w-10 text-slate-300" />
              <p className="text-sm">Chưa có câu hỏi nào được thêm.</p>
            </div>
          ) : (
            <div className="custom-scrollbar max-h-125 space-y-4 overflow-y-auto pr-2">
              {displayQuestions.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <QuestionCard
                    question={question}
                    index={index}
                    type={type}
                    handleDeleteQuestion={handleDeleteQuestion}
                    multipleChoiceQuestions={multipleChoiceQuestions}
                    trueFalseQuestions={trueFalseQuestions}
                    shortAnswerQuestions={shortAnswerQuestions}
                    setActiveParentId={setActiveParentId}
                    setOpenAddQuestionDialog={setOpenAddQuestionDialog}
                    setQuestionType={setQuestionType}
                    subject={subject}
                  />
                  {/* TÌM VÀ RENDER CÁC CÂU HỎI CON NẾU ĐÂY LÀ PASSAGE */}
                  {type === 'passage' && (
                    <>
                      {[
                        ...(multipleChoiceQuestions || []),
                        ...(trueFalseQuestions || []),
                        ...(shortAnswerQuestions || []),
                      ]
                        .filter((childQ) => childQ.parent_id === question.id)
                        .map((childQ, childIndex) => {
                          let childType = 'multiple-choice';
                          if (
                            trueFalseQuestions?.some((q) => q.id === childQ.id)
                          )
                            childType = 'true-false';
                          if (
                            shortAnswerQuestions?.some(
                              (q) => q.id === childQ.id
                            )
                          )
                            childType = 'short-answer';
                          return (
                            <QuestionCard
                              key={childQ.id}
                              question={childQ}
                              index={childIndex}
                              type={childType}
                              handleDeleteQuestion={handleDeleteQuestion}
                              multipleChoiceQuestions={multipleChoiceQuestions}
                              trueFalseQuestions={trueFalseQuestions}
                              shortAnswerQuestions={shortAnswerQuestions}
                              setActiveParentId={setActiveParentId}
                              setOpenAddQuestionDialog={
                                setOpenAddQuestionDialog
                              }
                              setQuestionType={setQuestionType}
                              subject={subject}
                              isChild={true}
                            />
                          );
                        })}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="lg:col-spans-8 space-y-6">
        {/* Render 3 danh sách bằng hàm dùng chung */}

        {renderQuestionSection(
          'Trắc nghiệm nhiều lựa chọn',
          'multiple-choice',
          multipleChoiceQuestions,
          true
        )}

        {renderQuestionSection(
          'Trắc nghiệm Đúng / Sai',
          'true-false',
          trueFalseQuestions,
          SUBJECTS_WITH_TRUE_FALSE.includes(subject)
        )}

        {renderQuestionSection(
          'Câu hỏi trả lời ngắn',
          'short-answer',
          shortAnswerQuestions,
          SUBJECTS_WITH_SHORT_ANSWER.includes(subject)
        )}
      </div>

      <ListQuestion
        open={openAddQuestionDialog}
        onOpenChange={(open) => {
          setOpenAddQuestionDialog(open);
          if (!open) {
            setActiveParentId(undefined); // Reset active parent ID khi đóng dialog
          }
        }}
        subject={subject}
        questionType={questionType}
        selectedQuestions={getCurrentSelectedQuestions()}
        setSelectedQuestions={getCurrentSetSelectedQuestions()}
        parentId={activeParentId}
      />
    </>
  );
};
