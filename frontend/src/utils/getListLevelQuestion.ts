import type { Question } from '@/Models/questions.model';

interface getListLevelQuestionProps {
  questions?: Question[];
}

export const getListLevelQuestion = ({
  questions,
}: getListLevelQuestionProps) => {
  if (!questions) return {};
  const easyQuestions = questions.reduce((acc, question) => {
    return question.level === 'Nhận biết' ? acc + 1 : acc;
  }, 0);
  const normalQuestions = questions.reduce((acc, question) => {
    return question.level === 'Thông hiểu' ? acc + 1 : acc;
  }, 0);
  const hardQuestions = questions.reduce((acc, question) => {
    return question.level === 'Vận dụng' ? acc + 1 : acc;
  }, 0);
  const veryHardQuestions = questions.reduce((acc, question) => {
    return question.level === 'Vận dụng cao' ? acc + 1 : acc;
  }, 0);

  return {
    easyQuestions,
    normalQuestions,
    hardQuestions,
    veryHardQuestions,
  };
};
