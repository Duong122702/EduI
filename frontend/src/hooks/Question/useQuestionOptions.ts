import type { Question } from '@/Models/questions.model';
import { useMemo } from 'react';
// Import kiểu Question từ type/schema của bạn

export const useQuestionOptions = (questions: Question[] = []) => {
  const uniqueSubjects = useMemo(
    () =>
      Array.from(
        new Set(
          questions
            .map((q) => q.subject)
            .filter((sub): sub is string => Boolean(sub))
        )
      ),
    [questions]
  );

  const uniqueLevels = useMemo(
    () =>
      Array.from(
        new Set(
          questions
            .map((q) => q.level)
            .filter((lvl): lvl is string => Boolean(lvl))
        )
      ),
    [questions]
  );

  const uniqueTypes = useMemo(
    () =>
      Array.from(
        new Set(
          questions
            .map((q) => q.question_type)
            .filter((type): type is string => Boolean(type))
        )
      ),
    [questions]
  );

  return {
    uniqueSubjects,
    uniqueLevels,
    uniqueTypes,
  };
};
