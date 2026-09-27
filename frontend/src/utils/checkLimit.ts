import {
  NUMBER_OF_QUESTIONS_BY_SUBJECT,
  QUESTION_TYPES,
} from '@/constants/examConfig';
import type { Question } from '@/Models/questions.model';

// Hàm phụ trợ: Chuyển đổi type chuỗi nội bộ thành key của QUESTION_TYPES
const getMappedQuestionType = (type: string) => {
  switch (type) {
    case 'multiple-choice':
      return QUESTION_TYPES.MULTIPLE_CHOICE;
    case 'true-false':
      return QUESTION_TYPES.TRUE_FALSE;
    case 'short-answer':
      return QUESTION_TYPES.SHORT_ANSWER;
    case 'passage':
      return QUESTION_TYPES.PASSAGE;
    default:
      return null;
  }
};
// KIỂM TRA GIỚI HẠN GLOBAL CHUNG (Dùng cho cả câu thường và câu con)
export const checkLimit = (
  typeString: string,
  currentQuestions: Question[] | null,
  subject: string
) => {
  const mappedType = getMappedQuestionType(typeString);
  if (!mappedType || mappedType === QUESTION_TYPES.PASSAGE)
    return { isLimitReached: false, maxLimit: undefined };

  const maxLimit = NUMBER_OF_QUESTIONS_BY_SUBJECT[subject]?.[mappedType];
  const isLimitReached =
    maxLimit !== undefined && (currentQuestions?.length || 0) >= maxLimit;

  return { isLimitReached, maxLimit };
};
