import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SUBJECTS_WITH_SHORT_ANSWER,
  SUBJECTS_WITH_TRUE_FALSE,
} from '@/constants/typeQuestionSubject';
import { SubjectBadge } from '@/features/questionbank/components/SubjectBadge';
import type { Question } from '@/Models/questions.model';
import { checkLimit } from '@/utils/checkLimit';
import { CornerDownRight, PlusCircle, Trash } from 'lucide-react';
import { ContentRenderer } from './ContentRenderer';

interface QuestionCardProps {
  question: Question;
  index: number;
  type: string;
  isChild?: boolean;
  subject: string;
  multipleChoiceQuestions: Question[] | null;
  trueFalseQuestions: Question[] | null;
  shortAnswerQuestions: Question[] | null;
  setActiveParentId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setQuestionType: React.Dispatch<React.SetStateAction<string>>;
  setOpenAddQuestionDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteQuestion: (questionId: string) => void;
}

export const QuestionCard = ({
  index,
  question,
  type,
  isChild,
  subject,
  multipleChoiceQuestions,
  trueFalseQuestions,
  shortAnswerQuestions,
  setActiveParentId,
  setQuestionType,
  setOpenAddQuestionDialog,
  handleDeleteQuestion,
}: QuestionCardProps) => {
  return (
    <Card
      key={question.id}
      className={`group relative transition-all hover:border-blue-300 hover:shadow-md ${isChild ? 'ml-10 border-l-4 border-l-blue-400' : ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center gap-3">
          {isChild && <CornerDownRight className="h-4 w-4 text-blue-400" />}
          <span className="font-semibold text-slate-700">
            {isChild ? 'Câu hỏi con:' : `Câu ${index + 1}:`}
          </span>
          <SubjectBadge subject={subject} topic={question.topic} />
          <Badge
            variant="secondary"
            className="border-transparent bg-orange-100 font-medium text-orange-700"
          >
            {question.level}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          {/* MENU DROPDOWN CHỈ HIỂN THỊ Ở PASSAGE CHA */}
          {type === 'passage' && !isChild && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Thêm câu hỏi con"
                  className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  disabled={
                    checkLimit(
                      'multiple-choice',
                      multipleChoiceQuestions,
                      subject
                    ).isLimitReached
                  }
                  onClick={() => {
                    setActiveParentId(question.id);
                    setQuestionType('multiple-choice');
                    setOpenAddQuestionDialog(true);
                  }}
                >
                  Thêm câu Trắc nghiệm
                </DropdownMenuItem>
                {SUBJECTS_WITH_TRUE_FALSE.includes(subject) && (
                  <DropdownMenuItem
                    disabled={
                      checkLimit('true-false', trueFalseQuestions, subject)
                        .isLimitReached
                    }
                    onClick={() => {
                      setActiveParentId(question.id);
                      setQuestionType('true-false');
                      setOpenAddQuestionDialog(true);
                    }}
                  >
                    Thêm câu Đúng/Sai
                  </DropdownMenuItem>
                )}
                {SUBJECTS_WITH_SHORT_ANSWER.includes(subject) && (
                  <DropdownMenuItem
                    disabled={
                      checkLimit('short-answer', shortAnswerQuestions, subject)
                        .isLimitReached
                    }
                    onClick={() => {
                      setActiveParentId(question.id);
                      setQuestionType('short-answer');
                      setOpenAddQuestionDialog(true);
                    }}
                  >
                    Thêm câu Trả lời ngắn
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600"
            onClick={() => {
              setQuestionType(type);
              setTimeout(() => handleDeleteQuestion(question.id), 0);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-5 py-4 text-left text-slate-800">
        <ContentRenderer
          content={question.content}
          block={true}
          imageUrl={question.image_url}
        />
      </CardContent>
    </Card>
  );
};
