import type { Exam } from '@/Models/exams.model';

export interface ExamResponse {
  exams: Exam[];
  total: number;
}
