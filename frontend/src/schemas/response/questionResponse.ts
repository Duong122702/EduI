import type { Question } from '@/Models/questions.model';

export interface QuestionResponse {
  question: Question[];
  total: number;
}
