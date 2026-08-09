import type { Question } from '@/Models/questions.model';

export interface QuestionResponse {
  questions: Question[];
  total: number;
}
